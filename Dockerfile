FROM node:lts-buster-slim

WORKDIR /app
COPY . .
RUN npm ci --only=production --ignore-scripts

CMD ['./start.sh']