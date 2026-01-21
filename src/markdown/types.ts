import type {
  Blockquote,
  Code,
  Emphasis,
  Heading,
  Html,
  Image,
  InlineCode,
  Link,
  List,
  ListItem,
  Paragraph,
  Root,
  RootContent,
  Strong,
  Table,
  TableCell,
  TableRow,
  Text,
  ThematicBreak,
} from "mdast";
import type { InlineMath, Math } from "mdast-util-math";

export type MdAstType =
  | Blockquote
  | Code
  | Emphasis
  | Heading
  | Html
  | Image
  | InlineCode
  | Link
  | List
  | ListItem
  | Paragraph
  | Root
  | Strong
  | Table
  | TableCell
  | TableRow
  | Text
  | ThematicBreak
  | Math
  | InlineMath
  | RootContent;

export type NodeType =
  | "blockquote"
  | "code"
  | "codeBlock"
  | "emphasis"
  | "heading"
  | "html"
  | "image"
  | "inlineMath"
  | "link"
  | "list"
  | "listItem"
  | "math"
  | "paragraph"
  | "root"
  | "strong"
  | "table"
  | "tableCell"
  | "tableRow"
  | "text"
  | "thematicBreak";

export interface BaseNode {
  type: NodeType;
  children?: ASTNode[];
}

export interface TextNode extends BaseNode {
  type: "text";
  value: string;
}

export interface ParagraphNode extends BaseNode {
  type: "paragraph";
  children: ASTNode[];
}

export interface HeadingNode extends BaseNode {
  type: "heading";
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  children: ASTNode[];
}

export interface BlockquoteNode extends BaseNode {
  type: "blockquote";
  children: ASTNode[];
}

export interface ListNode extends BaseNode {
  type: "list";
  ordered: boolean;
  start?: number;
  children: ListItemNode[];
}

export interface ListItemNode extends BaseNode {
  type: "listItem";
  checked?: boolean;
  children: ASTNode[];
}

export interface CodeNode extends BaseNode {
  type: "code";
  value: string;
  lang?: string;
  meta?: string;
}

export interface CodeBlockNode extends BaseNode {
  type: "codeBlock";
  value: string;
  lang?: string;
  meta?: string;
}

export interface EmphasisNode extends BaseNode {
  type: "emphasis";
  children: ASTNode[];
}

export interface StrongNode extends BaseNode {
  type: "strong";
  children: ASTNode[];
}

export interface LinkNode extends BaseNode {
  type: "link";
  url: string;
  title?: string;
  children: ASTNode[];
}

export interface ImageNode extends BaseNode {
  type: "image";
  url: string;
  alt?: string;
  title?: string;
}

export interface ThematicBreakNode extends BaseNode {
  type: "thematicBreak";
}

export interface HTMLNode extends BaseNode {
  type: "html";
  value: string;
}

export interface TableNode extends BaseNode {
  type: "table";
  align?: ("left" | "center" | "right")[];
  children: TableRowNode[];
}

export interface TableRowNode extends BaseNode {
  type: "tableRow";
  children: TableCellNode[];
}

export interface TableCellNode extends BaseNode {
  type: "tableCell";
  align?: "left" | "center" | "right";
  children: ASTNode[];
}

export interface MathNode extends BaseNode {
  type: "math";
  value: string;
  meta?: string;
}

export interface InlineMathNode extends BaseNode {
  type: "inlineMath";
  value: string;
}

export interface RootNode extends BaseNode {
  type: "root";
  children: ASTNode[];
}

export type ASTNode =
  | BlockquoteNode
  | CodeBlockNode
  | CodeNode
  | EmphasisNode
  | HeadingNode
  | HTMLNode
  | ImageNode
  | InlineMathNode
  | LinkNode
  | ListItemNode
  | ListNode
  | MathNode
  | ParagraphNode
  | RootNode
  | StrongNode
  | TableNode
  | TableCellNode
  | TableRowNode
  | TextNode
  | ThematicBreakNode;

export interface RenderConfig {
  classNamePrefix?: string;
  allowHtml?: boolean;
}

export interface ParseOptions {
  gfm?: boolean;
  breaks?: boolean;
  pedantic?: boolean;
}
