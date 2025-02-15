# Utilise Node.js 18 comme base
FROM node:18

# Crée et définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie package.json et package-lock.json avant d'installer les dépendances
COPY package.json package-lock.json ./

# Installe les dépendances
RUN npm install

# Copie le reste du code (y compris src/)
COPY . .

# Expose le port 5001
EXPOSE 5001

# Commande pour exécuter le backend depuis src/
CMD ["node", "src/app.js"]


# version render 2.0 ollama
# # Usa una imagen base de Ubuntu
# FROM ubuntu:latest

# # Instala dependencias necesarias
# RUN apt update && apt install -y curl git unzip

# # Instala Node.js y npm
# RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
#     && apt install -y nodejs

# # Instalar Ollama
# RUN curl -fsSL https://ollama.com/install.sh | sh

# # Crear el directorio de la app y copiar archivos
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm install
# COPY . .

# # Exponer los puertos (5001 para Node.js, 11434 para Ollama)
# EXPOSE 5001 11434

# # Iniciar Ollama, esperar que se levante y luego hacer el pull del modelo antes de iniciar el backend
# CMD ollama serve & sleep 10 && ollama pull ALIENTELLIGENCE/medicaldiagnostictools && node src/app.js


# version railway
# # Usa una imagen base de Ubuntu
# FROM ubuntu:latest

# # Instala dependencias necesarias
# RUN apt update && apt install -y curl git unzip

# # Instala Node.js y npm
# RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
#     && apt install -y nodejs

# # Instalar Ollama
# RUN curl -fsSL https://ollama.com/install.sh | sh

# # Crear el directorio de la app y copiar archivos
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm install
# COPY . .

# # Exponer los puertos (5001 para Node.js, 11434 para Ollama)
# EXPOSE 5001 11434

# # Ejecutar Ollama, esperar que se levante y luego hacer el pull del modelo antes de iniciar el backend
# CMD ollama serve & sleep 20 && ollama pull ALIENTELLIGENCE/medicaldiagnostictools && node src/app.js
