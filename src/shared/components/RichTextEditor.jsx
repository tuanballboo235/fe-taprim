import { useEffect, useRef } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Eraser,
  Heading1,
  Heading2,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Underline,
} from "lucide-react";
import { sanitizeRichTextHtml } from "@/shared/utils/richText";

const toolbarButtonClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:border-green-500 hover:bg-green-50 hover:text-green-700";

const ToolbarButton = ({ title, icon, onClick }) => (
  <button
    type="button"
    title={title}
    aria-label={title}
    onMouseDown={(event) => event.preventDefault()}
    onClick={onClick}
    className={toolbarButtonClass}
  >
    {icon}
  </button>
);

const RichTextEditor = ({
  value = "",
  onChange,
  placeholder = "Nhap noi dung...",
}) => {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const nextValue = value || "";
    if (editor.innerHTML !== nextValue) {
      editor.innerHTML = nextValue;
    }
  }, [value]);

  const emitChange = () => {
    onChange?.(editorRef.current?.innerHTML ?? "");
  };

  const runCommand = (command, commandValue = null) => {
    editorRef.current?.focus();

    try {
      document.execCommand("styleWithCSS", false, true);
      document.execCommand(command, false, commandValue);
    } finally {
      emitChange();
    }
  };

  const createLink = () => {
    const rawUrl = window.prompt("Nhap link");
    const url = rawUrl?.trim();
    if (!url) return;

    const normalizedUrl = /^(https?:|mailto:|tel:|\/|#)/i.test(url)
      ? url
      : `https://${url}`;

    runCommand("createLink", normalizedUrl);
  };

  const handleBlur = () => {
    const cleanHtml = sanitizeRichTextHtml(editorRef.current?.innerHTML ?? "");

    if (editorRef.current && editorRef.current.innerHTML !== cleanHtml) {
      editorRef.current.innerHTML = cleanHtml;
    }

    onChange?.(cleanHtml);
  };

  return (
    <div className="overflow-hidden rounded-md border border-slate-300 bg-white focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2">
        <select
          title="Kieu doan van"
          defaultValue="p"
          onChange={(event) => runCommand("formatBlock", event.target.value)}
          className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-700 outline-none"
        >
          <option value="p">Noi dung</option>
          <option value="h1">Tieu de 1</option>
          <option value="h2">Tieu de 2</option>
          <option value="h3">Tieu de 3</option>
          <option value="blockquote">Trich dan</option>
        </select>

        <ToolbarButton
          title="Tieu de lon"
          icon={<Heading1 className="h-4 w-4" />}
          onClick={() => runCommand("formatBlock", "h1")}
        />
        <ToolbarButton
          title="Tieu de phu"
          icon={<Heading2 className="h-4 w-4" />}
          onClick={() => runCommand("formatBlock", "h2")}
        />
        <ToolbarButton
          title="In dam"
          icon={<Bold className="h-4 w-4" />}
          onClick={() => runCommand("bold")}
        />
        <ToolbarButton
          title="In nghieng"
          icon={<Italic className="h-4 w-4" />}
          onClick={() => runCommand("italic")}
        />
        <ToolbarButton
          title="Gach chan"
          icon={<Underline className="h-4 w-4" />}
          onClick={() => runCommand("underline")}
        />
        <ToolbarButton
          title="Gach ngang"
          icon={<Strikethrough className="h-4 w-4" />}
          onClick={() => runCommand("strikeThrough")}
        />
        <ToolbarButton
          title="Danh sach cham"
          icon={<List className="h-4 w-4" />}
          onClick={() => runCommand("insertUnorderedList")}
        />
        <ToolbarButton
          title="Danh sach so"
          icon={<ListOrdered className="h-4 w-4" />}
          onClick={() => runCommand("insertOrderedList")}
        />
        <ToolbarButton
          title="Canh trai"
          icon={<AlignLeft className="h-4 w-4" />}
          onClick={() => runCommand("justifyLeft")}
        />
        <ToolbarButton
          title="Canh giua"
          icon={<AlignCenter className="h-4 w-4" />}
          onClick={() => runCommand("justifyCenter")}
        />
        <ToolbarButton
          title="Canh phai"
          icon={<AlignRight className="h-4 w-4" />}
          onClick={() => runCommand("justifyRight")}
        />
        <ToolbarButton
          title="Trich dan"
          icon={<Quote className="h-4 w-4" />}
          onClick={() => runCommand("formatBlock", "blockquote")}
        />
        <ToolbarButton
          title="Them link"
          icon={<LinkIcon className="h-4 w-4" />}
          onClick={createLink}
        />
        <label className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-2 text-xs font-semibold text-slate-600">
          Mau
          <input
            type="color"
            defaultValue="#0f172a"
            onMouseDown={(event) => event.stopPropagation()}
            onChange={(event) => runCommand("foreColor", event.target.value)}
            className="h-6 w-6 cursor-pointer border-0 bg-transparent p-0"
          />
        </label>
        <ToolbarButton
          title="Xoa dinh dang"
          icon={<Eraser className="h-4 w-4" />}
          onClick={() => runCommand("removeFormat")}
        />
      </div>

      <div
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        suppressContentEditableWarning
        onInput={emitChange}
        onBlur={handleBlur}
        className="rich-text-editor min-h-56 w-full overflow-y-auto px-3 py-2 text-sm leading-6 text-slate-800 outline-none"
      />
    </div>
  );
};

export default RichTextEditor;
