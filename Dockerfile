FROM node:18 AS base

# 1. Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY ./src/server/modules/trx/schema.prisma ./src/server/modules/trx/schema.prisma
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm@latest && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# This will do the trick, use the corresponding env file for each environment.
COPY .env.production.local .env.production.local
RUN yarn prisma generate
RUN yarn build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --gid 1001 --system nodejs
RUN adduser --system nextjs --uid 1001

COPY --chown=nextjs:nodejs .env.production.local .env.production.local
COPY --chown=nextjs:nodejs package.json package.json
COPY --chown=nextjs:nodejs next.config.js next.config.js

COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist


USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["yarn", "start"]