import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// --- Section schemas (discriminated union on `type`) ---

const offerCardSchema = z.object({
  headline: z.string(),
  icon: z.string(),
  body: z.string(),
  link: z.object({ label: z.string(), href: z.string() }),
});

const offerCardsSection = z.object({
  type: z.literal('offer-cards'),
  headline: z.string(),
  description: z.string(),
  as: z.enum(['h1', 'h2']).optional(),
  cards: z.array(offerCardSchema).optional(),
});

const painPointsSection = z.object({
  type: z.literal('pain-points'),
  headline: z.string(),
  body: z.string(),
  items: z.array(z.object({
    icon: z.string(),
    label: z.string(),
  })),
});

const painBlockSection = z.object({
  type: z.literal('pain-block'),
  headline: z.string(),
  body: z.string().optional(),
  consequenceLabel: z.string().optional(),
  consequences: z.array(z.object({
    text: z.string(),
  })).optional(),
  symptoms: z.array(z.object({
    iconName: z.string(),
    text: z.string(),
  })),
});

const servicesGridSection = z.object({
  type: z.literal('services-grid'),
  headline: z.string(),
  body: z.string(),
  as: z.enum(['h1', 'h2']).optional(),
  surface: z.enum(['light', 'muted', 'dark', 'accent']).optional(),
  numbered: z.boolean().optional(),
  services: z.array(z.object({
    heading: z.string(),
    icon: z.string().optional(),
    description: z.string(),
  })),
});

const testimonialsSection = z.object({
  type: z.literal('testimonials'),
  headline: z.string(),
  body: z.string(),
  cta: z.object({ label: z.string(), href: z.string() }).optional(),
  testimonials: z.array(z.object({
    name: z.string(),
    role: z.string(),
    logo: z.string().optional(),
    href: z.string().optional(),
  })),
});

const projectTypeSection = z.object({
  type: z.literal('project-type'),
  projects: z.array(z.object({
    headline: z.string(),
    cta: z.object({ label: z.string(), href: z.string() }),
    image: z.object({ src: z.string(), alt: z.string() }),
  })),
});

const ctaSection = z.object({
  type: z.literal('cta'),
  headline: z.string(),
  buttons: z.array(z.object({
    label: z.string(),
    href: z.string(),
    variant: z.enum(['primary', 'dark', 'ghost']),
  })),
});

const reportCoverMetric = z.object({
  label: z.string(),
  value: z.string(),
  note: z.string().optional(),
});

const reportCoverSection = z.object({
  type: z.literal('report-cover'),
  headline: z.string(),
  subtitle: z.string(),
  profileLabel: z.string(),
  profile: z.object({
    items: z.array(reportCoverMetric),
  }),
  metricsLabel: z.string(),
  metrics: z.array(reportCoverMetric),
  disclaimer: z.string(),
  authorHeadline: z.string(),
  authorBody: z.string(),
  author: z.object({
    name: z.string(),
    role: z.string(),
    photoUrl: z.string().optional(),
  }),
  cta: z.object({
    primary: z.object({ label: z.string(), href: z.string() }),
    secondary: z.object({ label: z.string(), href: z.string() }),
  }),
  gateNote: z.string(),
});

const chapterTitleSection = z.object({
  type: z.literal('chapter-title'),
  headline: z.string(),
  subtitle: z.string().optional(),
  chapterLabel: z.string().optional(),
});

const analysisSection = z.object({
  type: z.literal('analysis'),
  number: z.string(),
  title: z.string(),
  intro: z.string(),
  headerIcon: z.string(),
  insightsHeading: z.string(),
  insights: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })),
  comparisonHeading: z.string(),
  comparison: z.object({
    columns: z.array(z.string()),
    rows: z.array(z.array(z.string())),
    highlightedColumnIndex: z.number().optional(),
  }),
  risksHeading: z.string(),
  risks: z.array(z.object({
    icon: z.string(),
    title: z.string(),
    body: z.string(),
  })),
});

const overviewSection = z.object({
  type: z.literal('overview'),
  headline: z.string(),
  subtitle: z.string(),
  insightLabel: z.string(),
  insight: z.string(),
  insightPoints: z.array(z.string()).optional(),
  areasLabel: z.string(),
  areas: z.array(z.object({
    number: z.string(),
    label: z.string(),
    state: z.enum(['done', 'current']),
    href: z.string().optional(),
  })),
  sectionPills: z.array(z.object({
    label: z.string(),
    state: z.enum(['locked']),
  })).optional(),
  cta: z.object({
    label: z.string(),
    href: z.string(),
    note: z.string().optional(),
  }),
});


const section = z.discriminatedUnion('type', [
  reportCoverSection,
  chapterTitleSection,
  painBlockSection,
  overviewSection,
  analysisSection,
  offerCardsSection,
  painPointsSection,
  servicesGridSection,
  testimonialsSection,
  projectTypeSection,
  ctaSection,
]);

// --- Report collection ---

const reports = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/reports' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    description: z.string().optional(),
    sections: z.array(section),
  }),
});

export const collections = { reports };
