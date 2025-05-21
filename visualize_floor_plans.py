import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.gridspec import GridSpec

# Параметры здания
FLOORS = 16
MODULES_PER_ROW = 7
MODULES_PER_FLOOR = 14
LLUS = [(0, 2), (0, 3)]  # (row, col) для ЛЛУ (верхний ряд, 3 и 4)

# Квартирография на здание
APARTMENT_PLAN = {
    "studio": 10,
    "1k": 28,
    "2k": 20,
    "3k": 20,
}

# Цвета для типов квартир
COLORS = {
    "studio": "#e89ac7",  # розовый
    "1k": "#fff36a",  # желтый
    "2k": "#a6e97a",  # зеленый
    "3k": "#7ac6f9",  # голубой
    "llu": "#888888",  # темно-серый (ЛЛУ)
    "corridor": "#444444",  # коридор
    "empty": "#ffffff",  # пустой модуль
}

# Размеры квартир в модулях
APT_SIZE = {
    "studio": 1,
    "1k": 2,
    "2k": 3,
    "3k": 4,
}

# Коридорные модули (верхний и нижний ряд)
CORRIDOR_UP = [(0, i) for i in range(1, 6)]  # 2-6
CORRIDOR_DOWN = [
    (1, i) for i in range(1, 6)
]  # 9-13 (номера в ряду 1-6, но глобально 8-13)
CORRIDOR_CELLS = set(CORRIDOR_UP + CORRIDOR_DOWN)

# Модули, в которые нельзя попасть из коридора (глухие)
DEAD_CELLS = [(0, 0), (0, 6), (1, 0), (1, 6)]  # 1,7,8,14


# Проверка, примыкает ли квартира к коридору
def has_corridor_access(row, col, size, floor_grid):
    for c in range(col, col + size):
        if (row, c) in CORRIDOR_CELLS:
            return True
    return False


# Проверка, не выходит ли квартира за пределы ряда
def fits_in_row(col, size):
    return col + size <= MODULES_PER_ROW


# Проверка, не пересекает ли ЛЛУ или занятые модули
def is_free(row, col, size, floor_grid):
    for c in range(col, col + size):
        if floor_grid[row][c] != "empty":
            return False
    return True


# Шаблоны для этажей (0 - ЛЛУ, 1 - студия, 2 - 1к, 3 - 2к, 4 - 3к, 5 - пусто)
floor_templates = {
    1: [3, 3, 0, 0, 4, 4, 4, 3, 1, 5, 2, 2, 2, 4],
    "2-10": [3, 3, 0, 0, 4, 4, 4, 3, 1, 2, 2, 2, 2, 4],
    "11-14": [3, 3, 0, 0, 4, 4, 4, 3, 2, 2, 3, 3, 3, 4],
    "15-16": [4, 4, 0, 0, 4, 4, 4, 4, 3, 3, 4, 4, 4, 4],
}

APARTMENT_TYPES = ["studio", "1k", "2k", "3k"]

# Коридорные вертикали (между рядами)
CORRIDOR_LINES = [1, 2, 3, 4, 5]  # между 2-9, 3-10, 4-11, 5-12, 6-13

# Допустимые конфигурации для 3-комнатной квартиры (индексы модулей)
THREE_K_CONFIGS = [
    [4, 5, 6, 13],  # 5-6-7-14
    [1, 0, 7, 8],  # 2-1-8-9
    [0, 7, 8, 9],  # 1-8-9-10
    [5, 6, 13, 12],  # 6-7-14-13
    [7, 8, 9, 10],  # 8-9-10-11
    [8, 9, 10, 11],  # 9-10-11-12
    [9, 10, 11, 12],  # 10-11-12-13
    [10, 11, 12, 13],  # 11-12-13-14
    [11, 12, 13, 6],  # 12-13-14-7
]

# Индексы модулей с входом из коридора (2,5,6,9,12,13)
STUDIO_ALLOWED = [1, 4, 5, 8, 11, 12]


# Проверка: хотя бы один модуль квартиры с входом из коридора
def has_corridor_access(row, col, size):
    indices = []
    for c in range(col, col + size):
        idx = row * 7 + c
        indices.append(idx)
    return any(idx in STUDIO_ALLOWED for idx in indices)


