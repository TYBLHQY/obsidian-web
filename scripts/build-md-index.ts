import fs from "fs";
import matter from "gray-matter";
import path from "path";
import remarkParse from "remark-parse";
import { unified } from "unified";

const MD_ROOT = path.resolve("md");
const OUT_FILE = path.resolve("public/md-index.json");

function walk(dir: string): string[] {
  return fs.readdirSync(dir).flatMap(name => {
    const p = path.join(dir, name);
    return fs.statSync(p).isDirectory() ? walk(p) : p.endsWith(".md") ? [p] : [];
  });
}

function extractHeadings(content: string): string[] {
  const tree = unified().use(remarkParse).parse(content);
  return tree.children
    .filter((n: any) => n.type === "heading")
    .map((n: any) => n.children.map((c: any) => c.value || "").join(""));
}

const files = walk(MD_ROOT);

const index = files.map(file => {
  const raw = fs.readFileSync(file, "utf-8");
  const { data, content } = matter(raw);

  return {
    path: file.replace(MD_ROOT, "").replace(/\\/g, "/"),
    title: data.title ?? extractHeadings(content)[0] ?? "Untitled",
    tags: data.tags ?? [],
    wordCount: content.split(/\s+/).length,
    headings: extractHeadings(content),
  };
});

fs.writeFileSync(OUT_FILE, JSON.stringify(index, null, 2));
console.log(`✓ md index generated (${index.length} files)`);
