const data = [
    {
        city: 'Seoul',
        lat: 37.5665,
        lon: 126.9780,
        url: 'http://localhost:4000/sound/1.mp3'
    },
    {
        city: 'Hong Kong',
        lat: 22.3193,
        lon: 114.1694,
        url: 'http://localhost:4000/sound/2.mp3'
    },
    {
        city: 'London',
        lat: 51.5074,
        lon: 0.1278,
        url: 'http://localhost:4000/sound/3.mp3'
    },
    {
        city: 'Tokyo',
        lat: 35.40,
        lon: 139.45,
        url: 'http://localhost:4000/sound/4.mp3'
    },
    {
        city: 'Berlin',
        lat: 52.5200,
        lon: 13.4050,
        url: 'http://localhost:4000/sound/5.mp3'
    },
    {
        city: 'Paris',
        lat: 48.8566,
        lon: 2.3522,
        url: 'http://localhost:4000/sound/6.mp3'
    },
    {
        city: 'Beijing',
        lat: 39.9042,
        lon: 116.4074,
        url: 'http://localhost:4000/sound/7.mp3'
    },
    {
        city: 'Copenhagen',
        lat: 55.6761,
        lon: 12.5683,
        url: 'http://localhost:4000/sound/8.mp3'
    },
    {
        city: 'Stockholm',
        lat: 59.3293,
        lon: 18.0686,
        url: 'http://localhost:4000/sound/9.mp3'
    },
    {
        city: 'Rio de Janeiro',
        lat: 22.9068,
        lon: 43.1729
    },
    {
        city: 'Mexico City',
        lat: 19.4326,
        lon: 99.1332
    },
    {
        city: 'Panama City',
        lat: 8.9824,
        lon: 79.5199
    },
    {
        city: 'Budapest',
        lat: 47.4979,
        lon: 19.0402
    },
    {
        city: 'Cope Town',
        lat: 33.9249,
        lon: 18.4241
    },
];

var currentBegin = 0;
var currentEnd = 5;

let animation = null
let increment = null

const Earth = {
    createGlobe: () => {
        var earth = new WE.map('earth_div');
        var cities = [];

        WE.tileLayer('https://api.maptiler.com/maps/88a761b9-cca7-40a1-9d1a-cce662408371/{z}/{x}/{y}.png?key=J16kC7Zjej5UcrO1DsLF', {
            minZoom: 0,
            maxZoom: 5,
            attribution: 'NASA'
        }).addTo(earth);

        let i = 0
        let count = 0;
        let pointer = 0;
        const playHeadInfo = document.getElementById('playhead-info')

        let currentMarkers = [];

        increment = () => {

            i = (i + 1) % data.length

            if(count >= cities.length) {
                count = 0;
                currentBegin = 0;
                currentEnd = 5;
            }

            if(count++ % 3 === 0) {
                currentBegin = i
                currentEnd = i + 5;

                cities = data.slice(currentBegin, currentEnd);

                currentMarkers.map((marker) => {
                    marker.removeFrom(earth);
                })
                currentMarkers = []

                cities.map((dat, key) => {
                    var marker = WE.marker([dat.lat, dat.lon], './assets/Ellipse.png', 14, 14).addTo(earth)
                    marker.bindPopup(`<h2 id='marker-${key}'>${dat.city} #${1000 + key}</h2>`, { maxWidth: 150, closeButton: false }).openPopup()
                    currentMarkers.push(marker);
                })
            }

            earth.panTo([ cities[pointer].lat, cities[pointer].lon ])

            setTimeout(() => {
                if(pointer % 3 === 0) {
                    pointer = 0;
                }

                currentMarkers.map((marker, key) => {
                    var markerEl = marker.element;
                    var pointerMarkerEl = currentMarkers[pointer].element;
                    var markerElLabel = $(markerEl).find('h2')[0].innerText;
                    var pointerMarkerLabel = $(pointerMarkerEl).find('h2')[0].innerText;

                    if(markerElLabel === pointerMarkerLabel) {
                        markerEl.style.filter = 'grayscale(0)'
                        markerEl.style.opacity = 1
                        markerEl.style.width = '12px'
                        markerEl.style.height = '12px'
                        markerEl.style.marginLeft = '-6px'
                        playHeadInfo.innerText = $(markerEl).find('h2')[0].innerText
                        if (cities[key].url) {
                            if (window.sample) {
                                window.sample.stop()
                            }
                            window.sample = new Simpler(cities[key].url,1, 1, true)
                            window.sample.setOutput(AC.destination)
                        }
                    } else {
                        markerEl.style.filter = 'grayscale(100%)'
                        markerEl.style.opacity = 0.5
                        markerEl.style.width = '8px'
                        markerEl.style.height = '8px'
                        markerEl.style.marginLeft = '-4px'

                        if (window.sample) {
                            window.sample.stop()
                        }
                    }
                })

                pointer++;
            }, 250)
        }

        animation = setInterval(increment, 10000)
        earth.setView([data[0].lat, data[0].lon], 4.5);

        var before = null;

        requestAnimationFrame(function animate(now) {
            const playHeadInfo = document.getElementById('playhead-info')
            var c = earth.getPosition();
            var elapsed = before? now - before: 0;
            before = now;

            cities.map(({ city, lat, lon }, key) => {
                const near = [lat/c[0], lon/c[1]]
                const markerText = document.getElementById(`marker-${key}`)
                if (markerText) {
                    // const markerParent = markerText.parentNode.parentNode.parentNode.parentNode
                    // if ((near[0] <= 1.1 && near[0] >= 0.7) && (near[1] <= 1.1 && near[1] >= 0.7)) {
                    //     markerParent.firstElementChild.style.filter = 'grayscale(0)'
                    //     markerParent.firstElementChild.style.opacity = 1
                    //     markerParent.firstElementChild.style.width = '12px'
                    //     markerParent.firstElementChild.style.height = '12px'
                    //     markerParent.firstElementChild.style.marginLeft = '-6px'
                    //     playHeadInfo.innerText = city
                    // } else {
                    //     markerParent.firstElementChild.style.filter = 'grayscale(100%)'
                    //     markerParent.firstElementChild.style.opacity = 0.5
                    //     markerParent.firstElementChild.style.width = '8px'
                    //     markerParent.firstElementChild.style.height = '8px'
                    //     markerParent.firstElementChild.style.marginLeft = '-4px'
                    //     playHeadInfo.innerText = ''
                    // }
                }
            })

            // requestAnimationFrame(animate);
        });
    },
    stop: () => {
        clearInterval(animation)
        $('#playhead-play').show();
        $('#playhead-pause').hide();
    },
    play: () => {
        animation = setInterval(increment, 10000)
        $('#playhead-pause').show();
        $('#playhead-play').hide();
        window.sample = new Simpler('http://localhost:4000/sound/1.mp3',1, 1, true)
        window.sample.setOutput(AC.destination)
        window.sample.play();
    },
}