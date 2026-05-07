import type { StockItem, StockStatus } from '../types';

export function calcStockStatus(quantity: number): StockStatus {
  if (quantity <= 0) return 'empty';
  if (quantity <= 1) return 'low';
  return 'enough';
}

export function getLowStockItems(stock: StockItem[]): StockItem[] {
  return stock.filter(s => s.stockStatus === 'low' || s.stockStatus === 'empty');
}

export function getFoodStock(stock: StockItem[]): StockItem[] {
  return stock.filter(s => s.category === 'food');
}

export function getDailyStock(stock: StockItem[]): StockItem[] {
  return stock.filter(s => s.category === 'daily');
}

export function getBabyStock(stock: StockItem[]): StockItem[] {
  return stock.filter(s => s.category === 'baby');
}
