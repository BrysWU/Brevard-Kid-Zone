// Helper: Load JSON
function fetchJSON(url) {
  return fetch(url).then(res => {
    if (!res.ok) throw new Error(`Fetch failed for ${url}`);
    return res.json();
  });
}

let map, markersLayer;
let zipData = {};
let locations = [];

const RADIUS_MILES = 10; // Show locations within 10 miles

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const zipInput = document.getElementById('zip-input');
  const searchBtn = document.getElementById('search-btn');
  const searchError = document.getElementById('search-error');
  const resultsList = document.getElementById('results-list');

  // Init map
  map = L.map('map').setView([39.8283, -98.5795], 4); // Center of US
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 18,
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);

  // Load data
  Promise.all([
    fetchJSON('zipcodes.json'), 
    fetchJSON('locations.json')
  ]).then(([zipcodes, locs]) => {
    zipData = zipcodes;
    locations = locs;
  }).catch(err => {
    searchError.textContent = "Error loading data. Please try again later.";
    console.error(err);
  });

  // Search handler
  function handleSearch() {
    searchError.textContent = '';
    const zip = zipInput.value.trim();
    if (!/^\d{5}$/.test(zip)) {
      searchError.textContent = "Please enter a valid 5-digit ZIP code.";
      return;
    }
    if (!(zip in zipData)) {
      searchError.textContent = "ZIP code not found. Try another.";
      return;
    }
    const {lat, lng, city, state} = zipData[zip];

    // Find nearby locations (within RADIUS_MILES)
    const results = locations
      .map(loc => ({
        ...loc,
        distance: haversineMiles(lat, lng, loc.lat, loc.lng)
      }))
      .filter(loc => loc.distance <= RADIUS_MILES)
      .sort((a, b) => a.distance - b.distance);

    // Update map
    map.setView([lat, lng], 12);
    markersLayer.clearLayers();
    if (results.length === 0) {
      resultsList.innerHTML = `<li>No locations found within ${RADIUS_MILES} miles.</li>`;
    } else {
      results.forEach(loc => {
        const marker = L.marker([loc.lat, loc.lng])
          .addTo(markersLayer)
          .bindPopup(`<b>${loc.name}</b><br>${loc.type}<br>${loc.desc || ""}<br><em>${loc.distance.toFixed(1)} mi</em>`);
      });
      // Fit map bounds to markers
      const group = new L.featureGroup(results.map(loc => L.marker([loc.lat, loc.lng])));
      map.fitBounds(group.getBounds().pad(0.23));
      // Populate list
      resultsList.innerHTML = results.map(loc => `
        <li>
          <b>${loc.name}</b>
          <span class="place-type">${loc.type}</span>
          <span>(${loc.distance.toFixed(1)} mi)</span>
          <div>${loc.desc || ""}</div>
        </li>
      `).join('');
    }
  }

  // On search button click or Enter
  searchBtn.addEventListener('click', handleSearch);
  zipInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
});

// Haversine distance in miles
function haversineMiles(lat1, lng1, lat2, lng2) {
  const toRad = d => d * Math.PI / 180;
  const R = 3958.8; // Earth radius in miles
  const dLat = toRad(lat2-lat1), dLng = toRad(lng2-lng1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}