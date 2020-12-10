# CRM
Project management for courses and beyond.  
deployment on cloud: http://35.226.223.57:8080/
 
## TOC
- [Setup](#Setup)
- [Contributing](#Contributing)
- [Database Tables](#database-tables)

## Stack
- Front end: React TypeScript
- Back end: NodeJs(Express) TypeScript MySQL(ORM:[Sequelize](https://sequelize.org/master/index.html))
## Setup
1. Clone the repo to your machine

2. Go to the project directory
### server
1. Run `cd server; npm install` to install backend dependencies.  
This could take a bit of time, you may use it to call you mother, she worries.

2. Create a schema in mySQL (Docker/local), call it what you like (defaults to "crm")
1. Create a backend `.env` file. An [example](server/example.env) file is provided.
1. Edit `.env`.
```js
PORT = 8080 // the port the server will run on
MYSQL_USER = "<DB user>" // defaults to "root"
MYSQL_PASSWORD = "<your password>"
MYSQL_DATABASE = "<you db schema name>" // defaults to "crm"
MYSQL_HOST = "127.0.0.1" // default localhost, depends if you run your db on a Docker
NODE_ENV = "development"
ACCESS_TOKEN_SECRET="<your secret>" 
REFRESH_TOKEN_SECRET="<another secret>" // strings used in token creation
EMAIL_USER="" // mail used to send user confirmation messages
EMAIL_PASSWORD=""

```
5. Run `npm run migrate` to migrate all required tables into your schema. This could take a while, you can try meditation. 
1. Run `npm run dev` to start the server in dev mode (nodemon hot reload)
### client
1. Run `cd client; npm install` to install frontend dependencies

1. Create a client `.env` file. An [example](client/example.env) is provided.

1. Edit `.env`, add what you need.
```js
REACT_APP_API_KEY="" // google api key for location services
```

- If you have changed `PORT` in the server [`.env`](server/example.env), you need to change the `proxy` property in the client [`package.json`](client/package.json) 

4. Run `npm start` to start react in development mode
5. To log into the service oyu need credentials, contact your local admin to get them 

## Contributing
1. Decide on the feature you are working on 

1. Start a new branch with a nice descriptive name
    - **good name**: `add-message-system`   
    - **bad name**: `Shahar-cool-branch-23`   

2. Develop the feature. Try to only work on one feature in a branch for ease of merging.

1. When you have finished work on your feature, create a PR to **dev** and stop working on the branch.

1. If you need the new feature to continue, branch out from your branch and continue in that branch. Else - just start a new branch

1. Alert @AlonBru that you have finished work and expect some questions about it

1. Once the PR is merged, the branch may be deleted. 

## Database Tables
If you need to create a [new table](#new-table) or [modify an existing one](#modifying), always consult @Alonbru.  
you'll need to create a new migration or model, then [migrate](#migration) them to the DB.
### new table:
To create a new table, first create a new **model**:  
 ```cmd
 npx sequelize model:create --name <model name> --attributes <attribute>:<type>,<attribute>:<type>,<attribute>:<type> --underscored true
 ``` 
 This generates a new **model** in the [models](server/models) dir, and a **migration** in the [migrations](server/migrations) dir.
 - Using `--underscored true` makes the timestamp columns (createdAt,updatedAt) to be `camelCased` in the model but `snake_cased` in the migration and table (created_at,updated_at).   
 Sadly it does not work for all the column names, so you'll have to go and change them manually to be underscored in the migration. [this extension](https://marketplace.visualstudio.com/items?itemName=wmaurer.change-case) can help with that.
 - [more options](pics/cli-model-options.png)


 <!-- 
 may need more rules to add:
 paranoid
 table name
  -->
### modifying:
To add new columns to an existing table create new **migration**. a use:
 ```cmd
 npx sequelize migration:create --name <model name> --underscored true
```  
then edit the new migration to add the columns you need.

### migration
once the migrations are ready, use `npx sequelize db:migrate` to migrate all new changes to the DB. 