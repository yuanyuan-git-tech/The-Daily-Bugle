FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3005
CMD ["node", "article.js"]
CMD ["node", "authentication.js"]