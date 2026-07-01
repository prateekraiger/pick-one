/**
 * Encode/decode a decision setup (title + options) into a URL-safe base64
 * query param so users can share a specific setup with a link.
 */

export interface SharedSetup {
  title: string;
  options: string[];
  noRepeat?: boolean;
}

/** Base64url-encode a UTF-8 string (browser-safe, no padding). */
function base64UrlEncode(input: string): string {
  const utf8 = encodeURIComponent(input).replace(
    /%([0-9A-F]{2})/g,
    (_, hex: string) => String.fromCharCode(parseInt(hex, 16))
  );
  const b64 = btoa(utf8);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(input: string): string {
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const utf8 = atob(padded);
  return decodeURIComponent(
    utf8
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );
}

export function encodeSetup(setup: SharedSetup): string {
  const json = JSON.stringify(setup);
  return base64UrlEncode(json);
}

export function decodeSetup(encoded: string): SharedSetup | null {
  try {
    const json = base64UrlDecode(encoded);
    const parsed = JSON.parse(json) as unknown;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "title" in parsed &&
      "options" in parsed &&
      Array.isArray((parsed as SharedSetup).options)
    ) {
      const setup = parsed as SharedSetup;
      return {
        title: String(setup.title ?? ""),
        options: setup.options.map((o) => String(o)).slice(0, 20),
        noRepeat: Boolean(setup.noRepeat),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function buildShareUrl(setup: SharedSetup): string {
  const encoded = encodeSetup(setup);
  if (typeof window === "undefined") return `?s=${encoded}`;
  const url = new URL(window.location.href);
  url.search = `?s=${encoded}`;
  return url.toString();
}
