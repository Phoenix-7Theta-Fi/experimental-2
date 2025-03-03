export interface User {
  id: number;
  email: string;
  role: 'patient' | 'practitioner';
  username: string;
  name: string;
  avatar_url: string;
}

export interface Tweet {
  id: number;
  user_id: number;
  content: string;
  tag: string;
  created_at: string;
  user?: User;
  likes_count?: number;
  liked_by_user?: boolean;
}

export interface Like {
  id: number;
  tweet_id: number;
  user_id: number;
  created_at: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Appointment {
  id: number;
  practitioner_id: number;
  patient_id: number;
  date: string;
  time_slot: string;
  status: AppointmentStatus;
  created_at: string;
  practitioner?: User;
  patient?: User;
}

export type TimeSlot = {
  time: string;
  available: boolean;
};

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'Herbs' | 'Supplements';
  image_url: string;
  stock: number;
}

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  product?: Product;
}
