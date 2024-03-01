# syntax=docker/dockerfile:1

FROM alpine
ENV NODE_ENV=production
RUN apk add --update nodejs npm git
WORKDIR /opt/dockerseer
COPY . .
RUN npm install --omit=dev
CMD ["node", "index.js"]
#CMD tail -f /dev/null