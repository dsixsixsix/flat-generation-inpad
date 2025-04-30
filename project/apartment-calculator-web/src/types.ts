export interface ApartmentType {
  name: string;
  size: number;
  percentage: number;
}

export interface BuildingSpecs {
  totalArea: number;
  fixedAreas: {
    elevator: number;
    stairs: number;
    corridors: number;
  };
}

export interface DistributionResult {
  type: string;
  allocatedArea: number;
  possibleUnits: number;
  actualArea: number;
}

export interface CalculationResult {
  totalFixedArea: number;
  availableArea: number;
  distributions: DistributionResult[];
  efficiency: number;
} 