export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type UserRole = 'admin' | 'user';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Vehicle Types
export interface Vehicle {
  id: string;
  userId: string;
  plateNumber: string;
  vehicleType: 'car' | 'motorcycle' | 'truck';
  size: 'small' | 'medium' | 'large';
  attributes: {
    color?: string;
    model?: string;
    year?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFormData {
  plateNumber: string;
  vehicleType: 'car' | 'motorcycle' | 'truck';
  size: 'small' | 'medium' | 'large';
  attributes: {
    color?: string;
    model?: string;
    year?: number | string;
  };
}

// Parking Slot Types
export interface ParkingSlot {
  id: string;
  slotNumber: string;
  size: 'small' | 'medium' | 'large';
  vehicleType: 'car' | 'motorcycle' | 'truck' | 'any';
  status: 'available' | 'unavailable';
  location: 'north' | 'south' | 'east' | 'west';
  createdAt: string;
  updatedAt: string;
}

export interface SlotFormData {
  slotNumber: string;
  size: 'small' | 'medium' | 'large';
  vehicleType: 'car' | 'motorcycle' | 'truck' | 'any';
  location: 'north' | 'south' | 'east' | 'west';
}

export interface BulkSlotFormData {
  startNumber: number;
  count: number;
  size: 'small' | 'medium' | 'large';
  vehicleType: 'car' | 'motorcycle' | 'truck' | 'any';
  location: 'north' | 'south' | 'east' | 'west';
}

// Slot Request Types
export type SlotRequestStatus = 'pending' | 'approved' | 'rejected';

export interface SlotRequest {
  id: string;
  userId: string;
  vehicleId: string;
  slotId?: string;
  requestStatus: SlotRequestStatus;
  createdAt: string;
  updatedAt: string;
  vehicle?: Vehicle;
  slot?: ParkingSlot;
  user?: {
    name: string;
    email: string;
  };
}

export interface SlotRequestFormData {
  vehicleId: string;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
}

// Action Log Types
export interface ActionLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  userName?: string;
}