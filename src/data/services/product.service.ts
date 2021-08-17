import { API_URL } from '../../utils/constants';
import { Product } from '../entities/product.entity';

class ProductService {
  async products(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data;
  }
}

const productService = new ProductService();

export { productService };
