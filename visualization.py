"""Функции для визуализации планов этажей."""

import matplotlib.pyplot as plt
import numpy as np
from building_config import (
    FLOORS,
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


def visualize_apartment_distribution(building, save_path="distribution.png"):
    """Визуализация распределения квартир по этажам и сохранение в .png."""
    floor_counts = {
        "studio": [],
        "1k": [],
        "2k": [],
        "3k": [],
    }

    for floor in building:
        flat = [floor[0][i] for i in range(7)] + [floor[1][i] for i in range(7)]
        used = [False] * 14

        # Подсчет 3к
        three_count = 0
        for config in [
            [4, 5, 11, 6],  # 5-6-7-14
            [1, 0, 7, 8],  # 2-1-8-9
            [9, 10, 11, 12],  # 10-11-12-13
        ]:
            if all(flat[i] == "3k" and not used[i] for i in config):
                three_count += 1
                for i in config:
                    used[i] = True
        floor_counts["3k"].append(three_count)

        # Подсчет 2к
        two_count = 0
        # Линейные тройки
        for row in range(2):
            for col in range(5):
                idxs = [row * 7 + col, row * 7 + col + 1, row * 7 + col + 2]
                if all(flat[i] == "2k" and not used[i] for i in idxs):
                    two_count += 1
                    for i in idxs:
                        used[i] = True
        # Г/L-образные тройки
        for config in [
            [1, 0, 7],  # 2-1-8
            [0, 7, 8],  # 1-8-9
            [6, 13, 12],  # 7-14-13
            [13, 12, 5],  # 14-13-6
        ]:
            if all(flat[i] == "2k" and not used[i] for i in config):
                two_count += 1
                for i in config:
                    used[i] = True
        floor_counts["2k"].append(two_count)

        # Подсчет 1к
        one_count = 0
        # В ряду
        for row in range(2):
            for col in range(6):
                idxs = [row * 7 + col, row * 7 + col + 1]
                if all(flat[i] == "1k" and not used[i] for i in idxs):
                    one_count += 1
                    for i in idxs:
                        used[i] = True
        # Вертикальные пары
        if flat[0] == "1k" and flat[7] == "1k" and not used[0] and not used[7]:
            one_count += 1
            used[0] = used[7] = True
        if flat[6] == "1k" and flat[13] == "1k" and not used[6] and not used[13]:
            one_count += 1
            used[6] = used[13] = True
        floor_counts["1k"].append(one_count)

        # Подсчет студий
        studio_count = sum(1 for i in range(14) if flat[i] == "studio" and not used[i])
        floor_counts["studio"].append(studio_count)

    # Создаем график
    fig, ax = plt.subplots(figsize=(12, 6))
    x = np.arange(FLOORS)
    width = 0.2

    # Строим столбцы для каждого типа квартир
    ax.bar(
        x - width * 1.5,
        floor_counts["studio"],
        width,
        label="Студии",
        color=COLORS["studio"],
    )
    ax.bar(x - width * 0.5, floor_counts["1k"], width, label="1к", color=COLORS["1k"])
    ax.bar(x + width * 0.5, floor_counts["2k"], width, label="2к", color=COLORS["2k"])
    ax.bar(x + width * 1.5, floor_counts["3k"], width, label="3к", color=COLORS["3k"])

    # Настраиваем график
    ax.set_xlabel("Этаж")
    ax.set_ylabel("Количество квартир")
    ax.set_title("Распределение квартир по этажам")
    ax.set_xticks(x)
    ax.set_xticklabels([str(i) for i in range(1, FLOORS + 1)])
    ax.legend()

    plt.tight_layout()
    plt.savefig(save_path, dpi=200)
    plt.show()
