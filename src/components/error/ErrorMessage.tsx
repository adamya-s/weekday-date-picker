import React from 'react';

import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  onClose: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  return (
    <div role='alert' className='error-message' aria-live='polite'>
      <p>{message}</p>
      <button onClick={onClose} aria-label='Close error message'>
        ×
      </button>
    </div>
  );
};

export default ErrorMessage;
