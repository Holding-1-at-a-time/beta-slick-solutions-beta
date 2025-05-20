/**
 * This script automatically fixes component files to ensure they have both named and default exports
 * Run with: npx ts-node scripts/fix-exports.ts
 */

import fs from "fs"
import path from "path"
import { parse } from "@typescript-eslint/parser"

const COMPONENTS_DIR = path.join(process.cwd(), "components")

interface ExportInfo {
  hasNamedExport: boolean
  hasDefaultExport: boolean
  componentName: string | null
  isArrowFunction: boolean
}

function analyzeFile(filePath: string): ExportInfo {
  const content = fs.readFileSync(filePath, "utf-8")
  const ast = parse(content, {
    ecmaVersion: 2020,
    sourceType: "module",
  })

  let hasNamedExport = false
  let hasDefaultExport = false
  let componentName: string | null = null
  let isArrowFunction = false

  // Simple AST traversal to check for exports
  for (const node of ast.body) {
    if (node.type === "ExportNamedDeclaration") {
      hasNamedExport = true
      if (node.declaration) {
        if (node.declaration.type === "FunctionDeclaration") {
          componentName = node.declaration.id?.name || null
        } else if (node.declaration.type === "VariableDeclaration") {
          const declaration = node.declaration.declarations[0]
          if (declaration.id.type === "Identifier") {
            componentName = declaration.id.name
            if (declaration.init?.type === "ArrowFunctionExpression") {
              isArrowFunction = true
            }
          }
        }
      }
    } else if (node.type === "ExportDefaultDeclaration") {
      hasDefaultExport = true
      if (node.declaration.type === "FunctionDeclaration") {
        componentName = node.declaration.id?.name || null
      } else if (node.declaration.type === "Identifier") {
        componentName = node.declaration.name
      }
    }
  }

  return { hasNamedExport, hasDefaultExport, componentName, isArrowFunction }
}

function fixFile(filePath: string, info: ExportInfo): void {
  if (!info.componentName) {
    console.log(`Cannot fix ${filePath}: Unable to determine component name`)
    return
  }

  let content = fs.readFileSync(filePath, "utf-8")

  // Case 1: Has default export but no named export
  if (info.hasDefaultExport && !info.hasNamedExport) {
    // Replace "export default function ComponentName" with "export function ComponentName"
    // and add "export default ComponentName" at the end
    if (content.includes(`export default function ${info.componentName}`)) {
      content = content.replace(
        `export default function ${info.componentName}`,
        `export function ${info.componentName}`,
      )
      content += `\n\nexport default ${info.componentName};\n`
    }
    // Handle arrow functions
    else if (content.includes(`export default const ${info.componentName}`)) {
      content = content.replace(`export default const ${info.componentName}`, `export const ${info.componentName}`)
      content += `\n\nexport default ${info.componentName};\n`
    }
    // Handle direct default export
    else if (content.match(new RegExp(`export default ${info.componentName}`))) {
      // Find the function declaration
      const functionDeclarationRegex = new RegExp(`function ${info.componentName}\\s*\\(`)
      const arrowFunctionDeclarationRegex = new RegExp(`const ${info.componentName}\\s*=\\s*\\(`)

      if (functionDeclarationRegex.test(content)) {
        content = content.replace(
          new RegExp(`function ${info.componentName}\\s*\\(`),
          `export function ${info.componentName}(`,
        )
      } else if (arrowFunctionDeclarationRegex.test(content)) {
        content = content.replace(
          new RegExp(`const ${info.componentName}\\s*=\\s*\\(`),
          `export const ${info.componentName} = (`,
        )
      }
    }
  }

  // Case 2: Has named export but no default export
  else if (info.hasNamedExport && !info.hasDefaultExport) {
    // Add "export default ComponentName" at the end
    content += `\n\nexport default ${info.componentName};\n`
  }

  fs.writeFileSync(filePath, content)
  console.log(`Fixed ${filePath}`)
}

function processDirectory(dir: string): void {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      processDirectory(filePath)
    } else if (file.endsWith(".tsx") && !file.endsWith(".test.tsx") && !file.endsWith(".stories.tsx")) {
      const info = analyzeFile(filePath)

      if (!info.hasNamedExport || !info.hasDefaultExport) {
        console.log(`Fixing ${filePath}...`)
        fixFile(filePath, info)
      }
    }
  }
}

console.log("Fixing component exports...")
processDirectory(COMPONENTS_DIR)
console.log("Done!")
