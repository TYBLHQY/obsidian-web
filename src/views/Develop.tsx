import MarkdownRenderer from "@/components/MarkdownRenderer";
import { useMarkdown, useMarkdownParser } from "@/markdown";
import { computed, defineComponent } from "vue";

const Develop = defineComponent({
  name: "Develop",
  components: {
    MarkdownRenderer,
  },
  setup() {
    const { markdown, ast, wordCount, charCount, lineCount, setMarkdown } = useMarkdown();
    const { extractHeadings, extractLinks, extractImages } = useMarkdownParser();

    const headings = computed(() => extractHeadings(ast.value));
    const links = computed(() => extractLinks(ast.value));
    const images = computed(() => extractImages(ast.value));

    fetch("/md/markdownExample.md")
      .then(response => response.text())
      .then(text => setMarkdown(text || ""));

    return () => (
      <div>
        {/* 主容器 */}
        <div class="mx-auto mb-6 grid h-screen grid-cols-1 gap-6 lg:grid-cols-3">
          {/* 编辑器面板 */}
          <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
            <div class="border-b border-gray-200 bg-gray-100 px-4 py-3 dark:border-gray-600 dark:bg-gray-700">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">编辑器</h2>
            </div>
            <textarea
              value={markdown.value}
              onInput={(e: InputEvent) => setMarkdown((e.target as HTMLTextAreaElement).value)}
              class="h-full w-full resize-none bg-white p-4 font-mono text-sm text-gray-900 focus:outline-none dark:bg-gray-900 dark:text-gray-100"
              spellcheck="false"
            />
          </div>

          {/* markdown ast 面板 */}
          <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
            <div class="border-b border-gray-200 bg-gray-100 px-4 py-3 dark:border-gray-600 dark:bg-gray-700">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Markdown AST</h2>
            </div>
            <div class="h-full overflow-y-auto p-4">
              <pre class="font-mono text-sm text-amber-50">{JSON.stringify(ast.value, null, 2)}</pre>
            </div>
          </div>

          {/* 预览面板 */}
          <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
            <div class="border-b border-gray-200 bg-gray-100 px-4 py-3 dark:border-gray-600 dark:bg-gray-700">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">实时预览</h2>
            </div>
            <div class="h-full overflow-y-auto p-4">
              <MarkdownRenderer ast={ast.value} />
            </div>
          </div>
        </div>

        {/* 统计信息和文档结构 */}
        <div class="mx-auto mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* 统计信息 */}
          <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800">
            <h3 class="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">统计信息</h3>
            <ul class="space-y-2">
              <li class="text-gray-700 dark:text-gray-300">字符数: {charCount.value}</li>
              <li class="text-gray-700 dark:text-gray-300">单词数: {wordCount.value}</li>
              <li class="text-gray-700 dark:text-gray-300">行数: {lineCount.value}</li>
            </ul>
          </div>

          {/* 标题列表 */}
          <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800">
            <h3 class="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">标题</h3>
            <ul class="space-y-1 text-sm">
              {headings.value.map(heading => (
                <li
                  class="text-gray-700 dark:text-gray-300"
                  style={{
                    paddingLeft: `${(heading.level - 1) * 12}px`,
                  }}>
                  {heading.text}
                </li>
              ))}
            </ul>
          </div>

          {/* 链接列表 */}
          <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800">
            <h3 class="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">链接</h3>
            <ul class="space-y-2 text-sm">
              {links.value.length > 0 ? (
                links.value.map(link => (
                  <li class="truncate">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-600 hover:underline dark:text-blue-400"
                      title={link.url}>
                      {link.text || link.url}
                    </a>
                  </li>
                ))
              ) : (
                <li class="text-gray-500 italic dark:text-gray-400">暂无链接</li>
              )}
            </ul>
          </div>

          {/* 图片列表 */}
          <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800">
            <h3 class="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">图片</h3>
            <ul class="space-y-2 text-sm">
              {images.value.length > 0 ? (
                images.value.map(image => (
                  <li class="truncate">
                    <a
                      href={image.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-600 hover:underline dark:text-blue-400"
                      title={image.url}>
                      {image.alt || image.url}
                    </a>
                  </li>
                ))
              ) : (
                <li class="text-gray-500 italic dark:text-gray-400">暂无图片</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  },
});

export default Develop;
