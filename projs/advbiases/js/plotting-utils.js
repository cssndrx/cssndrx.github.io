

function plot_beta(selector, a, b){

	// console.log('beta mean ' + jStat.beta.mean(a, b));
	// console.log('beta median ' + jStat.beta.median(a, b));
	// console.log('beta mode ' + jStat.beta.mode(a, b));
	// console.log('beta variance ' + jStat.beta.variance(a, b));

	pts = range(0, 1, .01);

	pts = pts.map(function(elt){
		return {x:elt, y:jStat.beta.pdf(elt, a, b)};
	});

	nv.addGraph(function() {
	  var chart = nv.models.lineChart()
	  .options({
	    margin: {left: 100, bottom: 100},
	    showXAxis: true,
	    showYAxis: true,
	    transitionDuration: 250
	  })
	  ;

   chart.xAxis
       .axisLabel('Theta')
       .tickFormat(d3.format('.01f'));
  
    chart.yAxis
       .axisLabel('pdf')
       .tickFormat(d3.format('.01f'));

	 var packaged =  [{area:true, 
	    		values: pts, 
	    		key: 'Beta'}];

	  console.log(packaged);

	  d3.select(selector)
	    .datum(packaged)
	    .call(chart);

	});
}



function add_poi(selector, chart, points){
	// add points of interest
	for (var i=0; i<points.length; i++){
		var point = points[i];
		var x_loc = chart.xScale()(point);

		d3.select(selector).append('svg:line')
		.attr('x1', x_loc)
		.attr('y1', 0)
		.attr('x2', x_loc)
		.attr('y2', 200)
		.style("stroke", "rgb(6,120,155)");

	}
}

var integer = d3.format('d');
var float2 = d3.format('.02f');
var float1 = d3.format('.01f');

function format_xaxis(chart, label, format){
    chart.xAxis
       .axisLabel(label)
       .tickFormat(format);
}
function format_yaxis(chart, label, format){
    chart.yAxis
       .axisLabel(label)
       .tickFormat(format);	
}

function plot_geometric_cdf(selector, p){
	var epsilon = .001;
	var k = 0;

	var values = [];
	while (geometric_pdf(k, p) > epsilon){
		values.push( {x:k, y:geometric_cdf(k, p) } );
		k++;
	}

	var chart = nv.models.historicalBarChart()
				.margin({top: 30, right: 90, bottom: 50, left: 90});
//				.useInteractiveGuideline(true);

	var packaged = [{key: 'geometric pdf', values: values}];

	format_yaxis(chart, 'pdf', float2);
	format_xaxis(chart, 'n', integer);
	
	d3.select(selector)
	  .datum(packaged)
	  .call(chart);

	nv.utils.windowResize(chart.update);	 

	nv.addGraph(function() {
	  return chart;
	});

}

function plot_geometric_pdf(selector, p){
	var epsilon = .001;
	var k = 0;

	var values = [];
	while (geometric_pdf(k, p) > epsilon){
		values.push( {x:k, y:geometric_pdf(k, p) } );
		k++;
	}

	var chart = nv.models.historicalBarChart()
				.margin({top: 30, right: 90, bottom: 50, left: 90});
//				.useInteractiveGuideline(true);

	var packaged = [{key: 'geometric pdf', values: values}];

	format_yaxis(chart, 'pdf', float2);
	format_xaxis(chart, 'n', integer);
	
	d3.select(selector)
	  .datum(packaged)
	  .call(chart);

	nv.utils.windowResize(chart.update);	 

	nv.addGraph(function() {
	  return chart;
	});

}

function plot_poisson_pdf(selector, lambda){
	var epsilon = .001;
	var k = 0;

	var values = [];
	while (jStat.poisson.pdf(k, lambda) > epsilon){
		values.push( {x:k, y:jStat.poisson.pdf(k, lambda) } );
		k++;
	}

	// make the plot
	var chart = nv.models.historicalBarChart()
				.margin({top: 30, right: 90, bottom: 50, left: 90});

	var packaged = [{key: 'poisson pmf', values: values	}];

	format_yaxis(chart, 'pmf', float1);
	format_xaxis(chart, 'k', integer);
	
	d3.select(selector)
	  .datum(packaged)
	  .call(chart);

	nv.utils.windowResize(chart.update);	 

	nv.addGraph(function() {
	  return chart;
	});
}

function plot_poisson_cdf(selector, lambda){
	var epsilon = .001;
	var k = 0;

	var values = [];
	while (jStat.poisson.pdf(k, lambda) > epsilon){
		values.push( {x:k, y:jStat.poisson.cdf(k, lambda) } );
		k++;
	}

	// make the plot
	var chart = nv.models.historicalBarChart()
				.margin({top: 30, right: 90, bottom: 50, left: 90});
//				.useInteractiveGuideline(true);

	var packaged = [{key: 'poisson cdf', values: values}];

	format_yaxis(chart, 'cdf', float1);
	format_xaxis(chart, 'k', integer);
	
	d3.select(selector)
	  .datum(packaged)
	  .call(chart);

//	add_poi(selector, chart, [2]);

	nv.utils.windowResize(chart.update);	 

	nv.addGraph(function() {
	  return chart;
	});

}


function add_linechart(selector, arr){
	var chart = nv.models.lineChart()
				.margin({top: 30, right: 90, bottom: 50, left: 90})
	            //.margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
	            .useInteractiveGuideline(false)  //We want nice looking tooltips and a guideline!
	            .transitionDuration(350)  //how fast do you want the lines to transition?
	            .showLegend(false)       //Show the legend, allowing users to turn on/off line series.
	            .showYAxis(false)        //Show the y-axis
	            .showXAxis(false)        //Show the x-axis
	            .tooltips(false)
	;

	var packaged = [{ values: arr.map(function (elt, ind){
															 	return {x: ind+1, y:elt};
															 }) }];
	      		  
	  d3.select(selector)
	      .datum(packaged)
	      .call(chart);
	 
	  nv.utils.windowResize(chart.update);	 

	nv.addGraph(function() {
	  return chart;
	});
	
	return chart;

}

