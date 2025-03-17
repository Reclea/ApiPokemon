import { Router } from 'express';
import {
  getAttacks,
  getAttackById,
  createAttack,
  updateAttack,
  deleteAttack,
} from './attack.controller';
import { verifyJWT } from '../common/jwt.middleware';

export const attackRouter = Router();

attackRouter.get('/', getAttacks);
attackRouter.get('/:attackId', getAttackById);
attackRouter.post('/', verifyJWT, createAttack);
attackRouter.patch('/:attackId', verifyJWT, updateAttack);
attackRouter.delete('/:attackId', verifyJWT, deleteAttack);
