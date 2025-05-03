const translations = {
    en: {
        title: 'Apartment Calculator',
        language: 'English',
        buildingSpecs: 'Building Specifications',
        totalArea: 'Total Building Area (m²)',
        fixedAreas: 'Fixed Areas (m²)',
        elevator: 'Elevator Area',
        stairs: 'Stairs Area',
        corridors: 'Corridors Area',
        garbageChute: 'Garbage Chute Area',
        technicalRooms: 'Technical Rooms Area',
        entranceGroups: 'Entrance Groups Area',
        basement: 'Basement Area',
        technicalFloor: 'Technical Floor Area',
        floorHeight: 'Floor Height (m)',
        totalFloors: 'Total Floors',
        apartmentTypes: 'Apartment Types',
        oneBedroom: '1-Bedroom',
        twoBedroom: '2-Bedroom',
        threeBedroom: '3-Bedroom',
        size: 'Size (m²)',
        percentage: 'Percentage (%)',
        calculate: 'Calculate',
        results: 'Results',
        buildingSummary: 'Building Summary',
        apartmentDistribution: 'Apartment Distribution',
        overallEfficiency: 'Overall Building Efficiency',
        allocatedArea: 'Allocated Area',
        numberOfUnits: 'Number of Units',
        actualAreaUsed: 'Actual Area Used',
        efficiency: 'Efficiency',
        meetsGOST: 'Meets GOST',
        issues: 'Issues',
        yes: 'Yes',
        no: 'No',
        excellent: 'Excellent',
        good: 'Good',
        needsImprovement: 'Needs Improvement'
    },
    ru: {
        title: 'Калькулятор Квартир',
        language: 'Русский',
        buildingSpecs: 'Характеристики Здания',
        totalArea: 'Общая Площадь Здания (м²)',
        fixedAreas: 'Фиксированные Площади (м²)',
        elevator: 'Площадь Лифтов',
        stairs: 'Площадь Лестниц',
        corridors: 'Площадь Коридоров',
        garbageChute: 'Площадь Мусоропровода',
        technicalRooms: 'Площадь Технических Помещений',
        entranceGroups: 'Площадь Входных Групп',
        basement: 'Площадь Подвала',
        technicalFloor: 'Площадь Технического Этажа',
        floorHeight: 'Высота Этажа (м)',
        totalFloors: 'Количество Этажей',
        apartmentTypes: 'Типы Квартир',
        oneBedroom: '1-Комнатная',
        twoBedroom: '2-Комнатная',
        threeBedroom: '3-Комнатная',
        size: 'Площадь (м²)',
        percentage: 'Процент (%)',
        calculate: 'Рассчитать',
        results: 'Результаты',
        buildingSummary: 'Сводка по Зданию',
        apartmentDistribution: 'Распределение Квартир',
        overallEfficiency: 'Общая Эффективность Здания',
        allocatedArea: 'Выделенная Площадь',
        numberOfUnits: 'Количество Квартир',
        actualAreaUsed: 'Фактически Используемая Площадь',
        efficiency: 'Эффективность',
        meetsGOST: 'Соответствует ГОСТ',
        issues: 'Проблемы',
        yes: 'Да',
        no: 'Нет',
        excellent: 'Отлично',
        good: 'Хорошо',
        needsImprovement: 'Требует Улучшения'
    }
};

// Get language from localStorage or default to 'en'
let currentLanguage = localStorage.getItem('language') || 'en';

function updateLanguage() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLanguage][key]) {
            if (element.tagName === 'INPUT' && element.type === 'number') {
                // Don't change input values
                return;
            }
            element.textContent = translations[currentLanguage][key];
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const languageSwitch = document.getElementById('languageSwitch');
    
    // Set initial switch state based on saved language
    languageSwitch.checked = currentLanguage === 'ru';
    
    languageSwitch.addEventListener('change', () => {
        currentLanguage = languageSwitch.checked ? 'ru' : 'en';
        // Save language preference to localStorage
        localStorage.setItem('language', currentLanguage);
        updateLanguage();
    });
    
    // Initial language setup
    updateLanguage();
}); 