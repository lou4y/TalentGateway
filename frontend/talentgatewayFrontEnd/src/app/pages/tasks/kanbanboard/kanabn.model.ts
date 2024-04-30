// task.model.ts
export interface ModuleInfo {
  id: number;
  moduleName: string;
  moduleDescription: string;
}

export interface TaskKanban  {
  id: number;
  taskName: string;
  taskDescription: string;
  startDate: string;
  endDate: string;
  duration?: any; // Could be `null` or `string`
  statut: string; // Your API returns 'statut' not 'status'
  priority: string;
  module: ModuleInfo;
  userId: string;
  firstName: string;
  completed: boolean; // Or use an existing property that indicates completion

  
}

export interface ChartType {
  series: any[];
  chart: {
    height: number;
    type: string;
    toolbar?: {
      show: boolean;
      tools?: {
        download?: boolean;
        selection?: boolean;
        zoom?: boolean;
        zoomin?: boolean;
        zoomout?: boolean;
        pan?: boolean;
        reset?: boolean;
        home?: boolean;
      };
    };
  };
  plotOptions?: {
    bar: {
      columnWidth: string;
      endingShape: string;
    };
  };
  colors?: string[];
  dataLabels?: {
    enabled?: boolean;
  };
  stroke?: {
    curve: string;
    width?: number; // Add this line to include the 'width' property
    dashArray?: number | number[];
  };
  labels?: string[];
  xaxis?: {
    categories?: string[];
    min?: number;
    max?: number;
  };
  yaxis?: {
    categories?: string[];
    min?: number;
    max?: number;
  };
  fill?: {
    type: string;
    colors?: string[];
  };
  tooltip?: {
    enabled?: boolean;
  };
  title?: {
    text: string;
    align?: string;
  };
  tools?: {
    download?: boolean;
    selection?: boolean;
    zoom?: boolean;
    zoomin?: boolean;
    zoomout?: boolean;
    pan?: boolean;
    reset?: boolean;
    home?: boolean;
  };
  // ... include any other properties that ApexCharts configuration supports
}


