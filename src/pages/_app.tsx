import '@/theme/global.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { DefaultLayout } from '@/components/layouts';
import { NoticeProvider } from '@/hooks/notice';
import { CreateContextOptions } from '@/server/context';
import { createEmotionCache, themes } from '@/theme';
import { trpc } from '@/utils/trpc';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { NextPage } from 'next';
import { SessionProvider, getSession } from 'next-auth/react';
import type { AppProps, AppType } from 'next/app';
import Head from 'next/head';
import { SnackbarProvider } from 'notistack';
import { ReactElement, ReactNode } from 'react';
import { SWRConfig } from 'swr';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export type NextPageWithLayout<
  TProps = Record<string, unknown>,
  TInitialProps = TProps,
> = NextPage<TProps, TInitialProps> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export interface MyAppProps extends AppProps {
  Component: NextPageWithLayout;
  emotionCache?: EmotionCache;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  pageProps: AppProps['pageProps'] & CreateContextOptions;
}

const MyApp: AppType<CreateContextOptions> = ({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: MyAppProps) => {
  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

  return (
    <CacheProvider value={emotionCache}>
      <Head key="default">
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={themes.LIGHT}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={3000}
          disableWindowBlurListener
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <NoticeProvider>
            <SessionProvider session={pageProps?.session}>
              <SWRConfig
                value={{
                  fetcher: (resource, init) =>
                    fetch(resource, init).then((res) => res.json()),
                }}
              >
                {getLayout(<Component {...pageProps} />)}
              </SWRConfig>
            </SessionProvider>
          </NoticeProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

MyApp.getInitialProps = async ({ ctx }) => ({ session: await getSession(ctx) });

export default trpc.withTRPC(MyApp);
