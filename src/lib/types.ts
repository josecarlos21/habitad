
export type Role =
  | 'SUPER_ADMIN'
  | 'ADMIN_EXT'
  | 'ADMIN_INT'
  | 'COMMITTEE'
  | 'SECURITY'
  | 'MAINT'
  | 'RESIDENT';

// --- Base Entities ---

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  language: string;
  isVerified: boolean;
}

export interface UserCondoProfile {
  id: string; // From document id
  userId: string;
  condoId: string;
  role: Role;
  unitIds: string[];
  occupantType: 'OWNER' | 'TENANT' | 'FAMILY' | 'GUEST_REGISTERED';
  isVotingMember: boolean;
  imageUrl?: string; // Kept for UI consistency from old mock
  name: string; // Kept for UI consistency from old mock
  email: string; // Kept for UI consistency from old mock
  units: Unit[]; // Kept for UI consistency
}

export interface Condo {
  id: string;
  name: string;
  legalName?: string;
  address: string;
  city: string;
  country: string;
  timeZone: string;
  currency: string;
  settings: CondoSettings;
}

export interface Unit {
  id: string;
  condoId: string;
  code: string;
  type: 'APARTMENT' | 'HOUSE' | 'PARKING' | 'STORAGE';
  areaM2?: number;
  isActive: boolean;
  tower: string; // Kept for UI consistency
  number: string; // Kept for UI consistency
}

export interface CondoSettings {
  allowTenantsToVote: boolean;
  lateFeePolicy?: unknown; // Define LateFeePolicy if needed
  allowsOnlinePayments: boolean;
  offlineFirstEnabled: boolean;
}

// --- Finance Module ---

export type ChargeType = 'MAINTENANCE' | 'EXTRAORDINARY' | 'AMENITY' | 'FINE';
export type ChargeStatus = 'OPEN' | 'PARTIALLY_PAID' | 'SETTLED' | 'CANCELLED';

export interface Charge {
  id: string;
  condoId: string;
  unitId: string;
  type: ChargeType;
  description: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: ChargeStatus;
  createdAt: string;
  updatedAt: string;
}

export type PaymentStatus = 'PENDING_VERIFICATION' | 'PAID' | 'REJECTED';
export type PaymentMethod = 'CARD' | 'CASH' | 'MANUAL_TRANSFER';

export interface Payment {
  id: string;
  condoId: string;
  chargeId: string;
  userId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  paidAt?: string;
  evidenceUrl?: string;
  reference?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Incidents/Maintenance Module ---

export type IncidentPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_EXTERNAL' | 'RESOLVED' | 'CANCELLED';

export interface Incident {
  id: string;
  condoId: string;
  unitId?: string;
  createdBy: string;
  title: string;
  description: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export type WorkOrderStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface WorkOrder {
  id: string;
  condoId: string;
  incidentId?: string;
  assignedToUserId?: string;
  title: string;
  description: string;
  status: WorkOrderStatus;
  scheduledAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Security & Access ---

export type AccessResult = 'GRANTED' | 'DENIED';

export interface Visitor {
  id: string;
  condoId: string;
  name: string;
  idNumber?: string;
  plateNumber?: string;
  hostUserId: string;
  unitId: string;
  expectedAt?: string;
}

export interface VisitorPass {
  id: string;
  condoId: string;
  userId: string;
  visitorName: string;
  validFrom: string;
  validTo: string;
  qrToken: string;
  createdAt: string;
}

export interface AccessLog {
  id: string;
  condoId: string;
  visitorId?: string;
  userId?: string;
  gateId?: string;
  direction: 'IN' | 'OUT';
  result: AccessResult;
  recordedAt: string;
}

export interface Parcel {
    id: string;
    condoId: string;
    unitId: string;
    carrier: string;
    trackingNumber?: string;
    arrivedAt: string;
    status: "at_guard" | "picked_up";
    pickedUpAt?: string;
    pickedUpBy?: string;
}


// --- Amenities ---

export type AmenityBookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REJECTED' | 'NO_SHOW';

export interface Amenity {
  id: string;
  condoId: string;
  name: string;
  description?: string;
  requiresApproval: boolean;
  maxPeople?: number;
  rules?: string;
  image: string; // from old type
  requiresDeposit: boolean; // from old type
  depositAmount?: number; // from old type
}

export interface AmenityBooking {
  id: string;
  condoId: string;
  amenityId: string;
  userId: string;
  unitId: string;
  start: string; 
  end: string;
  status: AmenityBookingStatus;
  createdAt: string;
  updatedAt: string;
}

// --- Governance ---

export type AssemblyStatus = 'DRAFT' | 'OPEN' | 'CLOSED' | 'ARCHIVED';
export type VoteValue = 'YES' | 'NO' | 'ABSTAIN';

export interface Assembly {
  id: string;
  condoId: string;
  title: string;
  description?: string;
  scheduledAt: string;
  status: AssemblyStatus;
}

export interface Motion {
  id: string;
  assemblyId: string;
  title: string;
  description?: string;
  requiresQuorum: boolean;
}

export interface Vote {
  id: string;
  motionId: string;
  userId: string;
  value: VoteValue;
  castAt: string;
}

// --- Communication & Docs ---

export interface Announcement {
  id: string;
  condoId: string;
  title: string;
  body: string;
  createdBy: string; // userId
  createdAt: string;
  visibleToRoles: Role[];
  pinned: boolean; // from old type
  category: string; // from old type
}

export interface Document {
  id: string;
  condoId: string;
  name: string;
  url: string;
  category: 'BYLAWS' | 'MINUTES' | 'FINANCIAL' | 'OTHER';
  uploadedBy: string;
  uploadedAt: string;
}

// --- Notifications & Audit ---

export type NotificationChannel = 'PUSH' | 'EMAIL' | 'SMS' | 'IN_APP';

export interface Notification {
  id: string;
  condoId: string;
  userId: string;
  title: string;
  body: string;
  channel: NotificationChannel;
  sentAt: string;
  readAt?: string;
  category: 'announcement' | 'maintenance' | 'community' | 'parcels' | 'finance'; // from old type
}

export interface AuditLog {
  id: string;
  condoId: string;
  entityType: string;
  entityId: string;
  action: string;
  userId: string;
  createdAt: string;
  data?: Record<string, unknown>;
}


// --- Misc ---
export interface FaqItem {
    question: string;
    answer: string;
}

export interface NotificationPref {
  userId: string;
  channels: { push: boolean; email: boolean };
  categories: {
    finance: boolean;
    security: boolean;
    bookings: boolean;
    maintenance: boolean;
    community: boolean;
  };
}
