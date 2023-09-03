import { useHeadMeta } from '@/hooks';
import { themes } from '@/theme';
import { ThemeProvider } from '@mui/material';
import Head from 'next/head';
import { PropsWithChildren, ReactElement } from 'react';
import { DashboardMain } from './DashboardMain';

const DashboardProvider = ({
  children,
}: PropsWithChildren): ReactElement<PropsWithChildren> => {
  return <ThemeProvider theme={themes.DARK}>{children}</ThemeProvider>;
};

export const DashboardLayout = ({
  children,
}: PropsWithChildren): ReactElement<PropsWithChildren> => {
  const { title, description } = useHeadMeta('Dashboard');
  return (
    <DashboardProvider>
      <Head key="dashboard">
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <DashboardMain open={false} right={240}>
        {children}
      </DashboardMain>
    </DashboardProvider>
  );
};
