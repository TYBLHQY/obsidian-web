import type { ASTNode, RenderConfig } from "@/markdown";
import { parseMarkdown, renderMarkdownToHtml } from "@/markdown";
import type { ComputedRef } from "vue";
import { computed, ref } from "vue";

export function useMarkdown(initialMarkdown: string = "", config?: Partial<RenderConfig>) {
  // states
  const markdown = ref(initialMarkdown);
  const renderConfig = ref<Partial<RenderConfig>>({
    allowHtml: false,
    ...config,
  });

  // computed properties
  const ast: ComputedRef<ASTNode> = computed(() => {
    return parseMarkdown(markdown.value);
  });
  const html: ComputedRef<string> = computed(() => {
    return renderMarkdownToHtml(markdown.value);
  });
  const wordCount: ComputedRef<number> = computed(() => {
    return markdown.value.split(/\s+/).filter(word => word.length > 0).length;
  });
  const charCount: ComputedRef<number> = computed(() => {
    return markdown.value.length;
  });
  const lineCount: ComputedRef<number> = computed(() => {
    return markdown.value.split("\n").length;
  });

  // methods
  const setMarkdown = (content: string) => {
    markdown.value = content;
  };
  const appendMarkdown = (content: string) => {
    markdown.value += content;
  };
  const clearMarkdown = () => {
    markdown.value = "";
  };

  // config
  const updateConfig = (newConfig: Partial<RenderConfig>) => {
    renderConfig.value = {
      ...renderConfig.value,
      ...newConfig,
    };
  };
  const resetConfig = () => {
    renderConfig.value = {
      allowHtml: false,
      ...config,
    };
  };

  return {
    markdown,
    renderConfig,

    ast,
    html,
    wordCount,
    charCount,
    lineCount,

    setMarkdown,
    appendMarkdown,
    clearMarkdown,
    updateConfig,
    resetConfig,
  };
}

export function useMarkdownParser() {
  const parseMarkdownContent = (content: string): ASTNode => {
    return parseMarkdown(content);
  };

  const renderToHtml = (content: string): string => {
    return renderMarkdownToHtml(content);
  };

  const extractHeadings = (ast: ASTNode): Array<{ level: number; text: string }> => {
    const headings: Array<{ level: number; text: string }> = [];

    const traverse = (node: ASTNode) => {
      if (node.type === "heading") {
        const headingNode = node as any;
        let text = "";

        const extractText = (n: ASTNode): string => {
          if (n.type === "text") {
            return (n as any).value;
          }
          if ("children" in n && n.children) {
            return n.children.map(c => extractText(c as ASTNode)).join("");
          }
          return "";
        };

        text = extractText(node);
        headings.push({
          level: headingNode.depth,
          text,
        });
      }

      if ("children" in node && node.children) {
        node.children.forEach(child => traverse(child as ASTNode));
      }
    };

    traverse(ast);
    return headings;
  };

  const extractLinks = (ast: ASTNode): Array<{ url: string; title?: string; text: string }> => {
    const links: Array<{ url: string; title?: string; text: string }> = [];

    const traverse = (node: ASTNode) => {
      if (node.type === "link") {
        const linkNode = node as any;
        let text = "";

        const extractText = (n: ASTNode): string => {
          if (n.type === "text") {
            return (n as any).value;
          }
          if ("children" in n && n.children) {
            return n.children.map(c => extractText(c as ASTNode)).join("");
          }
          return "";
        };

        text = linkNode.children?.map((c: ASTNode) => extractText(c)).join("") || "";
        links.push({
          url: linkNode.url,
          title: linkNode.title,
          text,
        });
      }

      if ("children" in node && node.children) {
        node.children.forEach(child => traverse(child as ASTNode));
      }
    };

    traverse(ast);
    return links;
  };

  const extractImages = (ast: ASTNode): Array<{ url: string; alt?: string; title?: string }> => {
    const images: Array<{ url: string; alt?: string; title?: string }> = [];

    const traverse = (node: ASTNode) => {
      if (node.type === "image") {
        const imageNode = node as any;
        images.push({
          url: imageNode.url,
          alt: imageNode.alt,
          title: imageNode.title,
        });
      }

      if ("children" in node && node.children) {
        node.children.forEach(child => traverse(child as ASTNode));
      }
    };

    traverse(ast);
    return images;
  };

  return {
    parseMarkdownContent,
    renderToHtml,
    extractHeadings,
    extractLinks,
    extractImages,
  };
}
