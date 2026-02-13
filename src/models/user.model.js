import { v4 as uuidv4 } from 'uuid';//user ids no dulpicates

export default class UserModel {

    constructor(name, email, password) {
        this.id = uuidv4();
        this.name = name;
        this.email = email;
        this.password = password; 
    }

    static users = [];

    static getAll() {
        return this.users;
    }

    static add(name, email, password) {
        const newUser = new UserModel(name, email, password);
        this.users.push(newUser);
        return newUser;
    }

    static findByEmail(email) {
        return this.users.find(u => u.email === email);
    }

    static login(email, password) {
        const user = this.findByEmail(email);
        if (user && user.password === password) {
            return user;
        }
        return null;
    }
}
