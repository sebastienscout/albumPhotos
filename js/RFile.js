var RFile = function() {

	var content = "";

	this.addLine = function(arg1, arg2){
		content += (arg1 + "," + arg2+"\n");
	};

	this.out = function(){
		console.log(content);
	};
};