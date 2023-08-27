
## Postman collection : https://www.postman.com/lively-rocket-130218/workspace/personal/collection/64eaed0cc945b058057230b3?action=share&creator=10093619

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
6. navigate to http://localhost:3000/graphql to access the API
7. login route can be found at http://localhost:3000/auth
