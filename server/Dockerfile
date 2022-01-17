FROM node:latest

COPY ./modules/db/ ./modules/db

COPY package.json .

RUN npm install

COPY . .

RUN chmod +x ./init_prisma.sh

EXPOSE 8080

CMD ./init_prisma.sh