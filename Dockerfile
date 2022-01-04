FROM node:latest
LABEL org.opencontainers.image.source="https://github.com/jdenda/camcam"


RUN mkdir /home/node/camcam
RUN mkdir /mnt/library
COPY . /home/node/camcam
WORKDIR /home/node/camcam
RUN npm install --unsafe-perm --verbose
RUN chown -R node /home/node/camcam/

CMD [ "node","server.js" ]