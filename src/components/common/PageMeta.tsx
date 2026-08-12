import { HelmetProvider, Helmet } from 'react-helmet-async';

import { env } from '../../config/env';

interface PageMetaProps {
  title: string;
  description: string;
}

const PageMeta = ({ title, description }: PageMetaProps) => (
  <Helmet>
    <title>{`${title} | ${env.appName}`}</title>
    <meta name="description" content={description} />
  </Helmet>
);

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export default PageMeta;
