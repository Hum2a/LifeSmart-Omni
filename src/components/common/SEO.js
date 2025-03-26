import React from 'react';
import { Helmet } from 'react-helmet-async';
import { seoService } from '../../services/seoService';

const SEO = ({
  title,
  description,
  keywords,
  image,
  type = 'website',
  url,
  structuredData
}) => {
  const metaTags = seoService.generateMetaTags({
    title,
    description,
    keywords,
    image,
    type,
    url
  });

  return (
    <Helmet>
      <title>{metaTags.title}</title>
      <meta name="description" content={metaTags.meta[0].content} />
      <meta name="keywords" content={metaTags.meta[1].content} />
      
      {/* Open Graph */}
      <meta property="og:title" content={metaTags.meta[2].content} />
      <meta property="og:description" content={metaTags.meta[3].content} />
      <meta property="og:image" content={metaTags.meta[4].content} />
      <meta property="og:url" content={metaTags.meta[5].content} />
      <meta property="og:type" content={metaTags.meta[6].content} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={metaTags.meta[7].content} />
      <meta name="twitter:title" content={metaTags.meta[8].content} />
      <meta name="twitter:description" content={metaTags.meta[9].content} />
      <meta name="twitter:image" content={metaTags.meta[10].content} />

      {/* Canonical URL */}
      {url && <link rel="canonical" href={url} />}

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO; 