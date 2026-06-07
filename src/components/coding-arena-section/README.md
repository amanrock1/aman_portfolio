# Coding Arena Section

Ready-to-use React portfolio section.

## Files

- `src/components/CodingArena/CodingArena.jsx`
- `src/components/CodingArena/CodingArena.css`
- `api/coding-stats.js`

## Use

```jsx
import CodingArena from "./components/CodingArena/CodingArena";

function App() {
  return (
    <>
      {/* your existing sections */}
      <CodingArena />
      {/* your existing sections */}
    </>
  );
}

export default App;
```

## Replace usernames

Replace these everywhere:

- `YOUR_LEETCODE_USERNAME`
- `YOUR_CODEFORCES_HANDLE`
- `YOUR_CODECHEF_USERNAME`

Also update `USER_LINKS` in `CodingArena.jsx`.

## Notes

- Works as a frontend preview even if API fails.
- `api/coding-stats.js` is made for Vercel serverless routes.
- If not using Vercel, convert that file to your backend format.
- CodeChef values are manual fallback because CodeChef does not have a simple stable public stats API.
