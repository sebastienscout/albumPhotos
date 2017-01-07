var Solution = function(_numberOfPhotos) {
	var solution = [];
	var fitness = null;

	var constructor = function(_numberOfPhotos){
		for(var i = 0; i < _numberOfPhotos; i++){
			solution[i] = i;
		}

		shuffle();
	};

	this.copyFrom = function(s){
		solution = s.getSolution().slice(0);
		fitness = s.getFitness();
	};

	function shuffle() {
		var currentIndex = solution.length, temporaryValue, randomIndex;

		while (0 !== currentIndex) {

			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			temporaryValue = solution[currentIndex];
			solution[currentIndex] = solution[randomIndex];
			solution[randomIndex] = temporaryValue;
		}
	};

	this.swap = function(photo1, photo2){
		// Swap des photos
		var tempPhoto = solution[photo1];
		solution[photo1] = solution[photo2];
		solution[photo2] = tempPhoto;
	};

	this.setFitness = function(f){
		fitness = f;
	};

	this.getFitness = function(){
		return fitness;
	};

	this.getSolution = function(){
		return solution;
	};

	constructor(_numberOfPhotos);
};
