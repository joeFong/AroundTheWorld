const data = [
    {
      city: 'New York',
      lat: 40.7128,
      lon: 74.0060
    },
    {
      city: 'Seoul',
      lat: 37.5665,
      lon: 126.9780
    },
];

const Earth = {
    createGlobe: () => {
        var options = { center: [0, 0], zoom: 2};
        var earth = new WE.map('earth_div', options);
        
        earth.setView([46.8011, 8.2266], 2);
        
        WE.tileLayer('https://api.maptiler.com/maps/88a761b9-cca7-40a1-9d1a-cce662408371/{z}/{x}/{y}.png?key=J16kC7Zjej5UcrO1DsLF', {
            minZoom: 0,
            maxZoom: 5,
            attribution: 'NASA'
        }).addTo(earth);
        
        data.map((dat) => {  
            var marker = WE.marker([dat.lat, dat.lon], './assets/Ellipse.png', 14, 14).addTo(earth)
            // marker.bindPopup(`<h2>${dat.city}</h2>`, { maxWidth: 150, closeButton: false }).openPopup()
            marker.bindPopup(`<h2>${dat.city}</h2>`, { maxWidth: 150, closeButton: false })
        })
        
        var before = null;
        requestAnimationFrame(function animate(now) {
            var c = earth.getPosition();
            var elapsed = before? now - before: 0;
            before = now;
            earth.setCenter([c[0], c[1] + 0.1*(elapsed/60)]);
            requestAnimationFrame(animate);
        });
    }
}