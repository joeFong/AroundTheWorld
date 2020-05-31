// Peril.js
// Library for Web Audio API
// Developed by Min Nam
// jabuem.co

var Scope = function(context){
	var container, bar, scope;
	var x1, y1, x2, y2, selected = null;
	var analyser, noDataPoints, freqData;

	var initElements = function(){
		container = document.createElement("div");
		container.style.width = "300px";
		container.style.height = "300px";
		container.style.color = "black";
		container.style.position = "absolute";
		container.style.top = 0;
		document.body.appendChild(container);
	}

	initElements();

	var HEIGHT, WIDTH, ctx, ghostcanvas, gctx;
	var initCanvas = function(){
		scope = document.createElement("canvas");
		scope.style.height = "100%";
		scope.style.width  = "100%";
		container.appendChild(scope);

		HEIGHT = scope.height;
		WIDTH = scope.width;
		ctx = scope.getContext('2d');
		ghostcanvas = document.createElement('canvas');
		ghostcanvas.height = HEIGHT;
		ghostcanvas.width = WIDTH;
		gctx = ghostcanvas.getContext('2d');

		analyser = (context || AC).createAnalyser();
		freqData = new Uint8Array(analyser.frequencyBinCount);

		draw()
	}

	var clear = function(){
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
		ctx.stroke();
	}

	var fps = 12;
	var now;
	var then = Date.now();
	var interval = 1000/fps;
	var delta;

	var draw = function(){
		requestAnimationFrame(draw);
		now = Date.now();
		delta = now - then;
		//console.log(delta);

		if (delta > interval) {
			clear();
			analyser.getByteTimeDomainData(freqData);
			then = now - (delta % interval);

			ctx.lineJoin = 'round';
			ctx.beginPath();
			ctx.strokeStyle = "white";
			ctx.fillStyle = "white";
			ctx.lineWidth = 2;

			for (let i = 0; i < 5; i ++) {
				const index = parseInt((freqData.length / 5 ) * i)
				const rectHeight = ((1 - (freqData[index] / 128)) * HEIGHT)

				ctx.rect(i ? (WIDTH / 5) * i : 0, HEIGHT / 2 - rectHeight / 2, (WIDTH / 5), rectHeight)
				ctx.fill();
			}

		}

	}

	initCanvas();
	return analyser;
}

