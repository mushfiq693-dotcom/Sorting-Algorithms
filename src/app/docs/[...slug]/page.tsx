"use client";

import React from "react";
import { useParams, notFound } from "next/navigation";
import { DOCS_ARTICLES } from "@/data/docs";
import { DocsPageContent } from "@/components/docs/DocsPageContent";

export default function DynamicDocsArticlePage() {
  const params = useParams();
  const slugParam = params.slug;

  // Handle single string or array of path segments
  const slug = Array.isArray(slugParam) ? slugParam[slugParam.length - 1] : slugParam;

  const article = DOCS_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return <DocsPageContent article={article} />;
}
