import { useState, useEffect } from 'react';

const ZenToast = ({ message, emoji, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'from-green-50 to-emerald-50 border-green-200 text-green-800';
      case 'celebration':
        return 'from-purple-50 to-pink-50 border-purple-200 text-purple-800';
      case 'wisdom':
        return 'from-blue-50 to-cyan-50 border-blue-200 text-blue-800';
      case 'zen':
        return 'from-zen-50 to-serenity-50 border-zen-200 text-zen-800';
      default:
        return 'from-zen-50 to-serenity-50 border-zen-200 text-zen-800';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`zen-toast bg-gradient-to-r ${getToastStyles()} border ${
      isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'
    }`}>
      <div className="flex items-center space-x-3">
        {emoji && (
          <span className="text-lg animate-gentle-pulse">{emoji}</span>
        )}
        <p className="font-medium flex-1">{message}</p>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => {
              setIsVisible(false);
              onClose?.();
            }, 300);
          }}
          className="text-current opacity-60 hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Toast Manager Hook
export const useZenToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, options = {}) => {
    const id = Date.now();
    const toast = {
      id,
      message,
      emoji: options.emoji || '✨',
      type: options.type || 'success',
      duration: options.duration || 3000,
    };

    setToasts(prev => [...prev, toast]);

    // Auto-remove toast
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration + 500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <ZenToast
          key={toast.id}
          message={toast.message}
          emoji={toast.emoji}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );

  return { showToast, ToastContainer };
};

export default ZenToast;