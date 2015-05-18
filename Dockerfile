FROM node

ADD . /src
RUN cd /src; npm install

WORKDIR /src

EXPOSE 8080
EXPOSE 3000

CMD ["node", "bin/server.js"]
