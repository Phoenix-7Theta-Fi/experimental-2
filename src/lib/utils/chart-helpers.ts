import { 
  type EChartsOption, 
  type LineSeriesOption, 
  type BarSeriesOption 
} from 'echarts';
import { 
  BiomarkerData, 
  BiomarkerCategory,
  BiomarkerTrend, 
  BIOMARKER_RANGES,
  CategorySummary
} from '../types/health';

// Chart theme constants
const chartTheme: Partial<EChartsOption> = {
  backgroundColor: 'transparent',
  textStyle: { color: '#E2E8F0' },
  grid: {
    left: '5%',
    right: '5%',
    top: '8%',
    bottom: '8%',
    containLabel: true
  },
  animation: true,
  animationDuration: 1000,
  animationEasing: 'cubicOut' as const
};

export const getStatusColor = (value: number | null, min: number, max: number): string => {
  if (!value) return '#94A3B8';
  if (value < min || value > max) return '#EF4444';
  
  const middle = (max + min) / 2;
  const maxDistance = (max - min) / 2;
  const distance = Math.abs(value - middle);
  const percentage = distance / maxDistance;

  if (percentage < 0.25) return '#22C55E';
  return '#F59E0B';
};

export const formatBiomarkerValue = (value: number | null, category: BiomarkerCategory, metric: string): string => {
  if (value === null) return 'N/A';
  
  const units: { [key: string]: string } = {
    glucose: 'mg/dL',
    lipids: 'mg/dL',
    thyroid: metric === 'tsh' ? 'mU/L' : metric === 't3' ? 'ng/dL' : 'µg/dL',
    vitamins: metric === 'd' ? 'ng/mL' : 'pg/mL',
    inflammation: metric === 'crp' ? 'mg/L' : 'mm/hr',
    liver: metric === 'albumin' ? 'g/dL' : 'U/L',
    kidney: metric === 'uricAcid' ? 'mg/dL' : metric === 'creatinine' ? 'mg/dL' : 'mg/dL'
  };

  return `${value} ${units[category] || ''}`;
};

export const getBiomarkerValue = (data: BiomarkerData | undefined, category: BiomarkerCategory, metric: string): number | null => {
  if (!data || !data[category]) return null;
  const categoryData = data[category] as { [key: string]: number | null };
  return categoryData[metric] ?? null;
};

export const getBiomarkerRange = (category: BiomarkerCategory, metric: string): { min: number; max: number } => {
  const ranges = BIOMARKER_RANGES[category];
  return ranges[metric as keyof typeof ranges] || { min: 0, max: 100 };
};

export const calculateMovingAverage = (data: (number | null)[], window: number): number[] => {
  const result = new Array(data.length).fill(0);
  
  for (let i = 0; i < data.length; i++) {
    const slice = data.slice(Math.max(0, i - window + 1), i + 1)
      .filter((v): v is number => v !== null);
    
    result[i] = slice.length > 0 ? slice.reduce((a, b) => a + b, 0) / slice.length : 0;
  }
  
  return result;
};

