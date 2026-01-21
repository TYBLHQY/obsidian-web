export type NodeType =
  | "root"
  | "paragraph"
  | "heading"
  | "blockquote"
  | "list"
  | "listItem"
  | "code"
  | "codeBlock"
  | "emphasis"
  | "strong"
  | "link"
  | "image"
  | "text"
  | "thematicBreak"
  | "html"
  | "table"
  | "tableRow"
  | "tableCell";

export interface BaseNode {
  type: NodeType;
  children?: ASTNode[];
  data?: Record<string, any>;
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

export interface RootNode extends BaseNode {
  type: "root";
  children: ASTNode[];
}

export type ASTNode =
  | RootNode
  | ParagraphNode
  | HeadingNode
  | BlockquoteNode
  | ListNode
  | ListItemNode
  | CodeNode
  | CodeBlockNode
  | EmphasisNode
  | StrongNode
  | LinkNode
  | ImageNode
  | TextNode
  | ThematicBreakNode
  | HTMLNode
  | TableNode
  | TableRowNode
  | TableCellNode;

export interface RenderConfig {
  classNamePrefix?: string;
  customComponents?: Record<string, any>;
  allowHtml?: boolean;
}

export interface ParseOptions {
  gfm?: boolean;
  breaks?: boolean;
  pedantic?: boolean;
}
