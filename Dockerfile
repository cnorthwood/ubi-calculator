FROM node:14-alpine3.15 AS builder

RUN apk add python2

WORKDIR /build/
COPY . /build/

RUN yarn install
RUN yarn build

FROM nginx:stable@sha256:aabaaeb9c84fc529520a0be49fd000ebae452de4b46fb9906039b69c21508b07

COPY --from=builder /build/build /usr/share/nginx/html/ubi
