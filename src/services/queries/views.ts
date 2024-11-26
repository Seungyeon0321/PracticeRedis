import { client } from '$services/redis';
import {
  itemsKey,
  itemsByViewsKey,
  itmesViewsKey
} from '$services/keys';

export const incrementView = async (itemId: string, userId: string) => {
  const inserted = await client.pfAdd(itmesViewsKey(itemId), userId);

  if (inserted) {
  return Promise.all([
    client.hIncrBy(itemsKey(itemId), 'views', 1),
    client.zIncrBy(itemsByViewsKey(), 1, itemId)
  ])
  }
;
};
