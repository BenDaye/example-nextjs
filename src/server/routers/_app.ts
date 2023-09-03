/**
 * This file contains the root router of your tRPC-backend
 */
import { router } from '../trpc';
import {
  protectedAppAuth,
  protectedDashboardAuth,
  publicAppAuth,
  publicDashboardAuth,
} from './auth';
import {
  protectedAppUser,
  protectedDashboardUser,
  publicAppUser,
  publicDashboardUser,
} from './user';
import {
  protectedAppMeta,
  protectedDashboardMeta,
  publicAppMeta,
  publicDashboardMeta,
} from './meta';

export const appRouter = router({
  // NOTE: You can remove these if you don't need them
  protectedAppMeta,
  protectedDashboardMeta,
  publicAppMeta,
  publicDashboardMeta,
  // NOTE: You can remove these if you don't need them
  publicAppAuth,
  protectedAppAuth,
  publicDashboardAuth,
  protectedDashboardAuth,
  // NOTE: You can remove these if you don't need them
  protectedAppUser,
  protectedDashboardUser,
  publicAppUser,
  publicDashboardUser,
});

export type AppRouter = typeof appRouter;
