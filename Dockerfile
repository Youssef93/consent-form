FROM node:16-alpine

WORKDIR /app

COPY . .

RUN npm i

EXPOSE 5000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]