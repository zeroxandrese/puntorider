import { PrismaClient } from "@prisma/client";
import { startOfWeek, endOfWeek } from 'date-fns';

const prisma = new PrismaClient;

export const calculateEarnings = async () => {
    try {
        const now = new Date();
        const weekStart = startOfWeek(now, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

        const trips = await prisma.trip.findMany({
            where: {
                complete: true,
                discountApplied: true,
                created: {
                    gte: weekStart,
                    lte: weekEnd
                }
            }
        });

        const grouped: Record<string, {
            totalOffered: number;
            totalDiscounted: number; 
            totalDiscountDiff: number; 
        }> = {};
        trips.forEach(trip => {
            const driverId = trip.usersDriverId;

            if (!grouped[driverId]) {
                grouped[driverId] = {
                    totalOffered: 0,
                    totalDiscounted: 0,
                    totalDiscountDiff: 0
                };
            }

            const offered = trip.offeredPrice ?? trip.price ?? 0;
            const discounted = trip.priceWithDiscount ?? offered;

            grouped[driverId].totalOffered += offered;
            grouped[driverId].totalDiscounted += discounted;
            grouped[driverId].totalDiscountDiff += offered - discounted;
        });

        for (const driverId in grouped) {
            const { totalOffered, totalDiscounted, totalDiscountDiff } = grouped[driverId];

            await prisma.weeklyDriverEarnings.create({
                data: {
                    usersDriverId: driverId,
                    weekStart,
                    weekEnd,
                    totalOfferedPrice: totalOffered,
                    totalPriceWithDiscount: totalDiscounted,
                    totalDiscountDifference: totalDiscountDiff
                }
            });
        }

        return ({ ok: true, message: "Ganancia semanal calculada correctamente." });
    } catch (error) {
        console.error("❌ Error al calcular ganancias semanales:", error);
        return ({ ok: false, error: "Error interno del servidor" });
    }
};