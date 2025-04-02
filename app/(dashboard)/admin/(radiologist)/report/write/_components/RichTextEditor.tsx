import React, { useState, useEffect } from "react";
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
import History from '@tiptap/extension-history';
import { TextSelection } from 'prosemirror-state';

import EditorToolbar from "./EditorToolbar";

interface RichTextEditorProps {
  id: string;
  label: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  initialContent?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  id,
  label,
  setValue,
  initialContent = "" 
}) => {
  const [lastInsertedElement, setLastInsertedElement] = useState<string | null>(null);

  // Use safer way to handle word deletion
  const deleteWordBefore = (view: any) => {
    try {
      const { state, dispatch } = view;
      const { selection } = state;
      
      if (selection instanceof TextSelection && selection.$cursor) {
        const $cursor = selection.$cursor;
        const pos = $cursor.pos;
        
        // Get text content and find the last space before cursor
        const node = $cursor.parent;
        const text = node.textContent;
        const offset = $cursor.parentOffset;
        const beforeCursor = text.substring(0, offset);
        const lastSpaceIndex = beforeCursor.lastIndexOf(' ');
        
        let startPos = pos;
        if (lastSpaceIndex >= 0) {
          // Delete from last space to cursor
          startPos = pos - (offset - lastSpaceIndex - 1);
        } else if (offset > 0) {
          // Delete from beginning of text to cursor
          startPos = pos - offset;
        }
        
        if (startPos < pos) {
          const tr = state.tr.delete(startPos, pos);
          dispatch(tr);
          return true;
        }
      } else {
        const { from, to } = selection;
        if (from !== to) {
          const tr = state.tr.delete(from, to);
          dispatch(tr);
          return true;
        } else if (from > 0) {
          const tr = state.tr.delete(from - 1, from);
          dispatch(tr);
          return true;
        }
      }
    } catch (error) {
      console.error("Error in deleteWordBefore:", error);
    }
    return false;
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        blockquote: false,
        history: false,
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
      History.configure({
        depth: 100,
        newGroupDelay: 500,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "w-full min-h-52 rounded border p-3 focus:outline-none focus:ring-1 focus:ring-purple-500",
      },
      handleKeyDown: (view, event) => {
        if (event.ctrlKey && event.key === 'Backspace') {
          event.preventDefault();
          return deleteWordBefore(view);
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      setValue(editor.getHTML());
    },
  });

  // Safely handle editor focus when it is ready
  useEffect(() => {
    if (editor) {
      // Ensure editor is fully initialized before focusing
      setTimeout(() => {
        try {
          editor.commands.focus('end');
        } catch (error) {
          console.error("Error focusing editor:", error);
        }
      }, 100);
    }
  }, [editor]);

  const toggleHorizontalRule = () => {
    if (!editor) return;

    try {
      if (lastInsertedElement === "horizontalRule") {
        editor.chain().focus().deleteSelection().run();
        setLastInsertedElement(null);
      } else {
        editor.chain().focus().setHorizontalRule().run();
        setLastInsertedElement("horizontalRule");
      }
    } catch (error) {
      console.error("Error toggling horizontal rule:", error);
    }
  };

  // Custom handler with error handling
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.ctrlKey) {
      // Prevent default browser behavior for all Ctrl combinations
      // to avoid potential conflicts with TipTap
      if (event.key === 'Backspace') {
        event.stopPropagation();
      }
    }
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="mb-6" onKeyDown={handleKeyDown}>
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      <div className="prose prose-sm w-full">
        <EditorToolbar 
          editor={editor} 
          lastInsertedElement={lastInsertedElement} 
          toggleHorizontalRule={toggleHorizontalRule} 
        />
        <EditorContent editor={editor} id={id} />
      </div>
    </div>
  );
};

export default RichTextEditor;