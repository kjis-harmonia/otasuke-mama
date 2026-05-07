import { useState } from 'react';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import InventoryPage from './pages/InventoryPage';
import ShoppingPage from './pages/ShoppingPage';
import BudgetPage from './pages/BudgetPage';
import RecipesPage from './pages/RecipesPage';
import SettingsPage from './pages/SettingsPage';
import { useStock } from './hooks/useStock';
import { useShoppingList } from './hooks/useShoppingList';
import { useBudget } from './hooks/useBudget';
import { useRecipes } from './hooks/useRecipes';

export type TabName = 'home' | 'inventory' | 'shopping' | 'budget' | 'recipes' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<TabName>('home');

  const stockHook = useStock();
  const shoppingHook = useShoppingList();
  const budgetHook = useBudget();
  const recipesHook = useRecipes(stockHook.stock, budgetHook.remaining);

  const resetAll = () => {
    localStorage.clear();
    window.location.reload();
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home':      return <HomePage stock={stockHook} shopping={shoppingHook} budget={budgetHook} recipes={recipesHook} onTabChange={setActiveTab} />;
      case 'inventory': return <InventoryPage stock={stockHook} shopping={shoppingHook} />;
      case 'shopping':  return <ShoppingPage shopping={shoppingHook} stock={stockHook} />;
      case 'budget':    return <BudgetPage budget={budgetHook} />;
      case 'recipes':   return <RecipesPage recipes={recipesHook} shopping={shoppingHook} stock={stockHook} />;
      case 'settings':  return <SettingsPage budget={budgetHook} onReset={resetAll} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FFF8F0', maxWidth: '430px', margin: '0 auto' }}>
      <main className="flex-1 overflow-y-auto pb-20">
        {renderPage()}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
