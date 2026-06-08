
import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};

export const getCachedData = async (key: string) => {
    await connectRedis();
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
};

export const setCachedData = async (key: string, data: any, expirationInSeconds: number) => {
    await connectRedis();
    await redisClient.set(key, JSON.stringify(data), { EX: expirationInSeconds });
};
