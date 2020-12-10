# CRM
Project management for courses and beyond.
deployment on cloud: http://35.226.223.57:8080/
## setup
1. clone the repo to your machine
2. go to the project directory
### server
3. run `cd server; npm install` to install backend dependencies. This could take a bit of time, you may use it to call you mom.
2. create a schema in mySQL (Docker/local), call it what you like (defaults to "crm")
1. create a backend `.env` file. An [example](server/example.env) is provided.
1. Edit `.env`, add the required data for your db.
```js
PORT = 8080 // the port the server will run on
MYSQL_USER = "<DB user>" // defaults to "root"
MYSQL_PASSWORD = "<your password>"
MYSQL_DATABASE = "<you db schema name>" // defaults to "crm"
MYSQL_HOST = "127.0.0.1" // default localhost, depends if you run your db on a Docker
NODE_ENV = "development"
ACCESS_TOKEN_SECRET="<your secret>" 
REFRESH_TOKEN_SECRET="<another secret>" // strings used in token creation
EMAIL_USER=""
EMAIL_PASSWORD=""

```
7. run `npm run migrate` to migrate all required tables into your schema. This could take a while, you can try meditation. 
1. run `npm run dev` to start the server in dev mode (nodemon hot reload)
### client
1. run `cd client; npm install` to install frontend dependencies
1. 
## developing
1. Start a new branch with a descriptive name
    - good name - `message system`   
    - bad name - `Shahar-cool-branch-2`   
2. 

