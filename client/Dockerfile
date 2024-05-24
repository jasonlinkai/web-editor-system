# syntax=docker/dockerfile:1
FROM node:18-alpine as builder
ARG REACT_APP_API_URL
ARG REACT_APP_CDN_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_CDN_URL=$REACT_APP_CDN_URL
WORKDIR /usr/app
COPY . .
RUN yarn install
RUN yarn build
FROM nginx:alpine
COPY --from=builder /usr/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]