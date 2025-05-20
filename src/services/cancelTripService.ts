import { PrismaClient } from "@prisma/client";
import { redisClient } from '../config/redisConnection';
import { getSocketIO } from "../utils/initSocket";

import { cancelTripProps, userDriver } from '../interface/interface';
import { calculateDistance } from '../utils/calculateDistance';

const io = getSocketIO();

const prisma = new PrismaClient;

const cancelTripClientsPostService = async ({ tripId, uid }: cancelTripProps) => {
  try {

    const validationCalculateTrip = await prisma.calculateTrip.findFirst({
      where: {
        uid: tripId,
        usersClientId: uid,
      },
    });
console.log(validationCalculateTrip)
    if (validationCalculateTrip) {
      const tripCancelResponseService = await prisma.calculateTrip.update({
        where: {
          uid: validationCalculateTrip.uid,
        },
        data: {
          status: false,
          cancelForUser: true
        },
      });

      return tripCancelResponseService;
    };

    // Si no existe en calculateTrip
    const validation = await prisma.trip.findFirst({
      where: {
        uid: tripId,
        usersClientId: uid,
      },
    });
console.log(validation)
    if (!validation) {
      console.error("viaje no existe");
      return null;
    };

    const tripCancelResponseService = await prisma.trip.update({
      where: {
        uid: validation.uid,
      },
      data: {
        cancelForUser: true,
        status: false,
      },
    });

    await prisma.historyTripsClient.create({
      data: {
        usersClientId: tripCancelResponseService.usersClientId,
        tripId: tripCancelResponseService.uid,
        price: tripCancelResponseService.price,
        basePrice: tripCancelResponseService.basePrice,
        paymentMethod: tripCancelResponseService.paymentMethod,
        kilometers: tripCancelResponseService.kilometers,
        latitudeStart: tripCancelResponseService.latitudeStart,
        longitudeStart: tripCancelResponseService.longitudeStart,
        latitudeEnd: tripCancelResponseService.latitudeEnd,
        longitudeEnd: tripCancelResponseService.longitudeEnd,
        addressStart: tripCancelResponseService.addressStart,
        addressEnd: tripCancelResponseService.addressEnd,
        hourStart: tripCancelResponseService.hourStart,
        hourEnd: new Date().toString(),
        discountCode: tripCancelResponseService.discountCode,
        discountApplied: tripCancelResponseService.discountApplied,
        vehicle: tripCancelResponseService.vehicle,
        cancelForUser: true,
      },
    });
console.log(tripCancelResponseService.usersDriverId,"uiid del driver desde el cancel")
    io.to(tripCancelResponseService.usersDriverId).emit("trip_canceled", {
      tripId: tripCancelResponseService.uid,
    });

    const socketsInTripRoom = await io.in(tripCancelResponseService.uid).fetchSockets();

    if (!redisClient.isOpen) {

      await redisClient.connect();
    }

    const pendingDriversStr = await redisClient.get(`pendingTrip:${tripId}`);
    const pendingDrivers: string[] = pendingDriversStr ? JSON.parse(pendingDriversStr) : [];

    await redisClient.del(`pendingTrip:${tripId}`);

    for (const driver of pendingDrivers) {
        await redisClient.sRem(`availableTripsForDriver:${driver}`, tripId);
    }


    for (const socket of socketsInTripRoom) {
      socket.leave(tripCancelResponseService.uid);
    }

    return tripCancelResponseService;
  } catch (err) {
    console.error("Error en el servicio del user:", err);
    throw new Error("Error al cancelar el viaje del usuario");
  }
};

