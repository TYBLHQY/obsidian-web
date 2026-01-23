export type TableAlign = "left" | "center" | "right";
interface NodeSchema {
  blockquote: { children: ASTNode[] };
  codeBlock: { value: string; lang?: string; meta?: string };
  code: { value: string; lang?: string; meta?: string };
  emphasis: { children: ASTNode[] };
  heading: { depth: 1 | 2 | 3 | 4 | 5 | 6; children: ASTNode[] };
  html: { value: string };
  image: { url: string; alt?: string; title?: string };
  inlineMath: { value: string };
  link: { url: string; title?: string; children: ASTNode[] };
  listItem: { checked?: boolean; children: ASTNode[] };
  list: { ordered: boolean; start?: number; children: ASTNode[] };
  mark: { children: ASTNode[] };
  math: { value: string; meta?: string };
  paragraph: { children: ASTNode[] };
  root: { children: ASTNode[] };
  strong: { children: ASTNode[] };
  table: { align?: TableAlign[]; children: TableRowNode[] };
  tableRow: { children: TableCellNode[] };
  tableCell: { align?: TableAlign; children: ASTNode[] };
  text: { value: string };
  thematicBreak: "";
  yaml: { value: string };
}

type NodeData<K extends keyof NodeSchema> = { type: K } & NodeSchema[K];
export type BlockquoteNode = NodeData<"blockquote">;
export type CodeBlockNode = NodeData<"codeBlock">;
export type CodeNode = NodeData<"code">;
export type EmphasisNode = NodeData<"emphasis">;
export type HeadingNode = NodeData<"heading">;
export type HTMLNode = NodeData<"html">;
export type ImageNode = NodeData<"image">;
export type InlineMathNode = NodeData<"inlineMath">;
export type LinkNode = NodeData<"link">;
export type ListItemNode = NodeData<"listItem">;
export type ListNode = NodeData<"list">;
export type MarkNode = NodeData<"mark">;
export type MathNode = NodeData<"math">;
export type ParagraphNode = NodeData<"paragraph">;
export type RootNode = NodeData<"root">;
export type StrongNode = NodeData<"strong">;
export type TableNode = NodeData<"table">;
export type TableCellNode = NodeData<"tableCell">;
export type TableRowNode = NodeData<"tableRow">;
export type TextNode = NodeData<"text">;
export type ThematicBreakNode = NodeData<"thematicBreak">;
export type YamlNode = NodeData<"yaml">;

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
  | MarkNode
  | MathNode
  | ParagraphNode
  | RootNode
  | StrongNode
  | TableNode
  | TableCellNode
  | TableRowNode
  | TextNode
  | ThematicBreakNode
  | YamlNode;

export interface RenderConfig {
  classNamePrefix?: string;
  allowHtml?: boolean;
}

export interface ParseOptions {
  gfm?: boolean;
  breaks?: boolean;
  pedantic?: boolean;
}