# Алгоритм распределения квартир по этажу
def distribute_floor(left, studio_this_floor, floor_num):
    floor = [["empty"] * MODULES_PER_ROW for _ in range(2)]
    for row, col in LLUS:
        floor[row][col] = "llu"
    forbidden = set()
    if floor_num == 1:
        floor[1][2] = "empty"
        floor[1][3] = "empty"
        forbidden = {(1, 2), (1, 3)}
    # 1. Размещаем одну 3к в угловой конфигурации
    flat = [floor[0][i] for i in range(7)] + [floor[1][i] for i in range(7)]
    for config in THREE_K_CONFIGS:
        if floor_num == 1 and any(i in [9, 10] for i in config):
            continue
        if all(flat[i] == "empty" for i in config):
            if any(
                (i < 7 and floor[0][i] == "llu")
                or (i >= 7 and floor[1][i - 7] == "llu")
                for i in config
            ):
                continue
            if left["3k"] > 0:
                for i in config:
                    if i < 7:
                        floor[0][i] = "3k"
                    else:
                        floor[1][i - 7] = "3k"
                left["3k"] -= 1
                break
    # 2. Студия (только одна на этаж, только если остались по квартирографии)
    studio_placed = False
    if left["studio"] > 0:
        for idx in STUDIO_ALLOWED:
            row, col = (0, idx) if idx < 7 else (1, idx - 7)
            if (row, col) in forbidden:
                continue
            if floor[row][col] == "empty":
                floor[row][col] = "studio"
                left["studio"] -= 1
                studio_placed = True
                break
    # 3. Жадно размещаем все возможные 1к (в ряду и вертикальные пары)
    while left["1k"] > 0:
        placed = False
        one_k_pairs = []
        for row in range(2):
            for col in range(MODULES_PER_ROW - 1):
                if all(floor[row][c] == "empty" for c in [col, col + 1]):
                    if any(floor[row][c] == "llu" for c in [col, col + 1]):
                        continue
                    if not has_corridor_access(row, col, 2):
                        continue
                    if (row, col) in forbidden or (row, col + 1) in forbidden:
                        continue
                    one_k_pairs.append([(row, col), (row, col + 1)])
        # вертикальные пары 1-8, 7-14
        if (
            floor[0][0] == "empty"
            and floor[1][0] == "empty"
            and (0, 0) not in forbidden
            and (1, 0) not in forbidden
        ):
            one_k_pairs.append([(0, 0), (1, 0)])
        if (
            floor[0][6] == "empty"
            and floor[1][6] == "empty"
            and (0, 6) not in forbidden
            and (1, 6) not in forbidden
        ):
            one_k_pairs.append([(0, 6), (1, 6)])
        if not one_k_pairs:
            break
        for pair in one_k_pairs:
            if left["1k"] == 0:
                break
            for r, c in pair:
                floor[r][c] = "1k"
            left["1k"] -= 1
            placed = True
            break
        if not placed:
            break
    # 4. Жадно размещаем все возможные 2к (в ряду и Г/L-образные)
    while left["2k"] > 0:
        placed = False
        two_k_triples = []
        for row in range(2):
            for col in range(MODULES_PER_ROW - 2):
                if all(floor[row][c] == "empty" for c in [col, col + 1, col + 2]):
                    if any(floor[row][c] == "llu" for c in [col, col + 1, col + 2]):
                        continue
                    if not has_corridor_access(row, col, 3):
                        continue
                    if (
                        (row, col) in forbidden
                        or (row, col + 1) in forbidden
                        or (row, col + 2) in forbidden
                    ):
                        continue
                    two_k_triples.append([(row, col), (row, col + 1), (row, col + 2)])
        # Г/L-образные: 2-1-8, 1-8-9, 6-7-14, 7-14-13
        if all(floor[r][c] == "empty" for r, c in [(0, 1), (0, 0), (1, 0)]) and all(
            (r, c) not in forbidden for r, c in [(0, 1), (0, 0), (1, 0)]
        ):
            two_k_triples.append([(0, 1), (0, 0), (1, 0)])
        if all(floor[r][c] == "empty" for r, c in [(0, 0), (1, 0), (1, 1)]) and all(
            (r, c) not in forbidden for r, c in [(0, 0), (1, 0), (1, 1)]
        ):
            two_k_triples.append([(0, 0), (1, 0), (1, 1)])
        if all(floor[r][c] == "empty" for r, c in [(0, 6), (1, 6), (1, 5)]) and all(
            (r, c) not in forbidden for r, c in [(0, 6), (1, 6), (1, 5)]
        ):
            two_k_triples.append([(0, 6), (1, 6), (1, 5)])
        if all(floor[r][c] == "empty" for r, c in [(1, 6), (1, 5), (0, 5)]) and all(
            (r, c) not in forbidden for r, c in [(1, 6), (1, 5), (0, 5)]
        ):
            two_k_triples.append([(1, 6), (1, 5), (0, 5)])
        if not two_k_triples:
            break
        for triple in two_k_triples:
            if left["2k"] == 0:
                break
            for r, c in triple:
                floor[r][c] = "2k"
            left["2k"] -= 1
            placed = True
            break
        if not placed:
            break
    # 5. Если остались 3к, размещаем их в оставшихся разрешённых конфигурациях (например, на 16 этаже можно разместить сразу две 3к)
    while left["3k"] > 0:
        flat = [floor[0][i] for i in range(7)] + [floor[1][i] for i in range(7)]
        found = False
        for config in THREE_K_CONFIGS:
            if floor_num == 1 and any(i in [9, 10] for i in config):
                continue
            if all(flat[i] == "empty" for i in config):
                if any(
                    (i < 7 and floor[0][i] == "llu")
                    or (i >= 7 and floor[1][i - 7] == "llu")
                    for i in config
                ):
                    continue
                for i in config:
                    if i < 7:
                        floor[0][i] = "3k"
                    else:
                        floor[1][i - 7] = "3k"
                left["3k"] -= 1
                found = True
                break
        if not found:
            break
    return floor


