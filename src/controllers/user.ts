import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';

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

export const usersPut = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { _id, google, correo, ...rest } = req.body;

  //Validate database
  if (rest.password) {
    //Crypt password
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
