function make_color_joints(data){
	var max_number = 100;
	var subset = rand_sample(data, Math.min(max_number, data.length));	

	var buckets = {
	'social' : ['visitingparentshouse', 'loansdecisionmaker', 'outsideemployment'],
	'community': ['respectstatusafterjoiningcbo', 'problemsolvingwithincbo', 'socialissuesdemonstration', 'vote', 'politicsinvolvement', ] ,
	'technical': ['computerusage', 'personalmobilephone', 'mobilephoneusage', 'cant_text_read'],	
	'economic': ['numberoftimesadaytoeat', 'newclothes' ],	
	'health': ['defeacation', 'sanitarynapkins']};
	var pairs = _.pairs(buckets);

	pairs.forEach(function(pair){
		var category = pair[0];
		var question_ids = pair[1]; 	

		var question_ids_string = question_ids.join(' - ');
		$('#color-joints').append($('<h4></h4>').text(_.str.capitalize(category)));
		$('#color-joints').append($('<h5></h5>').text(question_ids_string));

		subset.forEach(function(datum){

			var $widget = $('<div class="color-joint" style="display:inline-block;"></div>');
			var is_missing_data = false;
			question_ids.forEach(function(question_id){
				
				var num_colors = $('#' + question_id).children().length - 1;
				var colors = get_colors(range(num_colors));
				var value = datum[question_id];
				var ind = $('#'+question_id).children(':contains("' + value + '")').index() - 1;

				if (ind == -2){
					console.log('question_id ' + question_id + ' value ' + value + ' triggering missing');
					is_missing_data = true;
				}			
				var $swatch = $('<div style="display:inline-block; width: 40px; height: 20px;"></div>');
				$swatch.css('background-color', colors[ind]); 
				$swatch.attr('title', datum.nameoffemalehead);
				$widget.append($swatch);
			});

			if (!is_missing_data){
				$('#color-joints').append($widget);
			}
		});
	});	
}


// function raychart_data(){

// 	var link_data = {}; // key that maps to other 
	
// 	Object.prototype.getdefault = function (key, def){
// 		if (!(key in this)){
// 			this[key] = def;			
// 		}
// 		return this[key];
// 	};

// 	var question_ids = ['education', 'livelihoodactivity', 'monthlyearnings'];
// 	var data = pluck(question_ids);

// 	data.forEach(function (datum){
// 		var pairs = _.pairs(datum);
// 		for (var i=0; i<pairs.length; i++){
// 			var pair = pairs[i];
// 			var others = pairs.slice(0, i);
// 			if (i < pairs.length - 1){
// 				extend(others, pairs.slice(i+1, pairs.length));
// 			}

// 			var observed = link_data.getdefault(pair, []);
// 			extend(observed, others);
// 		}

// 		// todo: not sure how to handle multiple labels
// 	});

// 	// with open('data/freq_links.js', 'w') as f:
// 	// 	max_size = max([max(x.values()) for x in links.values()])
// 	// 	f.write('max_link_size = ' + str(max_size) + ';')
// 	// 	f.write('link_data = ' + str(links) + ';')
// 	freq_links(link_data);

// }
// raychart_data();


// function freq_links(data){
// 	var $parent = $('#container');
// 	var canvas = $parent.find('canvas')[0];
// 	var context = canvas.getContext("2d");

// 	var width = 600;
// 	var height = 500;

// 	var vector_colors = ['orange', 'lightslategray', 'lightseagreen', 'orange'];


// 	// var labels = { 'education': ['Uneducated', 'Primary school', 'Middle school', 'Secondary school', 'Sr. Secondary school'],
// 	// 	'income': ['Less than Rs. 1000', 'Rs. 1000 - Rs. 3000', 'Rs. 3001 - Rs. 5000', 'Rs. 5001 - Rs. 10000', 'Above Rs. 10000'],
// 	// 	'industry': ['Salary employment', 'Dairy', 'Wage employment', 'Wage employment only', 'Agriculture'] }
// 	var labels = _.groupBy(_.pairs(_.keys(data)), function (pair){
// 		var key = pair[1];
// 		var label_name = key.split(',')[0];
// 		return label_name;
// 	});

