export interface Ingredient {
  id: string;
  name: string;
  price: number;
  unit: string;
}

export interface LaunchItem {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  unit: string;
  subtotal: number;
}

export interface DailyPlan {
  date: string;
  items: LaunchItem[];
  totalBudget: number;
  notes?: string;
}