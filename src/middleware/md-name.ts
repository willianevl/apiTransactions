import { Request, Response, NextFunction } from 'express';

function validarNome(
    req: Request,
    res: Response,
    next: NextFunction
){
    const { name }: { name: string } = req.body;

    if(!name) {
        return res.status(400).json({
            msg: 'O nome deve ser preenchido'
        });
    }


    if(name.trim().length < 3){
        return res.status(400).json({
            msg: 'O nome deve conter ao menos 3 caracteres'
        });
    }

    next();
}

export default validarNome;