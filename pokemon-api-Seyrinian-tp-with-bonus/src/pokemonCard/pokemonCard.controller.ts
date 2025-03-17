import {Request, Response} from 'express';
import prisma from '../client';

export const getPokemonCards = async (req: Request, res: Response) => {
    try {
        const pokemonCards = await prisma.pokemonCard.findMany({
            include: {
                type: true,
                attack: {
                    include: {
                        type: true
                    }
                },
                weakness: true
            }
        });
        res.json(pokemonCards);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch pokemonCards'});
    }
};

export const getPokemonCardById = async (req: Request, res: Response) => {
    const {pokemonCardId} = req.params;
    try {
        const pokemonCard = await prisma.pokemonCard.findUnique({
            where: {id: Number(pokemonCardId)},
        });
        if (!pokemonCard) {
            res.status(404).json({error: 'PokemonCard not found'});
            return;
        }
        res.json(pokemonCard);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch PokemonCard'});
    }
};

export const createPokemonCard = async (req: Request, res: Response) => {
    const {name, pokedexId, type, imageUrl, lifePoints, attack, weakness} =
        req.body;
    try {
        const pokemonCard = await prisma.pokemonCard.create({
            data: {
                name,
                pokedexId,
                type: {connect: {id: Number(type)}},
                imageUrl,
                lifePoints,
                attack: {connect: {id: Number(attack)}},
                weakness: {connect: {id: Number(weakness)}},
            },
        });
        res.status(201).json(pokemonCard);
    } catch (error) {
        res.status(500).json({error: 'Failed to create the PokemonCard'});
    }
};

export const updatePokemonCard = async (req: Request, res: Response) => {
    const {pokemonCardId} = req.params;
    const {name, pokedexId, type, imageUrl, lifePoints, attack, weakness} =
        req.body;

    try {
        // Vérifie si le Pokémon existe
        const existingPokemonCard = await prisma.pokemonCard.findUnique({
            where: {id: Number(pokemonCardId)},
        });

        if (!existingPokemonCard) {
            res.status(404).json({error: 'PokemonCard not found'});
            return;
        }
        const data: any = {};
        if (name) data.name = name;
        if (pokedexId) data.pokedexId = pokedexId;
        if (type) data.type = {connect: {id: Number(type)}};
        if (imageUrl) data.imageUrl = imageUrl;
        if (lifePoints) data.lifePoints = lifePoints;
        if (attack) data.attack = {connect: {id: Number(attack)}};
        if (weakness) data.weakness = {connect: {id: Number(weakness)}};

        const updatedPokemonCard = await prisma.pokemonCard.update({
            where: {id: Number(pokemonCardId)},
            data,
        });
        res.status(200).json(updatedPokemonCard);
    } catch (error) {
        res.status(500).json({error: 'Failed to update the PokemonCard'});
    }
};

export const deletePokemonCard = async (req: Request, res: Response) => {
    const {pokemonCardId} = req.params;

    try {
        await prisma.pokemonCard.delete({where: {id: Number(pokemonCardId)}});
        res.status(204).send();
    } catch (error) {
        res.status(500).json({error: 'Failed to delete the PokemonCard'});
    }
};
