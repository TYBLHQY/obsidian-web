import type {
  ASTNode,
  BlockquoteNode,
  CodeBlockNode,
  CodeNode,
  EmphasisNode,
  HeadingNode,
  ImageNode,
  LinkNode,
  ListItemNode,
  ListNode,
  ParagraphNode,
  RenderConfig,
  RootNode,
  StrongNode,
  TableCellNode,
  TableNode,
  TableRowNode,
  TextNode,
  ThematicBreakNode,
} from "@/markdown";
import hljs from "highlight.js";
import type { PropType } from "vue";
import { computed, defineComponent } from "vue";

const CodeBlock = defineComponent({
  name: "CodeBlock",
  props: {
    code: String,
    language: String,
  },
  setup(props) {
    const getHighlightedCode = () => {
      if (!props.code) return props.code;

      try {
        if (props.language && hljs.getLanguage(props.language)) {
          return hljs.highlight(props.code, { language: props.language }).value;
        }
        return hljs.highlightAuto(props.code).value;
      } catch {
        return props.code;
      }
    };

    return () => (
      <pre class={"mb-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100 dark:bg-gray-950"}>
        <code
          class={"hljs font-mono whitespace-pre-wrap"}
          innerHTML={getHighlightedCode()}
          style={{ fontSize: "0.875rem" }}></code>
      </pre>
    );
  },
});

