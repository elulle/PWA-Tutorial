
var carService = 'js/carService.js';
require([carService], function(result){
    carService = result;

    window.pageEvents = {
		loadCarPage: function(carID){
			carService.loadCarPage(carID);
		},
		loadMore: function(){
			carService.loadMoreRequest();
		}
	}

    carService.loadMoreRequest();
});

// window.pageEvents = {
// 	loadCarPage: function(carID){
// 		carService.loadCarPage(carID);
// 	}
// }
