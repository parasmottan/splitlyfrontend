import React, { useEffect } from 'react';

export default function SEO({
  title,
  description,
  canonical,
  noindex = false,
  ogImage = '/og-image.png',
  ogTitle,
  ogDescription
}) {
  useEffect(() => {
    // 1. Update Title
    if (title) {
      document.title = title;
      setMetaTag('property', 'og:title', ogTitle || title);
      setMetaTag('name', 'twitter:title', ogTitle || title);
    }

    // 2. Update Description
    if (description) {
      setMetaTag('name', 'description', description);
      setMetaTag('property', 'og:description', ogDescription || description);
      setMetaTag('name', 'twitter:description', ogDescription || description);
    }

    // 3. Update Canonical
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', `https://splitly-phi.vercel.app${canonical}`);
      setMetaTag('property', 'og:url', `https://splitly-phi.vercel.app${canonical}`);
    }

    // 4. Update Indexing
    if (noindex) {
      setMetaTag('name', 'robots', 'noindex, nofollow');
    } else {
      setMetaTag('name', 'robots', 'index, follow');
    }

    // 5. Update OG Image
    if (ogImage) {
      const fullImageUrl = ogImage.startsWith('http') ? ogImage : `https://splitly-phi.vercel.app${ogImage}`;
      setMetaTag('property', 'og:image', fullImageUrl);
      setMetaTag('name', 'twitter:image', fullImageUrl);
      setMetaTag('name', 'twitter:card', 'summary_large_image');
    }

    // Cleanup isn't strictly necessary for SPAs if every page sets its own SEO,
    // but good practice if we want to reset to defaults.
  }, [title, description, canonical, noindex, ogImage, ogTitle, ogDescription]);

  return null;
}

function setMetaTag(attrName, attrValue, content) {
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}
