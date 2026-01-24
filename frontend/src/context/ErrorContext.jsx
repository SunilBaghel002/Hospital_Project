import React, { createContext, useState, useEffect, useContext } from 'react';
import ErrorModal from '../components/common/ErrorModal';
import { errorBus } from '../utils/errorBus';

const ErrorContext = createContext();

export function ErrorProvider({ children }) {
    const [errorState, setErrorState] = useState({
        isOpen: false,
        title: 'Error',
        message: ''
    });

    useEffect(() => {
        const removeListener = errorBus.on((event, data) => {
            if (event === 'SHOW_ERROR') {
                setErrorState({
                    isOpen: true,
                    title: data.title || 'Error',
                    message: data.message
                });
            }
        });

        return () => removeListener();
    }, []);

    const closeError = () => {
        setErrorState(prev => ({ ...prev, isOpen: false }));
    };

    const showError = (message, title = 'Error') => {
        setErrorState({
            isOpen: true,
            title,
            message
        });
    };

    return (
        <ErrorContext.Provider value={{ showError }}>
            {children}
            <ErrorModal
                isOpen={errorState.isOpen}
                onClose={closeError}
                title={errorState.title}
                message={errorState.message}
            />
        </ErrorContext.Provider>
    );
}

export const useError = () => useContext(ErrorContext);
