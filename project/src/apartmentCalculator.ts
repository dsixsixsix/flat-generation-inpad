interface ApartmentType {
  name: string;
  size: number;  // in square meters
  percentage: number;
  minSize: number;  // minimum size according to GOST
  maxSize: number;  // maximum size according to GOST
  ceilingHeight: number;  // minimum ceiling height
  hasBalcony: boolean;
  requiredWindows: number;  // minimum number of windows
}

interface TechnicalAreas {
  elevator: number;
  stairs: number;
  corridors: number;
  garbageChute: number;
  technicalRooms: number;
  entranceGroups: number;
  basement: number;
  technicalFloor: number;
}

interface BuildingSpecs {
  totalArea: number;
  fixedAreas: TechnicalAreas;
  floorHeight: number;
  totalFloors: number;
  hasTechnicalFloor: boolean;
  hasBasement: boolean;
}

interface CalculationResult {
  type: string;
  allocatedArea: number;
  possibleUnits: number;
  actualArea: number;
  efficiency: number;
  meetsGOST: boolean;
  issues: string[];
}

function validateApartmentType(apt: ApartmentType): string[] {
  const issues: string[] = [];
  
  if (apt.size < apt.minSize) {
    issues.push(`Size (${apt.size}m²) is below minimum required (${apt.minSize}m²)`);
  }
  if (apt.size > apt.maxSize) {
    issues.push(`Size (${apt.size}m²) exceeds maximum allowed (${apt.maxSize}m²)`);
  }
  if (apt.ceilingHeight < 2.5) {
    issues.push(`Ceiling height (${apt.ceilingHeight}m) is below minimum required (2.5m)`);
  }
  
  return issues;
}

function calculateApartmentDistribution(
  buildingSpecs: BuildingSpecs,
  apartmentTypes: ApartmentType[]
): CalculationResult[] {
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
    const actualArea = possibleUnits * apt.size;
    const efficiency = (actualArea / allocatedArea) * 100;
    const issues = validateApartmentType(apt);
    
    return {
      type: apt.name,
      allocatedArea,
      possibleUnits,
      actualArea,
      efficiency,
      meetsGOST: issues.length === 0,
      issues
    };
  });

  return distributions;
}

function printResults(
  buildingSpecs: BuildingSpecs,
  distributions: CalculationResult[]
): void {
  console.log('\nBuilding Specifications:');
  console.log(`Total Building Area: ${buildingSpecs.totalArea} m²`);
  console.log(`Total Fixed Areas: ${Object.values(buildingSpecs.fixedAreas).reduce((sum, area) => sum + area, 0)} m²`);
  console.log(`Floor Height: ${buildingSpecs.floorHeight} m`);
  console.log(`Total Floors: ${buildingSpecs.totalFloors}`);
  console.log(`Has Technical Floor: ${buildingSpecs.hasTechnicalFloor ? 'Yes' : 'No'}`);
  console.log(`Has Basement: ${buildingSpecs.hasBasement ? 'Yes' : 'No'}\n`);

  console.log('Apartment Distribution:');
  distributions.forEach(dist => {
    console.log(`\n${dist.type}:`);
    console.log(`- Allocated Area: ${dist.allocatedArea.toFixed(2)} m²`);
    console.log(`- Number of Units: ${dist.possibleUnits}`);
    console.log(`- Actual Area Used: ${dist.actualArea} m²`);
    console.log(`- Efficiency: ${dist.efficiency.toFixed(2)}%`);
    console.log(`- Meets GOST: ${dist.meetsGOST ? 'Yes' : 'No'}`);
    if (dist.issues.length > 0) {
      console.log('- Issues:');
      dist.issues.forEach(issue => console.log(`  * ${issue}`));
    }
  });

  // Calculate overall building efficiency
  const totalUsedArea = distributions.reduce(
    (sum, dist) => sum + dist.actualArea,
    0
  );
  const totalFixedArea = Object.values(buildingSpecs.fixedAreas).reduce(
    (sum, area) => sum + area,
    0
  );
  const efficiency = ((totalUsedArea + totalFixedArea) / buildingSpecs.totalArea) * 100;
  console.log(`\nOverall Building Efficiency: ${efficiency.toFixed(2)}%`);
}

// Example usage
const buildingSpecs: BuildingSpecs = {
  totalArea: 1000,
  fixedAreas: {
    elevator: 15,
    stairs: 20,
    corridors: 100,
    garbageChute: 5,
    technicalRooms: 30,
    entranceGroups: 15,
    basement: 50,
    technicalFloor: 0
  },
  floorHeight: 2.7,
  totalFloors: 5,
  hasTechnicalFloor: false,
  hasBasement: true
};

const apartmentTypes: ApartmentType[] = [
  { 
    name: '1-Bedroom', 
    size: 45, 
    percentage: 30,
    minSize: 30,
    maxSize: 50,
    ceilingHeight: 2.7,
    hasBalcony: true,
    requiredWindows: 2
  },
  { 
    name: '2-Bedroom', 
    size: 70, 
    percentage: 40,
    minSize: 50,
    maxSize: 80,
    ceilingHeight: 2.7,
    hasBalcony: true,
    requiredWindows: 3
  },
  { 
    name: '3-Bedroom', 
    size: 95, 
    percentage: 30,
    minSize: 70,
    maxSize: 120,
    ceilingHeight: 2.7,
    hasBalcony: true,
    requiredWindows: 4
  }
];

const results = calculateApartmentDistribution(buildingSpecs, apartmentTypes);
printResults(buildingSpecs, results);