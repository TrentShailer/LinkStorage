FROM node:18.7.0-alpine3.15
WORKDIR /usr/src/app

ENV NODE_ENV=production

# install deps
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY . .

EXPOSE 8080

CMD ["node", "index.js"]
