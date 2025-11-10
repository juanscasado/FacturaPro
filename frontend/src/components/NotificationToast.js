import React from 'react';

export default function NotificationToast({ notifications, onRemove }) {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`
            max-w-sm p-4 rounded-lg shadow-lg border-l-4 transform transition-all duration-300 ease-in-out
            ${notification.type === 'success' 
              ? 'bg-green-50 border-green-400 text-green-800' 
              : notification.type === 'warning'
              ? 'bg-yellow-50 border-yellow-400 text-yellow-800'
              : 'bg-red-50 border-red-400 text-red-800'
            }
          `}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {notification.type === 'success' && (
                <span className="text-green-500 text-lg">✅</span>
              )}
              {notification.type === 'error' && (
                <span className="text-red-500 text-lg">❌</span>
              )}
              {notification.type === 'warning' && (
                <span className="text-yellow-500 text-lg">⚠️</span>
              )}
              {notification.type === 'info' && (
                <span className="text-blue-500 text-lg">ℹ️</span>
              )}
            </div>
            <div className="ml-3 flex-1">
              {notification.title && (
                <h3 className={`text-sm font-medium ${
                  notification.type === 'success' ? 'text-green-800' :
                  notification.type === 'warning' ? 'text-yellow-800' :
                  notification.type === 'info' ? 'text-blue-800' :
                  'text-red-800'
                }`}>
                  {notification.title}
                </h3>
              )}
              <div className={`text-sm ${
                notification.type === 'success' ? 'text-green-700' :
                notification.type === 'warning' ? 'text-yellow-700' :
                notification.type === 'info' ? 'text-blue-700' :
                'text-red-700'
              }`}>
                {notification.message}
              </div>
              {notification.action && (
                <div className="mt-2">
                  <button
                    onClick={notification.action.onClick}
                    className={`text-xs px-2 py-1 rounded ${
                      notification.type === 'success' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                      notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                      notification.type === 'info' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                      'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {notification.action.label}
                  </button>
                </div>
              )}
            </div>
            <div className="ml-4">
              <button
                onClick={() => onRemove(notification.id)}
                className={`text-xs opacity-70 hover:opacity-100 ${
                  notification.type === 'success' ? 'text-green-600' :
                  notification.type === 'warning' ? 'text-yellow-600' :
                  notification.type === 'info' ? 'text-blue-600' :
                  'text-red-600'
                }`}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}