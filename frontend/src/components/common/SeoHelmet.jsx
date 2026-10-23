import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'S.H. Sirojiddinov akademik litseyi';
const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=85';
const OG_IMAGE_W = 1200;
const OG_IMAGE_H = 630;

const SeoHelmet = ({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  noindex = false,
  children,
}) => {
  const img = ogImage || DEFAULT_OG_IMAGE;
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="uz_UZ" />
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={img} />
      <meta property="og:image:width" content={String(OG_IMAGE_W)} />
      <meta property="og:image:height" content={String(OG_IMAGE_H)} />

      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={img} />

      {canonical && <link rel="alternate" hreflang="uz" href={canonical} />}

      {children}
    </Helmet>
  );
};

export default SeoHelmet;
