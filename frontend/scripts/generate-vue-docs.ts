import fs from "fs";
import path from "path";
import { parse } from "@vue/compiler-sfc";
import { Project, SyntaxKind, MethodDeclaration } from "ts-morph";

const srcDir = "src";
const docsDir = "docs/api";
const allowedDirs = ["components", "pages", "layout", "ui"];
const includedSingleFiles = ["App.vue"];

const project = new Project({
  compilerOptions: { allowJs: true, target: 99 },
});

function extractFunctionsFromSetup(scriptContent: string) {
  const sourceFile = project.createSourceFile("temp.ts", scriptContent, {
    overwrite: true,
  });

  const setupMethod = sourceFile
    .getDescendantsOfKind(SyntaxKind.MethodDeclaration)
    .find((m) => m.getName() === "setup");

  if (!setupMethod) return [];

  const body = setupMethod.getBody();
  const statements = body?.getStatements() || [];
  const results = [];

  for (const stmt of statements) {
    // Obsługuje const foo = () => {}
    if (stmt.getKind() === SyntaxKind.VariableStatement) {
      const jsDoc = stmt.getJsDocs()[0];
      const identifier = stmt.getFirstDescendantByKind(SyntaxKind.Identifier);
      if (jsDoc && identifier) {
        results.push({
          name: identifier.getText(),
          comment: jsDoc.getComment(),
          code: stmt.getText(),
        });
      }
    }

    // Obsługuje function foo() {}
    if (stmt.getKind() === SyntaxKind.FunctionDeclaration) {
      const jsDoc = stmt.getJsDocs()[0];
      const identifier = stmt.getFirstChildByKind(SyntaxKind.Identifier);
      if (jsDoc && identifier) {
        results.push({
          name: identifier.getText(),
          comment: jsDoc.getComment(),
          code: stmt.getText(),
        });
      }
    }
  }

  return results;
}

function generateDocs(filePath: string, relativeToSrc: string) {
  const fileName = path.basename(filePath, ".vue");
  const topLevel = relativeToSrc.split(path.sep)[0] || "root";
  const outputPath = path.join(docsDir, topLevel);
  fs.mkdirSync(outputPath, { recursive: true });

  const source = fs.readFileSync(filePath, "utf-8");
  const { descriptor } = parse(source);
  const scriptBlock = descriptor.script || descriptor.scriptSetup;
  if (!scriptBlock?.content) return;

  const functions = extractFunctionsFromSetup(scriptBlock.content);
  console.log(`📄 ${filePath} → znaleziono ${functions.length} funkcji`);

  if (!functions.length) return;

  const lines = [`# ${fileName}`, "", "## Exposed Methods", ""];
  for (const fn of functions) {
    lines.push(`### \`${fn.name}()\``);
    lines.push(fn.comment || "_No description_");
    lines.push("\n```ts\n" + fn.code + "\n```", "");
  }

  fs.writeFileSync(
    path.join(outputPath, `${fileName}.md`),
    lines.join("\n"),
    "utf-8"
  );
}

function walk(dir: string) {
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const relativePath = path.relative(srcDir, fullPath);
    const isDir = fs.statSync(fullPath).isDirectory();
    const topLevel = relativePath.split(path.sep)[0];

    if (isDir) {
      if (!allowedDirs.includes(topLevel)) continue;
      walk(fullPath);
    } else if (
      fullPath.endsWith(".vue") &&
      (allowedDirs.includes(topLevel) ||
        includedSingleFiles.includes(path.basename(fullPath)))
    ) {
      generateDocs(fullPath, relativePath);
    }
  }
}

walk(srcDir);
