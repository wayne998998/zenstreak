import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import { useZenToast } from './components/ZenToast';
import './App.css';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { showToast, ToastContainer } = useZenToast();

  useEffect(() => {
    // Add a small delay for smoother loading animation
    setTimeout(() => setIsLoaded(true), 200);
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      {/* Enhanced Ambient Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Primary mint orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-mint-200/15 via-mint-100/10 to-transparent rounded-full blur-3xl animate-zen-float-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-gradient-to-br from-sage-200/15 via-sage-100/10 to-transparent rounded-full blur-3xl animate-zen-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-gradient-to-br from-lime-200/15 via-lime-100/10 to-transparent rounded-full blur-3xl animate-zen-float" style={{animationDelay: '4s'}}></div>
        
        {/* Additional subtle mint elements */}
        <div className="absolute top-3/4 left-1/2 w-24 h-24 bg-gradient-to-br from-mint-300/10 to-transparent rounded-full blur-2xl animate-zen-float-slow" style={{animationDelay: '6s'}}></div>
        <div className="absolute top-1/6 right-1/2 w-20 h-20 bg-gradient-to-br from-sage-300/10 to-transparent rounded-full blur-2xl animate-zen-float" style={{animationDelay: '3s'}}></div>
        
        {/* Meditation breathing overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-mint-50/5 via-transparent to-sage-50/5 animate-breathe-slow"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10">
        <Dashboard onToast={showToast} />
        
        {/* Enhanced Footer with meditation inspiration */}
        <footer className="text-center py-zen-2xl mt-zen-2xl">
          <div className="max-w-md mx-auto px-4">
            <div className="zen-card p-zen-lg mb-zen-lg">
              <p className="text-sage-700 text-zen-sm font-medium mb-2">
                "Peace comes from within. Do not seek it without."
              </p>
              <p className="text-sage-500 text-zen-xs italic">
                — Buddha
              </p>
            </div>
            <div className="flex items-center justify-center space-x-3 text-mint-500 text-zen-xs">
              <span className="animate-gentle-pulse">🧘‍♀️</span>
              <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-mint-300 to-transparent rounded-full"></div>
              <span className="font-medium">Mindful moments matter</span>
              <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-sage-300 to-transparent rounded-full"></div>
              <span className="animate-gentle-pulse" style={{animationDelay: '1s'}}>🧘‍♂️</span>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default App;