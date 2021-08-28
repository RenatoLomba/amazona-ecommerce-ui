import nookies from 'nookies';
import { API_URL } from '../../utils/constants';
import { OrderDto } from '../dto/order.dto';
import { Order } from '../entities/order.entity';

class OrderService {
  async saveOrder(order: OrderDto): Promise<Order> {
    const { USER_TOKEN } = nookies.get(null);

    if (!USER_TOKEN) throw new Error('Unauthorized request');

    order.shippingPrice =
      order.shippingPrice === 0 || order.shippingPrice < 0
        ? 0.1
        : order.shippingPrice;

    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + USER_TOKEN,
      },
      body: JSON.stringify(order),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data;
  }
}

const orderService = new OrderService();

export { orderService };
