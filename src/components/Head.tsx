import { useEffect } from 'react';

interface HeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function Head({ 
  title = 'Rajapakse Pharmacy - Your Trusted Online Healthcare Partner',
  description = 'Order medicines online, book doctor appointments, and upload prescriptions. Free shipping on orders over LKR 5,000. Located at No.456, Kurunagala Road, Newtown Madampe.',
  image = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=630&fit=crop',
  url = 'https://rajapakse-pharmacy.com'
}: HeadProps) {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Helper function to set or update meta tags
    const setMetaTag = (property: string, content: string, isName = false) => {
      const attribute = isName ? 'name' : 'property';
      let element = document.querySelector(`meta[${attribute}="${property}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }
      
      element.content = content;
    };

    // Standard meta tags
    setMetaTag('description', description, true);
    setMetaTag('keywords', 'pharmacy, online pharmacy, medicines, doctor appointments, prescriptions, healthcare, Sri Lanka, LKR, Rajapakse', true);

    // Open Graph meta tags
    setMetaTag('og:title', title);
    setMetaTag('og:description', description);
    setMetaTag('og:image', image);
    setMetaTag('og:url', url);
    setMetaTag('og:type', 'website');
    setMetaTag('og:site_name', 'Rajapakse Pharmacy');
    setMetaTag('og:locale', 'en_LK');

    // Twitter Card meta tags
    setMetaTag('twitter:card', 'summary_large_image', true);
    setMetaTag('twitter:title', title, true);
    setMetaTag('twitter:description', description, true);
    setMetaTag('twitter:image', image, true);

    // Additional meta tags
    setMetaTag('author', 'Rajapakse Pharmacy', true);
    setMetaTag('theme-color', '#0891B2', true);
  }, [title, description, image, url]);

  return null;
}