# Алгоритм распределения по всем этажам
def distribute_building(floors, plan, studio_limit):
    left = plan.copy()
    building = []
    for floor_num in range(1, floors + 1):
        studio_this_floor = floor_num <= studio_limit
        floor = distribute_floor(left, studio_this_floor, floor_num)
        building.append(floor)
    return building


# Визуализация одного этажа
def draw_floor(ax, floor, floor_num):
    for col in range(7):
        apt_type = floor[0][col]
        color = COLORS[apt_type]
        rect = patches.Rectangle(
            (col, 1), 1, 1, linewidth=1, edgecolor="black", facecolor=color
        )
        ax.add_patch(rect)
        ax.text(col + 0.5, 1.5, str(col + 1), va="center", ha="center", fontsize=10)
    for col in range(7):
        apt_type = floor[1][col]
        color = COLORS[apt_type]
        rect = patches.Rectangle(
            (col, 0), 1, 1, linewidth=1, edgecolor="black", facecolor=color
        )
        ax.add_patch(rect)
        ax.text(col + 0.5, 0.5, str(col + 8), va="center", ha="center", fontsize=10)
    # Коридор — горизонтальный прямоугольник от 2 до 6 модуля (x=1, width=5), высота 0.5
    ax.add_patch(
        patches.Rectangle((1, 0.75), 5, 0.5, facecolor=COLORS["corridor"], linewidth=0)
    )
    ax.set_xlim(0, 7)
    ax.set_ylim(0, 2)
    ax.axis("off")
    ax.text(
        -0.5,
        1.5,
        f"{floor_num} эт.",
        va="center",
        ha="right",
        fontsize=14,
        fontweight="bold",
    )


