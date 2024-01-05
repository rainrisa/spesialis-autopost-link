FROM node:slim

WORKDIR /app
COPY package.json yarn.lock ./ 
RUN yarn
COPY . .

CMD ["node", "main.js"]

