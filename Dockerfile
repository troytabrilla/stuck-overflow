FROM node:20 AS base
WORKDIR /app
RUN git clone https://github.com/vishnubob/wait-for-it.git

FROM base as dependencies
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base as runner
ENV NODE_ENV production
COPY --from=builder /app ./
EXPOSE 3000
ENV PORT 3000
CMD ["node", "dist/app.js"]