export const getLineChartOptions = (
  data: BiomarkerData[],
  category: BiomarkerCategory,
  metric: string,
  showTargetZone = true
): EChartsOption => {
  if (!data?.length) {
    return {
      ...chartTheme,
      title: {
        text: 'No data available',
        textStyle: { color: '#94A3B8' },
        left: 'center',
        top: 'center'
      }
    } as EChartsOption;
  }

  const dates = data.map(d => d.date);
  const values = data.map(d => getBiomarkerValue(d, category, metric));
  const range = getBiomarkerRange(category, metric);
  const trendValues = calculateMovingAverage(values, 7);

  const baseOptions: EChartsOption = {
    ...chartTheme,
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(30, 41, 59, 0.9)',
      borderColor: '#475569',
      textStyle: { color: '#F8FAFC' },
      formatter: (params: any) => {
        const date = new Date(params[0].axisValue).toLocaleDateString();
        const value = params[0].value === null ? 'N/A' : formatBiomarkerValue(params[0].value, category, metric);
        const trendValue = params[1]?.value ? formatBiomarkerValue(params[1].value, category, metric) : '';
        const status = params[0].value ? 
          `Status: ${params[0].value < range.min || params[0].value > range.max ? 'Out of Range' : 'Normal'}` :
          '';
        
        let result = `${date}<br/>${params[0].seriesName}: ${value}`;
        if (trendValue) result += `<br/>Trend: ${trendValue}`;
        if (status) result += `<br/>${status}`;
        
        return result;
      }
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        formatter: (value: string) => {
          const date = new Date(value);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        },
        color: '#94A3B8'
      },
      axisLine: { lineStyle: { color: '#475569' } },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => formatBiomarkerValue(value, category, metric),
        color: '#94A3B8'
      },
      axisLine: { lineStyle: { color: '#475569' } },
      splitLine: { lineStyle: { color: '#334155', type: 'dashed' } }
    }
  };

  const normalRangeSeries: LineSeriesOption = {
    name: 'Normal Range',
    type: 'line',
    data: Array(dates.length).fill(range.max),
    lineStyle: { opacity: 0 },
    areaStyle: {
      color: '#22C55E20',
      opacity: 0.2
    },
    stack: 'range',
    stackStrategy: 'all',
    symbol: 'none',
    emphasis: { disabled: true }
  };

  const warningRangeSeries: LineSeriesOption = {
    name: 'Warning Range',
    type: 'line',
    data: Array(dates.length).fill(range.max * 1.2),
    lineStyle: { opacity: 0 },
    areaStyle: {
      color: '#F59E0B20',
      opacity: 0.2
    },
    stack: 'range',
    stackStrategy: 'all',
    symbol: 'none',
    emphasis: { disabled: true }
  };

  const trendSeries: LineSeriesOption = {
    name: 'Trend',
    type: 'line',
    data: trendValues,
    symbol: 'none',
    lineStyle: {
      width: 2,
      color: '#94A3B8',
      type: 'dashed'
    },
    emphasis: { disabled: true }
  };

  const dataSeries: LineSeriesOption = {
    name: metric,
    type: 'line',
    data: values,
    symbol: 'circle',
    symbolSize: 8,
    lineStyle: {
      width: 3,
      color: '#3B82F6'
    },
    itemStyle: {
      color: '#3B82F6',
      borderWidth: 2,
      borderColor: '#1E293B'
    },
    emphasis: {
      scale: 1.5,
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(59, 130, 246, 0.5)'
      }
    }
  };

  const series = [
    ...(showTargetZone ? [normalRangeSeries, warningRangeSeries] : []),
    trendSeries,
    dataSeries
  ];

  return {
    ...baseOptions,
    series
  };
};

export const getStackedBarOptions = (
  data: BiomarkerData[],
  category: BiomarkerCategory,
  metrics: string[]
): EChartsOption => {
  if (!data?.length) {
    return {
      ...chartTheme,
      title: {
        text: 'No data available',
        textStyle: { color: '#94A3B8' },
        left: 'center',
        top: 'center'
      }
    } as EChartsOption;
  }

  const latest = data[0];
  const values = metrics.map(metric => getBiomarkerValue(latest, category, metric));

  const barSeries: BarSeriesOption = {
    type: 'bar',
    data: values.map((value, index) => {
      const range = getBiomarkerRange(category, metrics[index]);
      return {
        value,
        itemStyle: {
          color: value === null ? '#94A3B8' : getStatusColor(value, range.min, range.max),
          borderRadius: [0, 4, 4, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(255, 255, 255, 0.2)'
          }
        }
      };
    })
  };

  const options: EChartsOption = {
    ...chartTheme,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(30, 41, 59, 0.9)',
      borderColor: '#475569',
      textStyle: { color: '#F8FAFC' },
      formatter: (params: any) => {
        const metric = params[0].name;
        const value = params[0].value === null ? 'N/A' : formatBiomarkerValue(params[0].value, category, metric);
        const range = getBiomarkerRange(category, metric);
        return `${metric}<br/>Value: ${value}<br/>Target: ${range.min} - ${range.max}`;
      }
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => formatBiomarkerValue(value, category, metrics[0]),
        color: '#94A3B8'
      },
      axisLine: { lineStyle: { color: '#475569' } },
      splitLine: { lineStyle: { color: '#334155', type: 'dashed' } }
    },
    yAxis: {
      type: 'category',
      data: metrics,
      axisLabel: { color: '#94A3B8' },
      axisLine: { lineStyle: { color: '#475569' } }
    },
    series: [barSeries]
  };

  return options;
};

export const generateCategorySummary = (
  data: BiomarkerData[],
  category: BiomarkerCategory
): CategorySummary => {
  if (!data?.length) {
    return {
      category,
      metrics: []
    };
  }

  const latest = data[0];
  const ranges = BIOMARKER_RANGES[category];
  const metricKeys = Object.keys(ranges) as Array<keyof typeof ranges>;
  
  const metrics = metricKeys.map(metric => {
    const currentValue = getBiomarkerValue(latest, category, metric as string);
    const range = getBiomarkerRange(category, metric as string);
    const unit = formatBiomarkerValue(1, category, metric as string).split(' ')[1];
    
    return {
      name: metric,
      value: currentValue || 0,
      target: range,
      unit: unit || ''
    };
  });

  return {
    category,
    metrics
  };
};
