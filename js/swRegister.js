define([], function() {

	if('serviceWorker' in navigator){
		navigator.serviceWorker
		.register('sw.js')
		.then(function(swRegistration){
			console.log(swRegistration);


			swRegistration.addEventListener('updatefound', function(e){
				swRegistration.installing.addEventListener('statechange', function(e){
					console.log("New service worker state: ", e.target.state);
				});
				console.log("New service worker found:", swRegistration);
			});


			setInterval(function(){
				swRegistration.update();
			}, 5000);
		}).catch(function(error){
			console.log("Error occured", error);
		});

		navigator.serviceWorker.addEventListener('controllerchanged', function(e){
			console.log("Controller Changed!");
		});

		navigator.serviceWorker.addEventListener('message', function(event){
			var clientId = event.data.clientId;
			var message = event.data.message;
			console.log("From client: ", clientId, message);
		})

		if(navigator.serviceWorker.controller != null){
			navigator.serviceWorker.controller.postMessage('hello');
		};
	}

})