FROM node:14-bullseye AS build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json yarn.lock ./
RUN yarn install --silent

COPY tsconfig.json ./
COPY public ./public
COPY src ./src

ARG REACT_APP_TCL_AUTH
RUN yarn build

FROM alpine/git AS git
WORKDIR /app
COPY .git ./
RUN git describe --always > /version
RUN date +"%Y-%m-%d %H:%M:%S" > /date

FROM nginx AS prod
COPY --from=git /version /app/.version
COPY --from=git /date /app/.date
RUN export REACT_APP_VERSION=$(cat /app/.version)
RUN export REACT_APP_DATE=$(cat /app/.date)
COPY --from=build /app/build /usr/share/nginx/html
