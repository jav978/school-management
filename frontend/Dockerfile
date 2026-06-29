# Usar imagen ligera de Node.js
FROM node:20-alpine

# Establecer directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código del frontend
COPY . .

# Exponer el puerto del frontend (Nuxt.js)
EXPOSE 3000

# Variable de entorno para escuchar en todas las interfaces de red
ENV HOST=0.0.0.0
ENV PORT=3000

# Comando para iniciar en modo de desarrollo
CMD ["npm", "run", "dev"]
