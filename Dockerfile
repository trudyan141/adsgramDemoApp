ARG NODE_VERSION=20
ARG ENV=prod

FROM node:${NODE_VERSION}-alpine AS base
ARG ENV
USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

FROM base AS deps
ARG ENV
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

FROM base AS builder
ARG ENV
COPY --chown=node . .
COPY --from=deps --chown=node /home/node/app/node_modules ./node_modules
RUN yarn build:${ENV}

FROM base
ARG ENV

COPY --from=builder --chown=node /home/node/app/.next/standalone ./
COPY --from=builder --chown=node /home/node/app/public ./public
COPY --from=builder --chown=nodejs /home/node/app/.next/static ./.next/static
COPY --chown=node ./public/tonconnect-manifest-${ENV}.json ./public/tonconnect-manifest.json

EXPOSE 3000
CMD HOSTNAME='0.0.0.0' node server.js
