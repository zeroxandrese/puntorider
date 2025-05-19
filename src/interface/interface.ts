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
  uid: string,
  name: string,
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
  password: string,
  code: string
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
  usersClient?: UserClient; // Relación con UsersClient (opcional si no siempre se incluye)
  trip?: TripPost; // Relación con Trip (opcional si no siempre se incluye)
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
  vehicle?: string;
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
  discountApplied: boolean;
  offeredPrice?: number;
  paymentMethod: string;
  vehicle: string;
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

export interface referredCodeProps {
  id: string,
  code: string
}

export interface calculationEstimatedArrivalProps {
  latitude: number,
  longitude: number,
  driverId: string
}

export interface shipmentPostProps {
  latitudeStart: number,
  longitudeStart: number,
  latitudeEnd: number,
  longitudeEnd: number,
  usersDriverId: string
}

export interface shipmentPutProps {
  latitudeStart: number,
  longitudeStart: number,
  latitudeEnd: number,
  longitudeEnd: number,
  usersDriverId: string,
  statusDelivery?: string,
  id: string,
  note: string
}

export interface phoneNumberProps {
  phoneNumber: number,
}

export interface validationCodeProps {
  uid: string
  code: string,
  codeSecurity: string,
}

export interface validationCodePropsGeneric {
  code: string,
  codeSecurity: string,
}

export interface userDriver {
  uid: string,
  name: string,
  lastName: string | null,
  numberPhone: string,
  email: string,
  password: string,
  status:boolean,
  google :boolean,
  img: string | null,
  profile: string,
  created: Date | null
}

export interface vehicle {
  uid: string,
  model: string | null,
  usersDriverId: string | null,
  brand: string | null,
  year: number,
  register: string | null,
  color:string,
}

export interface contactUsProps{
  uid: string,
  comment: string
}

export interface clientsSurveysProps{
  tripId: string,
  feedback?: string,
  score: number,
  usersClientId: string
}

export interface DriversSurveysProps{
  tripId: string,
  feedback?: string,
  score: number,
  usersDriverId: string
}

export interface cancelTripProps {
  tripId: string,
  uid: string
}

export interface PropsPutCalculateTripOfferedPrice {
  tripId: string,
  uid: string,
  offeredPrice: number,
  discountCode: string
}

export interface PropsDeleteCalculateTrip {
  tripId: string,
  uid: string
}

export interface TokenNotificationProps {
  fcmToken: string,
  uid: string
}

export interface locationDriverProps {
  latitude: number,
  longitude: number,
  uid: string
}