// //	debugger;
// 	var weights;

// 	// add in labels
// 	var i=0;
// 	for (var label_name in labels){
// 		var values = labels[label_name];
// 		var $section = $($parent).find('#' + label_name);
// 		values.forEach(function(x){
// 			var x = x[1].split(',')[1];
// 			var $label = $('<span class="hoverable">' + x + '</span>');
// 			$label.css('background-color', vector_colors[i+1]);
// 			$label.css('color', 'white');
// 			$section.append($label);
// 		});
// 		i++;
// 	}

// 	function lookup_thickness(from, to){
// 		return data[from][to];
// 	}

// 	// upon hover
// 	$('.hoverable').hover(function(){
// 	 	context.clearRect(0, 0, width, height);

// 		var $hoverelt = $(this);
// 		var elt_pos = $hoverelt.position();
// 		var pelt_pos = $hoverelt.parent().position();

// 		var others = $parent.find('.hoverable').filter(function(ind, elt){
// 			return  $(elt).parent()[0] != $hoverelt.parent()[0] ;
// 		});

// 		//others.css('background-color', 'red');
// 		others.each(function(ind, other){
// 			var $other = $(other);
// 			var pos = $other.position();
// 			var ppos = $other.parent().position();

// 			// lookup the weight in the table
// 			var ydelta = 20; //$other.height()/2;
// //			console.log('parent index ' + $other.parent().index());

// 			var vector_color = vector_colors[$other.parent().index()];


// 			var raw_thickness = lookup_thickness($hoverelt.text(), $other.text());
// 			var thickness = lerp(raw_thickness, 0, max_link_size, 0, 30);

// 			draw_vector(context, vector_color, [elt_pos.left + pelt_pos.left, elt_pos.top + pelt_pos.top +ydelta], [pos.left + ppos.left, pos.top + ppos.top + ydelta] , thickness);

// 		});
// 	});	

// 	// the DOM knows each item's position
// 	// get each item's position if the item has a diff parent
// 	// get the weight


// 	// get a collection of vectors (start, end, weights)
// 	function draw_vector(context, vector_color, start, end, weight){
// 		// todo: incorporate the weight
// 		// todo: animate
// //			context.setTransform(1, 0, 0, -1, 0, height);

// 		plot_coords(context, [start, end], vector_color, weight);
// //		console.log('start ' + start[0] + ',' + start[1] + ' end ' + end);

// 		// position relative to canvas ....................................

// 	}
// }
// freq_links(link_data);


