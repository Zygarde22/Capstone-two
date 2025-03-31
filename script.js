"use strict";

document.addEventListener('DOMContentLoaded', () => {
    console.log('Page Loaded');
  
});

document.addEventListener('DOMContentLoaded', () => {
    const breweryContainer = document.getElementById('brewery-container');
    const apiUrl = 'https://api.openbrewerydb.org/breweries?by_country=united%20states&per_page=3';

    async function fetchBreweries() {
        try {
            const response = await fetch(apiUrl);
            const breweries = await response.json();
            displayBreweries(breweries);
        } catch (error) {
            console.error('Error fetching breweries:', error);
            breweryContainer.innerHTML = '<p class="text-red-500">Failed to load breweries. Please try again later.</p>';
        }
    }

    function displayBreweries(breweries) {
        breweryContainer.innerHTML = breweries.map(brewery => `
            <div class="bg-white p-4 shadow-lg rounded-lg m-2">
                <h3 class="text-xl font-bold">${brewery.name}</h3>
                <p class="text-gray-700"><strong>Location:</strong> ${brewery.city}, ${brewery.state}</p>
                <p class="text-gray-700"><strong>Type:</strong> ${brewery.brewery_type}</p>
                ${brewery.website_url ? `<a href="${brewery.website_url}" class="text-blue-500 hover:underline" target="_blank">Visit Website</a>` : '<p class="text-gray-500">No website available</p>'}
            </div>
        `).join('');
    }

    // Initial fetch
    fetchBreweries();
});

// Fix navigation menu toggle
document.getElementById('menu-toggle').addEventListener('click', function () {
    const menu = document.getElementById('menu');
    const isExpanded = this.getAttribute("aria-expanded") === "true";
    this.setAttribute("aria-expanded", !isExpanded);
    menu.classList.toggle('hidden');
});
