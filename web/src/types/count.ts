// ========================
// Tipe data
// ========================
export type Counts = {
  totalUsers: number;
  totalDestinations: number;
  totalCategories: number;
};

export type ChartItem = {
  name: string;
  value: number;
};

export type StatsData = {
  counts: Counts;
  chartData: ChartItem[];
};

export type StatsResponse = {
  status: number;
  message: string;
  data: StatsData;
};