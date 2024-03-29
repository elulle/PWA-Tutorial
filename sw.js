"use strict"

var carDealsCacheName = 'carDealsCacheV1';
var carDealsCachePageName = 'carDealsCachePagesV1';
var carDealsCacheImagesName = 'carDealsCacheImagesV1';

//pre caching files, can pre cahc CDNs too. 
var carDealsCacheFiles = [
	'js/app.js', 
	'js/carService.js',
	'js/clientStorage.js',
	'js/swRegister.js',
	'js/template.js',
	'./',
	'resources/localforage/localforage.min.js',
	'resources/localforage/localforage-getitems.js',
	'resources/localforage/localforage-setitems.js',
	'resources/material-design-light/material.min.js',
	'resources/material-design-light/material.min.js.map'
];

// var latestPath = '../json/latest-deals.json';
var latestPath = '/pluralsight/courses/progressive-web-apps/service/latest-deals.php';
var imagePath = '/pluralsight/courses/progressive-web-apps/service/car-image.php';
var carPath = '/pluralsight/courses/progressive-web-apps/service/car.php';

self.addEventListener('install', function(event){
	console.log('From SW: Install Event', event);
	self.skipWaiting();
	event.waitUntil(
		caches.open(carDealsCacheName)
		.then(function(cache){
			return cache.addAll(carDealsCacheFiles);
		})
	);
});

self.addEventListener('activate', function(event){
	console.log('From SW: Activate Event', event);
	self.clients.claim();
	event.waitUntil(
		caches.keys()
		.then(function(cacheKeys){
			var deletePromises = [];
			for(var i = 0; i < cacheKeys.length; i++){
				if(cacheKeys[i] != carDealsCacheName &&
					cacheKeys[i] != carDealsCachePageName &&
					cacheKeys[i] != carDealsCacheImagesName){
					deletePromises.push(caches.delete(cacheKeys[i]));
				};
			};

		})
	)	
});

self.addEventListener('fetch', function(event){
	var requestUrl = new URL(event.request.url);
	var requestPath = requestUrl.pathname;
	var fileName = requestPath.substring(requestPath.lastIndexOf('/') + 1 );

	if(requestPath == latestPath || fileName == "sw.js"){
		event.respondWith(fetch(event.request));
	}else if(requestPath == imagePath) {
		event.respondWith(networkFirstStrategy(event.request));
	}else{
		event.respondWith(cacheFirstStrategy(event.request));
	}
});

function cacheFirstStrategy(request){
	return caches.match(request).then(function(cacheResponse){
		return cacheResponse || fetchRequestAndCache(request);
	});
}

function networkFirstStrategy(request){
	return fetchRequestAndCache(request).catch(function(response){
		return caches.match(request);
	})
}

function fetchRequestAndCache(request){
	return fetch(request).then(function(networkResponse){
		caches.open(getCacheName(request)).then(function(cache){
			cache.put(request, networkResponse);
		});
		return networkResponse.clone();
	});
}

function getCacheName (request){
	var requestUrl = new URL(request.url);
	var requestPath = requestUrl.pathname;

	if(requestPath == imagePath){
		return carDealsCacheImagesName;
	}else if(requestPath == carPath){
		return carDealsCachePageName;
	}else{
		return carDealsCacheName;
	}
}


self.addEventListener('message', function(event){
	event.source.postMessage({
		clientId: event.source.id,
		message: 'sw'
	});
})
