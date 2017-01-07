$(document).ready(function(){
	readJSON();
});

function main(_album, _photos){
	var page = 1;

	var album = new Album(_album, _photos);
	album.computeDistances();

	// HillClimber - 0 | ILS - 1
	//var algo = 1;
	//var searchEngine = new Search(album);
	//searchEngine.run(algo);
	//var solution = searchEngine.getSolution();

	// Evolutionnary Algorithm
	var mu = 10;
	var lambda = 50;
	var tournamentSize = 2;
	var crossOverRate = 0.8;
	var mutationRate = 1.0;
	var maxGeneration = 1000;

	var eval = new Eval(album);
	var ea = new Evolutionnary(eval, mu, lambda, tournamentSize, crossOverRate, mutationRate, maxGeneration);
	var population = new Population();
	population.resize(mu);

	var solution = ea.run(population);

	/*
	// Test 100 Evolutionnary Algorithm
	var rFile = new RFile();
	rFile.addLine("nbEval","fitness");

	for(var i = 0; i < 100; i++){
		var eval = new Eval(album);
		var ea = new Evolutionnary(eval, mu, lambda, tournamentSize, crossOverRate, mutationRate, maxGeneration);

		var population = new Population();
		population.resize(mu);
		solution.copyFrom(ea.run(population));
		rFile.addLine(i, solution.getFitness());
	}
	rFile.out();
	*/

	updatePage(album.getPhotos(), page, solution);

	var nav = $('#navigation');
	nav.children('a').click(function(){
		var end = false;
		switch($(this).attr('id')) {
		    case 'first': page = 1; break;
		    case 'previous': ((page > 1) ? page-- : end = true); break;
		    case 'next': ((page < album.getNbPage()) ? page++ : end = true); break;
		    case 'last': page = album.getNbPage(); break;
		}
		if (!end) updatePage(album.getPhotos(), page, solution);
	});
};

function updatePage(photos, page, solutionObj){
	$('#album h3').html('Page '+page);
	$('#album h4').html('Fitness actuelle : ' + solutionObj.getFitness().toFixed(2));

	var solution = solutionObj.getSolution();
	$('#pictures').html('');
	for(var i = (page*6)-6; i < page*6; i++){
		$('#pictures').append('<div class="col-xs-6 col-md-6 fadeIn animated"><img src="img/'+ photos[solution[i]].name +'" class="img-thumbnail"></div>');
	}
};

function readJSON(){
	var album = [];
	var photos = [];
	$.getJSON('data/info-album.json', function(data1) {
		album = data1.slice(0);
		$.getJSON('data/info-photo.json', function(data2) {
			photos = data2.slice(0);
			main(album, photos);
	    });
    });
};
