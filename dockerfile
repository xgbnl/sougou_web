FROM node:24.12.0

RUN npm config set registry https://registry.npmmirror.com/

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
