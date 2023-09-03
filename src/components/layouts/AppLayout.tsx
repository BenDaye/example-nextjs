import { useHeadMeta } from '@/hooks';
import { themes } from '@/theme';
import { ThemeProvider } from '@mui/material';
import Head from 'next/head';
import { PropsWithChildren, ReactElement } from 'react';

const AppProvider = ({
  children,
}: PropsWithChildren): ReactElement<PropsWithChildren> => {
  return <ThemeProvider theme={themes.LIGHT}>{children}</ThemeProvider>;
};

export const AppLayout = ({
  children,
}: PropsWithChildren): ReactElement<PropsWithChildren> => {
  const { title, description } = useHeadMeta('App');
  return (
    <AppProvider>
      <Head key="app">
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      {children}
    </AppProvider>
  );
};
