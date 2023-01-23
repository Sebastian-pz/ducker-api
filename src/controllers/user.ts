import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';
import { noSpecialCharacters } from '../middlewares/utils/fields';
import {
  addFollowing,
  addFollower,
  addBlocked,
  addSilenced,
  removeFollower,
  removeFollowing,
  removeSilenced,
  removeBlocked,
} from './utils';

export const usersGet = async (req: Request, res: Response) => {
  const { since = 0, from = 10 } = req.query;
  const queryState = { state: true };

  const [total, users] = await Promise.all([
    User.countDocuments(queryState),
    User.find(queryState).limit(Number(from)).skip(Number(since)),
  ]);

  // Return length & users
  return res.status(200).send({
    total,
    users,
  });
};

export const userPost = async (req: Request, res: Response) => {
  const { fullname, email, password, nickname } = req.body;
  const nicknameL = `@${nickname.toLowerCase()}`;
  const user = new User({
    fullname,
    email,
    password,
    nickname: nicknameL,
  });

  //Encrypt password
  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(password, salt);

  //Save in DB
  await user.save();

  res.status(201).send({
    msg: 'User created succesfully',
    user,
  });
};

export const bulkCreate = async (req: Request, res: Response) => {
  const { users } = req.body;
  try {
    for (let i = 0; i < users.length; i++) {
      const user = new User({
        fullname: users[i].fullname,
        email: users[i].email,
        nickname: users[i].nickname,
        password: users[i].password,
        img: users[i].img,
      });

      await user.save();
    }

    return res.status(201).send({ response: true, msg: 'Creado con éxito' });
  } catch (error) {
    console.log(`Internal server error ${error}`);
    return res
      .status(500)
      .send({ response: false, msg: 'Internal server error' });
  }
};

export const userID = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) return res.status(404).send({ msg: 'User not found' });
    return res.status(201).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: 'Internal server error' });
  }
};

/**
 * usersGet (async) tries to generate a json web token using a specific user id
 * @param {String} id
 * @returns jwt / error
 */
export const usersPut = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { _id, google, correo, ...rest } = req.body;

  //Validate database
  if (rest.password) {
    //Crypt password
    if (!noSpecialCharacters(rest.password))
      return res.status(400).send({
        response: false,
        msg: `password ${rest.password} has special characters`,
      });
    const salt = bcrypt.genSaltSync();
    rest.password = bcrypt.hashSync(rest.password, salt);
  }

  try {
    const user = await User.findByIdAndUpdate(id, rest, { new: true });
    return res.status(202).send({ msg: 'User updated!', user });
  } catch (error) {
    console.log(`usersPut internal error: ${error}`);
    return res.status(500).send({ msg: 'Internal server error' });
  }
};

export const userDelete = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { state: false },
      { new: true }
    );
    return res
      .status(200)
      .send({ msg: 'User state changed successfully', user });
  } catch (error) {
    console.log(`userDelete internal server error: ${error}`);
    return res.status(500).send({ msg: 'Internal server error' });
  }
};

export const userFollowing = async (req: Request, res: Response) => {
  const { idUserOne } = req.params;
  const { idUserTwo } = req.body;

  const [following, follower] = await Promise.all([
    addFollowing(idUserOne, idUserTwo),
    addFollower(idUserTwo, idUserOne),
  ]);

  if (following && follower)
    return res
      .status(200)
      .send({ msg: 'Following added succesfully', following, follower });
  return res.status(500).send({ msg: 'Internal server error' });
};

export const userUnfollowing = async (req: Request, res: Response) => {
  const { idUserOne } = req.params;
  const { idUserTwo } = req.body;

  const [following, follower] = await Promise.all([
    removeFollowing(idUserOne, idUserTwo),
    removeFollower(idUserTwo, idUserOne),
  ]);

  if (following && follower)
    return res
      .status(200)
      .send({ msg: 'Unfollow succesfully', following, follower });
  return res.status(500).send({ msg: 'Internal server error' });
};

export const userFollowers = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idOtherUser = req.body;
  const resp = await addFollower(id, idOtherUser);

  if (resp)
    return res.status(200).send({ msg: 'Followers added succesfully', resp });
  return res.status(500).send({ msg: 'Internal server error' });
};

export const userSilenced = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { idOtherUser } = req.body;
  const resp = await addSilenced(id, idOtherUser);

  if (resp)
    return res.status(200).send({ msg: 'Silenced added succesfully', resp });
  return res.status(500).send({ msg: 'Internal server error' });
};

export const userRemoveSilenced = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { idOtherUser } = req.body;
  const resp = await removeSilenced(id, idOtherUser);

  if (resp)
    return res.status(200).send({ msg: 'Silenced removed succesfully', resp });
  return res.status(500).send({ msg: 'Internal server error' });
};

export const userBlocked = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { idOtherUser } = req.body;
  const resp = await addBlocked(id, idOtherUser);

  if (resp)
    return res.status(200).send({ msg: 'Blocked added succesfully', resp });
  return res.status(500).send({ msg: 'Internal server error' });
};

export const userRemoveBlocked = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { idOtherUser } = req.body;
  const resp = await removeBlocked(id, idOtherUser);

  if (resp)
    return res.status(200).send({ msg: 'Blocked removed succesfully', resp });
  return res.status(500).send({ msg: 'Internal server error' });
};

export const usersMailsAndNicknames = async (_req: Request, res: Response) => {
  const [nickNames, mails] = await Promise.all([
    User.find({}, { nickname: 1 }).distinct('nickname'),
    User.find({}, { email: 1 }).distinct('email'),
  ]);

  // Return length & users
  return res.status(200).send({
    nickNames,
    mails,
  });
};

export const queryUsers = async (req: Request, res: Response) => {
  const { nickname } = req.params;
  const regex = new RegExp(nickname, 'i');

  try {
    const users = await User.find(
      {
        $or: [{ nickname: regex }, { fullname: regex }],
      },
      { img: 1, nickname: 1, fullname: 1 }
    ).limit(10);
    return res.status(200).send(users);
  } catch (error) {
    console.log(`Internal server error: ${error}`);
    return res.status(500).send('Internal server error');
  }
};
