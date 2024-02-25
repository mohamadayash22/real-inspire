FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json .

RUN npm ci --omit=dev

USER node

COPY --chown=node:node ./src .

EXPOSE 3000
