"""Функции для визуализации планов этажей."""

import matplotlib.pyplot as plt
from building_config import (
    MODULES_PER_ROW,
    COLORS,
    CORRIDOR_CELLS,
    CORRIDOR_LINES,
    DEAD_CELLS,
)


def visualize_floor_plans(building, save_path="floor_plans.png"):
    """Визуализация планов этажей и сохранение в .png."""
    fig, axes = plt.subplots(4, 4, figsize=(20, 20))
    axes = axes.flatten()

    for floor_num, floor in enumerate(building, 1):
        ax = axes[floor_num - 1]
        ax.set_title(f"Этаж {floor_num}")

        # Создаем сетку
        for i in range(3):
            ax.axhline(y=i, color="black", linestyle="-", linewidth=0.5)
        for i in range(8):
            ax.axvline(x=i, color="black", linestyle="-", linewidth=0.5)

        # Отмечаем коридор
        for row, col in CORRIDOR_CELLS:
            ax.add_patch(
                plt.Rectangle(
                    (col, row),
                    1,
                    1,
                    facecolor="lightgray",
                    alpha=0.3,
                    edgecolor="black",
                )
            )

        # Отмечаем мертвые зоны
        for row, col in DEAD_CELLS:
            ax.add_patch(
                plt.Rectangle(
                    (col, row),
                    1,
                    1,
                    facecolor="red",
                    alpha=0.1,
                    edgecolor="black",
                )
            )

        # Отмечаем коридорные линии
        for row, col in CORRIDOR_LINES:
            ax.add_patch(
                plt.Rectangle(
                    (col, row),
                    1,
                    1,
                    facecolor="lightgray",
                    alpha=0.5,
                    edgecolor="black",
                )
            )

        # Отмечаем квартиры
        for row in range(2):
            for col in range(MODULES_PER_ROW):
                if floor[row][col] != "empty":
                    color = COLORS.get(floor[row][col], "white")
                    ax.add_patch(
                        plt.Rectangle(
                            (col, row),
                            1,
                            1,
                            facecolor=color,
                            alpha=0.7,
                            edgecolor="black",
                        )
                    )

        # Добавляем номера модулей
        for row in range(2):
            for col in range(MODULES_PER_ROW):
                module_num = row * 7 + col + 1
                ax.text(
                    col + 0.5,
                    row + 0.5,
                    str(module_num),
                    ha="center",
                    va="center",
                    fontsize=8,
                )

        ax.set_xlim(0, 7)
        ax.set_ylim(0, 2)
        ax.set_xticks([])
        ax.set_yticks([])

    # Добавляем легенду
    legend_elements = [
        plt.Rectangle((0, 0), 1, 1, facecolor=color, alpha=0.7, edgecolor="black")
        for color in COLORS.values()
    ]
    legend_labels = list(COLORS.keys())
    fig.legend(
        legend_elements,
        legend_labels,
        loc="center right",
        bbox_to_anchor=(0.98, 0.5),
    )

    plt.tight_layout()
    plt.savefig(save_path, dpi=200)
    plt.show()
