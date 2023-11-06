export enum PaymentMethod {
  COD,
  MOMO,
}

export interface OrderProduct {
  productId: string;
  name: string;
  image: string;
  price: string;
  quantity: number;
}
