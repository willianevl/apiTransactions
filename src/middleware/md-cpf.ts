import { Request, Response, NextFunction } from 'express';

function validarCPF(
    req: Request,
    res: Response,
    next: NextFunction
){
    const { cpf }: { cpf: string } = req.body;

    if(!cpf) {
        return res.status(400).json({
            msg: 'O CPF deve ser preenchido'
        });
    }


    if(cpf.length !== 11){
        return res.status(400).json({
            msg: 'CPF inválido'
        });
    }

    next();
}

export default validarCPF;