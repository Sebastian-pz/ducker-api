import { Request, Response } from 'express';
import User from '../models/user';
import addComment from './utils/addComment';
import addLike from './utils/addLike';
import addRecuacks from './utils/addRecuacks';

// Create cuacks

export const cuackPost = async (req: Request, res: Response) => {
	const { cuack } = req.body;

	if (!cuack) return res.status(400).send({ response: false, msg: 'Missing info' });

	// Hardcode content
	cuack.likes = [];
	cuack.recuacks = [];
	cuack.reports = 0;
	cuack.comments = [];
	cuack.isPublic = true;

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

// export const cuackDelete = async (req: Request, res: Response) => {
// 	const id = req.user;
// 	const { cuackID } = req.body;

// 	try {
// 		const user = await User.findOne({ _id: id });
// 	} catch (error) {
// 		console.log(`cuackDelete internal error: ${error}`);
// 		return res.status(500).send({ msg: 'Internal server error' });
// 	}
// };
