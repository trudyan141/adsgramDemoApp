import React from 'react';

type NoteType = 'info' | 'warning' | 'success' | 'error';

interface ImportantNoteProps {
  message: React.ReactNode;
  icon?: React.ReactNode;
  type?: NoteType;
}

const ImportantNote: React.FC<ImportantNoteProps> = ({ 
  message,
  type = 'info',
  icon
}) => {
  // Define styles based on type
  const styles = {
    info: {
      border: 'border-blue-200',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      iconColor: 'text-blue-600'
    },
    warning: {
      border: 'border-amber-200',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      iconColor: 'text-amber-600'
    },
    success: {
      border: 'border-green-200',
      bg: 'bg-green-50',
      text: 'text-green-700',
      iconColor: 'text-green-600'
    },
    error: {
      border: 'border-red-300',
      bg: 'bg-red-50',
      text: 'text-red-800',
      iconColor: 'text-red-600'
    }
  };

  const style = styles[type];

  // Default icons for each type
  const defaultIcons = {
    info: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    ),
    warning: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    ),
    success: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    ),
    error: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    )
  };

  // Use provided icon or default based on type
  const iconToShow = icon || defaultIcons[type];

  return (
    <div className={`flex items-center p-4 mt-4 rounded-lg border shadow-sm ${style.border} ${style.bg}`}>
      <div className={`mr-3 ${style.iconColor}`}>
        {iconToShow}
      </div>
      <div className={`text-sm font-medium ${style.text}`}>
        {message}
      </div>
    </div>
  );
};

export default ImportantNote; 