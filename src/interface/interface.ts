export interface User {
    id: string;
    name: string;
    password?: string | null;
};

export interface UserClientCreate {
    numberPhone: string;
};

export interface UserClientUpdate {
    numberPhone: string;
    email: string;
    name: string;
    uid: string
};

export interface UserDriverUpdate {
    numberPhone: string;
    email: string;
    name: string;
    uid: string;
    lastName?: string;
};

export interface UserClientUID {
    uid: string
};

export interface JwtPayload {
    id: string;
};

export interface UserClient {
    uid: String,
    name: String,
    numberPhone: string,
    email: string,
    status: boolean,
    google: boolean,
    img: string,
    googleUserId: string,
    created: string
}

export interface UIDObject {
    uid: UserClient
}

export interface DriverUserPost {
    email: string,
    password: string
}

export interface PropsLogin {
    numberPhone: string
}

export interface PropsLoginDriver {
    email: string,
    password: string
}

export interface commentsClientsProps {
    comment: string, 
    usersClientId: string, 
    tripId: string, 
}

export interface commentsDriverProps {
    comment: string, 
    usersDriverId: string, 
    tripId: string, 
}

export interface commentsClientsPutProps {
    id: string,
    comment: string 
}

export interface commentsClientsDeleteProps { 
    id: string 
}

export interface tripDeleteProps { 
    id: string 
}

export interface tripPutProps { 
    complete?: boolean,
    paid?: boolean,
    id: string,
    cancelForUser: boolean
}

export interface CommentsClient {
    uid: string; // Identificador único, equivalente a _id en MongoDB
    usersClientId: string; // ID del usuario cliente
    tripId: string; // ID del viaje
    comment: string; // Texto del comentario
    usersClient?: UsersClient; // Relación con UsersClient (opcional si no siempre se incluye)
    trip?: TripPost; // Relación con Trip (opcional si no siempre se incluye)
  }

  export interface UsersClient {
    uid: string; // Identificador único del usuario cliente
    name: string; // Nombre del cliente
    numberPhone?: string; // Número de teléfono (opcional)
    email?: string; // Correo electrónico (opcional)
    status: boolean; // Estado del cliente (activo/inactivo)
    google: boolean; // Indica si se registró con Google
    img?: string; // URL de la imagen del cliente (opcional)
    googleUserId?: string; // ID del usuario de Google (opcional)
    created: Date; // Fecha de creación
  
    // Relaciones
    //userLevels?: UserLevel[]; // Niveles del usuario
    //commentsClient?: CommentsClient[]; // Comentarios del cliente
    //trip?: Trip[]; // Viajes asociados al cliente
    //discountCode?: DiscountCode[]; // Códigos de descuento del cliente
    //favoritePlace?: FavoritePlace[]; // Lugares favoritos del cliente
    //scheduledTrip?: ScheduledTrip[]; // Viajes programados del cliente
    //reportClient?: ReportClient[]; // Reportes relacionados con el cliente
    //historyTripsClient?: HistoryTripsClient[]; // Historial de viajes del cliente
    //paymentMethod?: PaymentMethod[]; // Métodos de pago del cliente
    //notifications?: NotificationsClient[]; // Notificaciones asociadas al cliente
  }

  export interface TripPost {
    uid?: string; // Identificador único del viaje
    usersClientId: string; // ID del usuario cliente relacionado
    usersDriverId: string; // ID del conductor relacionado
    complete?: boolean; // Indica si el viaje está completo
    paid?: boolean; // Indica si el viaje está pagado
    price: number; // Precio del viaje
    paymentMethod: string; // Método de pago utilizado
    kilometers: number; // Kilómetros recorridos
    latitudeStart: number; // Latitud de inicio
    longitudeStart: number; // Longitud de inicio
    latitudeEnd: number; // Latitud de destino
    longitudeEnd: number; // Longitud de destino
    addressStart: string; // Dirección de inicio
    addressEnd: string; // Dirección de destino
    hourStart: string; // Hora de inicio
    hourEnd: string; // Hora de finalización
    discountCode?: string; // Código de descuento aplicado (opcional)
    status?: boolean; // Estado del viaje (activo/inactivo)
    created?: Date; // Fecha de creación
  
    // Relaciones
    //usersClient?: UsersClient; // Relación con el cliente
    //usersDriver?: UsersDriver; // Relación con el conductor
    //commentsClient?: CommentsClient[]; // Comentarios del cliente
    //commentsDriver?: CommentsDriver[]; // Comentarios del conductor
  }

  export interface tripCalculateInterface {
    latitudeStart: string; 
    longitudeStart: string; 
    latitudeEnd: string;
    longitudeEnd: string;
    discountCode: string;
    paymentMethod: string;
    uid: string;
  }

  export interface discountCodePostProps {
    percentage: number;
    usersClientId: string;
    code: string
  }

  export interface positionDriverProps {
    latitude: string;
    longitude: string;
    usersDriverId: string;
  }

  export interface genericIdProps {
    id: string;
  }

  export interface favoritePlaceProps {
    latitude: number;
    longitude: number;
    usersClientId: string;
  }

  export interface scheduledTripPutProps {
    id: string,
    cancelForUser: boolean
  }

  export interface reportClientsPostProps {
    id: string,
    comment: string 
}

