document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsDiv = document.getElementById('results');
    const buildingSummaryDiv = document.getElementById('buildingSummary');
    const apartmentResultsDiv = document.getElementById('apartmentResults');
    const efficiencyResultsDiv = document.getElementById('efficiencyResults');

    calculateBtn.addEventListener('click', () => {
        // Get building specifications
        const buildingSpecs = {
            totalArea: parseFloat(document.getElementById('totalArea').value),
            fixedAreas: {
                elevator: parseFloat(document.getElementById('elevator').value),
                stairs: parseFloat(document.getElementById('stairs').value),
                corridors: parseFloat(document.getElementById('corridors').value),
                garbageChute: parseFloat(document.getElementById('garbageChute').value),
                technicalRooms: parseFloat(document.getElementById('technicalRooms').value),
                entranceGroups: parseFloat(document.getElementById('entranceGroups').value),
                basement: parseFloat(document.getElementById('basement').value),
                technicalFloor: parseFloat(document.getElementById('technicalFloor').value)
            },
            floorHeight: parseFloat(document.getElementById('floorHeight').value),
            totalFloors: parseInt(document.getElementById('totalFloors').value),
            hasTechnicalFloor: parseFloat(document.getElementById('technicalFloor').value) > 0,
            hasBasement: parseFloat(document.getElementById('basement').value) > 0
        };

        // Get apartment types
        const apartmentTypes = [
            {
                name: currentLanguage === 'en' ? '1-Bedroom' : '1-Комнатная',
                size: parseFloat(document.getElementById('size1').value),
                percentage: parseFloat(document.getElementById('percentage1').value),
                minSize: 30,
                maxSize: 50,
                ceilingHeight: buildingSpecs.floorHeight,
                hasBalcony: true,
                requiredWindows: 2
            },
            {
                name: currentLanguage === 'en' ? '2-Bedroom' : '2-Комнатная',
                size: parseFloat(document.getElementById('size2').value),
                percentage: parseFloat(document.getElementById('percentage2').value),
                minSize: 50,
                maxSize: 80,
                ceilingHeight: buildingSpecs.floorHeight,
                hasBalcony: true,
                requiredWindows: 3
            },
            {
                name: currentLanguage === 'en' ? '3-Bedroom' : '3-Комнатная',
                size: parseFloat(document.getElementById('size3').value),
                percentage: parseFloat(document.getElementById('percentage3').value),
                minSize: 70,
                maxSize: 120,
                ceilingHeight: buildingSpecs.floorHeight,
                hasBalcony: true,
                requiredWindows: 4
            }
        ];

        // Calculate results
        const results = calculateApartmentDistribution(buildingSpecs, apartmentTypes);

        // Display results
        displayResults(buildingSpecs, results);

        // Smooth scroll to results
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    function validateApartmentType(apt) {
        const issues = [];
        
        if (apt.size < apt.minSize) {
            issues.push(currentLanguage === 'en' 
                ? `Size (${apt.size}m²) is below minimum required (${apt.minSize}m²)`
                : `Площадь (${apt.size}м²) меньше минимально требуемой (${apt.minSize}м²)`);
        }
        if (apt.size > apt.maxSize) {
            issues.push(currentLanguage === 'en'
                ? `Size (${apt.size}m²) exceeds maximum allowed (${apt.maxSize}m²)`
                : `Площадь (${apt.size}м²) превышает максимально допустимую (${apt.maxSize}м²)`);
        }
        if (apt.ceilingHeight < 2.5) {
            issues.push(currentLanguage === 'en'
                ? `Ceiling height (${apt.ceilingHeight}m) is below minimum required (2.5m)`
                : `Высота потолка (${apt.ceilingHeight}м) меньше минимально требуемой (2.5м)`);
        }
        
        return issues;
    }

    function calculateApartmentDistribution(buildingSpecs, apartmentTypes) {
        // Calculate total fixed areas
        const totalFixedArea = Object.values(buildingSpecs.fixedAreas).reduce(
            (sum, area) => sum + area,
            0
        );

        // Available area for apartments
        const availableArea = buildingSpecs.totalArea - totalFixedArea;

        // Calculate area allocation for each apartment type
        return apartmentTypes.map(apt => {
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
    }

    function displayResults(buildingSpecs, distributions) {
        // Display building summary
        const totalFixedArea = Object.values(buildingSpecs.fixedAreas).reduce(
            (sum, area) => sum + area,
            0
        );

        buildingSummaryDiv.innerHTML = `
            <h4 data-i18n="buildingSummary">Building Summary</h4>
            <p>${currentLanguage === 'en' ? 'Total Building Area' : 'Общая Площадь Здания'}: ${buildingSpecs.totalArea.toFixed(2)} m²</p>
            <p>${currentLanguage === 'en' ? 'Total Fixed Areas' : 'Общая Площадь Фиксированных Помещений'}: ${totalFixedArea.toFixed(2)} m²</p>
            <p>${currentLanguage === 'en' ? 'Floor Height' : 'Высота Этажа'}: ${buildingSpecs.floorHeight} m</p>
            <p>${currentLanguage === 'en' ? 'Total Floors' : 'Количество Этажей'}: ${buildingSpecs.totalFloors}</p>
            <p>${currentLanguage === 'en' ? 'Has Technical Floor' : 'Есть Технический Этаж'}: ${buildingSpecs.hasTechnicalFloor ? (currentLanguage === 'en' ? 'Yes' : 'Да') : (currentLanguage === 'en' ? 'No' : 'Нет')}</p>
            <p>${currentLanguage === 'en' ? 'Has Basement' : 'Есть Подвал'}: ${buildingSpecs.hasBasement ? (currentLanguage === 'en' ? 'Yes' : 'Да') : (currentLanguage === 'en' ? 'No' : 'Нет')}</p>
        `;

        // Display apartment results
        apartmentResultsDiv.innerHTML = `
            <h4 data-i18n="apartmentDistribution">Apartment Distribution</h4>
            ${distributions.map(dist => `
                <div class="apartment-result mb-4">
                    <h5>${dist.type}</h5>
                    <p>${currentLanguage === 'en' ? 'Allocated Area' : 'Выделенная Площадь'}: ${dist.allocatedArea.toFixed(2)} m²</p>
                    <p>${currentLanguage === 'en' ? 'Number of Units' : 'Количество Квартир'}: ${dist.possibleUnits}</p>
                    <p>${currentLanguage === 'en' ? 'Actual Area Used' : 'Фактически Используемая Площадь'}: ${dist.actualArea.toFixed(2)} m²</p>
                    <p>${currentLanguage === 'en' ? 'Efficiency' : 'Эффективность'}: ${dist.efficiency.toFixed(2)}%</p>
                    <p>${currentLanguage === 'en' ? 'Meets GOST' : 'Соответствует ГОСТ'}: <span class="badge ${dist.meetsGOST ? 'bg-success' : 'bg-danger'}">${dist.meetsGOST ? (currentLanguage === 'en' ? 'Yes' : 'Да') : (currentLanguage === 'en' ? 'No' : 'Нет')}</span></p>
                    ${dist.issues.length > 0 ? `
                        <div class="mt-2">
                            <h6 data-i18n="issues">Issues</h6>
                            <ul class="issue-list">
                                ${dist.issues.map(issue => `<li>${issue}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        `;

        // Calculate and display overall efficiency
        const totalUsedArea = distributions.reduce(
            (sum, dist) => sum + dist.actualArea,
            0
        );
        const efficiency = ((totalUsedArea + totalFixedArea) / buildingSpecs.totalArea) * 100;

        let efficiencyText = '';
        if (efficiency >= 80) {
            efficiencyText = currentLanguage === 'en' ? 'Excellent' : 'Отлично';
        } else if (efficiency >= 60) {
            efficiencyText = currentLanguage === 'en' ? 'Good' : 'Хорошо';
        } else {
            efficiencyText = currentLanguage === 'en' ? 'Needs Improvement' : 'Требует Улучшения';
        }

        efficiencyResultsDiv.innerHTML = `
            <h4 data-i18n="overallEfficiency">Overall Building Efficiency</h4>
            <div class="d-flex align-items-center">
                <span class="badge efficiency-badge ${efficiency >= 80 ? 'bg-success' : efficiency >= 60 ? 'bg-warning' : 'bg-danger'}">
                    ${efficiency.toFixed(2)}%
                </span>
                <span class="ms-2">${efficiencyText}</span>
            </div>
        `;

        // Show results
        resultsDiv.style.display = 'block';
        
        // Update translations for newly added elements
        updateLanguage();
    }
}); 