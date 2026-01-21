import type {
  ASTNode,
  BlockquoteNode,
  CodeBlockNode,
  CodeNode,
  EmphasisNode,
  HeadingNode,
  ImageNode,
  InlineMathNode,
  LinkNode,
  ListItemNode,
  ListNode,
  MathNode,
  ParagraphNode,
  ParseOptions,
  RootNode,
  StrongNode,
  TableCellNode,
  TableNode,
  TableRowNode,
  TextNode,
  ThematicBreakNode,
} from "@/markdown/types";
import rehypeFormat from "rehype-format";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export class MarkdownParser {
  private processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeFormat)
    .use(rehypeStringify);

  // markdown -> AST
  parse(markdown: string, options?: ParseOptions): ASTNode {
    const file = this.processor.parse(markdown);
    return this.mdastToCustomAST(file as any);
  }

  // mdast -> custom AST
  private mdastToCustomAST(node: any): ASTNode {
    const type = node.type;

    switch (type) {
      case "root":
        return {
          type: "root",
          children: (node.children || []).map((child: any) => this.mdastToCustomAST(child)),
        } as RootNode;

      case "paragraph":
        return {
          type: "paragraph",
          children: (node.children || []).map((child: any) => this.mdastToCustomAST(child)),
        } as ParagraphNode;

      case "heading":
        return {
          type: "heading",
          depth: node.depth,
          children: (node.children || []).map((child: any) => this.mdastToCustomAST(child)),
        } as HeadingNode;

      case "blockquote":
        return {
          type: "blockquote",
          children: (node.children || []).map((child: any) => this.mdastToCustomAST(child)),
        } as BlockquoteNode;

      case "list":
        return {
          type: "list",
          ordered: node.ordered || false,
          start: node.start,
          children: (node.children || []).map((child: any) => this.mdastToCustomAST(child)),
        } as ListNode;

      case "listItem":
        return {
          type: "listItem",
          checked: node.checked,
          children: (node.children || []).map((child: any) => this.mdastToCustomAST(child)),
        } as ListItemNode;

      case "code":
        return {
          type: "codeBlock",
          value: node.value,
          lang: node.lang,
          meta: node.meta,
        } as CodeBlockNode;

      case "inlineCode":
        return {
          type: "code",
          value: node.value,
        } as CodeNode;

      case "emphasis":
        return {
          type: "emphasis",
          children: (node.children || []).map((child: any) => this.mdastToCustomAST(child)),
        } as EmphasisNode;

      case "strong":
        return {
          type: "strong",
          children: (node.children || []).map((child: any) => this.mdastToCustomAST(child)),
        } as StrongNode;

      case "link":
        return {
          type: "link",
          url: node.url,
          title: node.title,
          children: (node.children || []).map((child: any) => this.mdastToCustomAST(child)),
        } as LinkNode;

      case "image":
        return {
          type: "image",
          url: node.url,
          alt: node.alt,
          title: node.title,
        } as ImageNode;

      case "text":
        return {
          type: "text",
          value: node.value,
        } as TextNode;

      case "math":
        return {
          type: "math",
          value: node.value,
          meta: node.meta,
        } as MathNode;

      case "inlineMath":
        return {
          type: "inlineMath",
          value: node.value,
        } as InlineMathNode;

      case "thematicBreak":
        return {
          type: "thematicBreak",
        } as ThematicBreakNode;

      case "table":
        return {
          type: "table",
          align: node.align,
          children: (node.children || []).map((child: any) => this.mdastToCustomAST(child)),
        } as TableNode;

      case "tableRow":
        return {
          type: "tableRow",
          children: (node.children || []).map((child: any) => this.mdastToCustomAST(child)),
        } as TableRowNode;

      case "tableCell":
        return {
          type: "tableCell",
          children: (node.children || []).map((child: any) => this.mdastToCustomAST(child)),
        } as TableCellNode;

      case "html":
        return {
          type: "html",
          value: node.value,
        };

      default:
        // unknown node type, return a generic node
        if (node.value !== undefined) {
          return {
            type: "text",
            value: String(node.value),
          } as TextNode;
        }
        return {
          type: "paragraph",
          children: [],
        } as ParagraphNode;
    }
  }

  // 遍历 ASTNode
  walk(node: ASTNode, callback: (node: ASTNode, parent?: ASTNode) => void, parent?: ASTNode): void {
    callback(node, parent);

    if ("children" in node && node.children) {
      node.children.forEach(child => this.walk(child as ASTNode, callback, node));
    }
  }

  // 查找 ASTNode
  find(node: ASTNode, predicate: (node: ASTNode) => boolean): ASTNode[] {
    const results: ASTNode[] = [];

    this.walk(node, current => {
      if (predicate(current)) {
        results.push(current);
      }
    });

    return results;
  }

  // markdown -> HTML
  renderToHtml(markdown: string): string {
    return String(this.processor.processSync(markdown));
  }
}

export const markdownParser = new MarkdownParser();

export function parseMarkdown(markdown: string, options?: ParseOptions): ASTNode {
  return markdownParser.parse(markdown, options);
}

export function renderMarkdownToHtml(markdown: string): string {
  return markdownParser.renderToHtml(markdown);
}
