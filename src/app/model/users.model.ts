export class User {
  constructor(
    public primaryKey?: string,
    public body?: {
    
      UserName?: string;
      Name?: string;
      SurName?: string;
      email?: string;
      password?: string;
      contactMessage?: boolean;
      UsersType?: string;
      UsersTypeId?: number;
    }
  ) {}
}
