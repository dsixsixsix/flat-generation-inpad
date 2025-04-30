import { BuildingSpecs, ApartmentType, CalculationResult, DistributionResult } from '../types';

export function calculateApartmentDistribution(
  buildingSpecs: BuildingSpecs,
  apartmentTypes: ApartmentType[]
): CalculationResult {
  // Calculate total fixed areas
  const totalFixedArea = Object.values(buildingSpecs.fixedAreas).reduce(
    (sum, area) => sum + area,
    0
  );

  // Available area for apartments
  const availableArea = buildingSpecs.totalArea - totalFixedArea;

  // Calculate area allocation for each apartment type
  const distributions = apartmentTypes.map(apt => {
    const allocatedArea = (availableArea * apt.percentage) / 100;
    const possibleUnits = Math.floor(allocatedArea / apt.size);

    return {
      type: apt.name,
      allocatedArea,
      possibleUnits,
      actualArea: possibleUnits * apt.size
    };
  });

  // Calculate efficiency
  const totalUsedArea = distributions.reduce(
    (sum, dist) => sum + dist.actualArea,
    0
  );
  const efficiency = ((totalUsedArea + totalFixedArea) / buildingSpecs.totalArea) * 100;

  return {
    totalFixedArea,
    availableArea,
    distributions,
    efficiency
  };
} 