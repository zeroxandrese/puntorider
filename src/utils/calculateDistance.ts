import DistanceApi from '../config/apiConnectionDistance';

const calculateDistance = async (lat1: number, lon1: number, lat2: number, lon2: number) => {
    try {
        const params = {
            origins: `${lat1},${lon1}`,
            destinations: `${lat2},${lon2}`,
        };

        const response = await DistanceApi.get('/json', { params });

        const data = response.data;

        // Validación de response
        if (data.rows && data.rows[0] && data.rows[0].elements[0].status === "OK") {
            const distance = data.rows[0].elements[0].distance.text;
            const duration = data.rows[0].elements[0].duration.text;

            const distanceValue = parseFloat(distance.replace(' km', '').replace(',', ''));

            return {
                distance: distanceValue,
                estimatedArrival: duration
            };
        } else {
            throw new Error('No se pudo calcular la distancia y duración.');
        }
    } catch (error) {
        console.error("Error al calcular la distancia:", error);
        throw error;
    }
};

export { calculateDistance };