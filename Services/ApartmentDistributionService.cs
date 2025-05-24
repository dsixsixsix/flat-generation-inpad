using System;
using System.Collections.Generic;
using System.Linq;
using InpadProject.Models;

namespace InpadProject.Services
{
    public class ApartmentDistributionService
    {
        public Building DistributeBuildingByTemplate()
        {
            var building = new Building();
            var floors = BuildingConfig.Floors;
            var plan = new Dictionary<string, int>(BuildingConfig.ApartmentPlan);
            var studioLimit = 10; // как в Python-версии

            // 1 этаж
            building.Floors[0] = CreateFloorByTemplate(1);
            UpdatePlanFromFloor(building.Floors[0], plan);

            // 2-10 этажи
            for (int i = 1; i < 10; i++)
            {
                building.Floors[i] = CreateFloorByTemplate(2);
                UpdatePlanFromFloor(building.Floors[i], plan);
            }

            // 11 этаж
            building.Floors[10] = CreateFloorByTemplate(11);
            UpdatePlanFromFloor(building.Floors[10], plan);

            // 12-15 этажи
            for (int i = 11; i < 15; i++)
            {
                building.Floors[i] = CreateFloorByTemplate(12);
                UpdatePlanFromFloor(building.Floors[i], plan);
            }

            // 16 этаж
            building.Floors[15] = CreateFloorByTemplate(16);
            UpdatePlanFromFloor(building.Floors[15], plan);

            return building;
        }