function freq_links(data){
	var $parent = $('#container')
	var canvas = $parent.find('canvas')[0];
	var context = canvas.getContext("2d");

	var width = 600;
	var height = 500;

	var vector_colors = ['orange', 'lightslategray', 'lightseagreen', 'orange'];

	var labels = { 'education': ['Uneducated', 'Primary school', 'Middle school', 'Secondary school', 'Sr. Secondary school'].reverse(),
		'income': ['Less than Rs. 1000', 'Rs. 1000 - Rs. 3000', 'Rs. 3001 - Rs. 5000', 'Rs. 5001 - Rs. 10000', 'Above Rs. 10000'].reverse(),
		'industry': ['Salary employment', 'Dairy', 'Wage employment', 'Wage employment only', 'Agriculture'] }

	var weights;

	// add in labels
	var i=0;
	for (var label_name in labels){
		var values = labels[label_name];

		var $section = $parent.children('#' + label_name);
		values.forEach(function(x){
			var $label = $('<span class="hoverable">' + x + '</span>');
			$label.css('background-color', vector_colors[i+1]);
			$label.css('color', 'white');
			//	$label.data('group', label_name);
			$section.append($label);

			// calculate the marginal
			// warning: /2 is an approximation due to incomplete data
			var marginal = Math.floor(sum(_.values(data[x]))/2);
			var left = $label.position().left;
				
			var bottom = $label.position().top + $label.height();
			var $marginal = $('<span class="marginal" style="position:absolute;">' + marginal + '</span>').css('left', left).css('top', bottom+20); //.text(marginal);
			$section.append($marginal);
		});


		var marginals = values.map(function(x){
			return Math.floor(sum(_.values(data[x]))/2);
		});

		function make_marginal_bars(weights, position){
			function is_horizontal(){
				return label_name == 'industry';
			}
			// add in visual marginals
			var $container = $('#' + label_name + '-bar'); //$('<div style="position:absolute; left:0px; top: 0px;"></div>');
			weights.forEach(function(weight){
				var $marginal_bar = $('<div style="margin: 4px;"></div>');
				$marginal_bar.css('display', is_horizontal() ? 'inline-block' : 'block');

				if (is_horizontal()){

				$marginal_bar.height(5);
				$marginal_bar.width(weight *400/sum(weights));

				}else{

				$marginal_bar.width(5);
				$marginal_bar.height(weight *400/sum(weights));
				}

				$marginal_bar.css('background-color', vector_colors[i+1]);
				$container.append($marginal_bar);	
			});

			$parent.append($container);
		}
		make_marginal_bars(marginals);

		i++;
	}

	function lookup_thickness(from, to){
		return data[from][to];
	}

	// upon hover
	$('.hoverable').hover(function(){
	 	context.clearRect(0, 0, width*2, height*2);


		var $hoverelt = $(this);
		var elt_pos = $hoverelt.position();
		var pelt_pos = $hoverelt.parent().position();

		var others = $parent.find('.hoverable').filter(function(ind, elt){
			return  $(elt).parent()[0] != $hoverelt.parent()[0] ;
		});

		//others.css('background-color', 'red');
		others.each(function(ind, other){
			var $other = $(other);
			var pos = $other.position();
			var ppos = $other.parent().position();

			// lookup the weight in the table
			var ydelta = 20; //$other.height()/2;

			var vector_color = vector_colors[$other.parent().index()];


			var raw_thickness = lookup_thickness($hoverelt.text(), $other.text());
			var thickness = lerp(raw_thickness, 0, max_link_size, 0, 30);

			// var start_x = elt_pos.left + pelt_pos.left + $hoverelt.width()/2;
			// var start_y = elt_pos.top + pelt_pos.top + ydelta + $hoverelt.height()/2;
			// var end_x = pos.left + ppos.left + $other.width()/2;
			// var end_y = pos.top + ppos.top + ydelta + $other.height()/2;
//			draw_vector(context, vector_color, [start_x, start_y], [end_x, end_y] , thickness);

			var origin = $()

			var start_x = elt_pos.left + pelt_pos.left + $hoverelt.width()/2;
			var start_y = elt_pos.top + pelt_pos.top + ydelta + $hoverelt.height()/2;
			var end_x = pos.left + ppos.left + $other.width()/2;
			var end_y = pos.top + ppos.top + ydelta + $other.height()/2;

			plot_coords(context, [start, end], vector_color, weight);

		});
	});	

	// the DOM knows each item's position
	// get each item's position if the item has a diff parent
	// get the weight


	// get a collection of vectors (start, end, weights)
	function draw_vector(context, vector_color, start, end, weight){
		// todo: incorporate the weight
		// todo: animate
//			context.setTransform(1, 0, 0, -1, 0, height);

		plot_coords(context, [start, end], vector_color, weight);
//		console.log('start ' + start[0] + ',' + start[1] + ' end ' + end);

		// position relative to canvas ....................................

	}
}

