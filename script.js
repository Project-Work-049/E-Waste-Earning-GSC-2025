// Map functionality
let map;
const mapError = document.getElementById('map-error');

// Predefined collection points worldwide
const collectionPoints = [
    // Asia
    {
        name: "E-Waste Collection Center - Shivaji Nagar",
        lat: 18.5314,
        lng: 73.8446,
        type: "recycling-center",
        address: "Shivaji Nagar, Pune, India",
        phone: "+91 1234567890",
        hours: "9:00 AM - 6:00 PM"
    },
    {
        name: "E-Waste Facility - Tokyo",
        lat: 35.6762,
        lng: 139.6503,
        type: "recycling-center",
        address: "Shibuya Ward, Tokyo, Japan",
        phone: "+81 3-1234-5678",
        hours: "8:00 AM - 5:00 PM"
    },
    {
        name: "Collection Point - Singapore",
        lat: 1.3521,
        lng: 103.8198,
        type: "drop-off",
        address: "Marina Bay, Singapore",
        phone: "+65 6789-0123",
        hours: "10:00 AM - 8:00 PM"
    },

    // Europe
    {
        name: "Recycling Center - London",
        lat: 51.5074,
        lng: -0.1278,
        type: "recycling-center",
        address: "City of London, UK",
        phone: "+44 20 7123 4567",
        hours: "9:00 AM - 6:00 PM"
    },
    {
        name: "E-Waste Facility - Paris",
        lat: 48.8566,
        lng: 2.3522,
        type: "recycling-center",
        address: "1st Arrondissement, Paris, France",
        phone: "+33 1 23 45 67 89",
        hours: "8:00 AM - 5:00 PM"
    },
    {
        name: "Collection Point - Berlin",
        lat: 52.5200,
        lng: 13.4050,
        type: "drop-off",
        address: "Mitte, Berlin, Germany",
        phone: "+49 30 12345678",
        hours: "10:00 AM - 7:00 PM"
    },

    // North America
    {
        name: "Recycling Center - New York",
        lat: 40.7128,
        lng: -74.0060,
        type: "recycling-center",
        address: "Manhattan, NYC, USA",
        phone: "+1 212-123-4567",
        hours: "9:00 AM - 6:00 PM"
    },
    {
        name: "E-Waste Facility - Los Angeles",
        lat: 34.0522,
        lng: -118.2437,
        type: "recycling-center",
        address: "Downtown LA, USA",
        phone: "+1 213-123-4567",
        hours: "8:00 AM - 5:00 PM"
    },
    {
        name: "Collection Point - Toronto",
        lat: 43.6532,
        lng: -79.3832,
        type: "drop-off",
        address: "Downtown Toronto, Canada",
        phone: "+1 416-123-4567",
        hours: "10:00 AM - 8:00 PM"
    },

    // South America
    {
        name: "Recycling Center - São Paulo",
        lat: -23.5505,
        lng: -46.6333,
        type: "recycling-center",
        address: "Centro, São Paulo, Brazil",
        phone: "+55 11 1234-5678",
        hours: "9:00 AM - 6:00 PM"
    },
    {
        name: "E-Waste Facility - Buenos Aires",
        lat: -34.6037,
        lng: -58.3816,
        type: "recycling-center",
        address: "Microcentro, Buenos Aires, Argentina",
        phone: "+54 11 1234-5678",
        hours: "8:00 AM - 5:00 PM"
    },

    // Africa
    {
        name: "Collection Point - Cape Town",
        lat: -33.9249,
        lng: 18.4241,
        type: "drop-off",
        address: "City Bowl, Cape Town, South Africa",
        phone: "+27 21 123 4567",
        hours: "9:00 AM - 6:00 PM"
    },
    {
        name: "Recycling Center - Cairo",
        lat: 30.0444,
        lng: 31.2357,
        type: "recycling-center",
        address: "Downtown Cairo, Egypt",
        phone: "+20 2 1234 5678",
        hours: "8:00 AM - 5:00 PM"
    },

    // Oceania
    {
        name: "E-Waste Facility - Sydney",
        lat: -33.8688,
        lng: 151.2093,
        type: "recycling-center",
        address: "CBD, Sydney, Australia",
        phone: "+61 2 1234 5678",
        hours: "9:00 AM - 6:00 PM"
    },
    {
        name: "Collection Point - Auckland",
        lat: -36.8485,
        lng: 174.7633,
        type: "drop-off",
        address: "CBD, Auckland, New Zealand",
        phone: "+64 9 123 4567",
        hours: "10:00 AM - 7:00 PM"
    }
];

