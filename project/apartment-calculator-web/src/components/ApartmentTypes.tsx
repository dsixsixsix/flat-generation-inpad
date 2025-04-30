import { Paper, Typography, TextField, Stack, Box, Grid } from '@mui/material';
import { ApartmentType } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

interface ApartmentTypesProps {
  types: ApartmentType[];
  onTypesChange: (types: ApartmentType[]) => void;
}

const paperStyle = {
  p: 3,
  height: '500px',
  width: '500px',
  display: 'flex',
  flexDirection: 'column'
};

export const ApartmentTypesComponent = ({ types, onTypesChange }: ApartmentTypesProps) => {
  const { language } = useLanguage();
  const t = translations[language];

  const getTranslatedType = (type: string) => {
    switch (type) {
      case '1-комнатная':
        return t.apartmentTypes.types.oneBedroom;
      case '2-комнатная':
        return t.apartmentTypes.types.twoBedroom;
      case '3-комнатная':
        return t.apartmentTypes.types.threeBedroom;
      default:
        return type;
    }
  };

  return (
    <Paper elevation={2} sx={paperStyle}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        {t.apartmentTypes.title}
      </Typography>
      <Stack spacing={3}>
        {types.map((apt, index) => (
          <Box key={index}>
            <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
              {getTranslatedType(apt.name)}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={t.apartmentTypes.size}
                  type="number"
                  value={apt.size}
                  onChange={(e) => {
                    const newTypes = [...types];
                    newTypes[index].size = Number(e.target.value);
                    onTypesChange(newTypes);
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={t.apartmentTypes.percentage}
                  type="number"
                  value={apt.percentage}
                  onChange={(e) => {
                    const newTypes = [...types];
                    newTypes[index].percentage = Number(e.target.value);
                    onTypesChange(newTypes);
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}; 