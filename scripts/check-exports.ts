/**
 * This script checks component files to ensure they have both named and default exports
 * Run with: npx ts-node scripts/check-exports.ts
 */

import fs from "fs"
import path from "path"
import { parse } from "@typescript-eslint/parser"

const COMPONENTS_DIR = path.join(process.cwd(), "components")

interface ExportInfo {
  hasNamedExport: boolean
  hasDefaultExport: boolean
  componentName: string | null
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

  // Simple AST traversal to check for exports
  // This is a simplified version and might not catch all edge cases
  for (const node of ast.body) {
    if (node.type === "ExportNamedDeclaration") {
      hasNamedExport = true
      if (node.declaration && node.declaration.type === "FunctionDeclaration") {
        componentName = node.declaration.id?.name || null
      }
    } else if (node.type === "ExportDefaultDeclaration") {
      hasDefaultExport = true
    }
  }

  return { hasNamedExport, hasDefaultExport, componentName }
}

function checkDirectory(dir: string): void {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      checkDirectory(filePath)
    } else if (file.endsWith(".tsx") && !file.endsWith(".test.tsx") && !file.endsWith(".stories.tsx")) {
      const { hasNamedExport, hasDefaultExport, componentName } = analyzeFile(filePath)

      if (!hasNamedExport || !hasDefaultExport) {
        console.log(`Issue in ${filePath}:`)
        if (!hasNamedExport) {
          console.log("  - Missing named export")
        }
        if (!hasDefaultExport) {
          console.log("  - Missing default export")
        }
        console.log("  - Component name:", componentName || "Unknown")
        console.log("")
      }
    }
  }
}

console.log("Checking component exports...")
checkDirectory(COMPONENTS_DIR)
console.log("Done!")
