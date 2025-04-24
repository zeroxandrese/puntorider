import orsDistanceApi from '../config/apiConnectionORS';

const orsCalculateDistance = async (lat1: number, lon1: number, lat2: number, lon2: number) => {
    try {
        const body = {
            coordinates: [
                [lon1, lat1], // ORIGEN: 
                [lon2, lat2], // DESTINO: 
            ],
            format: 'geojson',
        };

        const response = await orsDistanceApi.post('/geojson', body);
        const data = response.data;

        const summary = data.features[0].properties.summary;
        const distanceInKm = summary.distance / 1000;
        const durationInMin = summary.duration / 60;

        // Coordenadas para el polyline
        const polylineCoordinates = data.features[0].geometry.coordinates.map(([lon, lat]: [number, number]) => ({
            latitude: lat,
            longitude: lon,
        }));

        return {
            distance: distanceInKm,
            duration: durationInMin,
            polyline: polylineCoordinates,
        };

    } catch (error) {
        console.error("Error al calcular la distancia:", error);
        throw error;
    }
};

export { orsCalculateDistance };