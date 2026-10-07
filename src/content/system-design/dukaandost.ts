import type { ArchEdge, ArchNode, Mode, SystemDesign, Trace, TraceStep } from "./types";

// DukaanDost AI: a voice/text command goes through Whisper, an intent classifier, an entity
// extractor, a product matcher, business rules, a Postgres write and an automatic GST invoice.
//
// Ported from the real code (repo Dukaan_Dost):
//   src/lib/intentClassifier.ts   keyword rules, multi-action splitter, rule-based fallback
//   src/lib/entityExtractor.ts    fallbackExtract (regex)
//   src/lib/inventoryEngine.ts    GST maths, stock check, low-stock alert
//   src/lib/invoiceGenerator.ts   HSN codes, CGST/SGST split
//   src/app/api/process-request/route.ts   the order of the stages
// NOT run here: Whisper, the Llama model, Postgres, the PDF. The shop below is invented sample data.

const nodes: ArchNode[] = [
  { id: "input", label: "Voice or text", sub: "InputArea", kind: "client", col: 0, row: 1, blurb: "The shopkeeper speaks or types a command in English, Hindi or Hinglish, for example \"sold 5 laptops for 40000 each to Aman\".", tech: "Next.js 16, React 19", source: "src/components/dashboard/InputArea.tsx" },
  { id: "stt", label: "Speech to text", sub: "Groq Whisper v3", kind: "ai", col: 1, row: 1, blurb: "Voice commands are sent to Whisper large-v3 on Groq, which returns a transcript. Typed commands skip this station.", tech: "Groq, Whisper large-v3", source: "src/app/api/transcribe/route.ts" },
  { id: "split", label: "Command splitter", sub: "multi-action", kind: "logic", col: 2, row: 1, blurb: "Splits a compound command such as \"sold 2 laptops and then give invoice\" into separate actions, but only when at least two segments contain an action keyword.", tech: "Regex splitter", source: "src/lib/intentClassifier.ts" },
  { id: "intent", label: "Intent agent", sub: "keywords, then LLM", kind: "ai", col: 3, row: 1, blurb: "A hybrid classifier. Keyword rules run first (undo, purchase, sale, invoice, stock check). Only if nothing matches does it ask Llama 3.3 on Groq, and if that fails a rule-based fallback runs.", tech: "Regex + Groq Llama 3.3 70B", source: "src/lib/intentClassifier.ts" },
  { id: "extract", label: "Entity extraction", sub: "product, qty, price", kind: "ai", col: 4, row: 1, blurb: "Pulls the product, quantity, unit price and the customer or supplier out of the sentence. The real app asks Llama for JSON first and falls back to a regex extractor.", tech: "Groq Llama 3.3 + regex fallback", source: "src/lib/entityExtractor.ts" },
  { id: "clarify", label: "Ask and merge", sub: "mergeContext", kind: "logic", col: 4, row: 0, blurb: "If no product was found, the app asks \"Konsa product?\" and keeps the half-finished command as pending context. Your next message is merged into it instead of starting over.", tech: "pendingContext + mergeContext()", source: "src/app/api/process-request/route.ts" },
  { id: "match", label: "Inventory match", sub: "catalog lookup", kind: "logic", col: 5, row: 1, blurb: "Matches the product name against the catalog by name, alias or partial match. Several candidates means it asks you to choose; no match means the item is auto-registered.", tech: "Prisma + fuzzy matcher", source: "src/lib/entityExtractor.ts" },
  { id: "onboard", label: "Auto-register", sub: "unknown item", kind: "logic", col: 5, row: 0, blurb: "An item that is not in the catalog is created on the spot with a guessed category and GST rate (Electronics, Pharmacy, Stationery, Footwear or Groceries), a low-stock threshold of 5 and a default price of 20.", tech: "db.product.create", source: "src/app/api/process-request/route.ts" },
  { id: "rules", label: "Business rules", sub: "stock + GST", kind: "logic", col: 5, row: 2, blurb: "Computes the base amount, the GST amount and the total, and rejects a sale when there is not enough stock. This runs before anything is written.", tech: "TypeScript", source: "src/lib/inventoryEngine.ts" },
  { id: "db", label: "Database write", sub: "Prisma + Neon", kind: "data", col: 4, row: 2, blurb: "Creates the Sale row and updates the product's stock in Postgres. A purchase adds stock instead.", tech: "Prisma ORM, Neon serverless Postgres", source: "src/lib/inventoryEngine.ts" },
  { id: "insights", label: "Analytics", sub: "recommendations", kind: "ai", col: 3, row: 2, blurb: "The Analytics and Recommendation agents check whether the new stock level is at or below the product's low-stock threshold and raise an alert.", tech: "Analytics + Recommendation agents", source: "src/lib/businessIntelligence.ts" },
  { id: "log", label: "AI log", sub: "audit trail", kind: "data", col: 2, row: 2, blurb: "Every request is recorded: the raw input, the detected intent, the extracted entities, the action taken and the status, including failures.", tech: "AILog table", source: "src/lib/aiLogger.ts" },
  { id: "invoice", label: "GST invoice", sub: "pdf-lib", kind: "service", col: 1, row: 2, blurb: "Every successful sale automatically gets a GST invoice PDF with the HSN code for the product's category and the GST split into CGST and SGST.", tech: "pdf-lib", source: "src/lib/invoiceGenerator.ts" },
];

