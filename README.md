# Stackoverflow Questions Database

A tool to store questions from stackoverflow.com/questions including their metadata. Exposes a REST API for running the tool asynchronously.

Powered by [Fastify](https://fastify.io) for the web server and [Postgres](https://www.postgresql.org) for the database

## Installation and set-up

There are two ways to get the app running. If you have a Postgres instance ready, you can opt to use the same and simply run the app using NodeJS. If you do not have such an instance or are looking to spin this up real quick, docker-compose is the way to go having no other dependencies.

Copy the .env.example file to .env in the root directory
`cp .env.example .env`

Now edit the .env file with the appropriate values for each environment variable. You can skip the POSTGRES_HOST, POSTGRES_PORT, SERVER_IP variables if you are opting to run it using docker-compose. A description of each of the env variables are provided below:

POSTGRES_HOST - host ip/domain of the Postgres instance
POSTGRES_PORT - port on which the Postgres database listens on POSTGRES_HOST
POSTGRES_DB - database name to be used for storing the questions and metadata
POSTGRES_USER - username to connect to the Postgres instance and POSTGRES_DB
POSTGRES_PASSWORD - password for POSTGRES_USER
SERVER_IP - IP for the app to listen on (set to 0.0.0.0) if you want to make your app visible externally
SERVER_PORT - Port on which you want to app to listen to and expose the API on

Once ready, you can simply `docker-compose up -d` to run the app and it should be available at http://localhost:{SERVER_PORT}

If you wish to use your existing Postgres instance instead, you can run the app manually using NodeJS.

First install NodeJS v14 or above. The preferred method is using [nvm](https://github.com/nvm-sh/nvm) which helps to manage node versions very easily.

Once you have installed NodeJS, assuming you have set the values in .env, run the following commands from the project root directory.

```
npm ci --only=production --ignore-scripts
npm run migrate
npm run seed
```

The above commands installs the project dependencies and runs database schema and data migrations. Once the above commands have completed successfully run `npm start`.
The app is now running at http://{SERVER_IP}:{SERVER_PORT}

### Start the script

Making a GET request to the /start endpoint starts the crawler in the background
`curl http://localhost:6000/start`

### Kill/Stop the script

Making a GET request to the /stop endpoint starts the crawler in the background
`curl http://localhost:6000/stop`

## Contributing

To install the development dependencies run `npm install`
This installs all the dependencies and installs git hooks for enforcing code styles and formatting
