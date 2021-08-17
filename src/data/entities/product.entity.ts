export class Product {
  constructor(
    public _id: string,
    public name: string,
    public category: string,
    public image: string,
    public price: number,
    public brand: string,
    public description: string,
    public numReviews: number,
    public rating: number,
    public countInStock: number,
  ) {}
}
