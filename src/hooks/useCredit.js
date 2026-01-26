// src/hooks/useCredit.js
import { useOrder } from '../context/OrderContext';
import { useEffect, useState } from 'react';

export const useCredit = () => {
  const { credit, refreshCredit } = useOrder();
  const [localCredit, setLocalCredit] = useState(credit);

  useEffect(() => {
    setLocalCredit(credit);
  }, [credit]);

  const refresh = () => {
    refreshCredit();
    // Fuerza localStorage
    const mvp = localStorage.getItem('userCredito') || '10000.00';
    console.log('🔄 Refresh $10K:', mvp);
  };

  return { credit: localCredit, refresh };
};
