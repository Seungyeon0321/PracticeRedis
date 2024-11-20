import type { CreateItemAttrs } from '$services/types';

export const serialize = (attrs: CreateItemAttrs) => {
  return {
    ...attrs,
    // convert the date to a unix timestamp to make it easier to query from redis.
    createdAt: attrs.createdAt.toMillis(),
    endingAt: attrs.endingAt.toMillis(),
  };
};
