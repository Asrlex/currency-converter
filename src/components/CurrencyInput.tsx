
import React, { useState, useRef, useEffect } from 'react';
import './CurrencyInput.css';

interface CurrencyInputProps {
    currency: string;
    setCurrency: (currency: string) => void;
    currencies: { [key: string]: any };
    placeholder: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ currency, setCurrency, currencies, placeholder }) => {
    const [filteredCurrencies, setFilteredCurrencies] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const inputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase();
        setCurrency(value);
        setFilteredCurrencies(Object.keys(currencies).filter(currency => 
            currency.includes(value) || currencies[currency].name.toUpperCase().includes(value)
        ));
        setShowDropdown(true);
    };

    const handleCurrencyClick = () => {
        const value = currency.toUpperCase();
        setFilteredCurrencies(Object.keys(currencies).filter(currency => 
            currency.includes(value) || currencies[currency].name.toUpperCase().includes(value)
        ));
        setShowDropdown(true);
    };

    const selectCurrency = (currency: string) => {
        setCurrency(`${currency} - ${currencies[currency].name}`);
        setShowDropdown(false);
    };

    return (
        <div className="currency-input" ref={inputRef}>
            <input 
                type="text" 
                value={currency} 
                onChange={handleCurrencyChange} 
                onClick={handleCurrencyClick}
                placeholder={placeholder} 
            />
            {showDropdown && (
                <ul className="currency-dropdown">
                    {filteredCurrencies.map(currency => (
                        <li key={currency} onClick={() => selectCurrency(currency)}>
                            {currency} - {currencies[currency].name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CurrencyInput;