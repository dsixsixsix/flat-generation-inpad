using System;
using System.Collections.Generic;

namespace InpadProject.Models
{
    public class Floor
    {
        public string[,] Modules { get; private set; }
        public int FloorNumber { get; set; }

        public Floor(int floorNumber)
        {
            FloorNumber = floorNumber;
            Modules = new string[2, BuildingConfig.ModulesPerRow];
            InitializeEmptyFloor();
        }

        private void InitializeEmptyFloor()
        {
            // Инициализируем все модули как пустые
            for (int row = 0; row < 2; row++)
            {
                for (int col = 0; col < BuildingConfig.ModulesPerRow; col++)
                {
                    Modules[row, col] = "empty";
                }
            }

            // Устанавливаем коридоры
            foreach (var (row, col) in BuildingConfig.CorridorCells)
            {
                Modules[row, col] = "corridor";
            }

            // Устанавливаем ЛЛУ
            foreach (var (row, col) in BuildingConfig.Llus)
            {
                Modules[row, col] = "llu";
            }
        }

        public bool IsModuleEmpty(int row, int col)
        {
            return Modules[row, col] == "empty";
        }

        public void SetModuleType(int row, int col, string type)
        {
            if (row >= 0 && row < 2 && col >= 0 && col < BuildingConfig.ModulesPerRow)
            {
                Modules[row, col] = type;
            }
        }

        public string GetModuleType(int row, int col)
        {
            if (row >= 0 && row < 2 && col >= 0 && col < BuildingConfig.ModulesPerRow)
            {
                return Modules[row, col];
            }
            return "empty";
        }
    }
} 