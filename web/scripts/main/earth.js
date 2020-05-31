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
    {
      city: 'Hong Kong',
      lat: 22.3193,
      lon: 114.1694
    },
    {
      city: 'London',
      lat: 51.5074,
      lon: 0.1278
    },
];

const Earth = {
    createGlobe: () => {
        var earth = new WE.map('earth_div');

        WE.tileLayer('https://api.maptiler.com/maps/88a761b9-cca7-40a1-9d1a-cce662408371/{z}/{x}/{y}.png?key=J16kC7Zjej5UcrO1DsLF', {
            minZoom: 0,
            maxZoom: 5,
            attribution: 'NASA'
        }).addTo(earth);

        data.map((dat, key) => {
            var marker = WE.marker([dat.lat, dat.lon], './assets/Ellipse.png', 14, 14).addTo(earth)
            marker.bindPopup(`<h2 id='marker-${key}'>${dat.city}</h2>`, { maxWidth: 150, closeButton: false }).openPopup()
        })



        let i = 0
        const increment = () => {
            i = (i + 1) % data.length

            earth.panTo([ data[i].lat, data[i].lon ])
        }

        setInterval(increment, 10000)
        increment()
        earth.setView([data[0].lat, data[0].lon], 4.5);
        // playHeadInfo.innerText = data[0].city

        var before = null;
        requestAnimationFrame(function animate(now) {
            const playHeadInfo = document.getElementById('playhead-info')
            var c = earth.getPosition();
            var elapsed = before? now - before: 0;
            before = now;

            data.map(({ city, lat, lon }, key) => {
                const near = [lat/c[0], lon/c[1]]
                const markerText = document.getElementById(`marker-${key}`)

                if (markerText) {
                    const markerParent = markerText.parentNode.parentNode.parentNode.parentNode

                    if ((near[0] <= 1.1 && near[0] >= 0.7) && (near[1] <= 1.1 && near[1] >= 0.7)) {
                        markerParent.firstElementChild.style.filter = 'grayscale(0)'
                        markerParent.firstElementChild.style.opacity = 1
                        markerParent.firstElementChild.style.width = '12px'
                        markerParent.firstElementChild.style.height = '12px'
                        markerParent.firstElementChild.style.marginLeft = '-6px'
                        playHeadInfo.innerText = city

                    } else {
                        markerParent.firstElementChild.style.filter = 'grayscale(100%)'
                        markerParent.firstElementChild.style.opacity = 0.5
                        markerParent.firstElementChild.style.width = '8px'
                        markerParent.firstElementChild.style.height = '8px'
                        markerParent.firstElementChild.style.marginLeft = '-4px'
                        playHeadInfo.innerText = ''
                    }
                }
            })


            requestAnimationFrame(animate);
        });
    }
}