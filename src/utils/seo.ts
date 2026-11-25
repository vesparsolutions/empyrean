export interface PageSEO {
  title: string;
  description: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
}

export const SEO_CONFIG: Record<string, PageSEO> = {
  home: {
    title: 'Empyrean | Annual Fest of IIM Jammu',
    description:
      "Experience Empyrean, the annual fest of the Indian Institute of Management Jammu. Explore events, competitions, activities, registrations and everything happening at IIM Jammu's annual celebration.",
    canonical: 'https://empyreanfest.com/',
  },
  partners: {
    title: 'Partners & Sponsors | Empyrean - IIM Jammu',
    description:
      'Discover the visionary partners and sponsors supporting Empyrean 2026, the annual fest of IIM Jammu, driving collegiate leadership and youth innovation.',
    canonical: 'https://empyreanfest.com/partners',
  },
  privacy: {
    title: 'Privacy Policy | Empyrean - IIM Jammu',
    description:
      'Official Privacy Policy for Empyrean, the annual fest of Indian Institute of Management Jammu. Learn how we handle registrations, UTR verification, and personal information.',
    canonical: 'https://empyreanfest.com/privacy',
  },
  terms: {
    title: 'Terms of Service | Empyrean - IIM Jammu',
    description:
      'Official Terms of Service for Empyrean, the annual fest of Indian Institute of Management Jammu. Guidelines on event participation, ticket admission, and registration verification.',
    canonical: 'https://empyreanfest.com/terms',
  },
  tickets: {
    title: 'Tickets & Delegate Passes | Empyrean - IIM Jammu',
    description:
      'Book official passes and competition tickets for Empyrean 2026, the annual cultural, sports, and management fest of IIM Jammu.',
    canonical: 'https://empyreanfest.com/tickets',
  },
  admin: {
    title: 'Admin Verification | Empyrean - IIM Jammu',
    description: 'Verification dashboard for Empyrean 2026 ticket bookings.',
    canonical: 'https://empyreanfest.com/admin',
  },
  scanner: {
    title: 'Gate QR Scanner | Empyrean - IIM Jammu',
    description: 'Festival gate QR scanner for Empyrean 2026 entry verification.',
    canonical: 'https://empyreanfest.com/scanner',
  },
};

export function updateDocumentSEO(
  page: 'home' | 'partners' | 'tickets' | 'admin' | 'scanner' | 'privacy' | 'terms'
) {
  if (typeof document === 'undefined') return;
  const config = SEO_CONFIG[page] || SEO_CONFIG.home;

  // Title
  document.title = config.title;

  // Robots directive (noindex on admin & scanner routes)
  const metaRobots = document.querySelector('meta[name="robots"]');
  if (metaRobots) {
    metaRobots.setAttribute(
      'content',
      page === 'admin' || page === 'scanner'
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );
  }

  // Description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', config.description);
  }

  // Canonical
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', config.canonical);

  // Open Graph
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', config.ogTitle || config.title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', config.ogDescription || config.description);

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', config.canonical);

  // Twitter Card
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) twitterTitle.setAttribute('content', config.ogTitle || config.title);

  const twitterDesc = document.querySelector('meta[name="twitter:description"]');
  if (twitterDesc) twitterDesc.setAttribute('content', config.ogDescription || config.description);
}
