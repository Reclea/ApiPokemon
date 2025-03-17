import {Request, Response} from 'express';
import prisma from '../client';

export const getDecks = async (req: Request, res: Response) => {
    try {
        const decks = await prisma.deck.findMany({
            include: {
                owner: true,
                cards: true,
            },
        });
        res.json(decks);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch decks'});
    }
};

export const getDeckById = async (req: Request, res: Response) => {
    const {deckId} = req.params;
    try {
        const deck = await prisma.deck.findUnique({
            where: {id: Number(deckId)},
            include: {
                owner: true,
                cards: true,
            },
        });
        if (!deck) {
            res.status(404).json({error: 'Deck not found'});
            return;
        }
        res.json(deck);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch deck'});
    }
};

export const createDeck = async (req: Request, res: Response) => {
    const {name, cards} = req.body;
    const ownerId = req.query.userId;
    try {
        const deck = await prisma.deck.create({
            data: {
                name,
                owner: {connect: {id: Number(ownerId)}},
                cards: {
                    connect: cards.map((cardId: number) => ({id: cardId})),
                },
            },
        });
        res.status(201).json(deck);
    } catch (error) {
        res.status(500).json({error: 'Failed to create the deck'});
    }
};

export const updateDeck = async (req: Request, res: Response) => {
    const {deckId} = req.params;
    const {name, cards} = req.body;

    try {
        const existingDeck = await prisma.deck.findUnique({
            where: {id: Number(deckId)},
        });

        if (!existingDeck) {
            res.status(404).json({error: 'Deck not found'});
            return;
        }

        const ownerId = req.query.userId;

        const updatedDeck = await prisma.deck.update({
            where: {id: Number(deckId)},
            data: {
                name,
                owner: {connect: {id: Number(ownerId)}},
                cards: {
                    set: cards.map((cardId: number) => ({id: cardId})),
                },
            },
        });

        res.status(200).json(updatedDeck);
    } catch (error) {
        res.status(500).json({error: 'Failed to update the deck'});
    }
};

export const deleteDeck = async (req: Request, res: Response) => {
    const {deckId} = req.params;

    try {
        await prisma.deck.delete({where: {id: Number(deckId)}});
        res.status(204).send();
    } catch (error) {
        res.status(500).json({error: 'Failed to delete the deck'});
    }
};
