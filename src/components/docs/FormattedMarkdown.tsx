"use client";

import React, { useState, memo } from "react";
import { Check, Copy, Terminal, Info, ChevronRight } from "lucide-react";

interface FormattedMarkdownProps {
  content: string;
  className?: string;
}

/**
 * Converts raw LaTeX mathematical strings to clean, natural, formatted mathematical notation.
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

  // Concatenation & Complex LaTeX symbols
  str = str.replace(/\\mathbin\{\/\\mkern-3mu\/\}/g, " // ");
  str = str.replace(/\\mathbin\{([^}]+)\}/g, " $1 ");
  str = str.replace(/\\mkern[^;]*;?/g, "");
  str = str.replace(/\\text\{([^}]+)\}/g, "$1");

  // Common LaTeX Greek and Math Operators
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
  str = str.replace(/\\in\b/g, "∈");
  str = str.replace(/\\blacksquare\b/g, "■");
  str = str.replace(/\\approx\b/g, "≈");
  str = str.replace(/\\cdot\b/g, "·");
  str = str.replace(/\\times\b/g, "×");
  str = str.replace(/\\implies\b/g, " ⟹ ");
  str = str.replace(/\\quad\b/g, "   ");
  str = str.replace(/\\qquad\b/g, "      ");
  str = str.replace(/\\left\(/g, "(");
  str = str.replace(/\\right\)/g, ")");
  str = str.replace(/\\lfloor\b/g, "⌊");
  str = str.replace(/\\rfloor\b/g, "⌋");
  str = str.replace(/\\lceil\b/g, "⌈");
  str = str.replace(/\\rceil\b/g, "⌉");
  str = str.replace(/\\log_2\s*n/g, "log₂ n");
  str = str.replace(/\\log_2\s*([a-zA-Z0-9]+)/g, "log₂ $1");
  str = str.replace(/\\log_b\s*([a-zA-Z0-9]+)/g, "log_b $1");
  str = str.replace(/\\log_B\s*([a-zA-Z0-9]+)/g, "log_B $1");
  str = str.replace(/\\log\b/g, "log");

  // Specific Fractions
  str = str.replace(/\\frac\{1\}\{2\}/g, "½");
  str = str.replace(/\\frac\{1\}\{3\}/g, "⅓");
  str = str.replace(/\\frac\{1\}\{4\}/g, "¼");
  str = str.replace(/\\frac\{1\}\{8\}/g, "⅛");
  str = str.replace(/\\frac\{5\}\{6\}/g, "⅚");
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

  // Clean remaining isolated backslashes and extra spaces
  str = str.replace(/\\/g, "");
  str = str.replace(/\s+/g, " ").trim();

  return str;
}

/**
 * Parses inline text for bold, code, math ($...$), and italic tokens.
 * Renders variables naturally without disruptive box borders around every letter.
 */
