import { AlertCircle, AlertTriangle, Trash2, WifiOff, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  type?: 'load' | 'save' | 'delete' | 'network';
  onRetry?: () => void;
}

export default function ErrorState({ error, type = 'load', onRetry }: ErrorStateProps) {
  const configs = {
    load: {
      title: "Unable to load your freezer inventory",
      icon: <AlertCircle className="w-16 h-16 text-red-400" />,
      suggestions: [
        "Check your internet connection",
        "Refresh the page",
        "Try again in a few moments"
      ]
    },
    save: {
      title: "Failed to save changes",
      icon: <AlertTriangle className="w-16 h-16 text-yellow-400" />,
      suggestions: [
        "Your changes have not been saved",
        "Check your internet connection",
        "Try saving again"
      ]
    },
    delete: {
      title: "Failed to delete item",
      icon: <Trash2 className="w-16 h-16 text-red-400" />,
      suggestions: [
        "The item could not be deleted",
        "It may be in use or protected",
        "Try again or contact support"
      ]
    },
    network: {
      title: "Connection problem",
      icon: <WifiOff className="w-16 h-16 text-gray-400" />,
      suggestions: [
        "Check your internet connection",
        "Your data may be stored locally",
        "Changes will sync when reconnected"
      ]
    }
  };

  const config = configs[type];

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center mb-4">
          {config.icon}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {config.title}
        </h3>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-800">
            {error}
          </p>
        </div>
        
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">What you can try:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            {config.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {onRetry && (
          <div className="flex gap-3 justify-center">
            <button
              onClick={onRetry}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}