var Eval = function(_album) {
	var albumInvDist;
	var photoTagsDist;
	var photoAHashDist;
	var photoDHashDist;

	// Constructeur
	var constructor = function(_album){
		albumInvDist = _album.getInvDist().slice(0);
		photoTagsDist = _album.getphotoTagsDist().slice(0);
		photoAHashDist = _album.getphotoAHashDist().slice(0);
		photoDHashDist = _album.getphotoDHashDist().slice(0);
	};

	// Fonction d'evaluation
	this.evalTagsAHash = function(solution, tagsPercentage){
		var sum = 0;

		for(var i = 0; i < albumInvDist.length; i++) {
		    for(var j = i + 1; j < albumInvDist.length; j++) {
		    	var tempSum = (photoTagsDist[ solution[i] ][ solution[j] ] * tagsPercentage);
		    	tempSum += (photoAHashDist[ solution[i] ][ solution[j] ] * (1 - tagsPercentage));
		    	tempSum *= albumInvDist[i][j];
			  	sum += tempSum;
		    }
		}

		return sum;
	};

	this.evalTagsDHash = function(solution, tagsPercentage){
		var sum = 0;

		for(var i = 0; i < albumInvDist.length; i++) {
		    for(var j = i + 1; j < albumInvDist.length; j++) {
		    	var tempSum = (photoTagsDist[ solution[i] ][ solution[j] ] * tagsPercentage);
		    	tempSum += (photoDHashDist[ solution[i] ][ solution[j] ] * (1 - tagsPercentage));
		    	tempSum *= albumInvDist[i][j];
				  sum += tempSum;
		    }
		}

		return sum;
	};

	this.eval = function(solution){
		var sum = 0;

		for(var i = 0; i < albumInvDist.length; i++) {
		    for(var j = i + 1; j < albumInvDist.length; j++) {
					sum += (photoTagsDist[ solution[i] ][ solution[j] ] * albumInvDist[i][j]);
		    }
		}

		return sum;
	};

	constructor(_album);
};
