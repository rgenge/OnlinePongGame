FROM alpine:latest
WORKDIR /app
COPY package*.json ./
RUN apk add yarn
RUN yarn install
COPY . .
EXPOSE 3000
ENTRYPOINT ["yarn", "run", "start"]