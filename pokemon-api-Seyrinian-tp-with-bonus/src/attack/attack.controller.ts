import { Request, Response } from 'express';
import prisma from '../client';

export const getAttacks = async (req: Request, res: Response) => {
  try {
    const attacks = await prisma.attack.findMany();
    res.json(attacks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attacks' });
  }
};

export const getAttackById = async (req: Request, res: Response) => {
  const { attackId } = req.params;
  try {
    const attack = await prisma.attack.findUnique({
      where: { id: Number(attackId) },
    });
    if (!attack) {
      res.status(404).json({ error: 'Attack not found' });
      return;
    }
    res.json(attack);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attack' });
  }
};

export const createAttack = async (req: Request, res: Response) => {
  const { name, type, damages } = req.body;
  try {
    const attack = await prisma.attack.create({
      data: {
        name,
        type,
        damages,
      },
    });
    res.status(201).json(attack);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create the attack' });
  }
};

export const updateAttack = async (req: Request, res: Response) => {
  const { attackId } = req.params;
  const { name, type, damages } = req.body;

  try {
    const existingAttack = await prisma.attack.findUnique({
      where: { id: Number(attackId) },
    });

    if (!existingAttack) {
      res.status(404).json({ error: 'Attack not found' });
      return;
    }

    const updatedAttack = await prisma.attack.update({
      where: { id: Number(attackId) },
      data: {
        name,
        type,
        damages,
      },
    });

    res.status(200).json(updatedAttack);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update the attack' });
  }
};

export const deleteAttack = async (req: Request, res: Response) => {
  const { attackId } = req.params;

  try {
    await prisma.attack.delete({ where: { id: Number(attackId) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the attack' });
  }
};
