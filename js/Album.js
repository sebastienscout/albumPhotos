var Album = function(_album, _photos) {
	var album;
	var photos;
	var photoTagsDist = [];
	var photoAHashDist = [];
	var photoDHashDist = [];
	var albumInvDist = [];
	var pageSize;
	var pageNumber;
	var nbPhotos = 0;

	// Constructeur
	var constructor = function(_album, _photos){
		album = _album.slice(0);
		photos = _photos.slice(0);

		pageNumber = album[0].page;
		pageSize = album[0].pagesize;

		for(var i = 0; i < pageNumber; i++){
			nbPhotos += pageSize[i];
		}
	};

	function computeWithAHashDist(){

		for(var i = 0; i < photos.length; i++){
			photoAHashDist[i] = new Array(photos.length);
			// Trie avec ahashdist
			photoAHashDist[i] = photos[i].ahashdist;
		}
	};

	function computeWithDHashDist(){

		for(var i = 0; i < photos.length; i++){
			photoDHashDist[i] = new Array(photos.length);
			// Trie avec dhashdist
			photoDHashDist[i] = photos[i].dhashdist;
		}
	};

	function computeWithTags(){

		var tagPhotoList = [photos.length];

		for(var i = 0; i < photos.length; i++){
			var tags = photos[i].tags;
			tagPhotoList[i] = [];
			for(var j = 0; j < tags.classes.length; j++){
					tagPhotoList[i].push(tags.classes[j]);
			}
		}

		for(var i = 0; i < photos.length; i++){
			photoTagsDist[i] = new Array(photos.length);
			for(var j = 0; j < photos.length; j++){
				var nbSimilarTags = 0;
				var nbTotalTags = 0;
				if(tagPhotoList[i].length > tagPhotoList[j].length)
					nbTotalTags = tagPhotoList[i].length;
				else
					nbTotalTags = tagPhotoList[j].length;

				for(var x = 0; x < tagPhotoList[i].length; x++){
					for(var y = 0; y < tagPhotoList[j].length; y++){
						if(tagPhotoList[i][x] === tagPhotoList[j][y]){
							nbSimilarTags++;
						}
					}
				}
				photoTagsDist[i][j] = Math.abs((nbSimilarTags/nbTotalTags)-1);
			}
		}
	};

	function computeAlbumDistances(){
		albumInvDist = [nbPhotos];
    for(var i = 0; i < nbPhotos; i++){
			albumInvDist[i] = new Array(nbPhotos);
    }

    for(var i = 0; i < nbPhotos; i++){
			for(var j = 0; j < nbPhotos; j++) {
		    	albumInvDist[i][j] = inverseDistance(pageSize[0], i, j);
			}
    }
	};

	function inverseDistance(size, i, j){

		// number of pages
		var pagei = parseInt(i / size);
		var pagej = parseInt(j / size);

		// positions in the page
		var posi = parseInt(i);
		var posj = parseInt(j);

		// coordinate on the page
		var xi = parseInt(posi % 2);
		var yi = parseInt(posi / 2);
		var xj = parseInt(posj % 2);
		var yj = parseInt(posj / 2);

		// Manhatthan distance
		var d = Math.abs(xi - xj) + Math.abs(yi - yj);

		if (d === 0)
		  return -1;
		else if (parseFloat((1.0 / d).toFixed(2)) < 0.15)
			return 0;
		else
		  return parseFloat((1.0 / d).toFixed(2));
	};

	this.computeDistances = function(){
		computeWithTags();
		computeWithAHashDist();
		computeWithDHashDist();
		computeAlbumDistances();
	};

	this.getphotoTagsDist = function(){
		return photoTagsDist;
	};

	this.getphotoAHashDist = function(){
		return photoAHashDist;
	};

	this.getphotoDHashDist = function(){
		return photoDHashDist;
	};

	this.getInvDist = function(){
		return albumInvDist;
	};

	this.getNbPhotos = function(){
		return nbPhotos;
	};

	this.getPhotos = function(){
		return photos;
	};

	this.getNbPage = function(){
		return pageNumber;
	};

	constructor(_album, _photos);
};