const edges: ArchEdge[] = [
  { from: "input", to: "stt", label: "voice" },
  { from: "stt", to: "split" },
  { from: "split", to: "intent" },
  { from: "intent", to: "extract" },
  { from: "extract", to: "clarify", kind: "branch", label: "no product" },
  { from: "clarify", to: "extract", kind: "branch", label: "your answer" },
  { from: "extract", to: "match" },
  { from: "match", to: "onboard", kind: "branch", label: "not found" },
  { from: "match", to: "rules" },
  { from: "rules", to: "db" },
  { from: "db", to: "insights" },
  { from: "insights", to: "log" },
  { from: "log", to: "invoice" },
];

// ---------- sample shop (invented demo data, kept in memory so stock really changes) ----------
type Product = { id: string; name: string; aliases: string[]; category: string; stock: number; price: number; gst: number; threshold: number };
type Sale = { product: Product; qty: number; price: number; amount: number; gst: number; total: number; invoiced: boolean };

const CATALOG: Product[] = [
  { id: "laptop", name: "Laptop", aliases: ["laptops", "notebook computer"], category: "Electronics", stock: 12, price: 45000, gst: 18, threshold: 5 },
  { id: "keyboard", name: "Keyboard", aliases: ["keyboards"], category: "Electronics", stock: 40, price: 1200, gst: 18, threshold: 5 },
  { id: "wmouse", name: "Wireless Mouse", aliases: [], category: "Electronics", stock: 25, price: 700, gst: 18, threshold: 5 },
  { id: "gmouse", name: "Gaming Mouse", aliases: [], category: "Electronics", stock: 8, price: 1800, gst: 18, threshold: 5 },
  { id: "notebook", name: "Notebook", aliases: ["notebooks", "copy"], category: "Stationery", stock: 100, price: 60, gst: 5, threshold: 5 },
];
let shop: Product[] = CATALOG.map((p) => ({ ...p }));
let sales: Sale[] = [];
const resetShop = () => {
  shop = CATALOG.map((p) => ({ ...p }));
  sales = [];
};

const HSN: Record<string, string> = { Electronics: "8471", Stationery: "4820", Footwear: "6403", Pharmacy: "3004" };
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// ---------- intent (intentClassifier.ts) ----------
type Intent = "record_sale" | "record_purchase" | "check_stock" | "generate_invoice" | "undo" | "unknown";
const has = (words: string[], s: string) => words.some((w) => new RegExp(`\\b${w}\\b`, "i").test(s));

function clean(input: string) {
  return input
    .replace(/^\s*(?:then|and|so|now|please)\s+/i, "")
    .replace(/\s*(?:update|update karo|update stock|please|karo|now)\s*$/i, "")
    .trim();
}

