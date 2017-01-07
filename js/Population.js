var Population = function() {
	var individuals = [];
  var size;

	var constructor = function(){
    size = 0;
	};

  this.resize = function(_mu){
    if (size != _mu) {
			size = _mu;

			var delta = individuals.length - _mu;

			if (delta > 0) {
					individuals.length = size;
			}
			else {
					while (delta++ < 0)
						individuals.push(new Solution(54));
			}
		}
  };

	this.getIndividuals = function(){
		return individuals;
	};

	this.sort = function(){
		individuals.sort(function(a, b) {
			return a.getFitness() - b.getFitness();
		});
	};

	this.push = function(solution){
		size++;
		individuals.push(solution);
	};

  this.getSize = function(){
    return size;
  };

  this.averageFitness = function() {
    if (size == 0){
      return 0;
    }
    else {
      var sum = 0.0;
      for(var i = 0; i < size; i++) {
        sum += individuals[i].getFitness();
      }

      return (sum / size);
    }
  };

  this.bestSolution = function() {
    if (size == 0){
      return null;
    }
    else {
      var best = individuals[0];
      for(var i = 1; i < size; i++) {
        if (individuals[i].getFitness() < best.getFitness())
          best = individuals[i];
      }
      return best;
    }
  };

	constructor();
};