function ray_chart(){
	var $parent = $('#raychart');
	var canvas = $parent.find('canvas')[0];
	var context = canvas.getContext("2d");

     var radius = canvas.width/2 * .8;

	function to_rad(deg){
		while (deg < 0){
			deg += 360;
		}
		while (deg > 360){
			deg -= 360;
		}
		return 2*Math.PI * deg/360;
	}
	function draw_arc(startAngle, endAngle){

	  startAngle = to_rad(startAngle);
	  endAngle = to_rad(endAngle);
//	  console.log('start ' + startAngle + ' end ' + endAngle);

	  var x = canvas.width / 2;
      var y = canvas.height / 2;

      context.beginPath();
      context.arc(x, y, radius, endAngle, startAngle, true);
      context.lineWidth = 25;

      // line color
      context.strokeStyle = 'black';
      context.stroke();
	}

	function angle_to_pt(angle){
		var radius = 10;
		var rads = to_rad(-angle);
		var x = radius*Math.cos(rads);
		var y = radius*Math.sin(rads); 

		return [canvas.width/2 + x, canvas.height/2 - y + canvas.height];
	}

	function draw_counter_arc(startAngle, endAngle){
      context.beginPath();

      var startpt = angle_to_pt(startAngle);
      var endpt = angle_to_pt(endAngle);

      context.moveTo(startpt[0], startpt[1]);
      context.quadraticCurveTo(288, 0, endpt[0], endpt[1]);
      context.lineWidth = 10;

      // line color
      context.strokeStyle = 'green';
      context.stroke();
	}


	var width = 500;
	var height = 500;

	var labels = {	'income' : ['<1000', '1000-3000', '3000-5000', '>5000'],
					'industry' : ['agriculture', 'dairy', 'poultry', 'self-employment', 'wage', 'salaried'],
					'education' : ['elementary', 'middle', 'high school', 'college']
				};

	var weights;

	var angles = {};

	var label_names = _.keys(labels);
	label_names.forEach(function(label_name, ind){
		var values = labels[label_name];

		var weights = values.map(function(){
			return Math.random();
		});
		var normed_weights = normalize_weights(weights);

		var spacer = 5;
		var low = ind*120 + spacer; 
		var high = (ind+1)*120 - spacer;
		var span = high - low;


		var pixel_spans = normed_weights.map(function(weight){
			return weight * span;
		});


		var angle_spans = [];

		pixel_spans.forEach(function(span, ind){
			var begin = sum(pixel_spans.slice(0, ind));
			var pad = .5;

			if (span > 2*pad){
				var angle_start = low+begin+pad;
				var angle_end = low+begin+span-pad;
//				draw_arc(angle_start, angle_end);
draw_arc(0, 30);
draw_counter_arc(0, 30);

				angle_spans.push([angle_start, angle_end]);
			}
		});

		angles[label_name] = angle_spans;

	});
	// todo: put in the symbol for each segment of the arc

	// draw ray between each segment of the arc to the next;

}
//ray_chart();



// <!-- <div class="section">
// <h3>Color joints</h3>

// <div id="color-joints">
// </div>
// </div>
//  -->

// <!-- <h3>Chord Diagram</h3>
// <div id="raychart" style="position:relative">
// 	<canvas width="500px" height="500px"></canvas>
// </div>
//  -->

// <!-- <div class="section">
// <h3>Ray Chart</h3>

// <p>
// This is a first prototype of a ray chart, a means of representing interrelationships between probably linked groups. The ray chart attempts to be similar to the flower diagram in showing interesting relationships between groups, but in a more generic form factor. 
// </p>

// <p>Hover over a category to see strength of linkages with all other data,  conditioned upon the hovered entity being true. 
// </p>


// <div id="container" style="position:relative; background-color:white; display: inline-block;">
// 	<canvas width="680px" height="500px"></canvas>
// 	<div id="industry" style="position:absolute; top: 400px; left: 50px; "></div>
// 	<div id="industry-bar" style="position:absolute; top: 400px; left: 50px; "></div>

// 	<div id="income" style="position:absolute; top: 0px; left: 20px; width: 100px;"></div>
// 	<div id="income-bar" style="position:absolute; top: 0px; left: 20px; width: 100px;"></div>

// 	<div id="education" style="position:absolute; top:0px; left: 550px; width: 140px;"></div>
// 	<div id="education-bar" style="position:absolute; top:0px; left: 550px; width: 140px;"></div>

// </div>

// </div>
//  -->
