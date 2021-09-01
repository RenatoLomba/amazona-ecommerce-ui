export class UpdateUserDto {
  constructor(
    public name?: string,
    public email?: string,
    public password?: string,
  ) {}
}
