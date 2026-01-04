import React, { useEffect } from 'react';
import './HackerBanner.css';

const HackerBanner: React.FC = () => {
    // 1. Text, ktorý sa má opakovať
    const phrase = "youh4ck3dme | ";

    // 2. Vygenerujeme dlhý reťazec (napr. 150 opakovaní), 
    // aby sme mali istotu, že to pokryje šírku aj na 4K monitore pri veľkosti 3px.
    const longText = Array(150).fill(phrase).join("");

    // 3. Dynamické načítanie fontu
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Anonymous+Pro&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        return () => {
            // Check if it's still in the document before removing to avoid errors
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
        };
    }, []);

    return (
        <div className="hacker-banner-container">
            <div className="hacker-banner-scroller">
                {/* Prvá sada textu */}
                <span className="hacker-text">{longText}</span>

                {/* Druhá sada textu (duplikát pre nekonečnú slučku) */}
                <span className="hacker-text">{longText}</span>
            </div>
        </div>
    );
};

export default HackerBanner;
