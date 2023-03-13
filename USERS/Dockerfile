FROM node:17-alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 4022

EXPOSE 9229

CMD ["node", "--inspect=0.0.0.0", "users.js"]