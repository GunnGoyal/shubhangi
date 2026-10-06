import DOMPurify from "isomorphic-dompurify";

/** Strip HTML for plain-text display; use for any user-supplied strings in UI. */
export function sanitizePlainText(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
}

/** Encode for HTML text nodes (defense in depth with React escaping). */
export function encodeForHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
