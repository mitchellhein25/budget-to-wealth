FROM node:23.11.0 as build
WORKDIR /app
COPY . .
EXPOSE 3000
RUN npm install

FROM node:23.11.0 as dev
WORKDIR /app
COPY --from=build /app /app

CMD ["npm", "run", "dev"]
