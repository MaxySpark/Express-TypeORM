FROM node:jessie

COPY ./ ./

RUN npm install

CMD ["npm", "start"]