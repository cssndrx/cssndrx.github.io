// function add_canvas(selector, name, width, height){
// 	// insert a canvas within a container that allows relative positioning
// 	$(selector).append('<div id="'+name+'" style="position:relative"><canvas width="'+width+'" height="'+height+'"></canvas></div>');
// }


function rect_coords(canvas_w, canvas_h, w, h, rect_center_x, rect_center_y){
	rect_center_x = isdefined(rect_center_x) ? rect_center_x : canvas_w/2;

	var left = rect_center_x-w/2;
	var right = rect_center_x+w/2;

	var top, bottom;
	if (isdefined(rect_center_y)){
		top = canvas_h - rect_center_y - h/2;
		bottom = canvas_h - rect_center_y + h/2;
	}else{
		// ground the rectangle to the bottom of the canvas
		top = canvas_h-h;
		bottom = canvas_h;
	}

	return [ [left, top], [right, top], [right, bottom], [left, bottom]];		
}

function plot_coords(context, coords, fill, linewidth, scalefactor){
    context.lineWidth = isdefined(linewidth) ? linewidth: 10; // / 50; //achtung!!! linewidth gets scaled

    var scalefactor = isdefined(scalefactor) ? scalefactor : 1;
    context.lineWidth /= scalefactor;

    context.strokeStyle = isdefined(fill) ? fill : colors[0];
    context.fillStyle = isdefined(fill) ? fill: colors[2];
    context.beginPath();

	var first = car(coords);
	context.moveTo(first[0], first[1]);
	cdr(coords).forEach(function (coord){ context.lineTo(coord[0], coord[1]);} );
	context.lineTo(first[0], first[1]);

    context.closePath();

    context.fill();
    context.stroke();    	
}


// function plot_coords(context, coords, fill){
//     context.lineWidth = 1;
//     context.strokeStyle = colors[0];
//     context.fillStyle = isdefined(fill) ? fill: colors[2];

//     context.beginPath();

// 	var first = car(coords);
// 	context.moveTo(first[0], first[1]);
// 	cdr(coords).forEach(function (coord){ context.lineTo(coord[0], coord[1]);} );
// 	context.lineTo(first[0], first[1]);

//     context.closePath();

//     context.fill();
//     context.stroke();    	
// }

function add_text(context, text, coord, font){
	context.font = isdefined(font) ? font : "12px Arial";
    context.fillStyle = "black";
	// calculate the numbers that 
	context.fillText(text, coord[0], coord[1]);	        	    		
}

// function make_histogram(selector, width, height){
// 	var $container = $(selector);
//     var canvas = $container.children('canvas')[0];
//     var context = canvas.getContext("2d");

// 	var data = [{name: 'good', 
// 				value: .3},
// 				{name: 'evil',
// 				value: .7}];

// 	var edge = width/4;
// 	var bar_width = (width-edge) / data.length;

// 	data.forEach(function(datum, i){
// 		var bar_height = datum.value * height; //
// 		var rect_center = i*bar_width + edge/2;
// 		var coords = rect_coords(width, height, bar_width, bar_height, rect_center);	
// 		plot_coords(context, coords);		
// 	})

// 	// plot the axis labels

// }


