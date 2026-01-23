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
  MarkNode,
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
  YamlNode,
} from "@/markdown/types";
import type { Root, RootContent } from "mdast";
import remarkFlexibleMarkers from "remark-flexible-markers";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import { unified } from "unified";

export class MarkdownParser {
  private processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkFrontmatter)
    .use(remarkFlexibleMarkers)
    .use(remarkMath);

  // markdown -> AST
  parse(markdown: string, options?: ParseOptions): ASTNode {
    const tree = this.processor.parse(markdown);
    this.processor.run(tree);
    return this.mdastToCustomAST(tree);
  }

  // mdast -> custom AST
  private mdastToCustomAST(node: Root | RootContent): ASTNode {
    const type = node.type;

    switch (type) {
      case "blockquote":
        return {
          type: "blockquote",
          children: (node.children || []).map(child => this.mdastToCustomAST(child)),
        } as BlockquoteNode;

      case "code":
        return {
          type: "codeBlock",
          value: node.value,
          lang: node.lang,
          meta: node.meta,
        } as CodeBlockNode;

      case "root":
        return {
          type: "root",
          children: (node.children || []).map(child => this.mdastToCustomAST(child)),
        } as RootNode;

      case "paragraph":
        return {
          type: "paragraph",
          children: (node.children || []).map(child => this.mdastToCustomAST(child)),
        } as ParagraphNode;

      case "heading":
        return {
          type: "heading",
          depth: node.depth,
          children: (node.children || []).map(child => this.mdastToCustomAST(child)),
        } as HeadingNode;

      case "list":
        return {
          type: "list",
          ordered: node.ordered || false,
          start: node.start,
          children: (node.children || []).map(child => this.mdastToCustomAST(child)),
        } as ListNode;

      case "listItem":
        return {
          type: "listItem",
          checked: node.checked,
          children: (node.children || []).map(child => this.mdastToCustomAST(child)),
        } as ListItemNode;

      case "inlineCode":
        return {
          type: "code",
          value: node.value,
        } as CodeNode;

      case "emphasis":
        return {
          type: "emphasis",
          children: (node.children || []).map(child => this.mdastToCustomAST(child)),
        } as EmphasisNode;

      case "strong":
        return {
          type: "strong",
          children: (node.children || []).map(child => this.mdastToCustomAST(child)),
        } as StrongNode;

      case "link":
        return {
          type: "link",
          url: node.url,
          title: node.title,
          children: (node.children || []).map(child => this.mdastToCustomAST(child)),
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

      case "mark":
        return {
          type: "mark",
          children: (node.children || []).map(child => this.mdastToCustomAST(child)),
        } as MarkNode;

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
          children: (node.children || []).map(child => this.mdastToCustomAST(child)),
        } as TableNode;

      case "tableRow":
        return {
          type: "tableRow",
          children: (node.children || []).map(child => this.mdastToCustomAST(child)),
        } as TableRowNode;

      case "tableCell":
        return {
          type: "tableCell",
          children: (node.children || []).map(child => this.mdastToCustomAST(child)),
        } as TableCellNode;

      case "yaml":
        return {
          type: "yaml",
          value: node.value,
        } as YamlNode;

      case "html":
        return {
          type: "html",
          value: node.value,
        };

      default:
        throw new Error(`Unsupported node type: ${type}`);
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
