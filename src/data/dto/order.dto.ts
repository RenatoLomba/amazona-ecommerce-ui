import { OrderItem } from '../entities/order-item.entity';
import { ShippingAddress } from '../entities/shipping-address';

export class OrderDto {
  constructor(
    public orderItems: OrderItem[],
    public shippingAddress: ShippingAddress,
    public paymentMethod: string,
    public itemsPrice: number,
    public shippingPrice: number,
    public taxPrice: number,
    public totalPrice: number,
  ) {}
}
