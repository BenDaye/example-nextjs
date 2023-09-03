import { useState } from 'react';

type HeadMetaType = 'Default' | 'App' | 'Dashboard';
interface HeadMeta {
  title: string;
  description: string;
}
export const useHeadMeta = (type: HeadMetaType = 'Default'): HeadMeta => {
  const initMeta = (): HeadMeta => {
    switch (type) {
      case 'App':
        return {
          title: process.env.NEXT_PUBLIC_HEAD_META_APP_TITLE ?? 'App Title',
          description:
            process.env.NEXT_PUBLIC_HEAD_META_APP_DESCRIPTION ??
            'App Description',
        };
      case 'Dashboard':
        return {
          title:
            process.env.NEXT_PUBLIC_HEAD_META_DASHBOARD_TITLE ??
            'Dashboard Title',
          description:
            process.env.NEXT_PUBLIC_HEAD_META_DASHBOARD_DESCRIPTION ??
            'Dashboard Description',
        };
      default:
        return {
          title: 'Default Title',
          description: 'Default Description',
        };
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [{ title, description }, setMeta] = useState(initMeta);

  return {
    title,
    description,
  };
};
