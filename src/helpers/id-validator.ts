import { Response, Request, NextFunction, RequestHandler  } from 'express';

interface AuthenticatedRequest extends Request {
    userAuth?: {
        uid: string;
    };
}


const idValidator: RequestHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => { 
    const uid = await req.userAuth;
    const id = req.params.id;

    const uid1 = JSON.stringify(uid?.uid);
    const uidUpdate = uid1.slice(1, -1);

    if (!req.userAuth) {
        res.status(500).json({
            msg: 'Se intenta validar el id sin validar token'
        });
        return;
    }

    try {
        if (id !== uidUpdate) {
            res.status(401).json({
                msg: 'El uid no corresponde'
            });
            return;
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'El uid no corresponde'
        });
    }
};

export default idValidator;
