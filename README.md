# Corrida

# Instalação Docker

link https://docs.docker.com/install/

# Executar na API

`docker-compose -f "docker-compose.yml" up -d --build`
ou
`docker-compose up`

# API

Node 12.2

http://localhost:3000/race

# logs

http://localhost:9200/corrida/_search?q=name:corrida

# Tests

`npm test`
