/**
 * Escapes special characters in XML content
 */
export function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Creates an XML element with escaped content
 */
export function createXmlElement(name: string, content: string): string {
  return `<${name}>${escapeXml(content)}</${name}>`;
}
