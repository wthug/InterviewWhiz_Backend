FROM node:alpine3.21

RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev

ENV PYTHON=python3

WORKDIR /app
COPY package.json ./


RUN npm install

COPY . .

EXPOSE 4000

CMD [ "npm", "run", "start" ]
