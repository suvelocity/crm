FROM node:12

WORKDIR /client/build

ADD /client/build .

WORKDIR /server

COPY /server/package.json /server/package-lock.json ./

RUN npm install --production

# RUN git clone https://github.com/vishnubob/wait-for-it.git

EXPOSE 80

COPY /server/out ./out

# CMD ["npm", "run", "spinup:staging"]

# CMD ["./wait-for-it/wait-for-it.sh", "mysql:3306", "--", "npm", "run", "spinup"]