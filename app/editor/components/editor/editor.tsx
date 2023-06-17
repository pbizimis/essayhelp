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

export default function TipTapEditor() {
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
    content: `
  <h2>
    Hi there,
  </h2>
  <p>
    this is a basic <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
  </p>
  <ul>
    <li>
      That’s a bullet list with one …
    </li>
    <li>
      … or two list items.
    </li>
  </ul>
  <p>
    Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
  </p>
  <pre><code class="language-css">body {
  display: none;
}</code></pre>
  <p>
    I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
  </p>
  <blockquote>
    Wow, that’s amazing. Good work, boy! 👏
    <br />
    — Mom
  </blockquote>
`,
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