const cancelTripDriverPostService = async ({ tripId, uid }: cancelTripProps) => {
  try {
    // 1. Actualizar el estado del viaje (cancelado por el conductor)
    const updatedTrip = await prisma.trip.update({
      where: {
        uid: tripId,
        usersDriverId: uid
      },
      data: {
        cancelForDriver: true,
        status: false
      }
    });

    // 2. Buscar datos del viaje original
    const tripDataFind = await prisma.calculateTrip.findUnique({
      where: { uid: updatedTrip.tripCalculateId }
    });

    if (!tripDataFind) {
      console.error("No se encontraron datos del viaje para reenviar.");
      return { success: false, message: "No se encontró el viaje para reenviar." };
    }

    // 3. Buscar conductores cercanos
    const keys = await redisClient.keys('positionDriver:*');

    if (keys.length === 0) {
      console.error("No hay conductores disponibles.");
      return { success: false, message: "No hay conductores disponibles." };
    }

    const positions = await Promise.all(
      keys.map(async (key) => {
        try {
          const data = await redisClient.get(key);
          if (!data) return null;
          const parsedData = JSON.parse(data);
          return { userId: key.replace('positionDriver:', ''), position: parsedData };
        } catch (error) {
          console.error(`❌ Error en Redis para ${key}:`, error);
          return null;
        }
      })
    );

    const validPositions = positions.filter((p) => p !== null) as {
      userId: string;
      position: { latitude: number; longitude: number; vehicleType: string }
    }[];

    const requiredVehicleType = tripDataFind.vehicle;

    if (!requiredVehicleType) {
      console.error("Tipo de vehículo no especificado.");
      return { success: false, message: "Tipo de vehículo no especificado." };
    }

    const filteredByVehicle = validPositions.filter(driver => driver.position.vehicleType === requiredVehicleType);

    if (filteredByVehicle.length === 0) {
      console.error("No hay conductores con el vehículo correcto.");
      return { success: false, message: "No hay conductores disponibles del tipo solicitado." };
    }

    const distances = await Promise.all(
      filteredByVehicle.map(async (driver) => {
        const { distance, estimatedArrival } = await calculateDistance(
          tripDataFind.latitudeStart,
          tripDataFind.longitudeStart,
          driver.position.latitude,
          driver.position.longitude
        );

        return { driver: driver.userId, distance, estimatedArrival };
      })
    );

    const reasonableDistance = 12; // km
    const driversInRange = distances.filter(driver => driver.distance <= reasonableDistance);

    if (driversInRange.length === 0) {
      console.error("No hay conductores dentro del rango.");
      return { success: false, message: "No hay conductores dentro del rango." };
    }

    // 4. Guardar nuevamente conductores pendientes
    await redisClient.set(`pendingTrip:${tripDataFind.uid}`, JSON.stringify(driversInRange.map(d => d.driver)));

    // 5. Emitir notificación a cada conductor
    driversInRange.forEach((driver) => {
      io.to(driver.driver).emit("new_trip_request", {
        tripId: tripDataFind.uid,
        origin: {
          lat: tripDataFind.latitudeStart,
          lng: tripDataFind.longitudeStart,
          address: tripDataFind.addressStart,
        },
        destination: {
          lat: tripDataFind.latitudeEnd,
          lng: tripDataFind.longitudeEnd,
          address: tripDataFind.addressEnd,
        },
        price: tripDataFind.price,
        estimatedArrival: driver.estimatedArrival,
      });
    });

    return { success: true, message: "Viaje reenviado a nuevos conductores." };

  } catch (err) {
    console.error("Error en el servicio de cancelación y reenvío:", err);
    throw new Error("Error en el servicio de cancelación.");
  }
};

const rejectedTripDriverPostService = async ({ tripId, uid }: cancelTripProps) => {

  try {

    const rejectedTripDriverResponse = await prisma.rejectedTripForDriver.create({
      data: {
        usersDriverId: uid,
        tripId: tripId
      }
    })

    return rejectedTripDriverResponse

  } catch (err) {
    throw new Error("Error en el servicio del user");

  }
};

export { cancelTripDriverPostService, cancelTripClientsPostService, rejectedTripDriverPostService };
