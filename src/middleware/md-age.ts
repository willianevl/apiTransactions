import { Request, Response, NextFunction } from 'express';

function validarAge(
    req: Request,
    res: Response,
    next: NextFunction
){
    const { age }: { age: number } = req.body;

    if(!age) {
        return res.status(400).json({
            msg: 'A idade deve ser preenchida'
        });
    }


    if(age < 0){
        return res.status(400).json({
            msg: 'Idade inválida'
        });
    }

    next();
}

export default validarAge;