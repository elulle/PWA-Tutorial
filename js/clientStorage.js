define([], function(){
	var limit = 3;
	var lastItemId = null;
	var carInstance = localforage.createInstance({
		name: "cars"
	});

	function addCars(newCars){
		return new Promise(function(resolve, reject){
			carInstance.setItems(newCars)
			.then(function(){
				resolve();
			});
		});
	}

	function getCars(){
		return new Promise(function(resolve,reject){
			carInstance.keys().then(function(keys){
				// console.log("getCars", keys);
				var index = keys.indexOf(lastItemId);
				if(index == -1){ index = keys.length; }
				if(index == 0){ resolve([]); return; }

				var keys = keys.splice(index - limit, limit);
				carInstance.getItems(keys).then(function(results){
					var returnArr = Object.keys(results).map(function(k){ return results[k]}).reverse();
					lastItemId = returnArr[returnArr.length-1].id;
					resolve(returnArr);
				})
			})
		});
	}

	function getLastCarId(){
		return lastItemId;
	}

	return {
		addCars: addCars,
		getCars: getCars,
		getLastCarId: getLastCarId
	}
})