FROM node:14-slim as builder

WORKDIR /client

COPY ./client/package.json ./client/package-lock.json ./

RUN npm install --only=production

COPY ./client .

RUN npm run build:prod

FROM node:14-slim as serverbuilder

WORKDIR /server

COPY ./server/package.json ./server/package-lock.json ./server/tsconfig.json ./

RUN npm install --only=production

COPY ./server/src ./src

RUN npm run build 

FROM node:12

WORKDIR /client/build

COPY --from=builder ./client/build .

WORKDIR /server

COPY --from=serverbuilder ./server/package.json ./server/package-lock.json ./

COPY --from=serverbuilder ./server/node_modules ./node_modules

COPY --from=serverbuilder ./server/out ./out

EXPOSE 8080

CMD ["npm", "run", "start"]