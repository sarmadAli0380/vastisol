import Link from "next/link";
import { nav, site, solutions } from "@/lib/content";
import { Container, Wordmark } from "./primitives";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule bg-paper-sunk">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr] md:gap-8 md:py-20">
          <div className="max-w-sm">
            <Wordmark />
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-muted">
              {site.description}
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-6 inline-block border-b border-rule-strong pb-0.5 text-[0.9375rem] text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              {site.email}
            </a>
          </div>

          <FooterColumn
            title="Solutions"
            links={solutions.items.map((s) => ({
              label: s.title,
              href: "/#solutions",
            }))}
          />

          <FooterColumn
            title="Company"
            links={[...nav, { label: "Contact", href: "/contact" }]}
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-rule py-7 text-sm text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em]">
            Building the team behind the business
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h2 className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-ink-faint">
        {title}
      </h2>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[0.9375rem] text-ink-muted transition-colors duration-200 hover:text-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
