FROM node:latest
LABEL org.opencontainers.image.source="https://github.com/jdenda/camcam"

RUN mkdir /home/node/camcam
RUN mkdir /mnt/library
COPY . /home/node/camcam
WORKDIR /home/node/camcam
RUN npm install --unsafe-perm
RUN mkdir -p /home/node/camcam/tmp && mkdir -p /home/node/camcam/images && mkdir -p /home/node/camcam/docker-generated
RUN chown -R node:node /home/node/camcam/
RUN chmod -R 777 /home/node/camcam/docker-generated/

ARG NODE_ENV=docker
ENV NODE_ENV ${NODE_ENV}

EXPOSE 5000

CMD [ "npm","run","start" ]