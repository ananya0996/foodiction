var canvas ;
var context ;
var Val_Max;
var Val_Min;
var sections;
var xScale;
var yScale;
var y;
		// values of each item on the graph
		// enter all the Order Item Names in the first array.
		// enter the frequency of order for each item in the second array.
var itemName = [ "USA", "China", "India", "Japan" , "Germany", "Canada", "SriLanka", "Australia"];
var itemValue = [ 25, 7, 4.2, 4, 3.5, 2, 12, 10];

function init() {
		// intialize values for each variables
	sections = itemName.length;
	Val_Max = Math.max.apply(null, itemValue);
	Val_Min = Math.min.apply(null, itemValue)
	var stepSize = 1;
	var columnSize = 50;
	var rowSize = 60;
	var margin = 10;
	var header = "No. of Orders" 
		
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	context.fillStyle = "#000;"
	
	yScale = (canvas.height - columnSize - margin) / (Val_Max);
	xScale = (canvas.width - rowSize) / (sections + 1);
	
	context.strokeStyle="#000;"; // background black lines
	context.beginPath();
		// column names 
	context.font = "19 pt Arial;"
	context.fillText(header, 0,columnSize - margin);
		// draw lines in the background
	context.font = "16 pt Helvetica"
	var count =  0;
	for (scale=Val_Max;scale>=0;scale = scale - stepSize) {
		y = columnSize + (yScale * count * stepSize); 
		context.fillText(scale, margin,y + margin);
		context.moveTo(rowSize,y)
		context.lineTo(canvas.width,y)
		count++;
	}
	context.stroke();
	
		// print names of each data entry
	context.font = "20 pt Verdana";
	context.textBaseline="bottom";
	for (i=0;i<itemValue.length;i++) {
		computeHeight(itemValue[i]);
		context.fillText(itemName[i], xScale * (i+1),y - margin);
	}
	
		// shadow for graph's bar lines with color and offset
  
	context.fillStyle="#9933FF;";
  	context.shadowColor = 'rgba(128,128,128, 0.5)';
  
  		//shadow offset along X and Y direction 
	context.shadowOffsetX = 9;
	context.shadowOffsetY = 3;
  
		// translate to bottom of graph  inorder to match the data 
  	context.translate(0,canvas.height - margin);
	context.scale(xScale,-1 * yScale);
  
		// draw each graph bars	
	for (i=0;i<itemValue.length;i++) {
		context.fillRect(i+1, 0, 0.3, itemValue[i]);
	}

	var MPD = itemName[itemValue.indexOf(Val_Max)];
	var LPD = itemName[itemValue.indexOf(Val_Min)];
	var MP = document.getElementById("MPD");
	var LP = document.getElementById("LPD");

	MP.innerHTML = MPD;
	LP.innerHTML = LPD;
}

function computeHeight(value) {
	y = canvas.height - value * yScale ;	
}
