import { notFound } from "next/navigation";
import { Metadata } from "next";
import { KB_CATEGORIES, getCategoryById, getDocumentsByCategory } from "@/lib/content";
import CategoryPageClient from "./client";

interface Props {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const categoryConfig = getCategoryById(category);

  if (!categoryConfig) {
    return {
      title: "知识库 - 404",
    };
  }

  return {
    title: `${categoryConfig.name} - 知识库`,
    description: categoryConfig.description,
  };
}

export function generateStaticParams() {
  return KB_CATEGORIES.map((cat) => ({
    category: cat.id,
  }));
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const categoryConfig = getCategoryById(category);

  if (!categoryConfig) {
    notFound();
  }

  const documents = await getDocumentsByCategory(category);

  // Serialize data to ensure it's JSON-serializable
  const serializedCategory = JSON.parse(JSON.stringify(categoryConfig));
  const serializedDocuments = JSON.parse(JSON.stringify(documents));

  return (
    <CategoryPageClient
      category={serializedCategory}
      documents={serializedDocuments}
    />
  );
}
