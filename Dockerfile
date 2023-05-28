# edit tag to proper version
FROM node:alpine as builder
# build directory. If changed, also change copy command
WORKDIR /app
# upload app source
COPY ./ /app/
ENV HOME=/app
# arg for nexus publish control
#ARG NPM_PUBLISH
# arg for sonar scan control
#ARG SONAR_ARGS
# arg for json-server (mock server) control
#ARG STUB_ARGS
# clear cache, install deps and run artefact build
RUN npm cache verify && npm install && npm run build

# base image for prod
FROM nginx:alpine
# очищаем папку со статикой
RUN rm -rf /usr/share/nginx/html/*
# copy artifact from build step
COPY --from=builder  /app/dist /usr/share/nginx/html

# Copy the nginx.conf from root repo
COPY nginx.conf /etc/nginx/nginx.conf

# expose port 8080
EXPOSE 8080
# command to run,
# TODO: rewrite in helm chart
ENTRYPOINT ["nginx", "-g", "daemon off;"]

