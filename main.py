"""Основной файл для запуска визуализации планов этажей."""

from building_config import APARTMENT_PLAN
from apartment_distribution import (
    distribute_building_by_template,
    count_apartments,
)
from visualization import (
    visualize_floor_plans,
)


def main():
    """Основная функция."""
    # Распределяем квартиры по шаблону
    building = distribute_building_by_template()

    # Подсчитываем количество квартир
    (
        studio_count,
        one_count,
        two_count,
        three_count,
    ) = count_apartments(building)

    # Выводим статистику
    print("\nРаспределение квартир по типам:")
    print(f"Студии: {studio_count} (план: {APARTMENT_PLAN['studio']})")
    print(f"1-комнатные: {one_count} (план: {APARTMENT_PLAN['1k']})")
    print(f"2-комнатные: {two_count} (план: {APARTMENT_PLAN['2k']})")
    print(f"3-комнатные: {three_count} (план: {APARTMENT_PLAN['3k']})")

    # Визуализируем планы этажей
    visualize_floor_plans(building, save_path="floor_plans.png")

    # Визуализируем распределение квартир по этажам
    # visualize_apartment_distribution(building, save_path="distribution.png")


if __name__ == "__main__":
    main()
