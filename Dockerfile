FROM node:18

#  Create app directory where the container will be 
WORKDIR /src/app

COPY . .

RUN npm install

EXPOSE 3001

#Run npm run start:dev
CMD ["npm", "run", "start:dev"]