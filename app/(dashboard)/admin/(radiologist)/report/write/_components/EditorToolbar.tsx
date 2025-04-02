import React from "react";
import { Editor } from "@tiptap/react";
import { 
  BoldIcon, 
  ItalicIcon, 
  UnderlineIcon, 
  List, 
  ListOrdered, 
  Minus 
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor | null;
  lastInsertedElement: string | null;
  toggleHorizontalRule: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  lastInsertedElement,
  toggleHorizontalRule,
}) => {
  if (!editor) return null;

  return (
    <div className="flex gap-2 mb-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 py-1 ${
          editor.isActive("bold")
            ? "bg-purple-400 text-white border border-purple-400 text-sm rounded-sm"
            : "bg-stone-100 border text-sm border-purple-400 rounded-sm text-stone-700"
        }`}
        title="Bold"
        aria-label="Bold"
      >
        <BoldIcon size={15} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 ${
          editor.isActive("italic")
            ? "bg-purple-400 text-white border border-purple-400 text-sm rounded-sm"
            : "bg-stone-100 border text-sm border-purple-400 rounded-sm text-stone-700"
        }`}
        title="Italic"
        aria-label="Italic"
      >
        <ItalicIcon size={15} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-2 py-1 ${
          editor.isActive("underline")
            ? "bg-purple-400 text-white border border-purple-400 text-sm rounded-sm"
            : "bg-stone-100 border text-sm border-purple-400 rounded-sm text-stone-700"
        }`}
        title="Underline"
        aria-label="Underline"
      >
        <UnderlineIcon size={17} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 ${
          editor.isActive("bulletList")
            ? "bg-purple-400 text-white border border-purple-400 text-sm rounded-sm"
            : "bg-stone-100 border text-sm border-purple-400 rounded-sm text-stone-700"
        }`}
        title="Bullet List"
        aria-label="Bullet List"
      >
        <List size={18} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive("orderedList")
            ? "bg-purple-400 text-white border border-purple-400 text-sm rounded-sm"
            : "bg-stone-100 border text-sm border-purple-400 rounded-sm text-stone-700"
        }`}
        title="Ordered List"
        aria-label="Ordered List"
      >
        <ListOrdered size={18} />
      </button>
      
      <button
        onClick={toggleHorizontalRule}
        className={`px-[9px] py-1 rounded ${
          lastInsertedElement === "horizontalRule"
            ? "bg-purple-400 text-white border border-purple-400"
            : "bg-stone-100 border border-purple-400 text-stone-700"
        }`}
        title="Horizontal Rule"
        aria-label="Horizontal Rule"
      >
        <Minus size={17} />
      </button>
    </div>
  );
};

export default EditorToolbar;