function classify(input: string): { intent: Intent; confidence: number; why: string; llm: boolean } {
  const lower = clean(input).toLowerCase();
  if (has(["undo", "reverse", "wapas", "revert", "cancel last", "galat"], lower)) return { intent: "undo", confidence: 0.99, why: "undo keyword (highest priority)", llm: false };
  if (has(["bought", "purchased", "purchase", "khareeda", "kharida", "kharid", "khareede", "liya", "laaya", "laya"], lower)) return { intent: "record_purchase", confidence: 0.95, why: "purchase keyword", llm: false };
  if (has(["sold", "becha", "behca", "beche", "bech", "sell", "bika", "bike"], lower)) return { intent: "record_sale", confidence: 0.95, why: "sale keyword", llm: false };
  if (has(["invoice", "bill", "receipt", "invoice banao", "bill banao"], lower)) return { intent: "generate_invoice", confidence: 0.98, why: "invoice keyword", llm: false };
  if (has(["stock", "kitne", "baaki", "remaining"], lower)) return { intent: "check_stock", confidence: 0.95, why: "stock-check keyword", llm: false };
  // The real app now asks Llama 3.3 on Groq. The demo can only run the code's rule-based fallback.
  const l = input.toLowerCase();
  const any = (ws: string[]) => ws.some((w) => l.includes(w));
  if (any(["sold", "becha", "behca", "beche", "bech", "sale", "sold out", "gaya", "sell"])) return { intent: "record_sale", confidence: 0.7, why: "rule-based fallback: sale word", llm: true };
  if (any(["bought", "purchased", "purchase", "khareeda", "kharida", "kharid", "khareede", "liya", "order", "aaya", "stock add", "add stock"])) return { intent: "record_purchase", confidence: 0.7, why: "rule-based fallback: purchase word", llm: true };
  if (any(["stock", "how many", "kitne", "quantity", "available", "baaki", "remaining", "check"])) return { intent: "check_stock", confidence: 0.7, why: "rule-based fallback: stock word", llm: true };
  if (any(["invoice", "bill", "receipt"])) return { intent: "generate_invoice", confidence: 0.7, why: "rule-based fallback: invoice word", llm: true };
  return { intent: "unknown", confidence: 0.3, why: "no matching intent", llm: true };
}

// ---------- multi-action splitter (splitMultiActionCommand) ----------
const FILLER = new Set(["and", "then", "update", "karo", "also", "plus", "aur", "phir", "so", "now", "please", "and then"]);
const cleanSegment = (seg: string) =>
  seg
    .trim()
    .replace(/^[\s,;.\-+!]+|[\s,;.\-+!]+$/g, "")
    .replace(/^(?:and then|then|and|after that|aur|phir|so|now|please|also|plus)\s+/i, "")
    .replace(/\s*(?:,?\s*update\s*karo|,?\s*update\s*stock|,?\s*update|,?\s*please|,?\s*karo|,?\s*now)$/i, "")
    .trim();
const isAction = (s: string) => {
  const c = cleanSegment(s);
  return c.length > 2 && !FILLER.has(c.toLowerCase());
};
const hasActionKeyword = (t: string) =>
  ["bought", "buy", "purchased", "purchase", "khareeda", "kharida", "khareede", "liya", "laya", "add stock", "sold", "sell", "becha", "behca", "beche", "bech", "bika", "bike", "stock", "kitne", "baaki", "remaining", "invoice", "bill", "receipt", "generate", "banao", "create", "give", "show", "print"].some((k) => t.toLowerCase().includes(k));

