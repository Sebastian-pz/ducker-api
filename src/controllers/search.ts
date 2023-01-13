import { Request, Response } from 'express';
const { ObjectId } = require('mongoose').Types;
import User from '../models/user';
import Cuack from '../models/cuack';

const acceptedCollections = ['users', 'cuacks'];

const searchUsers = async (term = '', res: Response) => {
	const isMongoID = ObjectId.isValid(term);

	if (isMongoID) {
		const user = await User.findById(term);
		return res.status(200).send({
			results: user ? [user] : [],
		});
	}

	const regex = new RegExp(term, 'i');

	const [total, users] = await Promise.all([
		User.countDocuments({
			$or: [{ fullname: regex }, { email: regex }, { nickname: regex }],
			$and: [{ state: true }],
		}),

		User.find({
			$or: [{ fullname: regex }, { email: regex }, { nickname: regex }],
			$and: [{ state: true }],
		}),
	]);
	return res.status(200).send({
		results: total,
		users,
	});
};

const searchCuacks = async (term = '', res: Response) => {
	const isMongoID = ObjectId.isValid(term);

	if (isMongoID) {
		const [cuackID, cuackAuthor] = await Promise.all([
			Cuack.findById(term),
			Cuack.find({ author: term }),
		]);

		return res.status(200).send({
			results: cuackID ? [cuackID] : cuackAuthor,
		});
	}

	const regex = new RegExp(term, 'i');

	const [total, cuacks] = await Promise.all([
		Cuack.countDocuments({
			$or: [{ content: regex }, { category: regex }],
			$and: [{ state: true }],
		}),

		Cuack.find({
			$or: [{ content: regex }, { category: regex }],
			$and: [{ isPublic: true }],
		}),
	]);
	return res.status(200).send({
		results: total,
		cuacks,
	});
};

export const search = (req: Request, res: Response) => {
	const { collection, term } = req.params;

	if (!acceptedCollections.includes(collection)) {
		return res.status(400).send({
			msg: `The collection required is not accepted. Collections accepted is: ${acceptedCollections}`,
		});
	}

	switch (collection) {
		case 'users':
			return searchUsers(term, res);

		case 'cuacks':
			return searchCuacks(term, res);

		default:
			return res.status(500).send({
				msg: 'Internal server error, search case not covered.',
			});
	}
};
