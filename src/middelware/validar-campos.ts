import { Response, Request, NextFunction  } from "express";
import { validationResult } from "express-validator";

const validarCampos = (req: Request, res: Response, next: NextFunction): void => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
        res.status(400).json(erros);
        return;
    }
    next();
};

export { validarCampos };