function splitCommand(input: string): string[] {
  const trimmed = input.trim();
  if (!trimmed) return [];
  const splitRegex = /(?:\s*(?:,|;|\n|\+|&)\s*|\s+(?:and then|and|then|after that|aur|phir|also|plus|update|update karo)\s+)/i;
  let segs = trimmed.split(splitRegex).map(cleanSegment).filter(isAction);
  const sub: string[] = [];
  for (const seg of segs) {
    const lower = seg.toLowerCase();
    const compound = (lower.includes("sold") || lower.includes("bought") || lower.includes("becha") || lower.includes("khareeda")) && (lower.includes("invoice") || lower.includes("bill") || lower.includes("receipt"));
    if (compound) {
      const pos = seg.search(/(?:invoice|bill|receipt|generate|banao|give me invoice)/i);
      if (pos > 5) {
        const a = cleanSegment(seg.slice(0, pos));
        const b = cleanSegment(seg.slice(pos));
        if (isAction(a)) sub.push(a);
        if (isAction(b)) sub.push(b);
        continue;
      }
    }
    sub.push(seg);
  }
  segs = sub.filter(isAction);
  if (segs.length <= 1) return [trimmed];
  return segs.filter(hasActionKeyword).length >= 2 ? segs : [trimmed];
}

// ---------- entity extraction (fallbackExtract) ----------
type Ent = { product: string | null; qty: number | null; price: number | null; party: string | null };

function extract(input: string): Ent {
  const c = input
    .replace(/^(?:then|and|so|now|please)\s+/i, "")
    .replace(/\s*(?:update|update karo|update stock|please|karo|now)\s*$/i, "")
    .trim();
  let qty: number | null = null;
  let product: string | null = null;
  const m = c.match(/(\d+)\s+([a-zA-Z0-9\s\-_]+?)(?:\s+(?:for|at|@|price|rs|rupees|inr|each|per|becha|sold|bought|khareeda|behca|beche|\d+|$))/i);
  if (m) {
    qty = parseInt(m[1], 10);
    let p = m[2].trim().replace(/^(?:bought|purchased|khareeda|kharida|sold|becha|behca|beche|check|stock of)\s+/i, "");
    p = p.replace(/\s+(?:for|at|each|per)$/i, "").trim();
    if (p.length > 1) product = p;
  }
  if (!product) {
    const l = c.match(/(\d+)\s*(laptops?|keyboards?|monitors?|headphones?|speakers?|printers?|mice|mouse|notebooks?|pens?|shoes?|pairs?|medicines?|sanitizers?)/i);
    if (l) {
      qty = parseInt(l[1], 10);
      product = l[2].replace(/s$/, "");
    }
  }
  const nums = (c.match(/\d[\d,]*/g) ?? []).map((n) => parseInt(n.replace(/,/g, ""), 10));
  const prices = nums.filter((n) => n !== qty && n > 0);
  // Demo only: the real app's LLM picks out the customer/supplier; here a simple "to/from Name" rule does.
  const party = c.match(/\b(?:to|from)\s+([A-Za-z][A-Za-z]+)\s*$/i)?.[1] ?? null;
  return { product, qty, price: prices[0] ?? null, party };
}

const STOPWORDS = new Set(["for", "at", "each", "per", "rs", "rupees", "inr", "price"]);
const entText = (e: Ent) => `product=${e.product ?? "None"}, qty=${e.qty ?? "None"}, price=${e.price ? inr(e.price) : "None"}, party=${e.party ?? "None"}`;

// ---------- product matching ----------
const norm = (s: string) => s.toLowerCase().trim().replace(/s$/, "");
function matchProducts(name: string): Product[] {
  const n = norm(name);
  const exact = shop.filter((p) => norm(p.name) === n || p.aliases.some((a) => norm(a) === n));
  if (exact.length) return exact;
  return shop.filter((p) => norm(p.name).includes(n) || n.includes(norm(p.name)));
}

function guessCategory(name: string): { category: string; gst: number } {
  let category = "Groceries";
  if (/headphone|earphone|bud|laptop|mouse|keyboard|monitor|phone|usb|printer|cable|electronic|light/i.test(name)) category = "Electronics";
  else if (/tablet|syrup|paracetamol|medicine|gel|cream/i.test(name)) category = "Pharmacy";
  else if (/notebook|pen|paper|pencil|file|folder/i.test(name)) category = "Stationery";
  else if (/shoe|boot|sandal|sneaker/i.test(name)) category = "Footwear";
  return { category, gst: category === "Stationery" ? 5 : category === "Pharmacy" ? 12 : 18 };
}