def count_apartments(building):
    studio_count = 0
    one_count = 0
    two_count = 0
    three_count = 0
    # Г/L-образные тройки для 2к (глобальные индексы)
    two_k_specials = [
        [1, 0, 7],  # 2-1-8
        [0, 7, 8],  # 1-8-9
        [6, 7, 14],  # 7-14-13 (но 14 не существует, должно быть 13)
        [7, 13, 12],  # 14-13-12
        [0, 1, 8],  # 1-2-9 (добавим для универсальности)
        [6, 5, 12],  # 7-6-13
    ]
    for floor in building:
        flat = [floor[0][i] for i in range(7)] + [floor[1][i] for i in range(7)]
        used = [False] * 14
        # 3к: ищем все уникальные размещённые конфигурации
        for config in THREE_K_CONFIGS:
            if all(flat[i] == "3k" and not used[i] for i in config):
                three_count += 1
                for i in config:
                    used[i] = True
        # 2к: ищем линейные тройки
        for row in range(2):
            for col in range(5):
                idxs = [row * 7 + col, row * 7 + col + 1, row * 7 + col + 2]
                if all(flat[i] == "2k" and not used[i] for i in idxs):
                    two_count += 1
                    for i in idxs:
                        used[i] = True
        # 2к: ищем специальные Г/L-образные тройки
        for idxs in two_k_specials:
            if all(i < 14 and flat[i] == "2k" and not used[i] for i in idxs):
                two_count += 1
                for i in idxs:
                    used[i] = True
        # 1к: ищем последовательности из 2 подряд '1k' (в ряду)
        for row in range(2):
            for col in range(6):
                idxs = [row * 7 + col, row * 7 + col + 1]
                if all(flat[i] == "1k" and not used[i] for i in idxs):
                    one_count += 1
                    for i in idxs:
                        used[i] = True
        # 1к: вертикальные пары 1-8, 7-14
        if flat[0] == "1k" and flat[7] == "1k" and not used[0] and not used[7]:
            one_count += 1
            used[0] = used[7] = True
        if flat[6] == "1k" and flat[13] == "1k" and not used[6] and not used[13]:
            one_count += 1
            used[6] = used[13] = True
        # студии: оставшиеся одиночные 'studio'
        for i in range(14):
            if flat[i] == "studio" and not used[i]:
                studio_count += 1
                used[i] = True
    return studio_count, one_count, two_count, three_count


