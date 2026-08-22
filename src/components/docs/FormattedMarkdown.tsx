"use client";

import React, { useState } from "react";
import { Check, Copy, Terminal, Info, Calculator } from "lucide-react";

interface FormattedMarkdownProps {
  content: string;
  className?: string;
}

/**
 * Converts raw LaTeX mathematical strings to clean, beautiful, formatted Unicode mathematical notation.
 */
export function formatMathString(raw: string): string {
  if (!raw) return "";
  let str = raw.trim();

  // Strip outer math markers if present
  if (str.startsWith("$$") && str.endsWith("$$")) {
    str = str.slice(2, -2).trim();
  } else if (str.startsWith("$") && str.endsWith("$")) {
    str = str.slice(1, -1).trim();
  }

  // Common LaTeX Greek and Special Symbols
  str = str.replace(/\\Theta/g, "Θ");
  str = str.replace(/\\Omega/g, "Ω");
  str = str.replace(/\\Sigma/g, "Σ");
  str = str.replace(/\\sum_\{([^}]+)\}\^\{([^}]+)\}/g, "∑($1 to $2)");
  str = str.replace(/\\sum_\{([^}]+)\}\^(\S+)/g, "∑($1 to $2)");
  str = str.replace(/\\sum\b/g, "∑");
  str = str.replace(/\\dots/g, "…");
  str = str.replace(/\\cdots/g, "⋯");
  str = str.replace(/\\le\b/g, "≤");
  str = str.replace(/\\ge\b/g, "≥");
  str = str.replace(/\\ne\b/g, "≠");
  str = str.replace(/\\forall\b/g, "∀");
  str = str.replace(/\\blacksquare\b/g, "■");
  str = str.replace(/\\approx\b/g, "≈");
  str = str.replace(/\\cdot\b/g, "·");
  str = str.replace(/\\times\b/g, "×");
  str = str.replace(/\\implies\b/g, "⟹");
  str = str.replace(/\\quad\b/g, "   ");
  str = str.replace(/\\qquad\b/g, "      ");
  str = str.replace(/\\left\(/g, "(");
  str = str.replace(/\\right\)/g, ")");
  str = str.replace(/\\langle/g, "⟨");
  str = str.replace(/\\rangle/g, "⟩");
  str = str.replace(/\\text\{([^}]+)\}/g, "$1");
  str = str.replace(/\\log_2\s*n/g, "log₂ n");
  str = str.replace(/\\log_2\s*([a-zA-Z0-9]+)/g, "log₂ $1");
  str = str.replace(/\\log\b/g, "log");

  // Specific Fractions
  str = str.replace(/\\frac\{1\}\{2\}/g, "½");
  str = str.replace(/\\frac\{1\}\{4\}/g, "¼");
  str = str.replace(/\\frac\{1\}\{8\}/g, "⅛");
  str = str.replace(/\\frac\{3\}\{4\}/g, "¾");
  str = str.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1 / $2)");

  // Superscripts & Exponents
  str = str.replace(/\^2\b/g, "²");
  str = str.replace(/\^3\b/g, "³");
  str = str.replace(/\^k\b/g, "ᵏ");
  str = str.replace(/\^n\b/g, "ⁿ");
  str = str.replace(/\^\{2\}/g, "²");
  str = str.replace(/\^\{3\}/g, "³");
  str = str.replace(/\^\{k\}/g, "ᵏ");
  str = str.replace(/\^\{n\}/g, "ⁿ");
  str = str.replace(/\^\{([^}]+)\}/g, "^($1)");

  // Subscripts
  str = str.replace(/_0\b/g, "₀");
  str = str.replace(/_1\b/g, "₁");
  str = str.replace(/_2\b/g, "₂");
  str = str.replace(/_3\b/g, "₃");
  str = str.replace(/_i\b/g, "ᵢ");
  str = str.replace(/_j\b/g, "ⱼ");
  str = str.replace(/_k\b/g, "ₖ");
  str = str.replace(/_n\b/g, "ₙ");
  str = str.replace(/_\{0\}/g, "₀");
  str = str.replace(/_\{1\}/g, "₁");
  str = str.replace(/_\{2\}/g, "₂");
  str = str.replace(/_\{i\}/g, "ᵢ");
  str = str.replace(/_\{j\}/g, "ⱼ");
  str = str.replace(/_\{k\}/g, "ₖ");
  str = str.replace(/_\{n\}/g, "ₙ");
  str = str.replace(/_\{([^}]+)\}/g, "($1)");

  // Clean remaining isolated backslashes
  str = str.replace(/\\/g, "");

  return str;
}

