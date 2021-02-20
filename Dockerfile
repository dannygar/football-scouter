FROM node:12.18-alpine
ENV NODE_ENV=production
ENV HTTPS=true

# set working directory
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY public /usr/src/app/public
COPY src /usr/src/app/src
COPY package.json /usr/src/app/package.json
COPY yarn.lock /usr/src/app/yarn.lock
COPY tsconfig.json /usr/src/app/tsconfig.json
COPY .env.production /usr/src/app/.env.production

RUN yarn install && \
    yarn run build
EXPOSE 3001
EXPOSE 443

#start app
CMD ["yarn", "start"]
