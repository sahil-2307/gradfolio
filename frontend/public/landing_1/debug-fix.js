// Emergency fix for name duplication
(function() {
    console.log('🔧 Running emergency name duplication fix...');
    
    // Function to fix duplication immediately
    function fixNameDuplication() {
        const heroElement = document.getElementById('hero-name') || document.querySelector('.hero-text h1');
        
        if (heroElement) {
            console.log('Found hero element:', heroElement);
            console.log('Current content:', heroElement.innerHTML);
            
            // Check if duplication exists
            const currentHTML = heroElement.innerHTML;
            if (currentHTML.includes('Hello, I\'m') && currentHTML.indexOf('Hello, I\'m') !== currentHTML.lastIndexOf('Hello, I\'m')) {
                console.log('🚨 Duplication detected!');
            }
            
            // Get the correct name from localStorage
            let correctName = 'Sahil Bhujbal'; // Default to your name
            
            try {
                const savedData = localStorage.getItem('portfolioData');
                if (savedData) {
                    const data = JSON.parse(savedData);
                    correctName = data.personal?.fullName || correctName;
                }
            } catch (e) {
                console.log('Using default name due to localStorage error');
            }
            
            // Force complete clear and replacement
            heroElement.textContent = ''; // Remove all content including nested elements
            heroElement.innerHTML = ''; // Double clear
            
            // Wait a moment then set new content
            setTimeout(() => {
                heroElement.innerHTML = `Hello, I'm <span class="highlight">${correctName}</span>`;
                console.log('✅ Fixed! New content:', heroElement.innerHTML);
                console.log('Name set to:', correctName);
            }, 10);
            
            return true;
        } else {
            console.log('❌ Hero element not found');
            return false;
        }
    }
    
    // Run fix multiple times to catch all script executions
    function runMultipleFixes() {
        fixNameDuplication();
        
        // Run again after a short delay
        setTimeout(fixNameDuplication, 100);
        setTimeout(fixNameDuplication, 300);
        setTimeout(fixNameDuplication, 500);
    }
    
    // Try to fix immediately and on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runMultipleFixes);
    } else {
        runMultipleFixes();
    }
    
    // Also run after other scripts might have loaded
    window.addEventListener('load', fixNameDuplication);
    
    // Add to global scope for manual execution
    window.emergencyNameFix = fixNameDuplication;
    
    console.log('🚀 Emergency fix loaded. You can also call: emergencyNameFix()');
})();