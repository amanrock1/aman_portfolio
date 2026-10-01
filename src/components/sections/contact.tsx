"use client";
import React from "react";
import ContactForm from "../ContactForm";
import { config } from "@/data/config";
import { SectionHeader } from "./section-header";
import SectionWrapper from "../ui/section-wrapper";

const ContactSection = () => {
  return (
    <SectionWrapper id="contact" className="max-w-6xl mx-auto py-24 px-5 md:px-8">
      <SectionHeader
        id="contact"
        title="Contact"
        desc="Open to software engineering opportunities and collaborations"
        className="mb-10"
      />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        <div className="md:col-span-4 space-y-4">
          <p className="text-sm text-zinc-400 leading-relaxed">
            Have a role, project, or idea? Send a message or email me directly.
          </p>
          <div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-zinc-600 mb-1">Email</div>
            <a
              href={`mailto:${config.email}`}
              className="text-sm text-zinc-200 hover:text-white transition-colors"
            >
              {config.email}
            </a>
          </div>
        </div>

        <div className="md:col-span-8">
          <div className="border border-zinc-800/60 rounded-lg p-6 md:p-8">
            <h3 className="text-sm font-medium text-zinc-200 mb-1">Send a message</h3>
            <p className="text-xs text-zinc-500 mb-6">
              I&apos;ll get back to you as soon as possible.
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};
export default ContactSection;
