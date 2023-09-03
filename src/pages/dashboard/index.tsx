import { DashboardLayout } from '@/components/layouts';
import { NextPageWithLayout } from '@/pages/_app';

const Page: NextPageWithLayout = () => {
  return <></>;
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
