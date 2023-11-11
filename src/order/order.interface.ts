export enum EPaymentMethod {
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

export enum EOrderStatus {
  PENDING,
  SHIPPING,
  DELIVERED,
  CANCELLED,
}

export enum EPaymentStatus {
  UNPAID,
  PAID,
  REFUNDING,
  REFUNDED,
}
