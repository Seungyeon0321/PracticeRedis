export const pageCacheKey = (id: string) => `pagecache#${id}`;
export const userKey = (userId: string) => `user#${userId}`;
export const sessionKey = (sessionId: string) => `session#${sessionId}`;
export const itemsKey = (date: string) => `items#${date}`;
export const usernamesUniqueKey = () => `usernames:unique`;
export const userLikesKey = (userId: string) => `user:likes#${userId}`;
export const usernamesKey = () => `usernames`;
