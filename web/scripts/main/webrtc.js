const audioInputSelect = document.querySelector('select#audioSource');
const audioOutputSelect = document.querySelector('select#audioOutput');

const audioSource = audioInputSelect.value;
const constraints = {
    audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
};
const selectors = [audioInputSelect, audioOutputSelect];

audioOutputSelect.disabled = !('sinkId' in HTMLMediaElement.prototype);

function changeAudioDestination() {
    const audioDestination = audioOutputSelect.value;
    attachSinkId(videoElement, audioDestination);
}

// Attach audio output device to video element using device/sink ID.
function attachSinkId(element, sinkId) {
    if (typeof element.sinkId !== 'undefined') {
      element.setSinkId(sinkId)
          .then(() => {
            console.log(`Success, audio output device attached: ${sinkId}`);
          })
          .catch(error => {
            let errorMessage = error;
            if (error.name === 'SecurityError') {
              errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
            }
            console.error(errorMessage);
            // Jump back to first output device in the list as it's the default.
            audioOutputSelect.selectedIndex = 0;
          });
    } else {
      console.warn('Browser does not support output device selection.');
    }
}

function gotStream(stream) {
    window.stream = stream; // make stream available to console
    // Refresh button list in case labels have become available
    return navigator.mediaDevices.enumerateDevices();
}
  

function gotDevices(deviceInfos) {
    // Handles being called several times to update labels. Preserve values.
    const values = selectors.map(select => select.value);
    selectors.forEach(select => {
      while (select.firstChild) {
        select.removeChild(select.firstChild);
      }
    });
    for (let i = 0; i !== deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i];
      const option = document.createElement('option');
      option.value = deviceInfo.deviceId;
      if (deviceInfo.kind === 'audioinput') {
        option.text = deviceInfo.label || `microphone ${audioInputSelect.length + 1}`;
        audioInputSelect.appendChild(option);
      } else if (deviceInfo.kind === 'audiooutput') {
        option.text = deviceInfo.label || `speaker ${audioOutputSelect.length + 1}`;
        audioOutputSelect.appendChild(option);
      }
    }
    selectors.forEach((select, selectorIndex) => {
      if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
        select.value = values[selectorIndex];
      }
    });
  }

navigator.mediaDevices.enumerateDevices().then(gotStream).then(gotDevices).catch(handleError);

const WebRTC = { 
    initUserMedia: async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            handleSuccess(stream);
            e.target.disabled = true;
        } catch (e) {
            handleError(e);
        }
    }
}

function handleSuccess(stream) {
    console.log('Got stream with constraints:', constraints);
  }

function handleError(error) {
    console.log(error);
    alert(`Error error: ${error.name}`, error);
}