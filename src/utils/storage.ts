import { DailyPlan } from '../types';

const STORAGE_KEY = 'daily-launch-plans';

export const saveDailyPlan = (plan: DailyPlan): void => {
  try {
    const existingPlans = getDailyPlans();
    const updatedPlans = {
      ...existingPlans,
      [plan.date]: plan
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlans));
  } catch (error) {
    console.error('Error saving daily plan:', error);
  }
};

export const getDailyPlan = (date: string): DailyPlan | null => {
  try {
    const plans = getDailyPlans();
    return plans[date] || null;
  } catch (error) {
    console.error('Error getting daily plan:', error);
    return null;
  }
};

export const getDailyPlans = (): Record<string, DailyPlan> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error getting daily plans:', error);
    return {};
  }
};

export const deleteDailyPlan = (date: string): void => {
  try {
    const plans = getDailyPlans();
    delete plans[date];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  } catch (error) {
    console.error('Error deleting daily plan:', error);
  }
};