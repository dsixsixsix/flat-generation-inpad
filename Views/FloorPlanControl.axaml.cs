using Avalonia;
using Avalonia.Controls;
using Avalonia.Media;
using InpadProject.Models;
using System;

namespace InpadProject.Views
{
    public partial class FloorPlanControl : UserControl
    {
        private const double ModuleWidth = 100;
        private const double ModuleHeight = 100;

        public static readonly StyledProperty<Floor> FloorProperty =
            AvaloniaProperty.Register<FloorPlanControl, Floor>(nameof(Floor));

        public Floor Floor
        {
            get => GetValue(FloorProperty);
            set => SetValue(FloorProperty, value);
        }

        public FloorPlanControl()
        {
            InitializeComponent();
            this.PropertyChanged += (s, e) =>
            {
                if (e.Property == FloorProperty)
                {
                    UpdateFloorPlan();
                }
            };
        }

        private void UpdateFloorPlan()
        {
            if (Floor == null) return;

            FloorCanvas.Children.Clear();

            // Сначала рисуем коридорные клетки (поверх модулей)
            foreach (var (row, col) in BuildingConfig.CorridorCells)
            {
                var corridorRect = new Avalonia.Controls.Shapes.Rectangle
                {
                    Width = ModuleWidth,
                    Height = ModuleHeight,
                    Fill = new SolidColorBrush(Color.Parse("#cccccc")) { Opacity = 0.3 },
                    Stroke = null
                };
                Canvas.SetLeft(corridorRect, col * ModuleWidth);
                Canvas.SetTop(corridorRect, row * ModuleHeight);
                FloorCanvas.Children.Add(corridorRect);
            }

            // Затем рисуем dead cells (мертвые зоны)
            foreach (var (row, col) in BuildingConfig.DeadCells)
            {
                var deadRect = new Avalonia.Controls.Shapes.Rectangle
                {
                    Width = ModuleWidth,
                    Height = ModuleHeight,
                    Fill = new SolidColorBrush(Colors.Red) { Opacity = 0.15 },
                    Stroke = null
                };
                Canvas.SetLeft(deadRect, col * ModuleWidth);
                Canvas.SetTop(deadRect, row * ModuleHeight);
                FloorCanvas.Children.Add(deadRect);
            }

            // Рисуем сетку модулей
            for (int row = 0; row < 2; row++)
            {
                for (int col = 0; col < BuildingConfig.ModulesPerRow; col++)
                {
                    var moduleType = Floor.GetModuleType(row, col);
                    var color = BuildingConfig.Colors[moduleType];

                    // Создаем прямоугольник
                    var rect = new Avalonia.Controls.Shapes.Rectangle
                    {
                        Width = ModuleWidth,
                        Height = ModuleHeight,
                        Fill = new SolidColorBrush(color),
                        Stroke = new SolidColorBrush(Colors.Black),
                        StrokeThickness = 1
                    };

                    Canvas.SetLeft(rect, col * ModuleWidth);
                    Canvas.SetTop(rect, row * ModuleHeight);

                    // Создаем текст с номером модуля
                    var moduleNumber = row * BuildingConfig.ModulesPerRow + col + 1;
                    var textBlock = new TextBlock
                    {
                        Text = moduleNumber.ToString(),
                        FontSize = 12,
                        Foreground = new SolidColorBrush(Colors.Black)
                    };

                    Canvas.SetLeft(textBlock, col * ModuleWidth + ModuleWidth / 2 - 5);
                    Canvas.SetTop(textBlock, row * ModuleHeight + ModuleHeight / 2 - 8);

                    FloorCanvas.Children.Add(rect);
                    FloorCanvas.Children.Add(textBlock);
                }
            }
        }
    }
} 