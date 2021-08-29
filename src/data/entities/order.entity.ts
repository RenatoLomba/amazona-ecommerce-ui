import { OrderItem } from './order-item.entity';
import { ShippingAddress } from './shipping-address';

export type Order = {
  isDelivered: boolean;
  isPaid: boolean;
  _id: string;
  user: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  paidAt?: Date;
  deliveredAt?: Date;
};
