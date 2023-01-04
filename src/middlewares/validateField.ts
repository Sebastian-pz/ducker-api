const { validationResult } = require('express-validator');
import { Response, Request, NextFunction } from 'express';

// @ts-ignore
export const validarCampos = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json(errors);
	}
	next();
};
