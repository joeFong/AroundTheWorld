var socket = io.connect('http://localhost:4001');

var peerConnection = window.RTCPeerConnection ||
    window.mozRTCPeerConnection ||
    window.webkitRTCPeerConnection ||
    window.msRTCPeerConnection;

var sessionDescription = window.RTCSessionDescription ||
    window.mozRTCSessionDescription ||
    window.webkitRTCSessionDescription ||
    window.msRTCSessionDescription;

    navigator.getUserMedia  = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;


var pc = new peerConnection({
    iceServers: [{
        url: "stun:stun.services.mozilla.com",
        username: "somename",
        credential: "somecredentials"
    }]
});

let stream; 
let toggle = 0;

const initUserMedia = (e) => {
    try {
        const constraints = window.constraints = {
            audio: true,
            video: false
        };
        
        if(!stream) {
            stream = navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess);
        }

        if(toggle++ % 2 === 0) {
            window.audioContext.resume()
        } else {
            window.audioContext.suspend()
            toggle = 0;
        }

    } catch (e) {
        handleError(e);
    }
}

document.getElementById('stream-button').addEventListener('click', (event) => {
    socket.emit('add-users', {
        users: [socket.id]
    });
    initUserMedia();
})

function handleSuccess(stream) {
    window.stream = stream; // make variable available to browser console

    var scope = new Scope(window.audioContext)
    scope.connect(window.audioContext.destination)

    this.mic = window.audioContext.createMediaStreamSource(stream)
    this.mic.connect(scope)

    window.audioContext.resume()
  }

function handleError(error) {
    console.log(error);
    alert(`Error error: ${error.name}`, error);
}

socket.on('add-users', function (data) {
    for (var i = 0; i < data.users.length; i++) {
        console.log(data.users[i]);
    }
});

socket.on('offer-made', function (data) {
    offer = data.offer;

    pc.setRemoteDescription(new sessionDescription(data.offer), function () {
        pc.createAnswer(function (answer) {
            pc.setLocalDescription(new sessionDescription(answer), function () {
                console.log('MAKE ANSWER');
                socket.emit('make-answer', {
                    answer: answer,
                    to: data.socket
                });
            }, error);
        }, error);
    }, error);

});

var answersFrom = {}, offer;

socket.on('answer-made', function (data) {
    pc.setRemoteDescription(new sessionDescription(data.answer), function () {
        document.getElementById(data.socket).setAttribute('class', 'active');
        if (!answersFrom[data.socket]) {
            createOffer(data.socket);
            answersFrom[data.socket] = true;
        }
    }, error);
});

function createOffer(id) {
    pc.createOffer(function (offer) {
        pc.setLocalDescription(new sessionDescription(offer), function () {
            socket.emit('make-offer', {
                offer: offer,
                to: id
            });
        }, error);
    }, error);
}

function error(err) {
    console.warn('Error', err);
}
