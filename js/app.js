
var carService = 'js/carService.js';
var swRegister = 'js/swRegister.js';

require([swRegister], function(result){
    swRegister = result;
});
require([carService], function(result){
    carService = result;

 //    window.pageEvents = {
	// 	loadCarPage: function(carID){
	// 		carService.loadCarPage(carID);
	// 	},
	// 	loadMore: function(){
	// 		carService.loadMoreRequest();
	// 	}
	// }

    carService.loadMoreRequest();
});

 window.pageEvents = {
		loadCarPage: function(carID){
			carService.loadCarPage(carID);
		},
		loadMore: function(){
			carService.loadMoreRequest();
		}
	}