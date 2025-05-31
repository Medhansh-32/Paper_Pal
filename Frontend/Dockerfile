FROM node:18.20.8-alpine

WORKDIR /app


COPY package*.json tsconfig*.json tailwind.config.js vite.config.ts eslint.config.js ./


RUN npm install

EXPOSE 5173

COPY . .

CMD ["npm", "run", "dev"]