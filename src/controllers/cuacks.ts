import { Request, Response } from 'express';
import User from '../models/user';
import { noSpecialCharactersContent } from '../middlewares/utils/fields';
import Cuack from '../models/cuack';

export const cuackPost = async (req: Request, res: Response) => {
  const { cuack } = req.body;

  if (!cuack)
    return res.status(400).send({ response: false, msg: 'Missing info' });

  if (!noSpecialCharactersContent(cuack.content)) {
    return res
      .status(400)
      .send({ response: false, msg: 'Special characters is not allowed.' });
  }

  try {
    const newCuack = await Cuack.create(cuack);
    await User.updateOne(
      { _id: cuack.author },
      { $push: { cuacks: newCuack.id } }
    );
    return res.status(201).send({ response: true, payload: newCuack });
  } catch (error) {
    console.log(`Error CuackPost, Internal server error: ${error}`);
    return res
      .status(500)
      .send({ response: false, payload: 'Internal server error' });
  }
};

export const getAllCuacks = async (_req: Request, res: Response) => {
  try {
    const cuacks = await Cuack.find();
    return res.status(200).send({
      total: cuacks.length,
      cuacks,
    });
  } catch (error) {
    console.log(`Error getting cuacks, Internal server error: ${error}`);
    return res
      .status(500)
      .send({ response: false, payload: 'Internal server error' });
  }
};

export const deleteCuack = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id)
    return res.status(400).send({ response: false, payload: 'Missing data' });

  try {
    const update = await Cuack.findOneAndUpdate(
      { id },
      { $set: { isPublic: false } }
    );
    if (!update)
      return res
        .status(400)
        .send({ response: false, payload: 'failed to update' });
    return res
      .status(200)
      .send({ response: true, payload: 'successfully updated' });
  } catch (error) {
    console.log(`Error 'deleting' cuack', Internal server error: ${error}`);
    return res
      .status(500)
      .send({ response: false, payload: 'Internal server error' });
  }
};

export const addComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { cuack } = req.body;

  if (!id || !cuack)
    return res.status(400).send({ response: false, payload: 'Missing data' });

  cuack.before = id;

  try {
    const update = await Cuack.findOneAndUpdate(
      { _id: id },
      { $push: { comments: cuack } }
    );
    if (!update)
      return res
        .status(400)
        .send({ response: false, payload: 'failed to update' });
    await User.updateOne(
      { id: cuack.author },
      { $push: { cuacks: update.id } }
    );

    return res
      .status(200)
      .send({ response: true, payload: 'successfully updated' });
  } catch (error) {
    console.log(`Error adding comment, Internal server error: ${error}`);
    return res
      .status(500)
      .send({ response: false, payload: 'Internal server error' });
  }
};

export const removeComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { cuack } = req.body;

  if (!id || !cuack)
    return res.status(400).send({ response: false, payload: 'Missing data' });

  try {
    const update = await Cuack.findOneAndUpdate(
      { id },
      { $pull: { comments: cuack } }
    );
    if (!update)
      return res
        .status(400)
        .send({ response: false, payload: 'failed to update' });
    await User.updateOne(
      { id: update.author },
      { $pull: { cuacks: update.id } }
    );
    return res
      .status(200)
      .send({ response: true, payload: 'successfully updated' });
  } catch (error) {
    console.log(`Error adding comment, Internal server error: ${error}`);
    return res
      .status(500)
      .send({ response: false, payload: 'Internal server error' });
  }
};

export const reCuack = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req.body;

  if (!id || !user)
    return res.status(400).send({ response: false, payload: 'Missing data' });

  try {
    const update = await Cuack.findOneAndUpdate(
      { _id: id },
      { $push: { recuacks: user } }
    );
    if (!update)
      return res
        .status(400)
        .send({ response: false, payload: 'failed to update' });

    await User.updateOne({ _id: user }, { $push: { recuacks: update.id } });

    return res
      .status(200)
      .send({ response: true, payload: 'successfully updated' });
  } catch (error) {
    console.log(`Error in recuack function, Internal server error: ${error}`);
    return res
      .status(500)
      .send({ response: false, payload: 'Internal server error' });
  }
};

