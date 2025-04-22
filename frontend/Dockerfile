FROM node:18-alpine AS builder

WORKDIR /client

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /client/dist /usr/share/nginx/html/frontend

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]

# docker build -t frontend .  
# docker run -d -p 5173:5173 --name frontend  frontend:latest