const ASTRenderer = defineComponent({
  name: "ASTRenderer",
  props: {
    ast: {
      type: Object as PropType<ASTNode>,
      required: true,
    },
    config: {
      type: Object as PropType<Partial<RenderConfig>>,
      default: () => ({}),
    },
  },
  setup(props) {
    // merge config
    const finalConfig = computed<RenderConfig>(() => ({
      classNamePrefix: "",
      allowHtml: false,
      ...props.config,
    }));

    const renderNode = (node: ASTNode): any => {
      switch (node.type) {
        case "root":
          return renderRoot(node as RootNode);
        case "paragraph":
          return renderParagraph(node as ParagraphNode);
        case "heading":
          return renderHeading(node as HeadingNode);
        case "blockquote":
          return renderBlockquote(node as BlockquoteNode);
        case "list":
          return renderList(node as ListNode);
        case "listItem":
          return renderListItem(node as ListItemNode);
        case "code":
          return renderCode(node as CodeNode);
        case "codeBlock":
          return renderCodeBlock(node as CodeBlockNode);
        case "emphasis":
          return renderEmphasis(node as EmphasisNode);
        case "strong":
          return renderStrong(node as StrongNode);
        case "link":
          return renderLink(node as LinkNode);
        case "image":
          return renderImage(node as ImageNode);
        case "text":
          return renderText(node as TextNode);
        case "thematicBreak":
          return renderThematicBreak(node as ThematicBreakNode);
        case "table":
          return renderTable(node as TableNode);
        case "tableRow":
          return renderTableRow(node as TableRowNode);
        case "tableCell":
          return renderTableCell(node as TableCellNode);
        case "html":
          return renderHTML(node);
        default:
          return null;
      }
    };

    // 渲染根节点
    const renderRoot = (node: RootNode) => {
      return <article class={"mx-auto max-w-4xl"}>{node.children?.map(child => renderNode(child))}</article>;
    };

    // 渲染段落
    const renderParagraph = (node: ParagraphNode) => {
      return <p class={"mb-4 text-gray-900 dark:text-gray-100"}>{node.children?.map(child => renderNode(child))}</p>;
    };

    // 渲染标题
    const renderHeading = (node: HeadingNode) => {
      return [
        <h1
          class={"mb-6 text-4xl leading-tight font-bold tracking-tight text-gray-900 md:text-5xl dark:text-gray-100"}
          id={generateId(node)}>
          {node.children?.map(child => renderNode(child))}
        </h1>,
        <h2
          class={
            "mt-8 mb-5 text-3xl leading-tight font-bold tracking-tight text-gray-900 md:text-4xl dark:text-gray-100"
          }
          id={generateId(node)}>
          {node.children?.map(child => renderNode(child))}
        </h2>,
        <h3
          class={"mt-6 mb-4 text-2xl leading-tight font-bold text-gray-900 md:text-3xl dark:text-gray-100"}
          id={generateId(node)}>
          {node.children?.map(child => renderNode(child))}
        </h3>,
        <h4
          class={"mt-5 mb-3 text-xl leading-tight font-semibold text-gray-900 dark:text-gray-100"}
          id={generateId(node)}>
          {node.children?.map(child => renderNode(child))}
        </h4>,
        <h5
          class={"mt-4 mb-2 text-lg leading-tight font-semibold text-gray-900 dark:text-gray-100"}
          id={generateId(node)}>
          {node.children?.map(child => renderNode(child))}
        </h5>,
        <h6
          class={"mt-3 mb-2 text-base leading-tight font-semibold text-gray-700 dark:text-gray-300"}
          id={generateId(node)}>
          {node.children?.map(child => renderNode(child))}
        </h6>,
      ][node.depth - 1];
    };

    // 渲染块引用
    const renderBlockquote = (node: BlockquoteNode) => {
      return (
        <blockquote
          class={
            "mb-4 rounded border-l-4 border-blue-500 bg-blue-50 px-4 py-2 pl-4 text-gray-700 italic dark:bg-blue-950 dark:text-gray-300"
          }>
          {node.children?.map(child => renderNode(child))}
        </blockquote>
      );
    };

    // 渲染列表
    const renderList = (node: ListNode) => {
      return [
        <ul class={"mb-4 ml-6 list-disc space-y-2 text-gray-900 dark:text-gray-100"}>
          {node.children?.map(child => renderNode(child))}
        </ul>,
        <ol
          class={"mb-4 ml-6 list-decimal space-y-2 text-gray-900 dark:text-gray-100"}
          start={node.start}>
          {node.children?.map(child => renderNode(child))}
        </ol>,
      ][+node.ordered];
    };

    // 渲染列表项
    const renderListItem = (node: ListItemNode) => {
      if (node.checked !== null) {
        return (
          <li class={"mb-2 flex items-start gap-3"}>
            <input
              type="checkbox"
              checked={node.checked}
              disabled={true}
              class={"h-4 w-4 cursor-pointer rounded"}
            />
            <span>{node.children?.map(child => renderNode(child))}</span>
          </li>
        );
      }
      return <li class={"text-gray-900 dark:text-gray-100"}>{node.children?.map(child => renderNode(child))}</li>;
    };

    // 渲染行内代码
    const renderCode = (node: CodeNode) => {
      return (
        <code
          class={
            "inline-block rounded bg-gray-200 px-2 py-1 font-mono text-sm text-red-600 dark:bg-gray-700 dark:text-red-400"
          }>
          {node.value}
        </code>
      );
    };

    // 渲染代码块
    const renderCodeBlock = (node: CodeBlockNode) => {
      return (
        <CodeBlock
          code={node.value}
          language={node.lang}
        />
      );
    };

    // 渲染强调（斜体）
    const renderEmphasis = (node: EmphasisNode) => {
      return (
        <em class={"text-gray-900 italic dark:text-gray-100"}>{node.children?.map(child => renderNode(child))}</em>
      );
    };

    // 渲染加粗
    const renderStrong = (node: StrongNode) => {
      return (
        <strong class={"font-bold text-gray-900 dark:text-gray-100"}>
          {node.children?.map(child => renderNode(child))}
        </strong>
      );
    };

    // 渲染链接
    const renderLink = (node: LinkNode) => {
      return (
        <a
          href={node.url}
          title={node.title}
          class={"cursor-pointer text-blue-600 transition-colors hover:underline dark:text-blue-400"}
          target={isExternalUrl(node.url) ? "_blank" : undefined}
          rel={isExternalUrl(node.url) ? "noopener noreferrer" : undefined}>
          {node.children?.map(child => renderNode(child))}
        </a>
      );
    };

    // 渲染图片
    const renderImage = (node: ImageNode) => {
      return (
        <figure class={"my-4 text-center"}>
          <img
            src={node.url}
            alt={node.alt || ""}
            title={node.title}
            class={"my-4 h-auto max-w-full rounded-lg border border-gray-200 shadow-md dark:border-gray-700"}
            loading="lazy"
          />
          {node.alt ? (
            <figcaption class={"mt-2 text-sm text-gray-600 italic dark:text-gray-400"}>{node.alt}</figcaption>
          ) : null}
        </figure>
      );
    };

    // 渲染纯文本
    const renderText = (node: TextNode) => {
      return node.value;
    };

    // 渲染分割线
    const renderThematicBreak = (node: ThematicBreakNode) => {
      return <hr class={"my-8 border-0 border-t-2 border-gray-300 dark:border-gray-600"} />;
    };

    // 渲染表格
    const renderTable = (node: TableNode) => {
      return (
        <table class={"mb-4 w-full border-collapse border border-gray-300 dark:border-gray-600"}>
          {node.children?.map(child => renderNode(child))}
        </table>
      );
    };

    // 渲染表格行
    const renderTableRow = (node: TableRowNode) => {
      return (
        <tr class={"transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"}>
          {node.children?.map(child => renderNode(child))}
        </tr>
      );
    };

    // 渲染表格单元格
    const renderTableCell = (node: TableCellNode) => {
      return (
        <td class={"border border-gray-300 px-4 py-2 text-gray-900 dark:border-gray-600 dark:text-gray-100"}>
          {node.children?.map(child => renderNode(child))}
        </td>
      );
    };

    // 渲染 HTML
    const renderHTML = (node: any) => {
      if (!finalConfig.value.allowHtml) {
        return null;
      }
      return (
        <div
          class={"prose prose-invert dark:prose my-4"}
          innerHTML={node.value}
        />
      );
    };

    // helper function: 检查是否为外部链接
    const isExternalUrl = (url: string): boolean => {
      return url.startsWith("http://") || url.startsWith("https://");
    };

    // helper function: 生成标题 ID
    const generateId = (node: HeadingNode): string => {
      const text = extractTextContent(node);
      return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    };

    // helper function: 提取节点文本内容
    const extractTextContent = (node: ASTNode): string => {
      if (node.type === "text") {
        return (node as TextNode).value;
      }
      if ("children" in node && node.children) {
        return node.children.map(child => extractTextContent(child as ASTNode)).join("");
      }
      return "";
    };

    return () => renderNode(props.ast);
  },
});

export default ASTRenderer;
export { CodeBlock };
