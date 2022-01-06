FROM node:latest
LABEL org.opencontainers.image.source="https://github.com/jdenda/camcam"

ENV PORT ${PORT}
ENV MINUTES ${MINUTES}
ENV OFFSET ${OFFSET}

RUN mkdir /home/node/camcam
RUN mkdir /mnt/library
COPY . /home/node/camcam
WORKDIR /home/node/camcam
RUN npm install --unsafe-perm
RUN mkdir /home/node/camcam/tmp && mkdir /home/node/camcam/images
RUN chown -R node /home/node/camcam/

ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

EXPOSE 5000

CMD [ "node","server.js" ]