import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCategoryById, getDocument, KB_CATEGORIES } from "@/lib/content";
import DocumentPageClient from "./client";

// Import static params from generated file
import staticParams from "@/content/static-params.json";

interface Props {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const document = await getDocument(category, slug);

  if (!document) {
    return {
      title: "文档未找到",
    };
  }

  return {
    title: `${document.title} - ${document.category}`,
    description: document.description || document.title,
  };
}

export function generateStaticParams() {
  return staticParams;
}

export default async function DocumentPage({ params }: Props) {
  const { category, slug } = await params;

  const document = await getDocument(category, slug);

  if (!document) {
    notFound();
  }

  // Serialize data to ensure it's JSON-serializable
  const serializedDocument = JSON.parse(JSON.stringify(document));

  return <DocumentPageClient document={serializedDocument} />;
}
