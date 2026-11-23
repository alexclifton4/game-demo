FROM node:26-alpine
WORKDIR /app
RUN apk update && apk upgrade --no-cache
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --omit=dev
# Remove npm as it's not needed past this point and has vulnerable dependencies
RUN rm -rf /usr/local/lib/node_modules/npm \
    && rm -f /usr/local/bin/npm /usr/local/bin/npx
COPY . /app
EXPOSE 8080
CMD ["node", "index.js"]