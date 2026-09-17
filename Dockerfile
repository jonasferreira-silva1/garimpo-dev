# ==========================================
# Estágio 1: Build da Aplicação React/Vite
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências do projeto
RUN npm ci

# Copia todo o código-fonte do projeto
COPY . .

# Compila o projeto TypeScript e gera a pasta dist com o Vite
RUN npm run build

# ==========================================
# Estágio 2: Servidor de Produção (Nginx)
# ==========================================
FROM nginx:alpine AS runner

# Copia a build estática para o diretório padrão do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expõe a porta 80 do container
EXPOSE 80

# Inicia o Nginx em primeiro plano
CMD ["nginx", "-g", "daemon off;"]
