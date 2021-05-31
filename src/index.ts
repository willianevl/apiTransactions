import express, { Request, Response } from 'express';
import User from './classes/user';
import Transaction from './classes/transaction';
import IUser from './interface/userInterface';
import validarAge from './middleware/md-age';
import validarCPF from './middleware/md-cpf';
import validarEmail from './middleware/md-email';
import validarNome from './middleware/md-name';
import { validate as uuidValidate } from "uuid";
import ITransaction from './interface/transactionInterface';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.listen(process.env.PORT || 3000);

app.get("/", (req: express.Request, res: express.Response) => {
    res.send(`
    <body style='margin:0;padding:0'>
        <div style='display: flex;justify-content: center;align-items: center; align-content: center;width:99vw;height:99vh'>
          <h1 style='font-size:60px;font-weigth:600'>🚀 API - Transações</h1>
        </div>
    </body>
    `);
  });

app.post("/users", validarNome, validarAge, validarCPF, validarEmail, (req: Request, res: Response) => {
    const { name, cpf, email, age }: IUser = req.body;

    const existe = users.find((f) => {
        return f.cpf === cpf;
    });
    
    if (existe) {
        return res.json({msg: `Usuário ${name} já cadastrado com CPF: ${existe.cpf}`});
    }

    const user = new User(name, cpf, email, age);
    users.push(user);

    return res.status(201).json({
        success: true,
        data: user,
    });
});

app.get("/users/:id", (req: Request, res: Response) => {
    const { id }: { id?: string } = req.params;

    if(!uuidValidate(id)){
        return res.status(400).json({
            msg: 'ID inválido'
        })
    }


    const user = users.find((f) => {
        return f.id === id;
    });

    if(!user){
        return res.status(404).json({
            msg: 'Usário não encontrado'
        });
    }

    return res.status(200).json({
        success: true,
        data: user?.getUser()
    });
});

app.get("/users", (req: Request, res: Response) => {
    return res.status(200).json({
        success: true,
        data: users.map((m) => {
            return m.getUser()
        })
    });
});

app.put("/users/:id", validarNome, validarAge, validarCPF, validarEmail, (req: Request, res: Response) => {
    const { id }: { id?: string; } = req.params;
    const { name, cpf, email, age}: IUser = req.body;

    const usuario = users.find((f) => {
        return f.id === id;
    })

    if(!usuario){
        return res.status(404).json({msg: 'Usuário não existe'})
    }

    usuario.name = name;
    usuario.cpf = cpf;
    usuario.age = age;
    usuario.email = email;

    return res.status(200).json({
        usuario: usuario
    });
});


app.delete("/users/:id", (req: Request, res: Response) => {
    const { id }: { id?: string; } = req.params;

    const indice = users.findIndex((f) => {
        return f.id === id;
    })

    if(indice === -1){
        return res.status(404).json({msg: 'Usuário não existe'})
    }

    const usuarioRemovido = users.splice(indice, 1);


    return res.status(200).json({
        usuario: usuarioRemovido
    });
});


app.post("/user/:userId/transactions", (req: Request, res: Response) => {
    const { userId }: { userId?: string } = req.params;

    const { title, value, type }: {
      title: string, value: number, type: string
    } = req.body;

    const usuario = users.find((f) => {
        return f.id === userId;
    })

    if(!usuario){
        return res.status(404).json({msg: 'Usuário não existe'})
    }

    let initialValue: number = 0;

    if ( type === 'income' ){
        initialValue += value;
    }
    if ( type === 'outcome' ){
        initialValue += value;
    }


    usuario.transactions.push(new Transaction(title, initialValue, type));

    return res.status(200).json({
        transactions: usuario.transactions,
    });
});

app.get("/user/:userId/transactions/:id", (req: Request, res: Response) => {
    const { userId, id }: { userId?: string, id?: string } = req.params;

    const usuario = users.find((f) => {
        return f.id === userId;
    })

    if(!usuario){
        return res.status(404).json({msg: 'Usuário não existe'})
    }

    const transaction = usuario.transactions.find((f) => {
        return f.id === id;
    });

    if(!transaction){
        return res.status(404).json({msg: 'Transação não encontrada'})
    }

    return res.status(200).json({
        transaction: transaction
    })
});

app.get("/users/:userId/transactions", (req: Request, res: Response) => {
    const { userId}: { userId?: string  } = req.params;

    const usuario = users.find((f) => {
        return f.id === userId;
    })

    if(!usuario){
        return res.status(404).json({msg: 'Usuário não existe'})
    }

      let total: number = 0;
      let totalIncome: number = 0;
      let totalOutcome: number = 0;
      usuario.transactions.forEach(({value, type}: {value: number, type: string}) => {
        switch(type) {
          case 'income':
            totalIncome += value
          break;
          case 'outcome':
            totalOutcome += value
          break;
        }
        total = totalIncome - totalOutcome;
      });

    return res.status(200).json({
        transactions: usuario.transactions,
        totalIncome: totalIncome,
        totalOutcome: totalOutcome,
        total: total
    });

});

app.put("/users/:userId/transactions/:id", (req: Request, res: Response) => {
    const { userId, id }: { userId?: string, id?: string; } = req.params;
    const { title, value, type}:    ITransaction = req.body;

    const usuario = users.find((f) => {
        return f.id === userId;
    })

    if(!usuario){
        return res.status(404).json({msg: 'Usuário não existe'})
    }

    const transaction = usuario.transactions.find((f: any) => {
        return f.id === id;
    });

    if(!transaction){
        return res.status(404).json({msg: 'Transação não encontrada'})
    }


    transaction.title = title;
    transaction.value = value;
    transaction.type = type;

    return res.status(200).json({
        transaction: transaction
    });
});


app.delete("/users/:userId/transactions/:id", (req: Request, res: Response) => {
    const { userId, id }: { userId?: string, id?: string; } = req.params;

    const usuario = users.find((f) => {
        return f.id === userId;
    })

    if(!usuario){
        return res.status(404).json({msg: 'Usuário não existe'})
    }

    const indice = usuario.transactions.findIndex((f: any) => {
        return f.id === id;
    })

    if(indice === -1){
        return res.status(404).json({msg: 'Transferência não encontrada'})
    }

    const transactionRemovida = usuario.transactions.splice(indice, 1);


    return res.status(200).json({
        usuario: transactionRemovida
    });
});


const users: Array<User> = [];