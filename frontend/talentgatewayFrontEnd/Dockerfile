# Stage 1: Compile and Build angular codebase

# Use official node image as the base image

#Utilisée dans la première étape pour compiler et construire le code Angular.
#Node.js est utilisé car c'est l'environnement de développement pour les applications Angular.
#L'image Node.js fournit un environnement de développement avec npm (Node Package Manager) installé,
# ce qui est nécessaire pour installer les dépendances et exécuter les scripts de construction de l'application Angular.
FROM node:latest as build

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/

# Install all the dependencies
RUN npm install

# Generate the build of the application
RUN npm run build


# Stage 2: Serve app with nginx server
#Nginx est un serveur web léger et performant, souvent utilisé pour servir des applications web statiques comme celles construites avec Angular.
# Use official nginx image as the base image
FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/dist/skote /usr/share/nginx/html

# Expose port 80
EXPOSE 80
