interface ApartmentType {
  name: string;
  size: number;  // in square meters
  percentage: number;
}

interface BuildingSpecs {
  totalArea: number;
  fixedAreas: {
    elevator: number;
    stairs: number;
    corridors: number;
  };
}

function calculateApartmentDistribution(
  buildingSpecs: BuildingSpecs,
  apartmentTypes: ApartmentType[]
): void {
  // Calculate total fixed areas
  const totalFixedArea = Object.values(buildingSpecs.fixedAreas).reduce(
    (sum, area) => sum + area,
    0
  );

  // Available area for apartments
  const availableArea = buildingSpecs.totalArea - totalFixedArea;

  console.log('\nBuilding Specifications:');
  console.log(`Total Building Area: ${buildingSpecs.totalArea} m²`);
  console.log(`Total Fixed Areas: ${totalFixedArea} m²`);
  console.log(`Available Area for Apartments: ${availableArea} m²\n`);

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

  // Print results
  console.log('Apartment Distribution:');
  distributions.forEach(dist => {
    console.log(`\n${dist.type}:`);
    console.log(`- Allocated Area: ${dist.allocatedArea.toFixed(2)} m²`);
    console.log(`- Number of Units: ${dist.possibleUnits}`);
    console.log(`- Actual Area Used: ${dist.actualArea} m²`);
  });

  // Calculate efficiency
  const totalUsedArea = distributions.reduce(
    (sum, dist) => sum + dist.actualArea,
    0
  );
  const efficiency = ((totalUsedArea + totalFixedArea) / buildingSpecs.totalArea) * 100;

  console.log(`\nBuilding Efficiency: ${efficiency.toFixed(2)}%`);
}

// Example usage
const buildingSpecs: BuildingSpecs = {
  totalArea: 1000, // 1000 m²
  fixedAreas: {
    elevator: 15,
    stairs: 20,
    corridors: 100
  }
};

const apartmentTypes: ApartmentType[] = [
  { name: '1-Bedroom', size: 45, percentage: 30 },
  { name: '2-Bedroom', size: 70, percentage: 40 },
  { name: '3-Bedroom', size: 95, percentage: 30 }
];

calculateApartmentDistribution(buildingSpecs, apartmentTypes);