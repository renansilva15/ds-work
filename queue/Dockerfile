FROM node:14
WORKDIR /consumer
COPY package*.json ./
RUN npm install
COPY /src/ ./src/
CMD ["npm", "run", "dev"]
