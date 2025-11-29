// header-loader.js
// Dynamically load the common header into all pages

(function() {
    'use strict';

    // Function to load header
    function loadHeader() {
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (!headerPlaceholder) {
            console.error('Header placeholder not found');
            return;
        }

        // Determine the correct path to header.html based on current location
        const path = window.location.pathname;
        let headerPath = 'header.html';

        // If we're in a subdirectory (like howtoAI/), adjust the path
        if (path.includes('/howtoAI/') || path.includes('/startup/') || path.includes('/creative/')) {
            headerPath = '../header.html';
        }

        // Fetch and insert the header
        fetch(headerPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load header: ' + response.status);
                }
                return response.text();
            })
            .then(html => {
                headerPlaceholder.innerHTML = html;
                // Initialize hamburger menu after header is loaded
                initializeHamburgerMenu();
            })
            .catch(error => {
                console.error('Error loading header:', error);
                // Fallback: show a basic navigation
                headerPlaceholder.innerHTML = '<p style="padding: 20px; text-align: center;">Navigation failed to load</p>';
            });
    }

    // Function to initialize hamburger menu (from script.js)
    function initializeHamburgerMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function() {
                this.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                const isClickInsideNav = navMenu.contains(event.target);
                const isClickOnHamburger = hamburger.contains(event.target);

                if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });

            // Close menu when clicking on a link
            const navLinks = navMenu.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }

    // Load header when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadHeader);
    } else {
        loadHeader();
    }
})();
