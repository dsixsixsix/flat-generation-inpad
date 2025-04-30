import { useState, useRef } from 'react'
import { Container, Typography, Button, Stack, Box, Switch, FormControlLabel } from '@mui/material'
import { BuildingSpecsComponent } from './components/BuildingSpecs'
import { ApartmentTypesComponent } from './components/ApartmentTypes'
import { ResultsComponent } from './components/Results'
import { calculateApartmentDistribution } from './utils/calculator'
import { BuildingSpecs, ApartmentType, CalculationResult } from './types'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { translations } from './translations/translations'

function AppContent() {
  const [buildingSpecs, setBuildingSpecs] = useState<BuildingSpecs>({
    totalArea: 1000,
    fixedAreas: {
      elevator: 15,
      stairs: 20,
      corridors: 100
    }
  })

  const [apartmentTypes, setApartmentTypes] = useState<ApartmentType[]>([
    { name: '1-комнатная', size: 45, percentage: 30 },
    { name: '2-комнатная', size: 70, percentage: 40 },
    { name: '3-комнатная', size: 95, percentage: 30 }
  ])

  const [result, setResult] = useState<CalculationResult | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const { language, toggleLanguage } = useLanguage()
  const t = translations[language]

  const handleCalculate = () => {
    const calculationResult = calculateApartmentDistribution(buildingSpecs, apartmentTypes)
    setResult(calculationResult)
    
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }, 100)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {t.title}
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={language === 'en'}
              onChange={toggleLanguage}
              color="primary"
            />
          }
          label={language === 'ru' ? 'EN' : 'RU'}
        />
      </Box>

      <Stack spacing={4} alignItems="center">
        {/* Input Sections */}
        <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
          <BuildingSpecsComponent 
            specs={buildingSpecs} 
            onSpecsChange={setBuildingSpecs} 
          />
          <ApartmentTypesComponent 
            types={apartmentTypes} 
            onTypesChange={setApartmentTypes} 
          />
        </Box>

        {/* Calculate Button */}
        <Button
          variant="contained"
          size="large"
          onClick={handleCalculate}
          sx={{ 
            px: 6, 
            py: 2,
            fontSize: '1.1rem',
            boxShadow: 2,
            '&:hover': {
              boxShadow: 4
            }
          }}
        >
          {t.calculateButton}
        </Button>

        {/* Results */}
        {result && <ResultsComponent ref={resultsRef} result={result} />}
      </Stack>
    </Container>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App
