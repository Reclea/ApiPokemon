// Fichier : src/index.ts
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import {pokemonCardRouter} from './pokemonCard/pokemonCard.router';
import {userRouter} from './user/user.router';
import {attackRouter} from './attack/attack.router';
import {deckRouter} from './deck/deck.router';
import cors from 'cors';

export const app = express();
const port = process.env.PORT || 3000;

// Charger la spécification Swagger
const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml'));

app.use(
    cors({
        origin: '*', // Permet à toutes les origines d'accéder à l'API
        methods: 'GET,POST,PUT,DELETE,PATCH', // Spécifie les méthodes autorisées
        allowedHeaders: 'Content-Type,Authorization', // Spécifie les en-têtes autorisés: '*',
    })
);

// Serveur Swagger UI à l'adresse /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

app.use('/pokemon-cards', pokemonCardRouter);
app.use('/users', userRouter);
app.use('/attacks', attackRouter);
app.use('/decks', deckRouter);

export const server = app.listen(port);

export function stopServer() {
    server.close();
}
