import { useEffect, useState } from 'react';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';

import '../styles/reset.scss';
import '../styles/global.scss';

import type { AppProps } from 'next/app';

function CustomApp({ Component, router, pageProps }: AppProps) {
  const [switchingRoute, setSwitchingRoute] = useState<boolean>(false);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      setSwitchingRoute(true);
    };

    const handleRouteChangeComplete = () => {
      setSwitchingRoute(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeComplete);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>Welcome to moonbreaker!</title>
      </Head>
      {/* @ts-expect-error pageProps is not typed correctly */}
      <SessionProvider session={pageProps.session}>
        <main className="app">
          {switchingRoute ? (
            // TODO: Add a loading spinner
            <div>Loading...</div>
          ) : (
            <Component {...pageProps} />
          )}
        </main>
      </SessionProvider>
    </>
  );
}

export default CustomApp;
