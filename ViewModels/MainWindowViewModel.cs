using System;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows.Input;
using InpadProject.Models;
using InpadProject.Services;

namespace InpadProject.ViewModels
{
    public class MainWindowViewModel : INotifyPropertyChanged
    {
        private Building? _building;
        private readonly ApartmentDistributionService _distributionService;

        public ICommand GenerateNewBuildingCommand { get; }

        public Building? Building
        {
            get => _building;
            set
            {
                _building = value;
                OnPropertyChanged();
                OnPropertyChanged(nameof(ApartmentStatistics));
            }
        }

        public string ApartmentStatistics
        {
            get
            {
                if (_building == null) return string.Empty;

                var (studio, one, two, three) = _building.CountApartments();
                return $"Распределение квартир по типам:\n" +
                       $"Студии: {studio} (план: {BuildingConfig.ApartmentPlan["studio"]})\n" +
                       $"1-комнатные: {one} (план: {BuildingConfig.ApartmentPlan["1k"]})\n" +
                       $"2-комнатные: {two} (план: {BuildingConfig.ApartmentPlan["2k"]})\n" +
                       $"3-комнатные: {three} (план: {BuildingConfig.ApartmentPlan["3k"]})";
            }
        }

        public MainWindowViewModel()
        {
            _distributionService = new ApartmentDistributionService();
            GenerateNewBuildingCommand = new RelayCommand(_ => GenerateNewBuilding());
            GenerateNewBuilding();
        }

        public void GenerateNewBuilding()
        {
            Building = _distributionService.DistributeBuildingByTemplate();
        }

        public event PropertyChangedEventHandler? PropertyChanged;

        protected virtual void OnPropertyChanged([CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }

    public class RelayCommand : ICommand
    {
        private readonly Action<object?> _execute;
        private readonly Func<object?, bool>? _canExecute;

        public RelayCommand(Action<object?> execute, Func<object?, bool>? canExecute = null)
        {
            _execute = execute ?? throw new ArgumentNullException(nameof(execute));
            _canExecute = canExecute;
        }

        public event EventHandler? CanExecuteChanged;

        public bool CanExecute(object? parameter)
        {
            return _canExecute == null || _canExecute(parameter);
        }

        public void Execute(object? parameter)
        {
            _execute(parameter);
        }

        public void RaiseCanExecuteChanged()
        {
            CanExecuteChanged?.Invoke(this, EventArgs.Empty);
        }
    }
} 