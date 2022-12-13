import { address } from '../web3';
import { useState, useEffect, useCallback, useMemo } from 'react';

export function useMyAddress() {
    const [val, setVal] = useState(null);
    useEffect(() => {
        address.then(setVal);
    }, []);
    return val;
}