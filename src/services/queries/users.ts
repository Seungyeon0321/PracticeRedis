import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { userKey, usernamesUniqueKey, usernamesKey } from '$services/keys';

export const getUserByUsername = async (username: string) => {
  // Use the username argument to look up the persons User ID
  // with the usernames sorted set
  const decimalId = await client.zScore(usernamesKey(), username);

  // make sure we actually got an ID from the lookup
  if (!decimalId) {
    throw new Error('User does not exist');
  }

  // Take the id and convert it back to hex
  const id = decimalId.toString(16);
  // Use the id to look up the user's hash
  const user = await client.hGetAll(userKey(id));

  // deserialize and return the hash
  return deserialize(id, user);
};

export const getUserById = async (id: string) => {
  const user = await client.hGetAll(userKey(id));

  return deserialize(id, user);
};

export const createUser = async (attrs: CreateUserAttrs) => {
    const id = genId(); 

    // See if the username is already in the set of usernames
    const existing = await client.sIsMember(usernamesUniqueKey(), attrs.username);

    //If so, throw an error
    if (existing) {
        throw new Error('Username is already taken');
    }
    //Otherwise, continue

    await client.hSet(userKey(id), serialize(attrs));
    await client.sAdd(usernamesUniqueKey(), attrs.username);
    await client.zAdd(usernamesKey(), {
        value: attrs.username,
        score: parseInt(id, 16)
    });

    return id;
};

const serialize = (user: CreateUserAttrs) => {
    return {
        username: user.username,
        password: user.password,
    };
};

const deserialize = (id: string, user: {[key: string]: string}) => {
  return {
    id,
    username: user.username,
    password: user.password,
  }
}