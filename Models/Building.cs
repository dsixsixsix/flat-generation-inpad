using System;
using System.Collections.Generic;
using System.Linq;

namespace InpadProject.Models
{
    public class Building
    {
        public List<Floor> Floors { get; private set; }

        public Building()
        {
            Floors = new List<Floor>();
            for (int i = 0; i < BuildingConfig.Floors; i++)
            {
                Floors.Add(new Floor(i + 1));
            }
        }

        public (int studio, int one, int two, int three) CountApartments()
        {
            int studio_count = 0, one_count = 0, two_count = 0, three_count = 0;

            foreach (var floor in Floors)
            {
                // flat — одномерный массив из 14 модулей (0-6 верхний ряд, 7-13 нижний)
                var flat = new string[14];
                for (int col = 0; col < 7; col++)
                {
                    flat[col] = floor.GetModuleType(0, col);
                    flat[7 + col] = floor.GetModuleType(1, col);
                }
                var used = new bool[14];

                // 3к: ищем все уникальные размещённые конфигурации
                foreach (var config in BuildingConfig.ThreeKConfigs)
                {
                    if (config.All(i => i < 14 && flat[i] == "3k" && !used[i]))
                    {
                        three_count++;
                        foreach (var i in config) used[i] = true;
                    }
                }

                // 2к: ищем линейные тройки
                for (int row = 0; row < 2; row++)
                {
                    for (int col = 0; col < 5; col++)
                    {
                        var idxs = new[] { row * 7 + col, row * 7 + col + 1, row * 7 + col + 2 };
                        if (idxs.All(i => flat[i] == "2k" && !used[i]))
                        {
                            two_count++;
                            foreach (var i in idxs) used[i] = true;
                        }
                    }
                }

                // 2к: ищем специальные Г/L-образные тройки
                foreach (var idxs in BuildingConfig.TwoKSpecials)
                {
                    if (idxs.All(i => i < 14 && flat[i] == "2k" && !used[i]))
                    {
                        two_count++;
                        foreach (var i in idxs) used[i] = true;
                    }
                }

                // 1к: ищем последовательности из 2 подряд '1k' (в ряду)
                for (int row = 0; row < 2; row++)
                {
                    for (int col = 0; col < 6; col++)
                    {
                        var idxs = new[] { row * 7 + col, row * 7 + col + 1 };
                        if (idxs.All(i => flat[i] == "1k" && !used[i]))
                        {
                            one_count++;
                            foreach (var i in idxs) used[i] = true;
                        }
                    }
                }

                // 1к: вертикальные пары 1-8, 7-14
                if (flat[0] == "1k" && flat[7] == "1k" && !used[0] && !used[7])
                {
                    one_count++;
                    used[0] = used[7] = true;
                }
                if (flat[6] == "1k" && flat[13] == "1k" && !used[6] && !used[13])
                {
                    one_count++;
                    used[6] = used[13] = true;
                }

                // студии: оставшиеся одиночные 'studio'
                for (int i = 0; i < 14; i++)
                {
                    if (flat[i] == "studio" && !used[i])
                    {
                        studio_count++;
                        used[i] = true;
                    }
                }
            }
            return (studio_count, one_count, two_count, three_count);
        }

        public Floor? GetFloor(int floorNumber)
        {
            if (floorNumber >= 0 && floorNumber < Floors.Count)
            {
                return Floors[floorNumber];
            }
            return null;
        }
    }
} 