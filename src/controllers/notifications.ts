import User from '../models/user';
import { getMentions } from './utils/getMentions';

export async function addNotification(user: string, content: object) {
  if (!user || !content) return { reponse: false, payload: 'Missing data' };
  try {
    const operation = await User.findOneAndUpdate(
      { nickname: user },
      { $push: { notifications: content } }
    );
    if (!operation) return { response: false, payload: 'Invalid user' };
    return { response: true, payload: 'User updated!' };
  } catch (error) {
    console.log(`Internal server error ${error}`);
    return { response: false, payload: 'Internal server error' };
  }
}

export async function notificateMentions(cuack: any): Promise<void> {
  const mentions = getMentions(cuack.content);
  if (mentions?.length) {
    for (const mention of mentions) {
      await addNotification(mention, {
        content: `Te mencionaron en la publicación ${cuack._id}`,
      });
    }
  }
}
