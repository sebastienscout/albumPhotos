var Evolutionnary = function(_evalFunc, _mu, _lambda, _tournamentSize, _crossOverRate, _mutationRate, _maxGeneration) {
  var eval;
  var mu;
  var lambda;
  var tournamentSize;
  var crossOverRate ;
  var mutationRate;
  var maxGeneration;
	var rFile;

	var constructor = function(_evalFunc, _mu, _lambda, _tournamentSize, _crossOverRate, _mutationRate, _maxGeneration){
        eval = _evalFunc;
        mu = _mu;
        lambda = _lambda;
        tournamentSize = _tournamentSize;
        crossOverRate = _crossOverRate;
        mutationRate = _mutationRate ;
        maxGeneration = _maxGeneration;
				rFile = new RFile();
	};

  function evalPop(population) {
    for(var i = 0; i < population.getSize(); i++) {
      population.getIndividuals()[i].setFitness(eval.evalTagsDHash(population.getIndividuals()[i].getSolution(), 0.75));
    }
  }

	function tournament(parents) {
    var winer = parents.getIndividuals()[ Math.floor(Math.random() * parents.getSize()) ];
    var oneGuy = null;
    for(var i = 1; i < tournamentSize; i++) {
      oneGuy = parents.getIndividuals()[ Math.floor(Math.random() * parents.getSize()) ];
      if (oneGuy.getFitness() < winer.getFitness())
				winer = oneGuy;
    }
    return winer;
  }

	function selection(parents, genitors) {
    genitors.resize(lambda);
    for(var i = 0; i < genitors.getSize(); i++) {
      genitors.getIndividuals()[i].copyFrom(tournament(parents));
    }
  }

	function crossOver(sol1, sol2) {
    for(var i = 0; i < sol1.getSolution().length; i++) {
      if (Math.random() < 0.5) {
				var photo1 = i;
				var sol1Photo2 = sol1.getSolution().indexOf(sol2.getSolution()[i]);
				var sol2Photo2 = sol2.getSolution().indexOf(sol1.getSolution()[i]);
				sol1.swap(photo1, sol1Photo2);
				sol2.swap(photo1, sol2Photo2);
      }
    }
  }

	function mutation(sol) {
    var rate = (1 / sol.getSolution().length);
    for(var i = 0; i < sol.getSolution().length; i++) {
      if (Math.random() < rate){
				var photo1 = Math.floor(Math.random() * 54);
				var photo2 = Math.floor(Math.random() * 54);
				while(photo2 === photo1){
					photo2 = Math.floor(Math.random() * 54);
				}
				sol.swap(photo1, photo2);
			}
    }
  }

	function randomVariation(genitors) {
    for(var i = 0; i < genitors.getSize(); i += 2) {
      if (Math.random() < crossOverRate)
				crossOver(genitors.getIndividuals()[i], genitors.getIndividuals()[i+1]);

      if (Math.random() < mutationRate)
				mutation(genitors.getIndividuals()[i]);

      if (Math.random() < mutationRate)
				mutation(genitors.getIndividuals()[i+1]);
    }
  }

	function replacement(parents, children) {
    // put the children at the following of the parents
    for (var i = 0; i < children.getSize(); i++) {
      parents.push(children.getIndividuals()[i]);
    }

    // sort parents
		parents.sort();
    // reduce the size to mu
    parents.resize(mu);
  }

	this.run = function(parents) {
		rFile.addLine("nbEval","fitness");

    var nbGeneration = 0;

    var children = new Population();

    evalPop(parents);

		var solution = parents.bestSolution();

		rFile.addLine(nbGeneration, solution.getFitness());

    while (nbGeneration < maxGeneration) {
      selection(parents, children);
      randomVariation(children);
      evalPop(children);
      replacement(parents, children);
      nbGeneration += 1;

			if(parents.bestSolution().getFitness() < solution.getFitness()){
				solution.copyFrom(parents.bestSolution());
				rFile.addLine(nbGeneration, solution.getFitness());
			}
    }

		//rFile.out();

		return solution;
  }

	constructor(_evalFunc, _mu, _lambda, _tournamentSize, _crossOverRate, _mutationRate, _maxGeneration);
};