function make_linechart(selector, arr, params){
	if (params === undefined){
		params = {};
	}

	if (arr.length < 1){
		return;
	}

	var chart = nv.models.lineChart()
				.margin({top: 30, right: 90, bottom: 50, left: 90})
	            .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
	            .transitionDuration(350)  //how fast do you want the lines to transition?
	            .showYAxis(true)        //Show the y-axis
	            .showXAxis(true)        //Show the x-axis
	;
  
	var packaged = [{  values: arr.map(function (elt, ind){
															 	return {x: ind+1, y:elt};
															 }) }];

	if (isdefined(params.datalabel)){
		packaged[0]['key'] = params.datalabel;
		chart.showLegend(true);
	}else{
		chart.showLegend(false);
	}

	// add in a horizontal secret value if necessary
	if (_.isNumber(params.secret_value)){
		packaged.push(
	      		  {key: 'theoretical mean', color: 'orange', values: arr.map(function (elt, ind){
											 	return {x: ind+1, y:params.secret_value};
											 })}
			);
	}

	if (isdefined(params.yaxis)){
		format_yaxis(chart, params.yaxis.label, params.yaxis.formatter);
	}

	if (isdefined(params.xaxis)){
		format_xaxis(chart, params.xaxis.label, params.xaxis.formatter);		
	}
	      		  
	  d3.select(selector)
	      .datum(packaged)
	      .call(chart);
	 
	  nv.utils.windowResize(chart.update);
	 

	nv.addGraph(function() {
	  return chart;
	});
	
	return chart;
}

// todo: color individual bars in the histogram
// todo: make sure the histogram handles new data correctly (error) --> oops shouldn't be deleting the data
function make_histogram(selector, arr, params){
	if (params === undefined){
		params = {};
		params.binning = range(Math.floor(min(arr)), Math.ceil(max(arr))+2);
	}

	$(selector).find('rect').remove();

	 var chart = nv.models.historicalBarChart()
				.margin({top: 30, right: 90, bottom: 50, left: 90})
	    		.transitionDuration(250)
	    		.tooltips(false)
	 			;

	 var hist = d3.layout.histogram()
		 .bins(params.binning)
		 (arr);

	 var packaged = [{key: params.datalabel, 
	 				 values: hist}];

	if (isdefined(params.datalabel)){
		packaged[0]['key'] = params.datalabel;
	}

	if (isdefined(params.yaxis)){
		format_yaxis(chart, params.yaxis.label, params.yaxis.formatter);
	}

	if (isdefined(params.xaxis)){
		format_xaxis(chart, params.xaxis.label, params.xaxis.formatter);		
	}

	  d3.select(selector)
	      .datum(packaged)
	      .call(chart);
	 
	  nv.utils.windowResize(chart.update);

	nv.addGraph(function() {	 
	  return chart;
	});

	return chart;
}

function to_nvd3_values(labels, belief){
	return labels.map(function (x, ind) {return {label: x, value: belief[ind]}; });
}


function plot_histogram_belief(selector, values){
		var historicalBarChart = [ 
  {
    key: "",
    values: values.map(function (x) { x.color = '#5595BB'; return x;}), 
  }
];

	nv.addGraph(function() {  
	  var chart = nv.models.discreteBarChart()
	      .x(function(d) { return d.label })
	      .y(function(d) { return d.value })
//	      .staggerLabels(true)
	      .showValues(true)
	      .transitionDuration(250)
	      ;


	  d3.selectAll(selector)
	      .datum(historicalBarChart)
	      .call(chart);

	// nv.utils.windowResize(function(){ console.log("RESIZEEEEEEEEEEEEEEEE");});
	  // nv.utils.windowResize(function () {
	  // 	if ($(selector).is(':visible')) {
	  // 		console.log('UPDATTTINGGGGGGGG');
		 //  	chart.update();
	  // }});
	  nv.utils.windowResize(chart.update);

	  return chart;
	});
}


function make_belief_plot(selector, values, params){
	if (params === undefined){
		params = {};
//		params.binning = range(Math.floor(min(arr)), Math.ceil(max(arr))+2);
	}

	$(selector).find('rect').remove();

	 var chart = nv.models.lineChart()
				.margin({top: 30, right: 90, bottom: 50, left: 90})
	    		.transitionDuration(250)
	    		.tooltips(false)
				.forceY([0,.5])
	 			;

	//var normalize_belief(belief, x0, x1);

	 // var hist = d3.layout.histogram()
		//  .bins(params.binning)
		//  (arr);

	 var packaged = [{key: 'your belief', 
	 				 values: values,
	 				 area: true}, 
	 				 ];

	if (isdefined(params.secret)){
	 	packaged.push(params.secret);			 
	}	 				 

	// if (isdefined(params.datalabel)){
	// 	packaged[0]['key'] = params.datalabel;
	// }

	if (isdefined(params.yaxis)){
		format_yaxis(chart, params.yaxis.label, params.yaxis.formatter);
	}

	if (isdefined(params.xaxis)){
		format_xaxis(chart, params.xaxis.label, params.xaxis.formatter);		
	}

	  d3.select(selector)
	      .datum(packaged)
	      .call(chart);
	 
	  nv.utils.windowResize(chart.update);

	nv.addGraph(function() {	 
	  return chart;
	});

	return chart;
}