        private Floor CreateFloorByTemplate(int floorNum)
        {
            var floor = new Floor(floorNum);
            // Все модули по умолчанию empty
            for (int row = 0; row < 2; row++)
                for (int col = 0; col < BuildingConfig.ModulesPerRow; col++)
                    floor.SetModuleType(row, col, "empty");

            // ЛЛУ
            foreach (var (row, col) in BuildingConfig.Llus)
                floor.SetModuleType(row, col, "llu");

            if (floorNum == 1)
            {
                // 2к: 1-8-9 (0,0),(1,0),(1,1)
                floor.SetModuleType(0, 0, "2k");
                floor.SetModuleType(1, 0, "2k");
                floor.SetModuleType(1, 1, "2k");
                // студия: 2 (0,1)
                floor.SetModuleType(0, 1, "studio");
                // 1к: 12-13 (1,4),(1,5)
                floor.SetModuleType(1, 4, "1k");
                floor.SetModuleType(1, 5, "1k");
                // 3к: 5-6-7-14 (0,4),(0,5),(1,6),(0,6)
                floor.SetModuleType(0, 4, "3k");
                floor.SetModuleType(0, 5, "3k");
                floor.SetModuleType(1, 6, "3k");
                floor.SetModuleType(0, 6, "3k");
                // ЛЛУ
                floor.SetModuleType(0, 2, "llu");
                floor.SetModuleType(0, 3, "llu");
                // Входные модули пустые (1 этаж, 10-11: (1,2),(1,3))
                floor.SetModuleType(1, 2, "empty");
                floor.SetModuleType(1, 3, "empty");
            }
            else if (floorNum >= 2 && floorNum <= 10)
            {
                // студия: 2 (0,1)
                floor.SetModuleType(0, 1, "studio");
                // 2к: 1-8-9 (0,0),(1,0),(1,1)
                floor.SetModuleType(0, 0, "2k");
                floor.SetModuleType(1, 0, "2k");
                floor.SetModuleType(1, 1, "2k");
                // 1к: 10-11 (1,2),(1,3)
                floor.SetModuleType(1, 2, "1k");
                floor.SetModuleType(1, 3, "1k");
                // 1к: 12-13 (1,4),(1,5)
                floor.SetModuleType(1, 4, "1k");
                floor.SetModuleType(1, 5, "1k");
                // 3к: 5-6-7-14 (0,4),(0,5),(1,6),(0,6)
                floor.SetModuleType(0, 4, "3k");
                floor.SetModuleType(0, 5, "3k");
                floor.SetModuleType(1, 6, "3k");
                floor.SetModuleType(0, 6, "3k");
                // ЛЛУ
                floor.SetModuleType(0, 2, "llu");
                floor.SetModuleType(0, 3, "llu");
            }
            else if (floorNum == 11)
            {
                // 1к: 1-2 (0,0),(0,1)
                floor.SetModuleType(0, 0, "1k");
                floor.SetModuleType(0, 1, "1k");
                // 2к: 8-9-10 (1,0),(1,1),(1,2)
                floor.SetModuleType(1, 0, "2k");
                floor.SetModuleType(1, 1, "2k");
                floor.SetModuleType(1, 2, "2k");
                // 2к: 11-12-13 (1,3),(1,4),(1,5)
                floor.SetModuleType(1, 3, "2k");
                floor.SetModuleType(1, 4, "2k");
                floor.SetModuleType(1, 5, "2k");
                // 3к: 5-6-7-14 (0,4),(0,5),(1,6),(0,6)
                floor.SetModuleType(0, 4, "3k");
                floor.SetModuleType(0, 5, "3k");
                floor.SetModuleType(1, 6, "3k");
                floor.SetModuleType(0, 6, "3k");
                // ЛЛУ
                floor.SetModuleType(0, 2, "llu");
                floor.SetModuleType(0, 3, "llu");
            }
            else if (floorNum >= 12 && floorNum <= 15)
            {
                // 1к: 1-2 (0,0),(0,1)
                floor.SetModuleType(0, 0, "1k");
                floor.SetModuleType(0, 1, "1k");
                // 2к: 8-9-10 (1,0),(1,1),(1,2)
                floor.SetModuleType(1, 0, "2k");
                floor.SetModuleType(1, 1, "2k");
                floor.SetModuleType(1, 2, "2k");
                // 2к: 11-12-13 (1,3),(1,4),(1,5)
                floor.SetModuleType(1, 3, "2k");
                floor.SetModuleType(1, 4, "2k");
                floor.SetModuleType(1, 5, "2k");
                // 3к: 5-6-7-14 (0,4),(0,5),(1,6),(0,6)
                floor.SetModuleType(0, 4, "3k");
                floor.SetModuleType(0, 5, "3k");
                floor.SetModuleType(1, 6, "3k");
                floor.SetModuleType(0, 6, "3k");
                // ЛЛУ
                floor.SetModuleType(0, 2, "llu");
                floor.SetModuleType(0, 3, "llu");
            }
            else if (floorNum == 16)
            {
                // 3к: 5-6-7-14 (0,4),(0,5),(1,6),(0,6)
                floor.SetModuleType(0, 4, "3k");
                floor.SetModuleType(0, 5, "3k");
                floor.SetModuleType(1, 6, "3k");
                floor.SetModuleType(0, 6, "3k");
                // 3к: 2-1-8-9 (0,1),(0,0),(1,0),(1,1)
                floor.SetModuleType(0, 1, "3k");
                floor.SetModuleType(0, 0, "3k");
                floor.SetModuleType(1, 0, "3k");
                floor.SetModuleType(1, 1, "3k");
                // 3к: 10-11-12-13 (1,2),(1,3),(1,4),(1,5)
                floor.SetModuleType(1, 2, "3k");
                floor.SetModuleType(1, 3, "3k");
                floor.SetModuleType(1, 4, "3k");
                floor.SetModuleType(1, 5, "3k");
                // ЛЛУ
                floor.SetModuleType(0, 2, "llu");
                floor.SetModuleType(0, 3, "llu");
            }
            return floor;
        }

        private void UpdatePlanFromFloor(Floor floor, Dictionary<string, int> plan)
        {
            for (int row = 0; row < 2; row++)
            for (int col = 0; col < BuildingConfig.ModulesPerRow; col++)
            {
                var type = floor.GetModuleType(row, col);
                if (plan.ContainsKey(type))
                    plan[type] = Math.Max(0, plan[type] - 1);
            }
        }
    }
} 