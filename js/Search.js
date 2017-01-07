var Search = function(_album) {
	var solution;
	var numberOfPhotos;
	var e;
	var rFile;
	var tagsPercentage = 0.7;

	// Constructeur
	var constructor = function(_album){
		numberOfPhotos = _album.getNbPhotos();
		solution = new Solution(numberOfPhotos);
		e = new Eval(_album);
		rFile = new RFile();
	};

	// Hill Climber First Improvment
	function hillClimber(bestSolution){

		var initialFitness = e.evalTagsDHash(bestSolution.getSolution(), tagsPercentage);

		bestSolution.setFitness(initialFitness);

		var fBest = bestSolution.getFitness();
		var nbEval = 1;
		var stop = false;

		while(stop === false){

			var i = 0;
			var foundBestNeighbor = false;
			var photo1Best, photo2Best;

			while(i < numberOfPhotos && foundBestNeighbor === false){

				// Selection de 2 photos random
				var photo1 = Math.floor(Math.random() * numberOfPhotos);
				var photo2 = Math.floor(Math.random() * numberOfPhotos);
				while(photo2 === photo1){
					photo2 = Math.floor(Math.random() * numberOfPhotos);
				}
				bestSolution.swap(photo1, photo2);

				// Eval
				var f = e.evalTagsDHash(bestSolution.getSolution(), tagsPercentage);
				nbEval++;

				// Meilleure solution locale
				if(f < fBest){
					//console.log(f);
					fBest = f;
					photo1Best = photo1;
					photo2Best = photo2;
					foundBestNeighbor = true;
				}

				// Annuler le Swap
				bestSolution.swap(photo2, photo1);

				i++;
			}

			// Nouvelle meilleure solution
			if(fBest < bestSolution.getFitness()){
				bestSolution.swap(photo1Best, photo2Best);
				bestSolution.setFitness(fBest);
			}
			else if(foundBestNeighbor === false){
				stop = true;
			}
		}
		return bestSolution;
	};

	// Algorithme ILS
	function iteratedLocalSearch(jump, nbJump) {

		var s = new Solution(numberOfPhotos);
		var bestSolution = new Solution(numberOfPhotos);
		var nbEval = 1;

		s = hillClimber(s);
		s.setFitness(e.evalTagsDHash(s.getSolution(), tagsPercentage));
		bestSolution.copyFrom(s);

		while(nbEval < nbJump){
			for(var j = 0; j < jump; j++){
				var photo1 = Math.floor(Math.random() * numberOfPhotos);
				var photo2 = Math.floor(Math.random() * numberOfPhotos);
				while(photo2 === photo1){
					photo2 = Math.floor(Math.random() * numberOfPhotos);
				}
				s.swap(photo1, photo2);
			}

			s = hillClimber(s);
			var f = e.evalTagsDHash(s.getSolution(), tagsPercentage);
			s.setFitness(f);
			nbEval++;

			if(s.getFitness() < bestSolution.getFitness()){
				bestSolution.copyFrom(s);
			}
		}

		return bestSolution;
	};

	// Run la recherche que l'on souhaite (0 = HillClimber | 1 = ILS)
	this.run = function(algo){
		rFile.addLine("nbEval","fitness");

		if(algo === 0){

			console.log(" -- Hill Climber -- ");
			var solution = new Solution(numberOfPhotos);
			var nbEval = 1;

			solution.setFitness(e.evalTagsDHash(solution.getSolution(), tagsPercentage));
			rFile.addLine(nbEval, solution.getFitness());

			while(nbEval < 1000){
				var bestSolution = new Solution(numberOfPhotos);
				bestSolution = hillClimber(bestSolution);
				nbEval++;

				rFile.addLine(nbEval, bestSolution.getFitness());

				if(bestSolution.getFitness() < solution.getFitness()){
					solution.copyFrom(bestSolution);
				}
			}

			console.log("bestFitness = "+solution.getFitness());

		}
		else if(algo === 1){

			console.log(" -- Iterated Local Search -- ");

			for(var i = 0; i < 100; i++){
				solution.copyFrom(iteratedLocalSearch(20, 100));
				rFile.addLine(i, solution.getFitness());
			}

		}

		rFile.out();

	};

	// Retourne la meilleure solution
	this.getSolution = function(){
		return solution;
	};

	constructor(_album);
};
