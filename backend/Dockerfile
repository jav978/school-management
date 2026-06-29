# Usar imagen ligera de Node.js
FROM node:20-alpine

# Establecer directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el resto del código del backend
COPY . .

# Exponer el puerto del backend (Feathers.js)
EXPOSE 3030

# Variable de entorno por defecto
ENV NODE_ENV=production

# Comando para iniciar la aplicación
CMD ["npm", "start"]
