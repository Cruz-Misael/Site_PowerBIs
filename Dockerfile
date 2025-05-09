# executar para rodar na sua máquina: docker-compose up --build

# Etapa de build
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Etapa de produção (servidor leve para servir os arquivos)
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