// ---------- the pipeline ----------
// Each phase of a trace owns its own `steps` array. A command that asks a question ends the
// phase; `resume` starts a new one. `next` is called with the phase's array when a command ends.
type Ctx = { raw: string; intent: Intent; confidence: number; ent: Ent };
type Done = { tone: "ok" | "error" | "info"; line: string };
type Next = (d: Done, steps: TraceStep[]) => Trace;

const push = (steps: TraceStep[], s: TraceStep) => void steps.push(s);

function clip(s: string) {
  return s.length > 26 ? `${s.slice(0, 25)}…` : s;
}

/** Runs one command from "match" onward. May ask the visitor to choose between products. */
function fromMatch(ctx: Ctx, steps: TraceStep[], chosen: Product | null, next: Next): Trace {
  const { intent, ent } = ctx;
  let product = chosen;
  const qty = ent.qty ?? 1;

  if (!product) {
    const found = matchProducts(ent.product!);
    if (found.length > 1) {
      push(steps, { node: "match", title: `Several products match "${ent.product}"`, input: `name="${ent.product}"`, output: found.map((p) => p.name).join(" / "), tone: "branch", note: "The real app shows these as buttons and waits for you to pick one." });
      return {
        steps,
        result: { tone: "info", title: "Waiting for your choice", lines: [] },
        ask: {
          question: `Which one? ${found.map((p) => p.name).join(" or ")}`,
          placeholder: "type part of the name",
          resume: (answer) => {
            const more: TraceStep[] = [];
            const pick = found.find((p) => p.name.toLowerCase().includes(answer.toLowerCase())) ?? null;
            if (!pick) {
              push(more, { node: "match", title: "That did not match any option", input: `answer="${answer}"`, output: "nothing chosen", tone: "error" });
              return next({ tone: "error", line: "No option matched your answer, so the command stopped." }, more);
            }
            push(more, { node: "match", title: `Resolved to "${pick.name}"`, input: `answer="${answer}"`, output: `${pick.name}, stock ${pick.stock}` });
            return fromMatch(ctx, more, pick, next);
          },
        },
      };
    }
    if (found.length === 1) {
      product = found[0];
      push(steps, { node: "match", title: "Inventory validation", input: `name="${ent.product}"`, output: `Matched "${ent.product}" → "${product.name}". Stock: ${product.stock} units.`, note: "Demo matcher: exact name, alias, then partial match. The real one also checks model numbers and conflicting words." });
    } else {
      const g = guessCategory(ent.product!);
      const display = ent.product!.charAt(0).toUpperCase() + ent.product!.slice(1);
      push(steps, { node: "match", title: "Not in the catalog", input: `name="${ent.product}"`, output: "no match", tone: "branch" });
      const created: Product = { id: `new-${shop.length}`, name: display, aliases: [], category: g.category, stock: intent === "record_sale" ? qty + 50 : 0, price: ent.price ?? 20, gst: g.gst, threshold: 5 };
      shop.push(created);
      product = created;
      push(steps, { node: "onboard", title: "Auto-registered", input: `name="${display}"`, output: `${g.category}, GST ${g.gst}%, threshold 5, price ${inr(created.price)}, opening stock ${created.stock}`, tone: "branch", note: "Category and GST are guessed from the name with regexes, exactly as in the route." });
    }
  }

  const price = ent.price && ent.price > 0 ? ent.price : product.price;
  const amount = qty * price;
  const gstAmount = Math.round(amount * (product.gst / 100) * 100) / 100;
  const total = Math.round((amount + gstAmount) * 100) / 100;

  if (intent === "record_sale" && product.stock < qty) {
    push(steps, { node: "rules", title: "Business rule validation failed", input: `stock=${product.stock}, requested=${qty}`, output: `Insufficient stock: ${product.stock} available, ${qty} requested.`, tone: "error", note: "Nothing is written. The real app also logs this as a failed action and replies in Hinglish: \"Stock kam hai!\"" });
    return next({ tone: "error", line: `Stock kam hai! ${product.name} has only ${product.stock} units, you asked for ${qty}.` }, steps);
  }

  push(steps, { node: "rules", title: "Business rule validation", input: `qty=${qty}, price=${inr(price)}${ent.price ? "" : " (catalog price, none given)"}, GST ${product.gst}%`, output: `Base=${inr(amount)}, GST=${inr(gstAmount)}, Total=${inr(total)}`, note: ent.qty ? undefined : "No quantity given, so it defaults to 1." });

  const before = product.stock;
  const after = intent === "record_sale" ? before - qty : before + qty;
  product.stock = after;
  push(steps, {
    node: "db",
    title: "Database update",
    input: intent === "record_sale" ? `INSERT sale(product=${product.name}, qty=${qty}, amount=${inr(amount)}, gst=${inr(gstAmount)}, total=${inr(total)})` : `INSERT purchase(product=${product.name}, qty=${qty})`,
    output: `Prisma committed. Stock: ${before} → ${after} units.`,
  });

  const low = after <= product.threshold;
  push(steps, { node: "insights", title: "Recommendation update", input: `stockAfter=${after}, threshold=${product.threshold}`, output: low ? `Low stock alert for ${product.name}!` : "Inventory stable.", tone: low ? "branch" : "ok" });
  push(steps, { node: "log", title: "AI log written", input: `intent=${intent}`, output: `status=success, action="${intent === "record_sale" ? "sale" : "purchase"} ${product.name}"` });

  if (intent === "record_sale") {
    sales.push({ product, qty, price, amount, gst: gstAmount, total, invoiced: true });
    const half = Math.round((gstAmount / 2) * 100) / 100;
    push(steps, { node: "invoice", title: "GST invoice generated automatically", input: `sale of ${qty} x ${product.name}`, output: `HSN ${HSN[product.category] ?? "9999"} · CGST @ ${product.gst / 2}%: ${inr(half)} · SGST @ ${product.gst / 2}%: ${inr(half)} · Total ${inr(total)}`, note: "Every successful sale gets an invoice PDF. The demo does not render the PDF." });
    return next({ tone: low ? "info" : "ok", line: `Sale recorded${ent.party ? ` to ${ent.party}` : ""}: ${qty} x ${product.name} at ${inr(price)} each = ${inr(total)} incl. GST. Stock now ${after}.${low ? " Low stock!" : ""}` }, steps);
  }
  return next({ tone: low ? "info" : "ok", line: `Purchase recorded${ent.party ? ` from ${ent.party}` : ""}: ${qty} x ${product.name}. Stock now ${after}.${low ? " Still low." : ""}` }, steps);
}

