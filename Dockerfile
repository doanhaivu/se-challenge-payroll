FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .
RUN chmod +x /wait-for-it.sh
# Build the TypeScript
RUN npm run build

EXPOSE 3000
CMD ["./wait-for-it.sh", "db:5432", "--", "node", "dist/app.js"]