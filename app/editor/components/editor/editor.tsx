"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar, { ToolbarButton } from "./toolbar";
import {
  BlockJustifyIcon,
  BoldIcon,
  BulletListIcon,
  CenterAlignIcon,
  CodeIcon,
  H1Icon,
  H2Icon,
  ItalicIcon,
  LeftAlignIcon,
  NumberListIcon,
  QuoteIcon,
  RightAlignIcon,
} from "./icons";
import TextAlign from "@tiptap/extension-text-align";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function TipTapEditor() {
  const [saveStatus, setSaveStatus] = useState(true);

  const debouncedUpdates = useDebouncedCallback(async (editor) => {
    const json = editor.getJSON();
    setSaveStatus(false);
    console.log(json);
    setSaveStatus(true);
  }, 750);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      setSaveStatus(false);
      debouncedUpdates(editor);
    },
  });

  if (!editor) return <></>;

  return (
    <>
      <Toolbar>
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={<BoldIcon className="h-5 w-5" />}
        />
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={<ItalicIcon className="h-5 w-5" />}
        />
        <ToolbarButton
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
          icon={<CodeIcon className="h-5 w-5" />}
        />
        <ToolbarButton
          active={editor.isActive("heading", { level: 1 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          icon={<H1Icon className="h-5 w-5" />}
        />
        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          icon={<H2Icon className="h-5 w-5" />}
        />
        <ToolbarButton
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          icon={<QuoteIcon className="h-5 w-5" />}
        />
        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon={<NumberListIcon className="h-5 w-5" />}
        />
        <ToolbarButton
          active={editor.isActive("listItem")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={<BulletListIcon className="h-5 w-5" />}
        />
        <ToolbarButton
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          icon={<LeftAlignIcon className="h-5 w-5" />}
        />
        <ToolbarButton
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          icon={<RightAlignIcon className="h-5 w-5" />}
        />
        <ToolbarButton
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          icon={<CenterAlignIcon className="h-5 w-5" />}
        />
        <ToolbarButton
          active={editor.isActive({ textAlign: "justify" })}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          icon={<BlockJustifyIcon className="h-5 w-5" />}
        />
      </Toolbar>
      <div className="h-full w-full bg-white px-6 py-32 lg:px-8">
        <EditorContent editor={editor} />
      </div>
    </>
  );
}
