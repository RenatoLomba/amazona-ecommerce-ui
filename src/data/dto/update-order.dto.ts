export class UpdateOrderDto {
  constructor(
    public isPaid?: boolean,
    public isDelivered?: boolean,
    public paidAt?: Date,
    public deliveredAt?: Date,
  ) {}
}
