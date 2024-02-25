export default class User {
  constructor(
    public id: number,
    public name: string,
    public password: string,
    public connectionId: string
  ) {}
}
