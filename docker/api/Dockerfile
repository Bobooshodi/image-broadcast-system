FROM node:12.18-alpine
ENV NODE_ENV=development
WORKDIR /usr/src/app

RUN npm install -g ts-node
RUN npm install -g typeorm

COPY ["package.json", "./"]
# If you are building your code for production
# RUN npm ci --only=production
# --production --silent && mv node_modules ../
RUN npm install
COPY . .
# Entrypoint script
RUN cp ./docker/api/docker-entrypoint.sh /usr/local/bin/ && \
    chmod +x /usr/local/bin/docker-entrypoint.sh
EXPOSE 8000
# CMD ["npm", "start"]
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]