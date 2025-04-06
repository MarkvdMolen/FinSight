# Helpt zoeken naar Images -> https://hub.docker.com/
# Stap 1: Gebruik een officiële Node.js image als basis voor development
FROM node:20-alpine3.20

# Stap 2: Stel de werkdirectory in binnen de container
WORKDIR /app

# Stap 3: Kopieer de package.json en package-lock.json bestanden naar de container
COPY . .

# Stap 4: Installeer de projectafhankelijkheden
RUN npm install

# Stap 6: Stel de poort in waarop de container luistert
EXPOSE 4200

# Stap 7: Definieer het startcommando voor de ontwikkelomgeving
CMD ["npm", "run", "start"]