#FROM node:lts-alpine AS build
#WORKDIR code
#COPY package*.json vite.config.js index.html ./
#RUN npm install
#COPY . .
#RUN npm run build

#FROM nginx:alpine AS run
#COPY --from=build dist/ /usr/share/nginx/html/
#COPY web-server.conf /etc/nginx/conf.d/default.conf

FROM nginx:alpine

COPY dist/ /usr/share/nginx/html/
COPY web-server.conf /etc/nginx/conf.d/default.conf
