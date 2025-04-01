FROM node:22-alpine AS build

ARG SERVICE_NAME=product-management-bff

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml
COPY . .

RUN pnpm fetch
RUN pnpm install --frozen-lockfile

# Add conditional build command based on SERVICE_NAME
RUN if [ "$SERVICE_NAME" = "product-management-backend" ]; then \
      pnpm run build:backend; \
    else \
      pnpm run build:bff; \
    fi

ENV NODE_ENV production
RUN pnpm install --offline --frozen-lockfile --prod

USER node

###################
# PRODUCTION
###################

FROM node:22-alpine AS production

ARG SERVICE_NAME=product-management-bff
ENV NODE_ENV production

WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma
COPY --chown=node:node --from=build /usr/src/app/dist/apps/${SERVICE_NAME} ./

EXPOSE 3001
CMD ["node", "main.js"]