export const removeReCuack = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req.body;

  if (!id || !user)
    return res.status(400).send({ response: false, payload: 'Missing data' });

  try {
    const update = await Cuack.findOneAndUpdate(
      { id },
      { $pull: { recuacks: user } }
    );
    if (!update)
      return res
        .status(400)
        .send({ response: false, payload: 'failed to update' });

    await User.updateOne({ id: user }, { $pull: { recuacks: update.id } });

    return res
      .status(200)
      .send({ response: true, payload: 'successfully updated' });
  } catch (error) {
    console.log(
      `Error in remove recuack function, Internal server error: ${error}`
    );
    return res
      .status(500)
      .send({ response: false, payload: 'Internal server error' });
  }
};

export const likeCuack = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req.body;

  if (!id || !user)
    return res.status(400).send({ response: false, payload: 'Missing data' });

  try {
    const update = await Cuack.findOneAndUpdate(
      { _id: id },
      { $push: { likes: user } }
    );
    if (!update)
      return res
        .status(400)
        .send({ response: false, payload: 'failed to update' });

    await User.updateOne({ _id: user }, { $push: { likes: update.id } });
    return res
      .status(200)
      .send({ response: true, payload: 'successfully updated' });
  } catch (error) {
    console.log(`Error in like function, Internal server error: ${error}`);
    return res
      .status(500)
      .send({ response: false, payload: 'Internal server error' });
  }
};

export const removeLikeCuack = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req.body;

  if (!id || !user)
    return res.status(400).send({ response: false, payload: 'Missing data' });

  try {
    const update = await Cuack.findOneAndUpdate(
      { _id: id },
      { $pull: { likes: user } }
    );
    if (!update)
      return res
        .status(400)
        .send({ response: false, payload: 'failed to update' });

    await User.updateOne({ _id: user }, { $pull: { likes: update.id } });

    return res
      .status(200)
      .send({ response: true, payload: 'successfully updated' });
  } catch (error) {
    console.log(
      `Error in remove like function, Internal server error: ${error}`
    );
    return res
      .status(500)
      .send({ response: false, payload: 'Internal server error' });
  }
};

export const getCustomCuacks = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  if (!user)
    return res
      .status(400)
      .send({ reponse: false, msg: 'User not found, bad request' });

  let cuacksResponse: any = [];
  for (const following of user.following) {
    cuacksResponse = cuacksResponse.concat(await getCuacksByUser(following, 5));
  }
  cuacksResponse = cuacksResponse.concat(await getCuacksByUser(id, 5));

  return res.status(200).send({ response: true, payload: cuacksResponse });
};

export const getCuacksByUser = async (user: string, limit: number) => {
  try {
    const cuacks = await Cuack.find({ author: user })
      .sort({ date: -1 })
      .limit(limit);
    if (cuacks) {
      const author = await User.findOne({ _id: user });
      return cuacks.map((cuack) => {
        return {
          nickname: author?.nickname,
          fullname: author?.fullname,
          picture: author?.img,
          //@ts-ignore
          _doc: cuack._doc,
        };
      });
    }
    return [];
  } catch (error) {
    console.log(`Internal server error in getCuacksByUser: ${error}`);
    return [];
  }
};

export const getCuacksByUserId = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).send({ response: false, msg: 'Miising data' });
  const resp = await getCuacksByUser(id, 2);
  return res.status(200).send({ response: true, payload: resp });
};

export const getCuackByid = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cuack = await Cuack.findOne({ _id: id });
  if (!cuack)
    return res
      .status(400)
      .send({ reponse: false, msg: 'Cuack not found, bad request' })

  return res.status(200).send({ response: true, payload: cuack });
};