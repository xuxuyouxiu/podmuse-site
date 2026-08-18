export const dynamic = 'force-static'

import type { MetadataRoute } from 'next'

const BASE_URL = 'https://xuxuya66.top'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
