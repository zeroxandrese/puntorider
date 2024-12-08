import { redisClient } from '../config/redisConnection';

import { positionDriverProps, genericIdProps } from '../interface/interface';

const positionDriverGetService = async () => {

    const keys = await redisClient.keys('positionDriver:*');
    
    // Recuperar las posiciones
    const positions = await Promise.all(
      keys.map(async (key) => {
        const data = await redisClient.get(key);
        return { userId: key.replace('positionDriver:', ''), position: JSON.parse(data || '{}') };
      })
    );
    
    return positions;
  };

const positionDriverPostService = async ({ latitude, longitude, usersDriverId }: positionDriverProps) => {

    const key = `positionDriver:${usersDriverId}`;
    const data = { latitude, longitude, usersDriverId };

    // Guardado en redis
    const reponsePositionDriver = await redisClient.set(key, JSON.stringify(data));

    if (reponsePositionDriver) {
        return reponsePositionDriver;
      }
      return { message: 'No position data found for this user' };

};

const positionDriverDeleteService = async ({ id }: genericIdProps) => {

    const key = `positionDriver:${id}`;
    const deleted = await redisClient.del(key);

    if (deleted) {
        return { message: `Position data with ID ${id} deleted successfully` };
      }
      return { message: `No position data found with ID ${id}` };

};

export { positionDriverPostService, positionDriverDeleteService, positionDriverGetService };
