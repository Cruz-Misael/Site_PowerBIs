# executar para rodar na sua máquina: docker-compose up 

# Etapa única de desenvolvimento com hot reload
FROM node:18

# Criar diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependência
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm install

# Copiar o restante dos arquivos do projeto
COPY . .

# Expor a porta padrão do dev server
EXPOSE 3000

# Comando para iniciar o React com hot reload
CMD ["npm", "start"]
