

FROM node:latest

WORKDIR /app

COPY package* .

RUN npm install

COPY . . 

RUN npm run build

EXPOSE 3003

CMD [ "npm", "run", "dev" ]