def distribute_building_by_template():
    building = []
    # 1 этаж
    floor = [["empty"] * 7 for _ in range(2)]
    # 2к: 1-8-9 (0,0),(1,0),(1,1)
    for r, c in [(0, 0), (1, 0), (1, 1)]:
        floor[r][c] = "2k"
    # студия: 2 (0,1)
    floor[0][1] = "studio"
    # 1к: 12-13 (1,4),(1,5)
    for r, c in [(1, 4), (1, 5)]:
        floor[r][c] = "1k"
    # 3к: 5-6-7-14 (0,4),(0,5),(1,6),(0,6)
    for r, c in [(0, 4), (0, 5), (1, 6), (0, 6)]:
        floor[r][c] = "3k"
    # ЛЛУ
    floor[0][2] = "llu"
    floor[0][3] = "llu"
    # Входные модули пустые (1 этаж, 10-11: (1,2),(1,3))
    floor[1][2] = "empty"
    floor[1][3] = "empty"
    building.append(floor)
    # 2-10 этажи
    for _ in range(2, 11):
        floor = [["empty"] * 7 for _ in range(2)]
        # студия: 2 (0,1)
        floor[0][1] = "studio"
        # 2к: 1-8-9 (0,0),(1,0),(1,1)
        for r, c in [(0, 0), (1, 0), (1, 1)]:
            floor[r][c] = "2k"
        # 1к: 10-11 (1,2),(1,3)
        for r, c in [(1, 2), (1, 3)]:
            floor[r][c] = "1k"
        # 1к: 12-13 (1,4),(1,5)
        for r, c in [(1, 4), (1, 5)]:
            floor[r][c] = "1k"
        # 3к: 5-6-7-14 (0,4),(0,5),(1,6),(0,6)
        for r, c in [(0, 4), (0, 5), (1, 6), (0, 6)]:
            floor[r][c] = "3k"
        # ЛЛУ
        floor[0][2] = "llu"
        floor[0][3] = "llu"
        building.append(floor)
    # 11 этаж
    floor = [["empty"] * 7 for _ in range(2)]
    # 1к: 1-2 (0,0),(0,1)
    for r, c in [(0, 0), (0, 1)]:
        floor[r][c] = "1k"
    # 2к: 8-9-10 (1,0),(1,1),(1,2)
    for r, c in [(1, 0), (1, 1), (1, 2)]:
        floor[r][c] = "2k"
    # 2к: 11-12-13 (1,3),(1,4),(1,5)
    for r, c in [(1, 3), (1, 4), (1, 5)]:
        floor[r][c] = "2k"
    # 3к: 5-6-7-14 (0,4),(0,5),(1,6),(0,6)
    for r, c in [(0, 4), (0, 5), (1, 6), (0, 6)]:
        floor[r][c] = "3k"
    # ЛЛУ
    floor[0][2] = "llu"
    floor[0][3] = "llu"
    building.append(floor)
    # 12-15 этажи
    for _ in range(12, 16):
        floor = [["empty"] * 7 for _ in range(2)]
        # 1к: 1-2 (0,0),(0,1) - добавлено для увеличения количества 1к до 28
        for r, c in [(0, 0), (0, 1)]:
            floor[r][c] = "1k"
        # 2к: 8-9-10 (1,0),(1,1),(1,2)
        for r, c in [(1, 0), (1, 1), (1, 2)]:
            floor[r][c] = "2k"
        # 2к: 11-12-13 (1,3),(1,4),(1,5)
        for r, c in [(1, 3), (1, 4), (1, 5)]:
            floor[r][c] = "2k"
        # 3к: 5-6-7-14 (0,4),(0,5),(1,6),(0,6)
        for r, c in [(0, 4), (0, 5), (1, 6), (0, 6)]:
            floor[r][c] = "3k"
        # ЛЛУ
        floor[0][2] = "llu"
        floor[0][3] = "llu"
        building.append(floor)
    # 16 этаж
    floor = [["empty"] * 7 for _ in range(2)]
    # 3к: 5-6-7-14 (0,4),(0,5),(1,6),(0,6)
    for r, c in [(0, 4), (0, 5), (1, 6), (0, 6)]:
        floor[r][c] = "3k"
    # 3к: 2-1-8-9 (0,1),(0,0),(1,0),(1,1)
    for r, c in [(0, 1), (0, 0), (1, 0), (1, 1)]:
        floor[r][c] = "3k"
    # 3к: 10-11-12-13 (1,2),(1,3),(1,4),(1,5)
    for r, c in [(1, 2), (1, 3), (1, 4), (1, 5)]:
        floor[r][c] = "3k"
    # ЛЛУ
    floor[0][2] = "llu"
    floor[0][3] = "llu"
    building.append(floor)
    return building


# Основной код
if __name__ == "__main__":
    building = distribute_building_by_template()
    studio_count, one_count, two_count, three_count = count_apartments(building)
    fig = plt.figure(figsize=(16, 2 * FLOORS + 2))
    gs = GridSpec(FLOORS + 1, 1, height_ratios=[1] * FLOORS + [0.7])
    for i, floor in enumerate(building):
        ax = fig.add_subplot(gs[i, 0])
        draw_floor(ax, floor, i + 1)
    ax_legend = fig.add_subplot(gs[FLOORS, 0])
    ax_legend.axis("off")
    legend_str = (
        f"1с (студия): {studio_count} шт.    "
        f"1к: {one_count} шт.    "
        f"2к: {two_count} шт.    "
        f"3к: {three_count} шт."
    )
    ax_legend.text(0.01, 0.5, legend_str, fontsize=16, va="center", ha="left")
    legend_items = [
        ("studio", "1с (студия)"),
        ("1k", "1к"),
        ("2k", "2к"),
        ("3k", "3к"),
        ("llu", "ЛЛУ"),
        ("corridor", "Коридор"),
    ]
    for idx, (apt, color) in enumerate(legend_items):
        ax_legend.add_patch(
            patches.Rectangle(
                (0.01 + idx * 0.13, 0.1),
                0.03,
                0.3,
                facecolor=COLORS[apt],
                edgecolor="black",
            )
        )
        ax_legend.text(
            0.045 + idx * 0.13, 0.25, color, va="center", ha="left", fontsize=12
        )
    plt.tight_layout()
    plt.savefig("floor_plans.png", dpi=200)
    plt.show()
