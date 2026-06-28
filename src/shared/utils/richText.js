const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;

const ALLOWED_TAGS = new Set([
  "a",
  "b",
  "blockquote",
  "br",
  "code",
  "div",
  "em",
  "font",
  "h1",
  "h2",
  "h3",
  "h4",
  "i",
  "li",
  "ol",
  "p",
  "pre",
  "s",
  "span",
  "strong",
  "u",
  "ul",
]);

const SAFE_URL_PATTERN = /^(https?:|mailto:|tel:|\/|#)/i;
const DROP_TAGS = new Set(["iframe", "object", "script", "style"]);

const isSafeStyleValue = (value = "") => {
  const normalized = String(value).trim().toLowerCase();
  return normalized && !normalized.includes("url(") && !normalized.includes("expression");
};

const applyAllowedStyles = (element, sourceStyle = element.style) => {
  const styles = [];

  if (isSafeStyleValue(sourceStyle.color)) {
    styles.push(`color: ${sourceStyle.color}`);
  }

  if (isSafeStyleValue(sourceStyle.backgroundColor)) {
    styles.push(`background-color: ${sourceStyle.backgroundColor}`);
  }

  if (["left", "center", "right", "justify"].includes(sourceStyle.textAlign)) {
    styles.push(`text-align: ${sourceStyle.textAlign}`);
  }

  if (/^(bold|[1-9]00)$/.test(sourceStyle.fontWeight)) {
    styles.push(`font-weight: ${sourceStyle.fontWeight}`);
  }

  if (sourceStyle.fontStyle === "italic") {
    styles.push("font-style: italic");
  }

  if (/^(underline|line-through)$/.test(sourceStyle.textDecorationLine || sourceStyle.textDecoration)) {
    styles.push(`text-decoration: ${sourceStyle.textDecorationLine || sourceStyle.textDecoration}`);
  }

  element.removeAttribute("style");

  if (styles.length > 0) {
    element.setAttribute("style", styles.join("; "));
  }
};

const unwrapElement = (element) => {
  const parent = element.parentNode;
  if (!parent) return;

  while (element.firstChild) {
    parent.insertBefore(element.firstChild, element);
  }

  parent.removeChild(element);
};

const sanitizeElement = (element) => {
  const tagName = element.tagName.toLowerCase();

  if (DROP_TAGS.has(tagName)) {
    element.remove();
    return;
  }

  if (!ALLOWED_TAGS.has(tagName)) {
    unwrapElement(element);
    return;
  }

  const href = element.getAttribute("href") ?? "";
  const color = element.getAttribute("color") ?? "";
  const styleSnapshot = {
    backgroundColor: element.style.backgroundColor,
    color: element.style.color,
    fontStyle: element.style.fontStyle,
    fontWeight: element.style.fontWeight,
    textAlign: element.style.textAlign,
    textDecoration: element.style.textDecoration,
    textDecorationLine: element.style.textDecorationLine,
  };

  [...element.attributes].forEach((attribute) => {
    element.removeAttribute(attribute.name);
  });

  applyAllowedStyles(element, styleSnapshot);

  if (tagName === "a") {
    if (href && SAFE_URL_PATTERN.test(href)) {
      element.setAttribute("href", href);
      element.setAttribute("target", "_blank");
      element.setAttribute("rel", "noopener noreferrer");
    }
  }

  if (tagName === "font") {
    if (isSafeStyleValue(color)) {
      element.setAttribute("style", `color: ${color}`);
    }
  }
};

export const sanitizeRichTextHtml = (html = "") => {
  const source = String(html ?? "").trim();
  if (!source) return "";

  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return source;
  }

  const parser = new DOMParser();
  const document = parser.parseFromString(source, "text/html");
  const nodes = [...document.body.querySelectorAll("*")];

  nodes.forEach(sanitizeElement);

  return document.body.innerHTML.trim();
};

export const hasRichTextHtml = (value = "") => HTML_TAG_PATTERN.test(String(value));
