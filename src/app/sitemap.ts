import { MetadataRoute } from 'next';

/**
 * Dynamic XML Sitemap (`/sitemap.xml`, PRD 12.3 & 13).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const publicRoutes = [
    '',
    '/menu',
    '/about',
    '/gallery',
    '/reviews',
    '/offers',
    '/contact',
    '/reserve',
    '/order',
    '/cart',
    '/checkout',
    '/account',
    '/privacy',
    '/terms',
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/menu' || route === '/offers' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/menu' || route === '/reserve' ? 0.9 : 0.7,
  }));
}

