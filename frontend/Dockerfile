FROM alpine:latest
WORKDIR /app
COPY package*.json ./
RUN  apk add yarn
RUN yarn install
COPY . .
EXPOSE 5173
ENTRYPOINT ["yarn", "run", "dev", "--host"]