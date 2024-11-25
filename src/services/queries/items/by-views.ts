import { client } from "$services/redis";
import { itemsByViewsKey, itemsKey } from "$services/keys";
import { deserialize } from "./deserialize";

export const itemsByViews = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {

	let result: any= await client.sort(
    itemsByViewsKey(),
    {
      GET: [
        '#',
        `${itemsKey('*')}->name`,
        `${itemsKey('*')}->views`,
        `${itemsKey('*')}->endingAt`,
        `${itemsKey('*')}->imageUrl`,
        `${itemsKey('*')}->price`
      ],
      BY: 'nosort',
      DIRECTION: order,
      LIMIT: {
        offset,
        count
      }
    }
  )

  const items = [];

  while (result.length) {
    const [id, name, views, endingAt, imageUrl, price, ...rest] = result.splice(0, 6);
    const item = deserialize(id, {name, views, endingAt, imageUrl, price});
    items.push(item);
    result = rest;
  }

  return items;
};

