import "dotenv/config";
import mongoose from "mongoose";

let conectionDB = false;

const dbConection = async (): Promise<void> =>{
    try {
        if (!conectionDB) {
            mongoose.set('strictQuery', true);
            console.log("Intentando conectar a la DB...");
            await mongoose.connect(process.env.MONGODB_CNN!);
            conectionDB = true
            console.log('Conectado a la DB desde Server PuntoRide hijo😎');
        }
    } catch (error) {
        console.log("Error detallado:", error);
        throw new Error("Error al iniciar la conexion con la DB2 desde Server PuntoRide");
        
    }

};
export { dbConection };
