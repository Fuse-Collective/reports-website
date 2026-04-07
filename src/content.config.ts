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

const servicesGridSection = z.object({
  type: z.literal('services-grid'),
  headline: z.string(),
  body: z.string(),
  as: z.enum(['h1', 'h2']).optional(),
  surface: z.enum(['light', 'muted', 'dark', 'accent']).optional(),
  services: z.array(z.object({
    heading: z.string(),
    icon: z.string(),
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

const section = z.discriminatedUnion('type', [
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
