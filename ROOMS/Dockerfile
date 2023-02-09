FROM node:17-alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5050

CMD ["node", "rooms.js"]