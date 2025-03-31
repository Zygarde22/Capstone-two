"use strict"

document.addEventListener('DOMContentLoaded', () => {
    const breweryContainer = document.getElementById('brewery-container');

    // API endpoint to get breweries in South Korea
    const apiUrl = 'https://api.openbrewerydb.org/v1/breweries?by_country=united%20states&per_page=3'
;

 
    async function fetchBreweries() {
        try {
            const response = await fetch(apiUrl);
            const breweries = await response.json();
            displayBreweries(breweries);
        } catch (error) {
            console.error('Error fetching breweries:', error);
            breweryContainer.innerHTML = '<p>Failed to load breweries. Please try again later.</p>';
        }
    }

     
    function displayBreweries(breweries) {
        breweryContainer.innerHTML = '';
        breweries.forEach(brewery => {
            const breweryCard = `
                <div class="card m-2" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">${brewery.name}</h5>
                        <p class="card-text">
                            <strong>Location:</strong> ${brewery.city}, ${brewery.state}<br>
                            <strong>Type:</strong> ${brewery.brewery_type}
                        </p>
                        ${brewery.website_url ? `<a href="${brewery.website_url}" class="btn btn-primary" target="_blank">Visit Website</a>` : '<p>No website available</p>'}
                    </div>
                </div>
            `;
            breweryContainer.innerHTML += breweryCard;
        });
    }

    // Initial fetch when the page loads
    fetchBreweries();
});

