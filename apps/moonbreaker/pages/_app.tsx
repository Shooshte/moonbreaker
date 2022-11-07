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
        <title>Best Moonbreaker Rosters | Roster Breaker</title>
        <meta
          content="A fan-made web app for the PC game Moonbreaker. Find the best, most fun, competitive and most popular community-made rosters and share your own!"
          name="description"
        />
      </Head>
      {/* @ts-expect-error pageProps is not typed correctly */}
      <SessionProvider session={pageProps.session}>
        <main className="main-container">
          <section className="main-content">
            {switchingRoute ? (
              // TODO: Add a loading spinner
              <div>Loading...</div>
            ) : (
              <Component {...pageProps} />
            )}
          </section>
        </main>
      </SessionProvider>
    </>
  );
}

export default CustomApp;
