ARG NODE_VERSION=22-alpine

FROM node:${NODE_VERSION} AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:${NODE_VERSION}

LABEL maintainer="e-codex@eulisa.europa.eu"
LABEL description="e-CODEX connector admin console"

ENV NODE_ENV=production

ARG BUILD_OUTPUT_FOLDER=/app

ARG APP_FOLDER=/app

WORKDIR ${APP_FOLDER}

COPY --from=build ${BUILD_OUTPUT_FOLDER}/.next/standalone ${APP_FOLDER}
COPY --from=build ${BUILD_OUTPUT_FOLDER}/.next/static ${APP_FOLDER}/.next/static
COPY --from=build ${BUILD_OUTPUT_FOLDER}/public ${APP_FOLDER}/public

EXPOSE 3000

CMD ["node", "server.js"]
