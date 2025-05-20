document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsDiv = document.getElementById('results');
    const buildingSummaryDiv = document.getElementById('buildingSummary');
    const apartmentResultsDiv = document.getElementById('apartmentResults');
    const efficiencyResultsDiv = document.getElementById('efficiencyResults');

    // ГОСТы и нормативы
    const gostStandards = {
        apartmentSizes: {
            oneBedroom: {
                gost: 'ГОСТ 27751-2014',
                description: currentLanguage === 'en' 
                    ? 'Minimum and maximum sizes for 1-bedroom apartments'
                    : 'Минимальные и максимальные размеры для однокомнатных квартир'
            },
            twoBedroom: {
                gost: 'ГОСТ 27751-2014',
                description: currentLanguage === 'en'
                    ? 'Minimum and maximum sizes for 2-bedroom apartments'
                    : 'Минимальные и максимальные размеры для двухкомнатных квартир'
            },
            threeBedroom: {
                gost: 'ГОСТ 27751-2014',
                description: currentLanguage === 'en'
                    ? 'Minimum and maximum sizes for 3-bedroom apartments'
                    : 'Минимальные и максимальные размеры для трехкомнатных квартир'
            }
        },
        ceilingHeight: {
            gost: 'СП 54.13330.2016',
            description: currentLanguage === 'en'
                ? 'Minimum ceiling height requirements'
                : 'Требования к минимальной высоте потолков'
        },
        windows: {
            gost: 'СП 54.13330.2016',
            description: currentLanguage === 'en'
                ? 'Requirements for natural lighting and ventilation'
                : 'Требования к естественному освещению и вентиляции'
        },
        technicalAreas: {
            elevators: {
                gost: 'СП 267.1325800.2016',
                description: currentLanguage === 'en'
                    ? 'Requirements for elevator shafts and equipment'
                    : 'Требования к лифтовым шахтам и оборудованию'
            },
            stairs: {
                gost: 'СП 1.13130.2009',
                description: currentLanguage === 'en'
                    ? 'Fire safety requirements for escape routes'
                    : 'Требования пожарной безопасности к путям эвакуации'
            },
            corridors: {
                gost: 'СП 1.13130.2009',
                description: currentLanguage === 'en'
                    ? 'Fire safety requirements for corridors and common areas'
                    : 'Требования пожарной безопасности к коридорам и общим помещениям'
            },
            garbageChute: {
                gost: 'СП 54.13330.2016',
                description: currentLanguage === 'en'
                    ? 'Requirements for garbage chute systems'
                    : 'Требования к системам мусоропровода'
            },
            technicalRooms: {
                gost: 'СП 54.13330.2016',
                description: currentLanguage === 'en'
                    ? 'Requirements for technical rooms and equipment placement'
                    : 'Требования к техническим помещениям и размещению оборудования'
            },
            entranceGroups: {
                gost: 'СП 54.13330.2016',
                description: currentLanguage === 'en'
                    ? 'Requirements for entrance groups and vestibules'
                    : 'Требования к входным группам и тамбурам'
            }
        },
        buildingEfficiency: {
            gost: 'СП 54.13330.2016',
            description: currentLanguage === 'en'
                ? 'Requirements for building space efficiency and planning solutions'
                : 'Требования к эффективности использования пространства и планировочным решениям'
        }
    };

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

        // Display apartment results with GOST information
        apartmentResultsDiv.innerHTML = `
            <h4 data-i18n="apartmentDistribution">Apartment Distribution</h4>
            <div class="gost-standards mb-4">
                <h5>${currentLanguage === 'en' ? 'Applicable Standards' : 'Применяемые Стандарты'}</h5>
                <div class="gost-categories">
                    <h6 class="gost-category-title">${currentLanguage === 'en' ? 'Apartment Standards' : 'Стандарты для квартир'}</h6>
                    <ul class="list-unstyled">
                        <li><strong>${gostStandards.apartmentSizes.oneBedroom.gost}</strong>: ${gostStandards.apartmentSizes.oneBedroom.description}</li>
                        <li><strong>${gostStandards.apartmentSizes.twoBedroom.gost}</strong>: ${gostStandards.apartmentSizes.twoBedroom.description}</li>
                        <li><strong>${gostStandards.apartmentSizes.threeBedroom.gost}</strong>: ${gostStandards.apartmentSizes.threeBedroom.description}</li>
                        <li><strong>${gostStandards.ceilingHeight.gost}</strong>: ${gostStandards.ceilingHeight.description}</li>
                        <li><strong>${gostStandards.windows.gost}</strong>: ${gostStandards.windows.description}</li>
                    </ul>

                    <h6 class="gost-category-title">${currentLanguage === 'en' ? 'Technical Areas Standards' : 'Стандарты для технических помещений'}</h6>
                    <ul class="list-unstyled">
                        <li><strong>${gostStandards.technicalAreas.elevators.gost}</strong>: ${gostStandards.technicalAreas.elevators.description}</li>
                        <li><strong>${gostStandards.technicalAreas.stairs.gost}</strong>: ${gostStandards.technicalAreas.stairs.description}</li>
                        <li><strong>${gostStandards.technicalAreas.corridors.gost}</strong>: ${gostStandards.technicalAreas.corridors.description}</li>
                        <li><strong>${gostStandards.technicalAreas.garbageChute.gost}</strong>: ${gostStandards.technicalAreas.garbageChute.description}</li>
                        <li><strong>${gostStandards.technicalAreas.technicalRooms.gost}</strong>: ${gostStandards.technicalAreas.technicalRooms.description}</li>
                        <li><strong>${gostStandards.technicalAreas.entranceGroups.gost}</strong>: ${gostStandards.technicalAreas.entranceGroups.description}</li>
                    </ul>

                    <h6 class="gost-category-title">${currentLanguage === 'en' ? 'Building Efficiency Standards' : 'Стандарты эффективности здания'}</h6>
                    <ul class="list-unstyled">
                        <li><strong>${gostStandards.buildingEfficiency.gost}</strong>: ${gostStandards.buildingEfficiency.description}</li>
                    </ul>
                </div>
            </div>
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