import type { ASTNode, NodeData, RenderConfig } from "@/markdown";
import { markdownParser, parseMarkdown, renderMarkdownToHtml } from "@/markdown";
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

  const extractHeadings = (ast: ASTNode): NodeData<"heading">[] => {
    return markdownParser.find(ast, node => node.type === "heading") as NodeData<"heading">[];
  };

  const extractLinks = (ast: ASTNode): NodeData<"link">[] => {
    return markdownParser.find(ast, node => node.type === "link") as NodeData<"link">[];
  };

  const extractImages = (ast: ASTNode): NodeData<"image">[] => {
    return markdownParser.find(ast, node => node.type === "image") as NodeData<"image">[];
  };

  return {
    parseMarkdownContent,
    renderToHtml,
    extractHeadings,
    extractLinks,
    extractImages,
  };
}
