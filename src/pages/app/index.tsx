import { AppLayout } from '@/components/layouts';
import { NextPageWithLayout } from '@/pages/_app';

const Page: NextPageWithLayout = () => {
  return <></>;
};

Page.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Page;
