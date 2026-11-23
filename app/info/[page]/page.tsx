import { notFound } from "next/navigation";
import { PAGES } from "./content";

export function generateStaticParams() {
  return Object.keys(PAGES).map((page) => ({ page }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  return { title: PAGES[page] ? `${PAGES[page].title} — blocks` : "blocks" };
}

export default async function InfoPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const content = PAGES[page];
  if (!content) notFound();
  return (
    <section className="wrap prose">
      <h1>{content.title}</h1>
      {content.body()}
    </section>
  );
}