function runCommand(raw: string, steps: TraceStep[], next: Next): Trace {
  const c = classify(raw);
  push(steps, {
    node: "intent",
    title: "Intent classification",
    input: raw,
    output: `${c.intent} (confidence ${c.confidence})`,
    tone: c.intent === "unknown" ? "error" : "ok",
    note: c.llm ? "No keyword matched. The real app now asks Llama 3.3 on Groq; the demo runs only the code's rule-based fallback." : `Keyword layer: ${c.why}. No LLM call was needed.`,
  });

  if (c.intent === "unknown") return next({ tone: "error", line: 'I could not tell what you want to do. Try "sold 2 laptops for 45000 each".' }, steps);
  if (c.intent === "undo") return next({ tone: "info", line: "Undo reverts the last transaction in the real app. It is not simulated here." }, steps);

  if (c.intent === "check_stock") {
    const e = extract(raw);
    push(steps, { node: "extract", title: "Entity extraction", input: raw, output: e.product ? `product=${e.product}` : "no product (whole shop)", note: "Real app: Llama extracts these. Demo: regex fallback." });
    const hits = e.product ? matchProducts(e.product) : shop;
    push(steps, { node: "match", title: "Database query", input: e.product ? `name="${e.product}"` : "all products", output: hits.length ? hits.map((p) => `${p.name}: ${p.stock}${p.stock <= p.threshold ? " (LOW)" : ""}`).join(" · ") : "no match" });
    return next({ tone: hits.length ? "ok" : "info", line: hits.length ? `Stock check: ${hits.map((p) => `${p.name} ${p.stock}`).join(", ")}.` : `No product matches "${e.product}".` }, steps);
  }

  if (c.intent === "generate_invoice") {
    const last = [...sales].reverse().find((s) => !s.invoiced) ?? sales[sales.length - 1];
    push(steps, { node: "match", title: "Find the sale to invoice", input: "latest sale without an invoice, else the latest sale", output: last ? `Sale found: ${last.product.name}, ${inr(last.total)}${last.invoiced ? " (existing invoice)" : ""}` : "No sales found.", tone: last ? "ok" : "error" });
    if (!last) return next({ tone: "error", line: "Koi sale nahi mili. Pehle kuch becho, phir invoice banega!" }, steps);
    push(steps, { node: "invoice", title: "Invoice already exists", output: "Invoice already generated for this sale.", tone: "branch", note: "Sales are invoiced automatically, so asking again finds the existing invoice." });
    return next({ tone: "info", line: "That sale already has its invoice." }, steps);
  }

  // Sale or purchase: pull the entities out of the sentence.
  const e = extract(raw);
  const found = [e.product, e.qty, e.price].filter(Boolean).length;
  push(steps, { node: "extract", title: "Entity extraction", input: raw, output: entText(e), tone: e.product ? "ok" : "branch", note: STOPWORDS.has((e.product ?? "").toLowerCase()) ? `The regex fallback took the word "${e.product}" for a product. The real app asks Llama 3.3 first, which would not make this mistake; the fallback only runs if the LLM call fails.` : `Real app: Llama 3.3 returns this as JSON. Demo: the code's regex fallback found ${found} of 3 fields.` });
  const ctx: Ctx = { raw, intent: c.intent, confidence: c.confidence, ent: e };

  if (!e.product) {
    push(steps, { node: "clarify", title: "No product found, so it asks", input: "entities.productName = null", output: 'Konsa product? (e.g. "20 kurkure behce 10 ruppya each")', tone: "branch", note: "A missing quantity defaults to 1 and a missing price falls back to the catalog price. Only a missing product triggers a question." });
    return {
      steps,
      result: { tone: "info", title: "Waiting for your answer", lines: [] },
      ask: {
        question: "Konsa product?",
        placeholder: "e.g. laptop, or 5 laptop 40000",
        resume: (answer) => {
          const more: TraceStep[] = [];
          const parsed = extract(/\d/.test(answer) ? answer : `1 ${answer}`);
          const merged: Ent = {
            product: parsed.product ?? (answer.replace(/\d+/g, "").trim() || null),
            qty: ctx.ent.qty ?? (/\d/.test(answer) ? parsed.qty : null),
            price: ctx.ent.price ?? parsed.price,
            party: ctx.ent.party,
          };
          push(more, { node: "extract", from: "clarify", title: "mergeContext", input: `previous: ${entText(ctx.ent)}  +  answer: "${answer}"`, output: entText(merged), tone: "branch", note: "The previous intent is kept; your answer fills in the blanks instead of starting over." });
          if (!merged.product) return next({ tone: "error", line: "Still no product, so nothing was recorded." }, more);
          return fromMatch({ ...ctx, ent: merged }, more, null, next);
        },
      },
    };
  }
  return fromMatch(ctx, steps, null, next);
}

