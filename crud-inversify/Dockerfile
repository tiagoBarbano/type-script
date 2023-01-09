FROM node:slim
WORKDIR /srv/app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/index.js"]