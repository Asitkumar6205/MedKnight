import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import HardBreak from "@tiptap/extension-hard-break";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Strike from "@tiptap/extension-strike";
import Heading from "@tiptap/extension-heading";

import EditorToolbar from "./EditorToolbar";

interface ObservationsEditorProps {
  setObservations: React.Dispatch<React.SetStateAction<string>>;
}

const ObservationsEditor: React.FC<ObservationsEditorProps> = ({ 
  setObservations 
}) => {
  const [lastInsertedElement, setLastInsertedElement] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        blockquote: false,
      }),
      Bold,
      Italic,
      Underline,
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      HardBreak,
      HorizontalRule,
      Strike,
      Heading.configure({ levels: [1, 2, 3] }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "w-full min-h-52 rounded border p-3 focus:outline-none focus:ring-1 focus:ring-purple-500",
      },
    },
    onUpdate: ({ editor }) => {
      setObservations(editor.getHTML());
    },
  });

  const toggleHorizontalRule = () => {
    if (!editor) return;

    if (lastInsertedElement === "horizontalRule") {
      editor.chain().focus().deleteSelection().run();
      setLastInsertedElement(null);
    } else {
      editor.chain().focus().setHorizontalRule().run();
      setLastInsertedElement("horizontalRule");
    }
  };

  return (
    <div>
      <label className="text-lg font-bold text-gray-600">
        Observations
      </label>
      <div className="mt-1">
        <EditorToolbar 
          editor={editor} 
          lastInsertedElement={lastInsertedElement}
          toggleHorizontalRule={toggleHorizontalRule} 
        />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default ObservationsEditor;