function simulate(values: Record<string, string>): Trace {
  const raw = (values.command ?? "").trim();
  if (/^reset( shop)?$/i.test(raw)) {
    resetShop();
    return { steps: [], result: { tone: "info", title: "Sample shop reset", lines: ["Stock and sales are back to the starting sample data."] } };
  }
  if (!raw) return { steps: [], result: { tone: "error", title: "Type a command first", lines: ["For example: sold 5 laptops for 40000 each to Aman"] } };

  const steps: TraceStep[] = [];
  const voice = values.via === "voice";
  push(steps, { node: "input", title: voice ? "Spoken command" : "Typed command", input: voice ? "audio (webm)" : undefined, output: raw, slip: clip(raw) });
  if (voice) push(steps, { node: "stt", title: "Speech recognition", input: "audio blob", output: `"${raw}"`, note: "The demo does not process audio. Your text stands in for the transcript Whisper would return." });

  const segs = splitCommand(raw);
  push(steps, { node: "split", title: "Multi-action parser", input: raw, output: segs.length > 1 ? `${segs.length} commands: ${segs.map((s, i) => `${i + 1}) ${s}`).join("  ")}` : "1 command", note: segs.length > 1 ? "A compound command is split into actions that run one after another." : undefined });

  const lines: string[] = [];
  let tone: "ok" | "error" | "info" = "ok";
  const finish = (st: TraceStep[]): Trace => ({ steps: st, result: { tone, title: tone === "error" ? "Stopped" : segs.length > 1 ? "All commands done" : "Done", lines } });

  const go = (i: number, st: TraceStep[]): Trace => {
    if (i >= segs.length) return finish(st);
    return runCommand(segs[i], st, (d, st2) => {
      lines.push(d.line);
      if (d.tone === "error") tone = "error";
      else if (d.tone === "info" && tone === "ok") tone = "info";
      return d.tone === "error" ? finish(st2) : go(i + 1, st2);
    });
  };
  return go(0, steps);
}

