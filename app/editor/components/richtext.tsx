import React, { useCallback, useMemo } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, useSlate, Slate, ReactEditor } from "slate-react";
import {
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement,
  BaseEditor,
} from "slate";
import { HistoryEditor, withHistory } from "slate-history";
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
  UnderlineIcon,
} from "./icons";

interface Hotkeys {
  [key: string]: string;
  "mod+b": string;
  "mod+i": string;
  "mod+u": string;
  "mod+`": string;
}

const HOTKEYS: Hotkeys = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

function Toolbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed shadow-xl top-24 p-4 flex items-center justify-around space-x-5">{children}</div>
  );
}

const RichTextExample = () => {
  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Toolbar>
        <MarkButton format="bold" icon={<BoldIcon className="h-5 w-5" />} />
        <MarkButton format="italic" icon={<ItalicIcon className="h-5 w-5" />} />
        <MarkButton
          format="underline"
          icon={<UnderlineIcon className="h-5 w-5" />}
        />
        <MarkButton format="code" icon={<CodeIcon className="h-5 w-5" />} />
        <BlockButton
          format="heading-one"
          icon={<H1Icon className="h-5 w-5" />}
        />
        <BlockButton
          format="heading-two"
          icon={<H2Icon className="h-5 w-5" />}
        />
        <BlockButton
          format="block-quote"
          icon={<QuoteIcon className="h-5 w-5" />}
        />
        <BlockButton
          format="numbered-list"
          icon={<NumberListIcon className="h-5 w-5" />}
        />
        <BlockButton
          format="bulleted-list"
          icon={<BulletListIcon className="h-5 w-5" />}
        />
        <BlockButton
          format="left"
          icon={<LeftAlignIcon className="h-5 w-5" />}
        />
        <BlockButton
          format="center"
          icon={<CenterAlignIcon className="h-5 w-5" />}
        />
        <BlockButton
          format="right"
          icon={<RightAlignIcon className="h-5 w-5" />}
        />
        <BlockButton
          format="justify"
          icon={<BlockJustifyIcon className="h-5 w-5" />}
        />
      </Toolbar>
      <div className="w-full bg-white px-6 py-32 lg:px-8">
        <div className="mx-auto w-full max-w-3xl text-base leading-7 text-gray-700">
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Enter some rich text…"
            spellCheck
            disableDefaultStyles
            autoFocus
            className="max-w-2xl focus:outline-none"
            onKeyDown={(event) => {
              for (const hotkey in HOTKEYS) {
                if (isHotkey(hotkey, event as any)) {
                  event.preventDefault();
                  const mark = HOTKEYS[hotkey];
                  toggleMark(editor, mark);
                }
              }
            }}
          />
        </div>
      </div>
    </Slate>
  );
};

const toggleBlock = (editor: CustomEditor, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: CustomEditor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (
  editor: CustomEditor,
  format: string,
  blockType = "type"
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  );

  return !!match;
};

const isMarkActive = (editor: CustomEditor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align };
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote
          style={style}
          {...attributes}
          className="mt-10 border-l border-gray-600 pl-9 font-semibold text-gray-900"
        >
          <p>{children}</p>
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul
          style={style}
          {...attributes}
          className="ml-8 mt-8 max-w-xl list-disc space-y-8 text-gray-600"
        >
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1
          style={style}
          {...attributes}
          className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
        >
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2
          style={style}
          {...attributes}
          className="mt-16 text-2xl font-bold tracking-tight text-gray-900"
        >
          {children}
        </h2>
      );
    case "list-item":
      return (
        <li style={style} {...attributes} className="gap-x-3">
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol
          style={style}
          {...attributes}
          className="ml-8 mt-8 max-w-xl list-decimal space-y-8 text-gray-600"
        >
          {children}
        </ol>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function ToolbarButton({
  icon,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
      className={classNames(
      active ? "bg-indigo-50" : "bg-white",
      "rounded-md p-2 text-white shadow-sm hover:bg-indigo-50 focus:outline-none"
      )}
    >
      {icon}
    </button>
  );
}

const BlockButton = ({ format, icon }: any) => {
  const editor = useSlate();
  const active = isBlockActive(
    editor as CustomEditor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );
  const onClickCallback = () => toggleBlock(editor, format);
  return (
    <ToolbarButton onClick={onClickCallback} active={active} icon={icon} />
  );
};

const MarkButton = ({ format, icon }: any) => {
  const editor = useSlate();
  const active = isMarkActive(editor, format);
  const onClickCallback = () => toggleMark(editor, format);
  return (
    <ToolbarButton onClick={onClickCallback} active={active} icon={icon} />
  );
};

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [
      { text: "This is editable " },
      { text: "rich", bold: true },
      { text: " text, " },
      { text: "much", italic: true },
      { text: " better than a " },
      { text: "<textarea>", code: true },
      { text: "!" },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: "bold", bold: true },
      {
        text: ", or add a semantically rendered block quote in the middle of the page, like this:",
      },
    ],
  },
  {
    type: "block-quote",
    children: [{ text: "A wise quote." }],
  },
  {
    type: "paragraph",
    align: "left",
    children: [{ text: "Try it out for yourself!" }],
  },
];

export default RichTextExample;
