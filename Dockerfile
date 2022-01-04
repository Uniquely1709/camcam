FROM node:bullseye

RUN mkdir /home/node/camcam
RUN mkdir /mnt/library
COPY . /home/node/camcam
WORKDIR /home/node/camcam
RUN chown -R node:node /home/node/camcam/
RUN npm install

CMD [ "node","server.js" ]