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
  table: { align?: TableAlign[]; children: ASTNode[] };
  tableRow: { children: ASTNode[] };
  tableCell: { align?: TableAlign; children: ASTNode[] };
  text: { value: string };
  thematicBreak: Record<string, never>;
  yaml: { value: string };
}

export type NodeData<K extends keyof NodeSchema> = { type: K } & NodeSchema[K];
export type ASTNode = { [K in keyof NodeSchema]: NodeData<K> }[keyof NodeSchema];

export interface RenderConfig {
  classNamePrefix?: string;
  allowHtml?: boolean;
}

export interface ParseOptions {
  gfm?: boolean;
  breaks?: boolean;
  pedantic?: boolean;
}
