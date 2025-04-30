import { Paper, Typography, TextField, Stack } from '@mui/material';
import { BuildingSpecs } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

interface BuildingSpecsProps {
  specs: BuildingSpecs;
  onSpecsChange: (specs: BuildingSpecs) => void;
}

const paperStyle = {
  p: 3,
  height: '500px',
  width: '500px',
  display: 'flex',
  flexDirection: 'column'
};

export const BuildingSpecsComponent = ({ specs, onSpecsChange }: BuildingSpecsProps) => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <Paper elevation={2} sx={paperStyle}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        {t.buildingSpecs.title}
      </Typography>
      <Stack spacing={2}>
        <TextField
          fullWidth
          label={t.buildingSpecs.totalArea}
          type="number"
          value={specs.totalArea}
          onChange={(e) => onSpecsChange({
            ...specs,
            totalArea: Number(e.target.value)
          })}
        />
        <TextField
          fullWidth
          label={t.buildingSpecs.elevatorArea}
          type="number"
          value={specs.fixedAreas.elevator}
          onChange={(e) => onSpecsChange({
            ...specs,
            fixedAreas: {
              ...specs.fixedAreas,
              elevator: Number(e.target.value)
            }
          })}
        />
        <TextField
          fullWidth
          label={t.buildingSpecs.stairsArea}
          type="number"
          value={specs.fixedAreas.stairs}
          onChange={(e) => onSpecsChange({
            ...specs,
            fixedAreas: {
              ...specs.fixedAreas,
              stairs: Number(e.target.value)
            }
          })}
        />
        <TextField
          fullWidth
          label={t.buildingSpecs.corridorsArea}
          type="number"
          value={specs.fixedAreas.corridors}
          onChange={(e) => onSpecsChange({
            ...specs,
            fixedAreas: {
              ...specs.fixedAreas,
              corridors: Number(e.target.value)
            }
          })}
        />
      </Stack>
    </Paper>
  );
}; 