/**
 * Parses inline text for bold, code, math ($...$), and italic tokens.
 */
function renderInlineText(text: string): React.ReactNode[] {
  // Regex to match $math$, `code`, **bold**, *italic*
  // Order matters: match $...$ first for math, then `...`, then **...**, then *...*
  const pattern = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$|`[^`]+?`|\*\*[^*]+?\*\*|\*[^*]+?\*)/g;
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    if (!part) return null;

    // Display math embedded inline: $$...$$
    if (part.startsWith("$$") && part.endsWith("$$")) {
      const math = formatMathString(part);
      return (
        <span
          key={index}
          className="inline-block my-1 px-3 py-1 rounded-lg bg-secondary border border-cyan-500/30 font-mono font-bold text-cyan-700 dark:text-cyan-200 text-xs sm:text-sm shadow-sm"
        >
          {math}
        </span>
      );
    }

    // Inline math: $...$
    if (part.startsWith("$") && part.endsWith("$")) {
      const math = formatMathString(part);
      return (
        <span
          key={index}
          className="inline-flex items-center font-mono font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.5 rounded text-[11px] sm:text-xs mx-0.5 shadow-sm"
        >
          {math}
        </span>
      );
    }

    // Inline code: `...`
    if (part.startsWith("`") && part.endsWith("`")) {
      const code = part.slice(1, -1);
      return (
        <code
          key={index}
          className="font-mono text-[11px] sm:text-xs text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/25 px-1.5 py-0.5 rounded mx-0.5"
        >
          {code}
        </code>
      );
    }

    // Bold text: **...**
    if (part.startsWith("**") && part.endsWith("**")) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className="text-foreground font-bold">
          {renderInlineText(boldText)}
        </strong>
      );
    }

    // Italic text: *...*
    if (part.startsWith("*") && part.endsWith("*")) {
      const italicText = part.slice(1, -1);
      return (
        <em key={index} className="text-muted-foreground italic">
          {renderInlineText(italicText)}
        </em>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="my-5 rounded-2xl border border-border bg-card overflow-hidden shadow-sm dark:shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/70 text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-cyan-500" />
          <span className="text-foreground font-bold uppercase">{lang || "Code"}</span>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className="p-4 sm:p-5 font-mono text-xs sm:text-sm text-foreground overflow-x-auto leading-relaxed bg-background/50 selection:bg-cyan-500/30">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function DisplayMathCard({ math }: { math: string }) {
  const formatted = formatMathString(math);

  return (
    <div className="my-5 rounded-2xl border border-cyan-500/30 bg-secondary/50 p-4 sm:p-5 shadow-sm text-center relative overflow-hidden group">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
          <Calculator className="h-3.5 w-3.5 text-cyan-500" />
          <span>Mathematical Derivation</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 font-bold">
          Formal Bound
        </span>
      </div>
      <div className="font-mono text-sm sm:text-base md:text-lg font-extrabold text-foreground tracking-wide select-text py-2 overflow-x-auto">
        {formatted}
      </div>
    </div>
  );
}

function MarkdownTable({ tableLines }: { tableLines: string[] }) {
  if (tableLines.length < 2) return null;

  const parseRow = (line: string) => {
    return line
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());
  };

  const headerCells = parseRow(tableLines[0]);
  const dataRows = tableLines.slice(2).map(parseRow);

  return (
    <div className="my-6 rounded-2xl border border-border bg-card overflow-hidden shadow-sm dark:shadow-2xl backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary text-foreground font-bold">
              {headerCells.map((cell, idx) => (
                <th key={idx} className="py-3 px-4 font-mono text-cyan-700 dark:text-cyan-300 font-bold text-xs uppercase tracking-wider">
                  {renderInlineText(cell)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {dataRows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className={`transition-colors ${
                  rIdx % 2 === 0 ? "bg-transparent" : "bg-secondary/30"
                } hover:bg-cyan-500/[0.06]`}
              >
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="py-3 px-4 text-foreground leading-relaxed font-sans">
                    {renderInlineText(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function FormattedMarkdown({ content, className = "" }: FormattedMarkdownProps) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let keyIndex = 0;

  let i = 0;
  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // 1. Code Block: ```
    if (line.startsWith("```")) {
      const lang = line.replace("```", "").trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // Skip closing ```
      elements.push(<CodeBlock key={keyIndex++} code={codeLines.join("\n")} lang={lang} />);
      continue;
    }

    // 2. Display Math Block: $$...$$
    if (line.startsWith("$$")) {
      if (line.endsWith("$$") && line.length > 4) {
        // Single-line display math: $$ formula $$
        const formula = line.slice(2, -2).trim();
        elements.push(<DisplayMathCard key={keyIndex++} math={formula} />);
        i++;
        continue;
      } else {
        // Multi-line display math
        const mathLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().endsWith("$$")) {
          mathLines.push(lines[i]);
          i++;
        }
        if (i < lines.length) {
          const lastLine = lines[i].trim().replace(/\$\$$/, "");
          if (lastLine) mathLines.push(lastLine);
          i++;
        }
        elements.push(<DisplayMathCard key={keyIndex++} math={mathLines.join(" ")} />);
        continue;
      }
    }

    // 3. Markdown Table: lines starting with |
    if (line.startsWith("|") && line.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      elements.push(<MarkdownTable key={keyIndex++} tableLines={tableLines} />);
      continue;
    }

    // 4. Headings
    if (line.startsWith("### ")) {
      const title = line.replace("### ", "");
      elements.push(
        <h3 key={keyIndex++} className="text-lg sm:text-xl font-bold text-foreground mt-8 mb-3 tracking-tight flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-500 inline-block shadow-[0_0_6px_#38bdf8]" />
          <span>{renderInlineText(title)}</span>
        </h3>
      );
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      const title = line.replace("## ", "");
      elements.push(
        <h2 key={keyIndex++} className="text-xl sm:text-2xl font-extrabold text-foreground mt-10 mb-4 tracking-tight border-b border-border pb-2.5 flex items-center gap-2.5">
          <span>{renderInlineText(title)}</span>
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith("# ")) {
      const title = line.replace("# ", "");
      elements.push(
        <h1 key={keyIndex++} className="text-2xl sm:text-3xl font-extrabold text-foreground mt-6 mb-4 tracking-tight">
          {renderInlineText(title)}
        </h1>
      );
      i++;
      continue;
    }

    // 5. Horizontal Rule
    if (line === "---" || line === "***") {
      elements.push(<hr key={keyIndex++} className="my-8 border-border" />);
      i++;
      continue;
    }

    // 6. Blockquote: > text
    if (line.startsWith("> ")) {
      const quoteText = line.replace(/^>\s*/, "");
      elements.push(
        <div key={keyIndex++} className="my-4 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 flex items-start gap-3">
          <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-blue-950 dark:text-blue-100 leading-relaxed font-sans">
            {renderInlineText(quoteText)}
          </div>
        </div>
      );
      i++;
      continue;
    }

    // 7. Unordered List Items: - or *
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const itemText = line.slice(2);
      elements.push(
        <li key={keyIndex++} className="text-xs sm:text-sm text-foreground/90 ml-5 list-disc leading-relaxed my-1.5 font-sans marker:text-cyan-500">
          {renderInlineText(itemText)}
        </li>
      );
      i++;
      continue;
    }

    // 8. Ordered List Items: 1. , 2. , etc.
    const orderedMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (orderedMatch) {
      const num = orderedMatch[1];
      const itemText = orderedMatch[2];
      elements.push(
        <div key={keyIndex++} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90 my-2 font-sans">
          <span className="shrink-0 h-5 w-5 rounded-md bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center font-mono text-[11px] font-bold text-cyan-700 dark:text-cyan-300 mt-0.5">
            {num}
          </span>
          <div className="leading-relaxed flex-1">{renderInlineText(itemText)}</div>
        </div>
      );
      i++;
      continue;
    }

    // 9. Paragraph
    if (line.length > 0) {
      elements.push(
        <p key={keyIndex++} className="text-xs sm:text-sm text-foreground/90 leading-relaxed my-3 font-sans">
          {renderInlineText(line)}
        </p>
      );
    }

    i++;
  }

  return <div className={`space-y-1 ${className}`}>{elements}</div>;
}
