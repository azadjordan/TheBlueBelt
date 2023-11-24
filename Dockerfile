FROM node:18

WORKDIR /app

COPY . .


WORKDIR /app/frontend

RUN npm install

RUN npm run build

WORKDIR /app/backend

RUN npm install

WORKDIR /app

CMD ["npm", "run", "dev"]