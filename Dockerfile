FROM node:8-alpine

# Install docker and docker-compose
RUN apk update && apk add docker && apk add py-pip && pip install docker-compose

# Add app
COPY package.json /app/package.json
WORKDIR /app
RUN npm install
COPY app /app
ENV PORT=4050
EXPOSE 4050

COPY test/docker-compose.yaml /app/docker-compose.yaml

CMD ["npm", "start"]
