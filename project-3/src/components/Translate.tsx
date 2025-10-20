import React, { useEffect } from 'react';

const GoogleTranslate = () => {
    
    useEffect(() => {
        // Create a script element for Google Translate API
        const translateScript = document.createElement('script');
        translateScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        
        // Append the script element to the body
        document.body.appendChild(translateScript);
        
        // Define the callback function to initialize Google Translate
        (window as any).googleTranslateElementInit = () => {
            new (window as any).google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
        };

        // Cleanup function to remove the script element and delete the callback function
        return () => {
            document.body.removeChild(translateScript);
            delete (window as any).googleTranslateElementInit;
        };
    }, []); // empty dependency array ensures this effect runs only once

    // Render the element where Google Translate will be initialized
    return (
        <div id="google_translate_element"></div>
    );
};

export default GoogleTranslate;
