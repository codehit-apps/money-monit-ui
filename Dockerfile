FROM node:16

WORKDIR /money-monit-ui
COPY . .

USER node

EXPOSE 8080

CMD bash