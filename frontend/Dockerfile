FROM alpine:latest
WORKDIR /app
COPY package*.json ./
RUN  apk add yarn
RUN yarn install
COPY . .
EXPOSE 5137
ENTRYPOINT ["yarn", "run", "dev", "--host"]