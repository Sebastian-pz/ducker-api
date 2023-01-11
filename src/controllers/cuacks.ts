import { Request, Response } from 'express';
import User from '../models/user';
import addComment from './utils/addComment';
import addLike from './utils/addLike';
import addRecuacks from './utils/addRecuacks';
import { noSpecialCharactersContent } from '../middlewares/utils/fields';
import { remove } from './utils/removeComment';
import { cancelLike } from './utils/removeLike';
import { cancelRecuack } from './utils/removeRecuack';

export const cuackPost = async (req: Request, res: Response) => {
	const { cuack } = req.body;

	if (!cuack) return res.status(400).send({ response: false, msg: 'Missing info' });

	if (!noSpecialCharactersContent(cuack.content)) {
		return res.status(400).send({ response: false, msg: 'Special characters is not allowed.' });
	}

	try {
		User.findOneAndUpdate(
			{ _id: cuack.author },
			{ $push: { cuacks: cuack } },
			function (error: any, _success: any) {
				if (error) {
					return res.status(400).send({ response: false, msg: 'Post was not published' });
				}
				return res.status(202).send({ response: true, msg: 'Post published' });
			}
		);
	} catch (error) {
		console.log(`Error posting a cuack ${error}`);
		return res.status(500).send({ response: false, msg: 'Internal server error' });
	}

	return;
};

//likes, comments & recuacks
export const cuackPut = async (req: Request, res: Response) => {
	const id = req.params.id;
	const { likeID, comment, cuackID, recuackID } = req.body;

	if (id && likeID && cuackID) {
		const response = await addLike(id, likeID, cuackID);
		if (response) {
			return res.status(202).send({ response: true, msg: 'Likes updated successfully' });
		} else {
			return res.status(500).send({ response: false, msg: 'Error in like post' });
		}
	}

	if (id && comment && cuackID) {
		const response = await addComment(id, cuackID, comment);
		if (response) {
			return res.status(202).send({ response: true, msg: 'Comment updated successfully' });
		} else {
			return res.status(500).send({ response: false, msg: 'Error, you could comment' });
		}
	}

	if (id && recuackID && cuackID) {
		const response = await addRecuacks(id, recuackID, cuackID);
		if (response) {
			return res.status(202).send({ response: true, msg: 'Recuack updated successfully' });
		} else {
			return res.status(500).send({ response: false, msg: 'Error in recuack post' });
		}
	}
	return res.status(400).send({ response: false, msg: 'Missing information' });
};

export const cuacksByUser = async (req: Request, res: Response) => {
	const { since = '0', limit = '10' } = req.query;
	const { id } = req.params;
	let s: number = 0;
	let l: number = 10;

	if (since && typeof since === 'string') s = parseInt(since);
	if (limit && typeof limit === 'string') l = parseInt(limit);

	try {
		const user = await User.findOne({ id });

		if (!user) return res.status(400).send({ response: false, msg: 'Invalid ID or missing info' });

		const total = user.cuacks.length;
		const cuacks = user.cuacks.slice(s, l);
		return res.status(200).send({ total, cuacks });
	} catch (error) {
		console.log(`Error getting cuacks, ${error}`);
		return res.status(500).send({ response: false, msg: 'Internal server error' });
	}
};

export const cuacksByID = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const { cuackID } = req.body;

		const user = await User.findById(id);
		// @ts-ignore
		const userCuack = user && user.cuacks.find((cuack) => cuack.id === cuackID);
		return res.status(201).send({ response: true, userCuack });
	} catch (error) {
		console.log(`Error searching a cuack: ${error}`);
		return res.status(500).send({ response: false, msg: 'Internal server error' });
	}
};

export const cuackDelete = async (req: Request, res: Response) => {
	const id = req.params.id;
	const { cuackID } = req.body;

	try {
		await User.findOneAndUpdate(
			{ id, 'cuacks._id': cuackID },
			{ 'cuacks.$.isPublic': false },
			{ new: true }
		);

		return res.status(202).send({ response: true, msg: 'Cuack deleted successfully' });
	} catch (error) {
		console.log(`cuackDelete internal server error: ${error}`);
		return res.status(500).send({ msg: 'Internal server error' });
	}
};

export const reportCuack = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { cuackID } = req.body;

	try {
		if (!id || !cuackID) {
			console.log('missing data');
			return res.status(400).send({ msg: 'missing data' });
		}
		await User.findOneAndUpdate({ id, 'cuacks._id': cuackID }, { $inc: { 'cuacks.$.reports': 1 } });
		return res.status(201).send({ msg: 'report received succesfully' });
	} catch (error) {
		console.log(`cuackReport internal server error: ${error}`);
		return res.status(500).send({ msg: 'Internal server error' });
	}
};

//Eliminar comentarios, likes y recuacks

export const removeComment = async (req: Request, res: Response) => {
	const { idAuthorOrigin, idCuackOrigin, idComment } = req.body;
	if (!idAuthorOrigin || !idCuackOrigin || !idComment)
		return res.status(404).send({ msg: 'Missing info' });
	const r = await remove(idAuthorOrigin, idComment, idCuackOrigin);
	if (r) return res.status(200).send({ msg: 'Comment removed succesfully' });
	return res.status(500).send({ msg: 'Algo no salió bien' });
};

export const removeRecuack = async (req: Request, res: Response) => {
	const { idAuthorOrigin, idCuackOrigin, idRecuack } = req.body;

	if (!idAuthorOrigin || !idCuackOrigin || !idRecuack)
		return res.status(404).send({ msg: 'Missing info' });

	const r = await cancelRecuack(idAuthorOrigin, idCuackOrigin, idRecuack);
	if (r) return res.status(200).send({ msg: 'ReCuack removed succesfully' });
	return res.status(500).send({ msg: 'Algo no salió bien' });
};

export const removeLike = async (req: Request, res: Response) => {
	const { idAuthorOrigin, idCuackOrigin, idLike } = req.body;

	if (!idAuthorOrigin || !idCuackOrigin || !idLike)
		return res.status(404).send({ msg: 'Missing info' });

	const r = await cancelLike(idAuthorOrigin, idCuackOrigin, idLike);
	if (r) return res.status(200).send({ msg: 'Like removed succesfully' });
	return res.status(500).send({ msg: 'Algo no salió bien' });
};
