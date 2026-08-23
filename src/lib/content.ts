/**
 * All site copy lives here.
 *
 * Edit this file to change wording anywhere on the site — the components read
 * from it and contain no hard-coded marketing text.
 *
 * Deliberately contains NO statistics, client names, testimonials, awards or
 * years-of-experience claims. Nothing here asserts anything the business
 * cannot currently back up. Add proof only when it is real.
 */

export const site = {
  name: "Vastisol",
  tagline: "Build the Team Behind Your Business",
  description:
    "Vastisol helps growing businesses build and scale reliable teams for customer support, operations, sales and specialized business functions.",
  // TODO: replace with the live domain before deploying.
  url: "https://vastisol.com",
  // TODO: replace with the real inbox.
  email: "hello@vastisol.com",
};

export const nav = [
  { label: "Solutions", href: "/#solutions" },
  { label: "Property Management", href: "/#property-management" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Why Vastisol", href: "/#why-vastisol" },
];

export const hero = {
  eyebrow: "Global outsourcing & business operations",
  heading: ["Build the Team", "Behind Your Business."],
  body: "Vastisol helps growing companies build reliable teams for customer support, operations, sales and specialized business functions — without the complexity of building everything in-house.",
  primaryCta: { label: "Let's Build Your Team", href: "/contact" },
  secondaryCta: { label: "See how it works", href: "/#how-it-works" },
};

/** The five function areas, shown as a hairline-divided strip under the hero. */
export const functionStrip = [
  "Customer Support",
  "Business Operations",
  "Property Management",
  "Sales & Lead Generation",
  "Dedicated Teams",
];

export const problem = {
  eyebrow: "The problem",
  heading: "Your business is growing. Your operations shouldn't hold it back.",
  lead: "Every function you build internally carries the same overhead: finding people, training them, managing them, replacing them. It works — until it becomes the thing slowing you down.",
  items: [
    {
      title: "Hiring takes longer than the work can wait",
      body: "Sourcing, interviewing and onboarding a single role can absorb weeks of leadership attention before anyone actually does the job.",
    },
    {
      title: "Training doesn't end at onboarding",
      body: "Processes change, tools change, people leave. The real cost of keeping a function running is rarely the cost that was budgeted for it.",
    },
    {
      title: "Operational work expands to fill the day",
      body: "Follow-ups, coordination, data entry and inbox management quietly consume the hours that should be going into growth.",
    },
    {
      title: "Every new function adds management overhead",
      body: "More headcount means more supervision, more systems and more complexity — before it means more capacity.",
    },
  ],
  closing: "Vastisol takes that weight off your team.",
};

export const solutions = {
  eyebrow: "Solutions",
  heading: "Five ways we support the work behind your growth.",
  lead: "Start with the function that's slowing you down most. Expand from there.",
  items: [
    {
      id: "customer-support",
      title: "Customer Support",
      summary:
        "Responsive, well-trained support across the channels your customers actually use.",
      points: [
        "Phone support",
        "Email and ticketing",
        "Live chat",
        "General customer service",
        "Technical support where appropriate",
      ],
    },
    {
      id: "business-operations",
      title: "Business Operations",
      summary:
        "The administrative and back-office work that keeps a company running, handled consistently.",
      points: [
        "Administrative work",
        "Data management",
        "Scheduling and coordination",
        "Documentation",
        "Back-office processes",
      ],
    },
    {
      id: "property-management-solution",
      title: "Property Management",
      summary:
        "Our starting specialization — day-to-day operational support for property management teams.",
      points: [
        "Tenant communication",
        "Maintenance coordination",
        "Leasing support",
        "Vendor communication",
        "Property management software",
      ],
    },
    {
      id: "sales-lead-generation",
      title: "Sales & Lead Generation",
      summary:
        "Support for the top of your pipeline, so the people who close spend their time closing.",
      points: [
        "Lead research",
        "Lead qualification",
        "Outreach",
        "Appointment setting",
        "CRM management",
      ],
    },
    {
      id: "dedicated-teams",
      title: "Dedicated Teams",
      summary:
        "When one person is no longer enough, we build the function around you.",
      points: [
        "Multiple team members",
        "Shared processes and standards",
        "A dedicated point of contact",
        "Capacity that grows with the business",
      ],
    },
  ],
};

export const propertyManagement = {
  eyebrow: "Where we started",
  /** Second half renders in italic accent. */
  heading: [
    "Property management is where we started.",
    "Business operations are where we're going.",
  ],
  paragraphs: [
    "Vastisol is being built through hands-on work inside property management operations — tenant communication, maintenance coordination, leasing support and the daily administrative load that comes with managing property at scale.",
    "That work shaped a specific understanding of what operational support has to look like when it is tied to real properties, real tenants and real deadlines: clear communication, reliable follow-through, and people who know the systems you already use.",
    "It is a foundation, not a ceiling. The same model — understand the workflow, build the team around it, integrate it into the operation — applies just as well to customer support, business operations and sales.",
  ],
  capabilitiesLabel: "What property management support covers",
  capabilities: [
    "Tenant communication",
    "Maintenance coordination",
    "Vendor communication",
    "Leasing support",
    "Administrative support",
    "Customer service",
    "Follow-ups",
    "CRM and property-management software",
    "General property management operations",
  ],
};

export const howItWorks = {
  eyebrow: "How it works",
  heading: "Start with one person. Grow into a team. Build an entire function.",
  lead: "The same five steps whether we're placing a single team member or standing up a department.",
  steps: [
    {
      title: "Understand",
      body: "We start with your business, not a job description. Your goals, workflows, systems and standards shape everything that follows.",
    },
    {
      title: "Build",
      body: "We identify and recruit people suited to your specific requirements — not simply the first available candidate.",
    },
    {
      title: "Train",
      body: "The team learns your processes, your tools and your expectations before they touch live work.",
    },
    {
      title: "Launch",
      body: "The Vastisol team integrates into your existing operation and works the way your business already works.",
    },
    {
      title: "Scale",
      body: "As your business grows, we expand the team alongside it — same standards, more capacity.",
    },
  ],
};

export const whyVastisol = {
  eyebrow: "Why Vastisol",
  heading: "We're building an operational partner, not a staffing vendor.",
  lead: "A few principles shape how every Vastisol team is built and run.",
  items: [
    {
      title: "People First",
      body: "The quality of the people behind a business shapes the quality of its operation. We treat that as the whole job, not a detail.",
    },
    {
      title: "Built Around the Client",
      body: "Your workflows, your systems, your tools, your standards. We adapt to your operation rather than asking you to adapt to ours.",
    },
    {
      title: "Quality Over Volume",
      body: "We would rather take longer to find the right person than fill a seat quickly and hand the problem to you.",
    },
    {
      title: "Operational Partnership",
      body: "We aren't looking to be a vendor that sends workers. We're looking to become part of how your business runs.",
    },
    {
      title: "Built to Scale",
      body: "One person today, a department later. The relationship is designed to grow without being rebuilt.",
    },
  ],
};

export const vision = {
  eyebrow: "The long-term vision",
  heading:
    "The future of outsourcing isn't sending work somewhere else. It's building better businesses through better teams.",
  paragraphs: [
    "Vastisol exists to give growing companies access to the people, processes and operational support they need to move faster. What starts as one team member can become a team, and then an entire business function.",
    "We are building toward a global business operations partner — a company able to take on whole departments, not just tasks.",
  ],
  progression: [
    {
      title: "One person",
      body: "A single team member embedded in one function.",
    },
    {
      title: "A dedicated team",
      body: "Several people working to shared processes and standards.",
    },
    {
      title: "An entire function",
      body: "A complete outsourced department running alongside your business.",
    },
  ],
};

export const finalCta = {
  heading: "Let's build your team.",
  body: "Tell us what's slowing your operation down — the function, the volume, the tools you use. We'll come back with how we would staff and run it.",
  cta: { label: "Start the conversation", href: "/contact" },
};

export const contactPage = {
  eyebrow: "Let's build your team",
  heading: "Tell us what you need.",
  lead: "The more we know about the work, the more useful our first reply will be. There's no obligation and no pitch deck — just a conversation about how the function would run.",
  asideTitle: "What happens next",
  aside: [
    {
      title: "We read it properly",
      body: "Your message goes to the people who would actually build the team, not a general inbox.",
    },
    {
      title: "We come back with specifics",
      body: "How we would structure the role or team, what we'd need from you, and how we'd get it running.",
    },
    {
      title: "You decide whether to continue",
      body: "No commitment at this stage. If it isn't a fit, we'll say so.",
    },
  ],
  /** Options for the "what do you need support with" multi-select. */
  needs: [
    "Customer Support",
    "Business Operations",
    "Property Management",
    "Sales & Lead Generation",
    "A dedicated team",
    "Not sure yet",
  ],
  teamSizes: [
    "Not sure yet",
    "1 person to start",
    "2–5 people",
    "6–10 people",
    "More than 10",
  ],
};
