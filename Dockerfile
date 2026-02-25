FROM node:14-alpine3.15 AS builder

RUN apk add python2

WORKDIR /build/
COPY . /build/

RUN yarn install
RUN yarn build

FROM nginx:stable

COPY --from=builder /build/build /usr/share/nginx/html/ubi
