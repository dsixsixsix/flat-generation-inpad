using System;
using System.Collections.Generic;
using System.Linq;
using Avalonia.Media;

namespace InpadProject.Models
{
    public static class BuildingConfig
    {
        // Параметры здания
        public const int Floors = 16;
        public const int ModulesPerRow = 7;
        public const int ModulesPerFloor = 14;
        public static readonly List<(int row, int col)> Llus = new() { (0, 2), (0, 3) };

        // Квартирография на здание
        public static readonly Dictionary<string, int> ApartmentPlan = new()
        {
            { "studio", 10 },
            { "1k", 28 },
            { "2k", 20 },
            { "3k", 20 }
        };

        // Цвета для типов квартир
        public static readonly Dictionary<string, Color> Colors = new()
        {
            { "studio", Color.Parse("#e89ac7") },  // розовый
            { "1k", Color.Parse("#fff36a") },      // желтый
            { "2k", Color.Parse("#a6e97a") },      // зеленый
            { "3k", Color.Parse("#7ac6f9") },      // голубой
            { "llu", Color.Parse("#888888") },     // темно-серый (ЛЛУ)
            { "corridor", Color.Parse("#444444") },   // коридор
            { "empty", Color.Parse("#ffffff") }    // пустой модуль
        };

        // Размеры квартир в модулях
        public static readonly Dictionary<string, int> AptSize = new()
        {
            { "studio", 1 },
            { "1k", 2 },
            { "2k", 3 },
            { "3k", 4 }
        };

        // Коридорные модули (верхний и нижний ряд)
        public static readonly List<(int row, int col)> CorridorUp = new()
        {
            (0, 1), (0, 2), (0, 3), (0, 4), (0, 5)
        };

        public static readonly List<(int row, int col)> CorridorDown = new()
        {
            (1, 1), (1, 2), (1, 3), (1, 4), (1, 5)
        };

        public static readonly HashSet<(int row, int col)> CorridorCells = new(CorridorUp.Concat(CorridorDown));

        // Модули, в которые нельзя попасть из коридора (глухие)
        public static readonly List<(int row, int col)> DeadCells = new()
        {
            (0, 0), (0, 6), (1, 0), (1, 6)
        };

        // Коридорные вертикали (между рядами)
        public static readonly List<(int row, int col)> CorridorLines = new(CorridorUp.Concat(CorridorDown));

        // Индексы модулей с входом из коридора
        public static readonly List<int> StudioAllowed = new() { 1, 4, 5, 8, 11, 12 };

        // Допустимые конфигурации для 3-комнатной квартиры
        public static readonly List<List<int>> ThreeKConfigs = new()
        {
            new List<int> { 4, 5, 6, 13 },  // 5-6-7-14
            new List<int> { 1, 0, 7, 8 },   // 2-1-8-9
            new List<int> { 0, 7, 8, 9 },   // 1-8-9-10
            new List<int> { 5, 6, 13, 12 }, // 6-7-14-13
            new List<int> { 7, 8, 9, 10 },  // 8-9-10-11
            new List<int> { 8, 9, 10, 11 }, // 9-10-11-12
            new List<int> { 9, 10, 11, 12 },// 10-11-12-13
            new List<int> { 10, 11, 12, 13 },// 11-12-13-14
            new List<int> { 11, 12, 13, 6 } // 12-13-14-7
        };

        // Г/L-образные тройки для 2к
        public static readonly List<List<int>> TwoKSpecials = new()
        {
            new List<int> { 1, 0, 7 },  // 2-1-8
            new List<int> { 0, 7, 8 },  // 1-8-9
            new List<int> { 6, 7, 14 }, // 7-14-13
            new List<int> { 7, 13, 12 },// 14-13-12
            new List<int> { 0, 1, 8 },  // 1-2-9
            new List<int> { 6, 5, 12 }  // 7-6-13
        };
    }
} 