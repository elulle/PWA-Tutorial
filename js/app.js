var carService = 'js/carService.js';
require([carService], function(result){
    carService = result;
    carService.loadMoreRequest();
});