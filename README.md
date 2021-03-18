Requirements 
    - Docker
    - Docker Compose

clone the Repo
    sh "git clone https://github.com/Bobooshodi/image-processor-api.git"

 sh "cd image-processor-api";

rename .env.dist or .env.prod to .env and modify .env accordingly
renamr docker-compose.debug.yaml to docker-compose.yaml and modify accordingly

 docker-compose up -d --build
 ------------------------------------------------------------------------------------------

                        Without Docker
 Requirements
    - NPM

clone the Repo
    sh "git clone https://github.com/Bobooshodi/image-processor-api.git"

 sh "cd image-processor-api";

 rename .env.dist or .env.prod to .env and modify .env accordingly

 npm install
 npm run migrate
 npm start



                                NOTE
For the Integration Test, this requires the Server to be running. just start the docker-container, and run npm run test