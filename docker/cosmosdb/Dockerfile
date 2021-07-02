FROM node:12.18.0-alpine

WORKDIR /opt/cosmosdb

RUN npm install @zeit/cosmosdb-server @azure/cosmos ts-node

COPY docker/cosmosdb/server.js /opt/cosmosdb

CMD ["node", "server.js"]
