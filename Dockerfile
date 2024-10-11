FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install -g @nestjs/cli

RUN npm install

COPY . .

COPY .env .env

EXPOSE 3000

CMD ["npm", "run", "dev"]
