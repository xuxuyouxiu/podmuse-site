export const dynamic = 'force-static'

import type { MetadataRoute } from 'next'

const BASE_URL = 'https://xuxuya66.top'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
