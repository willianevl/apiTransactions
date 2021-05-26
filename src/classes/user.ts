import { v4 as uuid } from 'uuid';
import Transaction from './transaction';

class User {
    public id: string;
    public name: string;
    public cpf: string;
    public email: string;
    public age: number;
    public transactions: Array<Transaction>;

    constructor(
        name: string, 
        cpf: string,
        email: string,
        age: number
    ){
        this.id = uuid();
        this.name = name;
        this.cpf = cpf;
        this.email = email;
        this.age = age;
        this.transactions = [];
    }

    getUser() {
        return {
          id: this.id,
          name: this.name,
          email: this.email,
          age: this.age,
          cpf: this.cpf,
        };
      }
}

export default User;