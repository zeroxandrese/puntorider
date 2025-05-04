import { getSocketIO } from "../utils/initSocket";

const io = getSocketIO();

export const simulateDriverPositions = async ({
    driverId,
    polyline,
    userIdClient
}: {
    driverId: string;
    polyline: { latitude: number; longitude: number }[];
    userIdClient: string;
}) => {
    try {
        if (polyline.length < 3) {
            console.error("❌ No hay suficientes puntos en la polyline.");
            return;
        }

        const testPoints = [
            polyline[polyline.length - 1],
            polyline[Math.floor(polyline.length / 2)],
            polyline[0]
        ];

        testPoints.forEach((point, index) => {
            setTimeout(() => {
                io.to(driverId).emit("driver_location_update", { position: point });
                io.to(userIdClient).emit("client_driver_update", { position: point });
                console.log(`📍 Emitido punto ${index + 1}:`, point);
            }, 20000 * index); 
        });
    } catch (error) {
        console.error("❌ Error en simulateDriverPositions:", error);
    }
};