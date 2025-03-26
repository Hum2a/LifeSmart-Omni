import { generateSitemap } from '../utils/generateSitemap';

const GOOGLE_SITEMAP_URL = 'https://www.google.com/webmasters/sitemaps/ping?sitemap=';
const BING_SITEMAP_URL = 'https://www.bing.com/ping?sitemap=';

export const seoService = {
  // Generate and save sitemap
  generateAndSaveSitemap: async () => {
    try {
      const sitemap = generateSitemap();
      // Here you would typically save the sitemap to your server
      // For now, we'll just return it
      return sitemap;
    } catch (error) {
      console.error('Error generating sitemap:', error);
      throw error;
    }
  },

  // Submit sitemap to search engines
  submitSitemapToSearchEngines: async (sitemapUrl) => {
    try {
      const googleResponse = await fetch(`${GOOGLE_SITEMAP_URL}${encodeURIComponent(sitemapUrl)}`);
      const bingResponse = await fetch(`${BING_SITEMAP_URL}${encodeURIComponent(sitemapUrl)}`);

      return {
        google: googleResponse.ok,
        bing: bingResponse.ok
      };
    } catch (error) {
      console.error('Error submitting sitemap:', error);
      throw error;
    }
  },

  // Generate meta tags for a page
  generateMetaTags: (pageData) => {
    const {
      title,
      description,
      keywords,
      image,
      type = 'website',
      url
    } = pageData;

    return {
      title: `${title} | LifeSmart`,
      meta: [
        { name: 'description', content: description },
        { name: 'keywords', content: keywords },
        // Open Graph
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { property: 'og:url', content: url },
        { property: 'og:type', content: type },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image }
      ]
    };
  },

  // Track page view for analytics
  trackPageView: (page) => {
    if (window.gtag) {
      window.gtag('config', 'G-XXXXXXXXXX', {
        page_path: page,
        page_title: document.title
      });
    }
  },

  // Add structured data to page
  addStructuredData: (data) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  }
}; 