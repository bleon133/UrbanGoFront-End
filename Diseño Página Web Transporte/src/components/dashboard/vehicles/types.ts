export interface Vehicle {
  id: string;
  type: string;
  brand: string;
  model: string;
  year?: number;
  licensePlate?: string;
  color?: string;
  weight?: number;
  maxSpeed?: number;
  status: string;
  branchId: string;
  branchName?: string;
  photo?: string;
}

export interface VehiclePayload {
  id?: string;
  type: string;
  brand: string;
  model: string;
  year?: number;
  licensePlate?: string;
  color?: string;
  weight?: number;
  maxSpeed?: number;
  status: string;
  branchId: string;
}

export interface BranchOption {
  id: string;
  name: string;
}

export interface TransportTypeOption {
  id: string;
  name: string;
}
