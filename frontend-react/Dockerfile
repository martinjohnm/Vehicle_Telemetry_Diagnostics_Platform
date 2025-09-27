
FROM node:latest

WORKDIR /app

COPY package* .

RUN npm install

COPY . .

RUN npm run build


EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]