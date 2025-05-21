"""Логика распределения квартир по этажам."""

from building_config import (
    MODULES_PER_ROW,
    LLUS,
    CORRIDOR_CELLS,
    STUDIO_ALLOWED,
    THREE_K_CONFIGS,
    TWO_K_SPECIALS,
)


def has_corridor_access(row, col, size):
    """Проверка: хотя бы один модуль квартиры с входом из коридора."""
    indices = []
    for c in range(col, col + size):
        idx = row * 7 + c
        indices.append(idx)
    return any(idx in STUDIO_ALLOWED for idx in indices)


def is_free(row, col, size, floor_grid):
    """Проверка, не пересекает ли ЛЛУ или занятые модули."""
    for c in range(col, col + size):
        if floor_grid[row][c] != "empty":
            return False
    return True


def distribute_floor(left, studio_this_floor, floor_num):
    """Алгоритм распределения квартир по этажу."""
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
    if left["studio"] > 0:
        for idx in STUDIO_ALLOWED:
            row, col = (0, idx) if idx < 7 else (1, idx - 7)
            if (row, col) in forbidden:
                continue
            if floor[row][col] == "empty":
                floor[row][col] = "studio"
                left["studio"] -= 1
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

    # 5. Если остались 3к, размещаем их в оставшихся разрешённых конфигурациях
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


def distribute_building(floors, plan, studio_limit):
    """Алгоритм распределения по всем этажам."""
    left = plan.copy()
    building = []
    for floor_num in range(1, floors + 1):
        studio_this_floor = floor_num <= studio_limit
        floor = distribute_floor(left, studio_this_floor, floor_num)
        building.append(floor)
    return building


def count_apartments(building):
    """Подсчет количества квартир каждого типа."""
    studio_count = 0
    one_count = 0
    two_count = 0
    three_count = 0

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
        for idxs in TWO_K_SPECIALS:
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
    """Распределение квартир по шаблону."""
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