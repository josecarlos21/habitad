
export type ID = string;
export type Currency = "MXN";

export interface User {
  id: ID;
  name: string;
  email?: string;
  phone?: string;
  role: "resident" | "admin" | "guard";
  units: Unit[];
  imageUrl?: string;
}

export interface Unit {
  id: ID;
  tower: string;
  number: string;
}

export interface Invoice {
  id: ID;
  unitId: ID;
  concept: string;
  amount: number;
  currency: Currency;
  dueDate: string; // ISO
  status: "pending" | "paid" | "overdue";
}

export interface Payment {
  id: ID;
  invoiceId: ID;
  method: "card" | "spei" | "cash" | "applepay" | "webpay";
  amount: number;
  createdAt: string; // ISO
  status: "succeeded" | "failed" | "processing";
  receiptUrl?: string;
}

export interface Ticket {
    id: string;
    title: string;
    description: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    category: 'plumbing' | 'electrical' | 'common_area' | 'amenity' | 'other';
    unitId: string;
    createdAt: string; // ISO
}

export interface Amenity {
  id: ID;
  name: string;
  description: string;
  image: string;
  rules?: string;
  requiresDeposit: boolean;
  depositAmount?: number;
}

export interface Booking {
  id: ID;
  amenityId: ID;
  userId: ID;
  slot: { start: string; end: string }; // ISO
  status: "confirmed" | "cancelled";
}

export interface VisitorPass {
  id: ID;
  userId: ID;
  visitorName: string;
  validFrom: string; // ISO
  validTo: string; // ISO
  qrToken: string;
}

export interface Parcel {
  id: ID;
  unitId: ID;
  carrier: string;
  trackingNumber: string;
  arrivedAt: string; // ISO
  status: "at_guard" | "picked_up";
}

export interface Announcement {
  id: ID;
  title: string;
  body: string;
  category: "admin" | "security" | "maintenance" | "event";
  createdAt: string; // ISO
  pinned: boolean;
}

export interface Assembly {
  id: ID;
  title: string;
  date: string; // ISO
  status: "active" | "past";
  topics: string[];
  docs: { name: string; url: string }[];
  vote?: Vote;
}

export interface Vote {
  id: ID;
  assemblyId: ID;
  question: string;
  options: string[];
  status: "open" | "closed";
}

export interface NotificationPref {
  userId: ID;
  channels: { push: boolean; email: boolean };
  categories: {
    finance: boolean;
    security: boolean;
    bookings: boolean;
    maintenance: boolean;
    community: boolean;
  };
}

export interface Notification {
    id: ID;
    userId: ID;
    category: 'announcement' | 'maintenance' | 'community' | 'parcels';
    title: string;
    description: string;
    createdAt: string; // ISO
    read: boolean;
    link?: string;
}

export interface FaqItem {
    question: string;
    answer: string;
}

    