function showError(message) {
    if (mapError) {
        mapError.textContent = message;
        mapError.style.display = 'block';
    }
}

function addCollectionPoint(point) {
    const icon = L.divIcon({
        className: point.type === 'recycling-center' ? 'recycling-center' : 'drop-off-point',
        html: `<div style="background-color: ${point.type === 'recycling-center' ? '#27ae60' : '#3498db'}; 
                      width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
    });

    const popupContent = `
        <div style="color: white;">
            <h3 style="margin-bottom: 10px;">${point.name}</h3>
            <p><strong>Type:</strong> ${point.type === 'recycling-center' ? 'Recycling Center' : 'Drop-off Point'}</p>
            <p><strong>Address:</strong> ${point.address}</p>
            <p><strong>Phone:</strong> ${point.phone}</p>
            <p><strong>Hours:</strong> ${point.hours}</p>
        </div>
    `;

    L.marker([point.lat, point.lng], { icon })
        .bindPopup(popupContent)
        .addTo(map);
}

function initMap() {
    try {
        // Initialize the map with a world view
        map = L.map('map').setView([20, 0], 2);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = [position.coords.latitude, position.coords.longitude];
                    
                    // Center map on user's location
                    map.setView(userLocation, 12);

                    // Add user location marker
                    L.marker(userLocation, {
                        icon: L.divIcon({
                            className: 'user-marker',
                            html: '<div style="background-color: #e74c3c; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
                            iconSize: [12, 12],
                            iconAnchor: [6, 6]
                        })
                    })
                    .bindPopup('Your Location')
                    .addTo(map);

                    // Add all collection points
                    collectionPoints.forEach(point => addCollectionPoint(point));
                },
                (error) => {
                    console.error("Error getting location:", error);
                    showError("Unable to get your location. Please enable location services.");
                    // Add collection points even if location is not available
                    collectionPoints.forEach(point => addCollectionPoint(point));
                }
            );
        } else {
            showError("Geolocation is not supported by your browser");
            // Add collection points even if geolocation is not supported
            collectionPoints.forEach(point => addCollectionPoint(point));
        }
    } catch (error) {
        console.error("Error initializing map:", error);
        showError("Error loading the map. Please try refreshing the page.");
    }
}

function searchLocation() {
    const searchInput = document.getElementById('location-search');
    if (searchInput && searchInput.value) {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredPoints = collectionPoints.filter(point => 
            point.name.toLowerCase().includes(searchTerm) ||
            point.address.toLowerCase().includes(searchTerm)
        );

        if (filteredPoints.length > 0) {
            // Center map on the first matching point
            map.setView([filteredPoints[0].lat, filteredPoints[0].lng], 13);
        } else {
            alert('No collection points found matching your search.');
        }
    }
}

// Initialize map when the page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('map')) {
        initMap();
    }
    
    // Add animation to title
    const animatedTitle = document.querySelector('.animated-title');
    if (animatedTitle) {
        animatedTitle.classList.add('fade-in');
    }

    // Add animation to eco icon
    const ecoAnimation = document.querySelector('.eco-animation');
    if (ecoAnimation) {
        ecoAnimation.classList.add('pulse');
    }

    // Add smooth scrolling to navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}); 