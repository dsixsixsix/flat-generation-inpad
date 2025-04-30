import { Box, Paper, Typography, Card, CardContent, Stack } from '@mui/material';
import { CalculationResult } from '../types';
import { forwardRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

interface ResultsProps {
  result: CalculationResult;
}

export const ResultsComponent = forwardRef<HTMLDivElement, ResultsProps>(({ result }, ref) => {
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
    <Box ref={ref} sx={{ width: '100%', maxWidth: '1200px' }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
          {t.results.title}
        </Typography>
        
        {/* Building Summary Card */}
        <Box sx={{ mb: 4 }}>
          <Card elevation={0} sx={{ 
            bgcolor: 'background.default',
            maxWidth: '600px',
            mx: 'auto'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                {t.results.buildingSummary}
              </Typography>
              <Stack spacing={1} alignItems="center">
                <Typography>{t.results.totalFixedArea}: {result.totalFixedArea.toFixed(2)} м²</Typography>
                <Typography>{t.results.availableArea}: {result.availableArea.toFixed(2)} м²</Typography>
                <Typography>{t.results.buildingEfficiency}: {result.efficiency.toFixed(2)}%</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Apartment Distribution Cards */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3, 
          justifyContent: 'center'
        }}>
          {result.distributions.map((dist, index) => (
            <Card 
              key={index} 
              elevation={0} 
              sx={{ 
                bgcolor: 'background.default',
                width: '280px',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 2
                }
              }}
            >
              <CardContent>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    textAlign: 'center',
                    color: 'primary.main'
                  }}
                >
                  {getTranslatedType(dist.type)}
                </Typography>
                <Stack spacing={1} alignItems="center">
                  <Typography sx={{ minWidth: '200px', textAlign: 'center' }}>
                    {t.results.allocatedArea}: {dist.allocatedArea.toFixed(2)} м²
                  </Typography>
                  <Typography sx={{ minWidth: '200px', textAlign: 'center' }}>
                    {t.results.numberOfUnits}: {dist.possibleUnits}
                  </Typography>
                  <Typography sx={{ minWidth: '200px', textAlign: 'center' }}>
                    {t.results.actualAreaUsed}: {dist.actualArea.toFixed(2)} м²
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}); 