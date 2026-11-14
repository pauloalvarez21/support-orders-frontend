
export enum OrderStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CANCELLED = 'CANCELLED'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum Category {
  PAYMENT = 'PAYMENT',
  TECHNICAL = 'TECHNICAL',
  ACCOUNT = 'ACCOUNT',
  OTHER = 'OTHER'
}

export enum Channel {
  MOBILE_APP = 'MOBILE_APP',
  WEB = 'WEB',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE'
}

export interface CreateOrderRequest {
  externalReference: string;
  customerId: string;
  category: Category;
  description: string;
  channel: Channel;
  priority: Priority;
}

export interface UpdateStatusRequest {
  status: OrderStatus;
}

export interface OrderResponse {
  id: number;
  externalReference: string;
  customerId: string;
  category: Category;
  description: string;
  channel: Channel;
  priority: Priority;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderSummary {
  id: number;
  externalReference: string;
  category: Category;
  priority: Priority;
  status: OrderStatus;
  createdAt: string;
}

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  fieldErrors?: Record<string, string>;
}