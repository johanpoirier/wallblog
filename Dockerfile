FROM node:8.12-stretch

WORKDIR /usr/src/app
RUN yarn

ENTRYPOINT ["npm", "start"]
