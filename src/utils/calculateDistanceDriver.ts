import { redisClient } from '../config/redisConnection';

import { calculationEstimatedArrivalProps } from '../interface/interface';
import DistanceApi from '../config/apiConnectionDistance';

const getDriverLocation = async (driverId: string) => {
    const location = await redisClient.get(`positionDriver:${driverId}:location`);
    if (!location) throw new Error('Driver location not found');
    return JSON.parse(location);
  };

  const calculationEstimatedArrival = async ({ driverId, latitude, longitude }: calculationEstimatedArrivalProps) => {
    try {
        const driverLocation = await getDriverLocation(driverId);

        if (!driverLocation.lat || !driverLocation.lng) {
            throw new Error('Invalid driver location coordinates');
        }

        // Construccion parametros para API Distance
        const params = {
            origins: `${driverLocation.lat},${driverLocation.lng}`,
            destinations: `${latitude},${longitude}`,
        };

        const response = await DistanceApi.get('/json', { params });

        // Extraccion de resultados
        const data = response.data;
        if (data.rows && data.rows[0] && data.rows[0].elements[0].status === "OK") {
            const distance = data.rows[0].elements[0].distance.text;
            const duration = data.rows[0].elements[0].duration.text;

            return {
                distance,
                estimatedArrival: duration,
            };
        } else {
            throw new Error('Unable to calculate distance and duration');
        }
    } catch (error) {
        throw error;
    }
};

export { calculationEstimatedArrival };

