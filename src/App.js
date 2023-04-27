import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './App.scss';

function App() {
    const [url, setUrl] = useState('');
    const [shortenedUrls, setShortenedUrls] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    useEffect(() => {
        const storedUrls = JSON.parse(localStorage.getItem('shortenedUrls'));
        if (storedUrls) {
            setShortenedUrls(storedUrls);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('shortenedUrls', JSON.stringify(shortenedUrls));
    }, [shortenedUrls]);

    const shortenUrl = async (e) => {
        e.preventDefault();
        if (!url) {
            setErrorMessage('Please enter a URL');
            return;
        }
        try {
            const response = await fetch(
                `https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(url)}`
            );
            const data = await response.json();
            if (data.ok) {
                setShortenedUrls([...shortenedUrls, { original: url, short: data.result.full_short_link }]);
                setUrl('');
                setErrorMessage('');
            } else {
                setErrorMessage(data.error);
            }
        } catch (error) {
            setErrorMessage('Error shortening URL');
        }
    };

    return (
        <div className="App">
            <h1>URL Shortener</h1>
            <form onSubmit={shortenUrl}>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter URL to shorten"
                />
                <button type="submit">Shorten</button>
            </form>
            {errorMessage && <div className="error">{errorMessage}</div>}
            <ul>
                {shortenedUrls.map((url, index) => (
                    <li key={index}>
                        <span>{url.original}</span>
                        <a href={url.short} target="_blank" rel="noopener noreferrer">
                            {url.short}
                        </a>
                        <CopyToClipboard text={url.short}>
                            <button>Copy</button>
                        </CopyToClipboard>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;