function renderInlineText(text: string): React.ReactNode[] {
  // Regex to match $math$, `code`, **bold**, *italic*
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
          className="inline-block my-1.5 px-3 py-1 rounded-xl bg-cyan-950/30 border border-cyan-500/30 font-mono font-bold text-cyan-300 text-sm sm:text-base shadow-sm"
        >
          {math}
        </span>
      );
    }

    // Inline math: $...$ (Clean, natural math typography without cluttered boxed borders)
    if (part.startsWith("$") && part.endsWith("$")) {
      const math = formatMathString(part);
      return (
        <span
          key={index}
          className="font-serif italic font-semibold text-cyan-400 dark:text-cyan-300 mx-1 text-[1.05em] tracking-wide"
        >
          {math}
        </span>
      );
    }

    // Inline code: `...` (Subtle, sleek code badge)
    if (part.startsWith("`") && part.endsWith("`")) {
      const code = part.slice(1, -1);
      return (
        <code
          key={index}
          className="font-mono text-[13px] sm:text-[14px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg mx-1 font-medium"
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
        <em key={index} className="text-muted-foreground italic font-serif">
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
    <div className="my-6 rounded bg-[#14100D] border border-[#4A3F35] overflow-hidden shadow-2xl corner-flourish">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#4A3F35] bg-[#1C1714] text-xs font-mono text-[#9C8B7A]">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-[#C9A962]" />
          <span className="text-[#E8DFD4] font-display font-bold uppercase tracking-wider">{lang || "Code"}</span>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#4A3F35] bg-[#251E19] text-xs font-display uppercase tracking-wider text-[#E8DFD4] hover:text-[#C9A962] hover:border-[#C9A962] transition-all cursor-pointer"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-[#C9A962]" />}
          <span>{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>
      <pre className="p-5 sm:p-6 font-mono text-sm sm:text-base text-[#E8DFD4] overflow-x-auto leading-relaxed selection:bg-[#C9A962]/30">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function DisplayMathCard({ math }: { math: string }) {
  const formatted = formatMathString(math);

  return (
    <div className="my-6 py-4 px-6 rounded border border-[#C9A962]/40 bg-gradient-to-r from-[#251E19] via-[#1C1714] to-[#251E19] shadow-inner text-center overflow-x-auto corner-flourish">
      <div className="font-mono text-base sm:text-lg md:text-xl font-bold text-[#C9A962] tracking-wide select-text py-1">
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
    <div className="my-6 rounded border border-[#4A3F35] bg-[#251E19] overflow-hidden shadow-2xl corner-flourish">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm sm:text-base border-collapse">
          <thead>
            <tr className="border-b border-[#4A3F35] bg-[#1C1714] text-[#E8DFD4]">
              {headerCells.map((cell, idx) => (
                <th key={idx} className="py-3.5 px-5 font-display text-[#C9A962] font-bold text-xs sm:text-sm uppercase tracking-wider">
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
                  rIdx % 2 === 0 ? "bg-transparent" : "bg-secondary/20"
                } hover:bg-cyan-500/[0.05]`}
              >
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="py-3.5 px-5 text-foreground/90 leading-relaxed font-sans">
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

export const FormattedMarkdown = memo(function FormattedMarkdown({
  content,
  className = "",
}: FormattedMarkdownProps) {
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
        const formula = line.slice(2, -2).trim();
        elements.push(<DisplayMathCard key={keyIndex++} math={formula} />);
        i++;
        continue;
      } else {
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

    // 4. Headings (H1 to H4)
    if (line.startsWith("#### ")) {
      const title = line.replace("#### ", "");
      elements.push(
        <h4 key={keyIndex++} className="text-base sm:text-lg font-bold text-cyan-400 mt-6 mb-2 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 inline-block shadow-[0_0_8px_#38bdf8]" />
          <span>{renderInlineText(title)}</span>
        </h4>
      );
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      const title = line.replace("### ", "");
      elements.push(
        <h3 key={keyIndex++} className="text-lg sm:text-xl font-bold text-foreground mt-8 mb-3 tracking-tight flex items-center gap-2">
          <ChevronRight className="h-5 w-5 text-cyan-400" />
          <span>{renderInlineText(title)}</span>
        </h3>
      );
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      const title = line.replace("## ", "");
      elements.push(
        <h2 key={keyIndex++} className="text-xl sm:text-2xl font-extrabold text-foreground mt-9 mb-4 tracking-tight border-b border-border/80 pb-2.5">
          <span>{renderInlineText(title)}</span>
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith("# ")) {
      const title = line.replace("# ", "");
      elements.push(
        <h1 key={keyIndex++} className="text-2xl sm:text-3xl font-black text-foreground mt-7 mb-4 tracking-tight">
          {renderInlineText(title)}
        </h1>
      );
      i++;
      continue;
    }

    // 5. Horizontal Rule
    if (line === "---" || line === "***") {
      elements.push(<hr key={keyIndex++} className="my-8 border-border/70" />);
      i++;
      continue;
    }

    // 6. Blockquote: > text
    if (line.startsWith("> ")) {
      const quoteText = line.replace(/^>\s*/, "");
      elements.push(
        <div key={keyIndex++} className="my-5 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5 flex items-start gap-3.5">
          <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
          <div className="text-sm sm:text-base text-foreground leading-relaxed font-sans">
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
        <li key={keyIndex++} className="text-base sm:text-[17px] text-foreground/90 ml-6 list-disc leading-relaxed my-2 font-sans marker:text-cyan-400">
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
        <div key={keyIndex++} className="flex items-start gap-3 text-base sm:text-[17px] text-foreground/90 my-2.5 font-sans">
          <span className="shrink-0 h-6 w-6 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center font-mono text-xs font-bold text-cyan-300 mt-0.5">
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
        <p key={keyIndex++} className="text-base sm:text-[17px] text-foreground/90 leading-relaxed my-3 font-sans">
          {renderInlineText(line)}
        </p>
      );
    }

    i++;
  }

  return <div className={`space-y-1.5 ${className}`}>{elements}</div>;
});
