import { useState } from 'react';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import InventoryPage from './pages/InventoryPage';
import ShoppingPage from './pages/ShoppingPage';
import BudgetPage from './pages/BudgetPage';
import RecipesPage from './pages/RecipesPage';
import SettingsPage from './pages/SettingsPage';
import SetupPage from './pages/SetupPage';
import GuideModal from './components/GuideModal';
import { useStock } from './hooks/useStock';
import { useShoppingList } from './hooks/useShoppingList';
import { useBudget } from './hooks/useBudget';
import { useRecipes } from './hooks/useRecipes';
import { useSetup } from './hooks/useSetup';
import { useGuide } from './hooks/useGuide';
import type { DataMode } from './types';

export type TabName = 'home' | 'inventory' | 'shopping' | 'budget' | 'recipes' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [expiryTabTrigger, setExpiryTabTrigger] = useState(0);

  const setup       = useSetup();
  const guide       = useGuide();
  const stockHook   = useStock();
  const shoppingHook = useShoppingList();
  const budgetHook  = useBudget();
  const recipesHook = useRecipes(stockHook.stock, budgetHook.remaining);

  const handleSetupComplete = (dataMode: DataMode) => {
    if (dataMode === 'real') {
      stockHook.clearUserData();
      shoppingHook.clearAll();
      budgetHook.clearEntries();
      recipesHook.clearFeedbacks();
    }
    setup.completeSetup(dataMode);
  };

  const resetAll = () => {
    localStorage.clear();
    window.location.reload();
  };

  const resetSetup = () => {
    setup.resetSetup();
  };

  const handleNavigateToExpiryRecipes = () => {
    setActiveTab('recipes');
    setExpiryTabTrigger(prev => prev + 1);
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home':      return <HomePage      stock={stockHook} shopping={shoppingHook} budget={budgetHook} recipes={recipesHook} onTabChange={setActiveTab} onNavigateToExpiryRecipes={handleNavigateToExpiryRecipes} />;
      case 'inventory': return <InventoryPage stock={stockHook} shopping={shoppingHook} />;
      case 'shopping':  return <ShoppingPage  shopping={shoppingHook} stock={stockHook} />;
      case 'budget':    return <BudgetPage    budget={budgetHook} />;
      case 'recipes':   return <RecipesPage   recipes={recipesHook} shopping={shoppingHook} stock={stockHook} expiryTabTrigger={expiryTabTrigger} />;
      case 'settings':  return <SettingsPage  budget={budgetHook} onReset={resetAll} onResetSetup={resetSetup} />;
    }
  };

  // 初回セットアップ未完了なら SetupPage を全画面表示
  if (!setup.isSetupComplete) {
    return (
      <div style={{ minHeight: '100svh', backgroundColor: '#EDD5C8', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <div style={{ width: '100%', maxWidth: '430px', minHeight: '100svh', backgroundColor: '#FFF8F1', boxShadow: '0 0 48px rgba(0,0,0,0.14)' }}>
          <SetupPage
            onComplete={handleSetupComplete}
            defaultBudget={budgetHook.weeklyBudget.amount}
            onBudgetChange={budgetHook.updateBudget}
          />
        </div>
      </div>
    );
  }

  return (
    /* PC表示：ピンクベージュ背景に中央配置のスマホシェル */
    <div style={{
      minHeight: '100svh',
      backgroundColor: '#EDD5C8',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '430px',
        minHeight: '100svh',
        backgroundColor: '#FFF8F1',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 0 48px rgba(0,0,0,0.14)',
      }}>
        <main style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px' }}>
          {renderPage()}
        </main>
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        {setup.isSetupComplete && !guide.isTourSeen && (
          <GuideModal onClose={guide.markTourSeen} />
        )}
      </div>
    </div>
  );
}

export default App;
