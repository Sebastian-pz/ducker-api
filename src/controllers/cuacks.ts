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
  // Vamos a añadir un comentario, es decir un cuack con before
  // Se realizan tres operaciones,
  // 1. Se crea el comentario (cuack)
  // 2. Al cuack original se pushea en el arreglo de comentarios el id del nuevo
  // 3. Se añade el cuack a la lista de cuacks del usuario

  const { id } = req.params;
  const { comment } = req.body;

  try {
    if (!id || !comment)
      return res
        .status(400)
        .send({ response: false, payload: 'Missing information' });
    comment.type = 'comment';
    comment.previous = id;
    const newComment = await Cuack.create(comment);
    const cuack = await Cuack.findOneAndUpdate(
      { _id: id },
      { $push: { comments: newComment.id } }
    );
    if (!cuack)
      return res.status(400).send({ response: false, payload: 'Invalid ID' });
    await User.updateOne(
      { id: comment.author },
      { $push: { cuacks: newComment.id } }
    );
    return res.status(201).send({ response: true, payload: newComment });
  } catch (error) {
    console.log(`Error adding comment, Internal server error: ${error}`);
    return res
      .status(500)
      .send({ response: false, payload: 'Internal server error' });
  }
};

export const getComments = async (req: Request, res: Response) => {
  const { previous } = req.params;
  if (!previous)
    return res
      .status(400)
      .send({ response: false, payload: 'Invalid or missing data' });
  try {
    const comments = await Cuack.find({ previous });
    let response = [];
    for (const comment of comments) {
      // @ts-ignore
      const { nickname, fullname, img, id } = await User.findOne({
        _id: comment.author,
      });
      response.push({ nickname, fullname, img, userid: id, _doc: comment });
    }
    return res.status(200).send(response);
  } catch (error) {
    console.log(`Internal server error on GetComments ${error}`);
    return res
      .status(500)
      .send({ response: false, payload: 'Internal server error' });
  }
};

export const removeComment = async (req: Request, res: Response) => {
  /*
		Necesitamos 3 cosas
			-> El id del comentario
			-> El id del Cuack original
			-> El id del author

			Los tres los encontramos dentro del comentario (id, previous, author)
	*/
  const { id } = req.params;

  const comment = await Cuack.findOne({ _id: id, type: 'comment' });

  if (!comment)
    return res.status(400).send({ response: false, payload: 'Invalid id' });

  try {
    // Se elimina la referencia en el cuack anterior
    await Cuack.updateOne(
      { _id: comment.previous },
      { $pull: { comments: comment.id } }
    );
    // Se elimina el cuack del usuario
    await User.updateOne(
      { _id: comment.author },
      { $pull: { cuacks: comment.id } }
    );
    // Se borra el comentario
    await Cuack.deleteOne({ _id: comment.id });

    return res.status(200).send({ response: true, payload: 'Success' });
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
  const user = await User.findOne({ _id: id, type: 'cuack' });
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
    const cuacks = await Cuack.find({ author: user, type: 'cuack' })
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
      .send({ reponse: false, msg: 'Cuack not found, bad request' });
  const author = await User.findOne({ _id: cuack.author });

  return res.status(200).send({
    response: true,
    payload: {
      nickname: author?.nickname,
      fullname: author?.fullname,
      picture: author?.img,
      //@ts-ignore
      _doc: cuack,
    },
  });
};