const mode: Mode = {
  id: "command",
  label: "Run a command",
  intro: "Say it the way a shopkeeper would, in English, Hindi or Hinglish. The command goes through the real stages, and the sample shop's stock changes for real, so try a few in a row.",
  fields: [
    { id: "command", label: "Command", type: "text", default: "sold 5 laptops for 40000 each to Aman", placeholder: "sold 5 laptops for 40000 each to Aman" },
    { id: "via", label: "How you said it", type: "select", default: "typed", options: [{ value: "typed", label: "Typed" }, { value: "voice", label: "Spoken (Whisper)" }] },
  ],
  presets: [
    { label: "Sold 5 laptops for 40,000 each to Aman", values: { command: "sold 5 laptops for 40000 each to Aman", via: "typed" } },
    { label: "Spoken: 3 keyboard becha 1500 each", values: { command: "3 keyboard becha 1500 each", via: "voice" } },
    { label: "Bought 10 notebooks from Sharma", values: { command: "bought 10 notebooks for 55 each from Sharma", via: "typed" } },
    { label: "Sold 50 laptops (not enough stock)", values: { command: "sold 50 laptops for 40000 each", via: "typed" } },
    { label: "Sold it for 4000 (no product)", values: { command: "sold it for 4000", via: "typed" } },
    { label: "Sold 2 mouse (which one?)", values: { command: "sold 2 mouse for 900 each", via: "typed" } },
    { label: "Sold 3 pens (unknown item)", values: { command: "sold 3 pens for 10 each", via: "typed" } },
    { label: "Sold 2 laptops, then invoice", values: { command: "sold 2 laptops for 45000 each and then give invoice", via: "typed" } },
    { label: "How many laptops?", values: { command: "stock of laptop", via: "typed" } },
    { label: "Reset the sample shop", values: { command: "reset shop", via: "typed" } },
  ],
  simulate,
};

export const dukaandost: SystemDesign = {
  slug: "dukaandost-ai",
  title: "How one spoken command becomes a stock update and a GST invoice",
  tagline: "Follow a command through the intent agent, the entity extractor, the inventory matcher, the business rules, Postgres and the invoice generator.",
  repo: "Dukaan_Dost",
  layout: { cols: 6, rows: 3 },
  nodes,
  edges,
  modes: [mode],
  honesty:
    "Runs in your browser and calls no servers. The keyword rules, the multi-command splitter, the regex extractor, the GST maths, HSN codes and the order of stages are ported from the real code. Whisper, the Llama model, Postgres and the PDF are not run, and the shop's products and prices are invented sample data.",
};
