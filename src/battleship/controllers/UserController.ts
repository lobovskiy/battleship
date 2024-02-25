import User from '../models/User';

export default class UserController {
  private users: User[] = [];

  private lastId = 1;

  public registerUser(name: string, password: string, connectionId: string) {
    return (
      this.users.find(
        (user) => user.name === name && user.password === password
      ) || this.createNewUser(name, password, connectionId)
    );
  }

  public getWinners() {
    return this.users.map((user) => ({
      name: user.name,
      wins: user.wins,
    }));
  }

  private createNewUser(name: string, password: string, connectionId: string) {
    const id = this.lastId++;
    const newUser = new User(id, name, password, connectionId);

    this.users.push(newUser);

    return newUser;
  }
}
