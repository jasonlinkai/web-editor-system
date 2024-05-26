# syntax=docker/dockerfile:1
FROM node:18-alpine as builder
WORKDIR /usr/app
COPY . .
RUN yarn install
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]