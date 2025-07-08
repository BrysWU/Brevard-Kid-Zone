# Kids Services Map Finder

A static website that helps users find parks, playgrounds, museums, and fun spots for children near a U.S. ZIP code.

## Features

- **Free & open:** No paid APIs, no backend.
- **Map:** Leaflet + OpenStreetMap.
- **ZIP code search:** Uses a local JSON file.
- **Locations:** Easily editable in `locations.json`.
- **Deploy:** Ready for GitHub Pages.

## How To Use

1. **Edit `locations.json`**  
   Add more locations or update with your own!

2. **Expand `zipcodes.json` (optional)**  
   For more coverage, you can download public U.S. ZIP code → lat/lng data and replace or expand this file.

3. **Deploy:**
   - Push all files to a GitHub repo.
   - In repo settings, enable GitHub Pages (deploy from `main` branch or `/docs` folder).
   - Your site is live!

## How It Works

- User enters a ZIP code.
- Map centers on that ZIP.
- All locations within 10 miles are listed and shown on the map.

---

**Map data &copy; [OpenStreetMap](https://openstreetmap.org) contributors**  
Built with [Leaflet](https://leafletjs.com/)