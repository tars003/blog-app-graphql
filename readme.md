
## Postman collection : https://www.postman.com/lively-rocket-130218/workspace/personal/collection/64eaed0cc945b058057230b3?action=share&creator=10093619

# Brief Description about code
1.description about packages used
		1.sequelize - orm for mysql
		2. jwt - for authentication
		3. bcrypt - for storing password in hashed manner
		4. dotenv - for loading environment variables
2. description about features of app
		1. only a user himself can do update/delete mutations on his profile
		2. only the post author can update/delete the respective post
		3. only the comment author can update/delete the respective comment
		4. while performing mutations on post and comment, if there is some 
		   anomaly in associated data, i.e. foreign keys, author_id/post_id.
		   I check for them and handle them.
3. description about structure of code
		1. dir - middleware. consists of jwt middleware that handles the 
		   logic for extracting jwt token out of the request headers and
		   attaching user object to request before forwarding the request.
		   App expects token in form of Bearer Token.
		2. dir - graphql, consists of graphql setup and actual schema
		   describing all graphql queries and mutations
		3. dir - models, consists of all the model schemas, i.e. User, 
		   Post & Comment
		4. dir - routes, consists of route <base_url>/auth, which is 
		   the login route for user to obtain his jwt, which is needed for 
		   all graphql requests 
		5. file - app.js, consists of main http server and db initialization
		   logic
	    6. file - Dockerfile & docker-compose.yml
	       Dockerfile defines image definition for nodejs server
	       I am running nodejs server and mysql db on 2 separate containers 
	       docker compose
	       docker-compose.yml defines db credentials for mysql db and also 
	       root password and db name for mysql image

# Run using docker
1. clone github repo : [tars003/blog-app-graphql (github.com)](https://github.com/tars003/blog-app-graphql/tree/master)
2. make sure to have docker installed and running
3. update mysql db credentials in `docker-compose.yml` file in root dir
	1. in case you have mysql running on your local machine, it'll conflict with mysql container we are building in docker-compose file
	2. this mysql container is running on port `3307`
4. run command `docker-compose up --build`
5. navigate to http://localhost:3000/graphql to access the API
6. login route can be found at http://localhost:3000/auth

# Run without using docker
1. clone github repo : [tars003/blog-app-graphql (github.com)](https://github.com/tars003/blog-app-graphql/tree/master)
2. create a .env file in root folder
```yaml
	JWT_SECRET='your-secret-key-here'
	JWT_EXPIRATION_HOURS='720h'
	SALT_ROUNDS=10
	MYSQL_HOST='localhost'
	MYSQL_PORT=3306
	MYSQL_USER='shyftlab-user'
	MYSQL_PASSWORD='abcd1234'
	MYSQL_DATABASE='shyftlabs'
```
3. run command `npm i`
4. make sure to setup mysql locally on your system
	1. create / use existing mysql database
	2. update db name, db user, db user password in .env file
5. run command `npm run dev`
6. 5. navigate to http://localhost:3000/graphql to access the API
6. login route can be found at http://localhost:3000/auth
