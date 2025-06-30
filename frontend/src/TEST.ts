import fs from "fs";
import path from "path";
import { parse } from "@vue/compiler-sfc";
import { Project, SyntaxKind, JSDocTag, PropertySignature } from "ts-morph";

const srcDir = "src";
const docsDir = "docs/api";
const allowedDirs = ["components", "pages", "layout", "ui"];
const includedSingleFiles = ["App.vue"];

const project = new Project({
  compilerOptions: { allowJs: true, target: 99 },
});

function extractComponentInfo(scriptContent: string) {
  const commentRegex = /\/\*\*([\s\S]*?)\*\//gm;
  const matches = [...scriptContent.matchAll(commentRegex)];

  for (const match of matches) {
    if (match[0].includes("@component")) {
      const block = match[1];
      const descMatch = /@description\s+([\s\S]*?)(?=@|\*\/)/.exec(block);
      const description = descMatch?.[1]?.replace(/\*\/$/, "").trim();
      return { description };
    }
  }

  return null;
}

function extractPropsInterface(scriptContent: string) {
  const sourceFile = project.createSourceFile(
    "temp-interface.ts",
    scriptContent,
    { overwrite: true }
  );
  const interfaceNode = sourceFile
    .getInterfaces()
    .find((i) => i.getName() === "Props");
  if (!interfaceNode) return [];

  const jsDocTags = interfaceNode.getJsDocs()[0]?.getTags() || [];

  const docMap: Record<string, string> = {};
  jsDocTags.forEach((tag: JSDocTag) => {
    if (tag.getTagName() === "property") {
      const text = tag.getText();
      const match = /{[^}]+}\s+\[?(\w+)\]?\s*-\s*(.*)/.exec(text);
      if (match) {
        docMap[match[1]] = match[2].trim();
      }
    }
  });

  return interfaceNode.getProperties().map((prop: PropertySignature) => {
    const name = prop.getName();
    const type = prop.getType().getText();
    const required = !prop.hasQuestionToken();
    return {
      name,
      type,
      required: required ? "yes" : "no",
      comment: docMap[name] || "",
    };
  });
}

function extractFunctionsFromSetup(scriptContent: string) {
  const sourceFile = project.createSourceFile("temp-fn.ts", scriptContent, {
    overwrite: true,
  });
  const setupMethod = sourceFile
    .getDescendantsOfKind(SyntaxKind.MethodDeclaration)
    .find((m) => m.getName() === "setup");
  if (!setupMethod) return [];

  const body = setupMethod.getBody();
  if (!body) return [];

  const results = [];

  body.getStatements().forEach((stmt) => {
    const isFunction =
      stmt.getKind() === SyntaxKind.FunctionDeclaration ||
      stmt.getKind() === SyntaxKind.VariableStatement;

    // Only proceed if it's a function and getJsDocs exists
    if (!isFunction || typeof (stmt as any).getJsDocs !== "function") return;

    const jsDocs = (stmt as any).getJsDocs();
    if (!jsDocs.length) return;

    const jsDoc = jsDocs[0];
    const tags = jsDoc.getTags();
    const jsdocFunctionTag = tags.find((t) => t.getTagName() === "function");

    let fnName = jsdocFunctionTag?.getComment()?.trim();
    if (!fnName) {
      if (stmt.getKind() === SyntaxKind.FunctionDeclaration) {
        fnName = stmt.getFirstChildByKind(SyntaxKind.Identifier)?.getText();
      } else if (stmt.getKind() === SyntaxKind.VariableStatement) {
        const declaration = stmt.getDeclarations()[0];
        fnName = declaration?.getName();
      }
    }

    if (!fnName) return;

    const description = jsDoc.getDescription().trim();
    const params = tags
      .filter((t) => t.getTagName() === "param")
      .map((tag) => {
        const text = tag.getText();
        const parts = /{([^}]+)}\s+(\w+)\s*-\s*(.*)/.exec(text);
        return parts
          ? `- \`${parts[2]}\` (\`${parts[1]}\`): ${parts[3]}`
          : `- ${text}`;
      });

    const returns = tags
      .find((t) => t.getTagName() === "returns")
      ?.getComment();

    results.push({ name: fnName, description, params, returns });
  });

  return results;
}

function extractEmits(scriptContent: string) {
  const emitsRegex = /defineEmits\s*<[^>]*>\(\s*\[([^\]]*)\]/m;
  const altRegex = /emits:\s*\[([^\]]+)\]/m;

  const match =
    scriptContent.match(emitsRegex) || scriptContent.match(altRegex);
  if (!match) return [];

  return match[1]
    .split(",")
    .map((e) => e.replace(/['"`]/g, "").trim())
    .filter(Boolean);
}

function generateDocs(filePath: string, relativeToSrc: string) {
  const fileName = path.basename(filePath, ".vue");
  const topLevel = relativeToSrc.split(path.sep)[0] || "root";
  const outputPath = path.join(docsDir, topLevel);
  fs.mkdirSync(outputPath, { recursive: true });

  const source = fs.readFileSync(filePath, "utf-8");
  const { descriptor } = parse(source);
  const script = descriptor.script || descriptor.scriptSetup;
  if (!script?.content) return;

  const content = script.content;
  const componentInfo = extractComponentInfo(content);
  const props = extractPropsInterface(content);
  const emits = extractEmits(content);
  const functions = extractFunctionsFromSetup(content);

  console.log(
    `📄 ${filePath} → props: ${props.length}, emits: ${emits.length}, fn: ${functions.length}`
  );

  const lines = [`# ${fileName}`, ""];

  if (componentInfo?.description) {
    lines.push(componentInfo.description, "");
  }

  if (props.length) {
    lines.push("## Props", "");
    lines.push("| Name | Type | Required | Description |");
    lines.push("|------|------|----------|-------------|");
    for (const p of props) {
      lines.push(
        `| \`${p.name}\` | \`${p.type}\` | ${p.required} | ${p.comment} |`
      );
    }
    lines.push("");
  }

  if (emits.length) {
    lines.push("## Emits", "");
    for (const ev of emits) {
      lines.push(`- \`${ev}\``);
    }
    lines.push("");
  }

  if (functions.length) {
    lines.push("## Exposed Methods", "");
    for (const fn of functions) {
      lines.push(`### \`${fn.name}()\``);
      if (fn.description) lines.push(fn.description, "");
      if (fn.params?.length) {
        lines.push("**Parameters:**", ...fn.params, "");
      }
      if (fn.returns) {
        lines.push(`**Returns:** ${fn.returns}`, "");
      }
    }
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
