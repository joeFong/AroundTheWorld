window.onload = async () => {
    $('select').formSelect();
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        window.audioContext = new AudioContext();
    } catch (e) {
        alert('Web Audio API not supported.');
    }

    Earth.createGlobe();
}

