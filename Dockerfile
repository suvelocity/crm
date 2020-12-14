FROM node:12

WORKDIR /client/build

ADD /client/build .

WORKDIR /server

COPY /server/package.json /server/package-lock.json ./

RUN npm install --production

# RUN git clone https://github.com/vishnubob/wait-for-it.git

EXPOSE 8080

COPY /server .

CMD ["npm", "run", "spinup"]

# CMD ["./wait-for-it/wait-for-it.sh", "mysql:3306", "--", "npm", "run", "spinup"]
