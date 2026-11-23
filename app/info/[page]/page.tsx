import { notFound } from "next/navigation";

const PAGES: Record<string, { title: string; body: string[] }> = {
  delivery: {
    title: "Delivery",
    body: ["[Delivery times and costs go here — e.g. typical delivery window, free delivery threshold, tracking info.]"],
  },
  returns: {
    title: "Returns",
    body: ["[Returns policy goes here — returns window, condition of items, how to start a return, refund timing.]"],
  },
  contact: {
    title: "Contact us",
    body: ["[Contact email and expected reply time go here.]"],
  },
};

export function generateStaticParams() {
  return Object.keys(PAGES).map((page) => ({ page }));
}

export default async function InfoPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const content = PAGES[page];
  if (!content) notFound();
  return (
    <section className="wrap prose">
      <h1>{content.title}</h1>
      {content.body.map((t, i) => (
        <p key={i}>{t}</p>
      ))}
    </section>
  );
}
