FROM node:14-bullseye AS build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json yarn.lock ./
RUN yarn install --silent

COPY tsconfig.json ./
COPY public ./public
COPY src ./src

RUN export REACT_APP_VERSION=$(git describe --always)
RUN export REACT_APP_DATE=$(date +"%Y-%m-%d %H:%M:%S")
ARG REACT_APP_TCL_AUTH
RUN yarn build

FROM nginx AS prod
COPY --from=build /app/build /usr/share/nginx/html
