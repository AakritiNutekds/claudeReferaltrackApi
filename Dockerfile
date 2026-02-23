# Base image
FROM node:20-alpine

# Create app directory, this is in our container/in our image
WORKDIR /usr/src/app

# Install system dependencies, including OpenSSL 
RUN apk add --no-cache openssl

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
# install node-gyp globally
RUN npm install -g node-gyp
RUN npm install

COPY ./prisma prisma
COPY ./src src

# If you are building your code for production
#RUN npm ci --only=production

# Bundle app source project
COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 8080

CMD [ "node", "dist/main" ]