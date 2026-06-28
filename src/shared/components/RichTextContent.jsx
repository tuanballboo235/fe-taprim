import { useMemo } from "react";
import { hasRichTextHtml, sanitizeRichTextHtml } from "@/shared/utils/richText";

const RichTextContent = ({
  html = "",
  fallback = "",
  className = "",
}) => {
  const content = String(html ?? "").trim();
  const safeHtml = useMemo(() => sanitizeRichTextHtml(content), [content]);

  if (!content) {
    return <div className={className}>{fallback}</div>;
  }

  if (!hasRichTextHtml(content)) {
    return <div className={`${className} whitespace-pre-wrap`}>{content}</div>;
  }

  if (!safeHtml) {
    return <div className={className}>{fallback}</div>;
  }

  return (
    <div
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
};

export default RichTextContent;
