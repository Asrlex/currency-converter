import './App.css'
import { useState, useEffect } from 'react'
import CurrencyInput from './components/CurrencyInput'

function App() {
    const [amount, setAmount] = useState<number | string>('');
    const [fromCurrency, setFromCurrency] = useState<string>('');
    const [toCurrency, setToCurrency] = useState<string>('');
    const [result, setResult] = useState<number | null>(null);
    const [currencies, setCurrencies] = useState<{ [key: string]: any }>({});
    const [inputError, setInputError] = useState<boolean>(false);

    useEffect(() => {
        const fetchCurrencies = async () => {
            const apiKey = import.meta.env.VITE_APP_API_KEY;
            const apiUrl = `https://api.freecurrencyapi.com/v1/currencies?apikey=${apiKey}`;
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                setCurrencies(data.data);
            } catch (error) {
                console.error('Error fetching currencies:', error);
            }
        };
        fetchCurrencies();
    }, []);

    const handleConvert = async () => {
        if (!amount || !fromCurrency || !toCurrency) {
            setInputError(true);
            setTimeout(() => setInputError(false), 2000);
            return;
        }

        const apiKey = import.meta.env.VITE_APP_API_KEY;
        const apiUrl = `https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}&base_currency=${fromCurrency.split(' - ')[0]}&currencies=${toCurrency.split(' - ')[0]}`;
        
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const conversionRate = data.data[toCurrency.split(' - ')[0]];
            setResult(parseFloat((parseFloat(amount as string) * conversionRate).toFixed(4)));
        } catch (error) {
            console.error('Error fetching conversion rate:', error);
        }
    }

    return (
        <div className="container">
            <h1>Currency Converter</h1>
            <div className="input-group">
                <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    step="any"
                    className={inputError ? 'input-error' : ''}
                />
                <CurrencyInput 
                    currency={fromCurrency} 
                    setCurrency={setFromCurrency} 
                    currencies={currencies} 
                    placeholder="From Currency" 
                />
                <CurrencyInput 
                    currency={toCurrency} 
                    setCurrency={setToCurrency} 
                    currencies={currencies} 
                    placeholder="To Currency" 
                />
            </div>
            <div className="button-group">
                {result !== null && (
                    <label className={`result-label ${result !== null ? 'show' : ''}`}>
                        <span className="result-number">{result}</span> <span className="result-currency">{toCurrency.split(' - ')[0]}</span>
                    </label>
                )}
                <button onClick={handleConvert}>Convert</button>
            </div>
        </div>
    )
}

export default App
