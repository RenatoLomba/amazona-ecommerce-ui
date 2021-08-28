import { OrderItem } from './order-item.entity';
import { ShippingAddress } from './shipping-address';

export type Order = {
  isDelivered: boolean;
  isPaid: boolean;
  _id: string;
  user: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paidAt?: Date;
  deliveredAt?: Date;
};
