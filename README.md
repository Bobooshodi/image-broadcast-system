Requirements 
    - Docker
    - Docker Compose

clone the Repo
    sh "git clone https://github.com/Bobooshodi/message-broadcast-api.git"

 sh "cd message-broadcast-api";

rename .env.dist or .env.prod to .env and modify .env accordingly
renamr docker-compose.debug.yaml to docker-compose.yaml and modify accordingly

 docker-compose up -d --build
 ------------------------------------------------------------------------------------------

                        Without Docker
 Requirements
    - NPM

clone the Repo
    sh "git clone https://github.com/Bobooshodi/message-broadcast-api.git"

 sh "cd message-broadcast-api";

 rename .env.dist or .env.prod to .env and modify .env accordingly

 npm install
 npm run migrate
 npm start



                                NOTE
For the Integration Test, this requires the Server to be running. just start the docker-container, and run npm run test
