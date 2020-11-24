FROM node:12

WORKDIR /client/build

ADD /client/build .

WORKDIR /server

COPY /server .

RUN npm install --production

RUN npm rebuild bcrypt --build-from-source

RUN git clone https://github.com/vishnubob/wait-for-it.git

EXPOSE 8080

CMD ["./wait-for-it/wait-for-it.sh", "mysql:3306", "--", "npm", "run", "spinup"]