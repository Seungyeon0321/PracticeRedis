import { client } from '$services/redis';
import { userLikesKey, itemsKey } from '$services/keys';
import { deserialize } from './items';
import { getItems } from './items';

export const userLikesItem = async (itemId: string, userId: string) => {
  //해당 userId의 key를 가지고 있는 set에 itemId가 있는지 확인
  return client.sIsMember(userLikesKey(userId), itemId);
};

export const likedItems = async (userId: string) => {
  // Fetch all the item Ids' from this user's liked set
  const ids = await client.sMembers(userLikesKey(userId));
  // Fetch all the item hashes with those ids and return as array
  return getItems(ids);
};

export const likeItem = async (itemId: string, userId: string) => {
  //해당 userId의 key를 가지고 있는 set에 itemId를 추가
  const inserted = await client.sAdd(userLikesKey(userId), itemId);
  if (inserted) {
    return client.hIncrBy(itemsKey(itemId), 'likes', 1);
  };
};

export const unlikeItem = async (itemId: string, userId: string) => {
  const removed = await client.sRem(userLikesKey(userId), itemId);
  if (removed) {
    return client.hIncrBy(itemsKey(itemId), 'likes', -1);
  }
};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {
  const ids = await client.sInter([userLikesKey(userOneId), userLikesKey(userTwoId)]);
  // Fetch all the item hashes with those ids and return as array 
  return getItems(ids);
};
