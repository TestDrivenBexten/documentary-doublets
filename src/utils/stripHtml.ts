import DOMPurify from "dompurify";

export function stripHtml(html: string): string {
  const sanitized = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
  const decoded = new DOMParser().parseFromString(sanitized, "text/html").body.textContent ?? "";
  return decoded.replace(/\s+/g, " ").trim();
}
