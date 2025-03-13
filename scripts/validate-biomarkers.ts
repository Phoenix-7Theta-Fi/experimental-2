import { getDB } from '../src/lib/db';
import { getUserBiomarkerData } from '../src/lib/db/biomarkers';
import { 
  BiomarkerData, 
  BiomarkerCategory, 
  BIOMARKER_RANGES 
} from '../src/lib/types/health';
import { 
  getStatusColor, 
  getBiomarkerValue, 
  getBiomarkerRange,
  formatBiomarkerValue 
} from '../src/lib/utils/chart-helpers';

function getBiomarkerMetrics(category: BiomarkerCategory): string[] {
  switch (category) {
    case 'glucose':
      return ['fasting', 'postPrandial', 'hba1c'];
    case 'lipids':
      return ['totalCholesterol', 'hdl', 'ldl', 'triglycerides'];
    case 'thyroid':
      return ['tsh', 't3', 't4'];
    case 'vitamins':
      return ['d', 'b12'];
    case 'inflammation':
      return ['crp', 'esr'];
    case 'liver':
      return ['alt', 'ast', 'albumin'];
    case 'kidney':
      return ['creatinine', 'urea', 'uricAcid'];
  }
}

function validateBiomarkerData(userId: number) {
  console.log(`\nValidating biomarker data for user ${userId}...\n`);
  
  const data = getUserBiomarkerData(userId);
  if (!data) {
    console.error('No biomarker data found');
    return;
  }

  // Validate data structure
  console.log('Data structure validation:');
  const latestRecord = data[0];
  const categories: BiomarkerCategory[] = ['glucose', 'lipids', 'thyroid', 'vitamins', 'inflammation', 'liver', 'kidney'];
  
  categories.forEach(category => {
    const metrics = getBiomarkerMetrics(category);
    console.log(`\n${category.toUpperCase()} Metrics:`);
    
    metrics.forEach(metric => {
      const value = getBiomarkerValue(latestRecord, category, metric);
      const range = getBiomarkerRange(category, metric);
      const formattedValue = formatBiomarkerValue(value, category, metric);
      
      const status = value === null ? 'missing' :
        value < range.min || value > range.max ? 'out of range' : 'normal';
      
      const color = value === null ? '⚪' :
        getStatusColor(value, range.min, range.max) === '#22C55E' ? '🟢' :
        getStatusColor(value, range.min, range.max) === '#F59E0B' ? '🟡' : '🔴';
      
      console.log(`  ${metric}:`.padEnd(20), 
        `Value: ${formattedValue}`.padEnd(25),
        `Range: ${range.min}-${range.max}`.padEnd(20),
        `Status: ${status}`.padEnd(20),
        color
      );
    });
  });

  // Time series validation
  console.log('\nTime series validation:');
  const dates = data.map(record => record.date);
  console.log('Data points available for dates:', dates);

  // Summary statistics
  console.log('\nSummary:');
  const totalMetrics = categories.reduce((sum, category) => 
    sum + getBiomarkerMetrics(category).length, 0);
  
  const nullValues = categories.reduce((sum, category) => {
    const metrics = getBiomarkerMetrics(category);
    return sum + metrics.reduce((categorySum, metric) => {
      const value = getBiomarkerValue(latestRecord, category, metric);
      return categorySum + (value === null ? 1 : 0);
    }, 0);
  }, 0);

  const outOfRangeValues = categories.reduce((sum, category) => {
    const metrics = getBiomarkerMetrics(category);
    return sum + metrics.reduce((categorySum, metric) => {
      const value = getBiomarkerValue(latestRecord, category, metric);
      if (value === null) return categorySum;
      
      const range = getBiomarkerRange(category, metric);
      return categorySum + (value < range.min || value > range.max ? 1 : 0);
    }, 0);
  }, 0);

  console.log(`Total metrics:`, totalMetrics);
  console.log(`Null values:`, nullValues, `(${(nullValues/totalMetrics*100).toFixed(1)}%)`);
  console.log(`Out of range values:`, outOfRangeValues, `(${(outOfRangeValues/(totalMetrics-nullValues)*100).toFixed(1)}% of non-null values)`);
}

// Get all patients and validate their data
const db = getDB();
const patients = db.prepare("SELECT id, name FROM users WHERE role = 'patient'").all() as { id: number; name: string }[];

patients.forEach(patient => {
  console.log(`\n=== Validating data for patient: ${patient.name} (ID: ${patient.id}) ===`);
  validateBiomarkerData(patient.id);
});

console.log('\nValidation complete!');
