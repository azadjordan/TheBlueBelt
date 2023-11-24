FROM node:18-alpine

WORKDIR /app

COPY . .


WORKDIR /app/frontend

RUN npm install --production

RUN npm run build

WORKDIR /app

RUN npm install

CMD ["npm", "run", "dev"]
