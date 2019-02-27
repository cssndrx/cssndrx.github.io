var PICKUP_COLOR = 0xe41a1c;
var DROPOFF_COLOR = 0x00A5FF;

var container, scene, camera, renderer, controls;

var segments = 20,
	xMin = -10, xMax = 10, xRange = xMax - xMin,
	yMin = -10, yMax = 10, yRange = yMax - yMin,
	zMin = -10, zMax = 10, zRange = zMax - zMin;
	
var consumables = [];


function iter_to_datetime(iter){
  var step_size = 15; // 15 min
  var steps_in_a_hour = 60/step_size;
  var steps_in_a_day = steps_in_a_hour * 24;

  var time_offset = iter % steps_in_a_day;
  var day_offset = Math.floor(iter / steps_in_a_day);

  var hour = Math.floor(time_offset / steps_in_a_hour);
  var minute = time_offset % steps_in_a_hour * step_size;

  // Return a JS date.
  // For some reason, month is 0 index and date is 1 indexed.
  // new Date(2012, 4, 1, 1) --> Tue May 01 2012 01:00:00 GMT-0700 (Pacific Daylight Time)
  return new Date(2012, 4, day_offset+1, hour, minute);
}  
console.assert(iter_to_datetime(0).getTime(), new Date(2012, 4, 1).getTime());


function update_clock(datetime){
	var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	var date_string = datetime.toLocaleDateString("en-US", options);

	var time_string = datetime.toLocaleString().split(', ')[1].replace(':00 ', ' ');

  $('#date').text(date_string);
  $('#time').text(time_string);
}


function show_data_for(iter){
	console.log('showing data for iter ' + iter);
	make_topology(iter); 
	update_clock(iter_to_datetime(iter));
}


function x_hover_to_iter(x_hover){
	var pixels = $(window).width();
	var num_points = 4*24*31;
	return Math.round(x_hover * num_points / pixels);
}

function init_threejs() {
	// SCENE
	scene = new THREE.Scene();

	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 90, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	camera.position.set(2, -3, 10);
	scene.add(camera);

	// RENDERER
	if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	else
		renderer = new THREE.CanvasRenderer(); 
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	container = document.getElementById( 'ThreeJS' );
	container.appendChild( renderer.domElement );

	// EVENTS
	THREEx.WindowResize(renderer, camera);
	controls = new THREE.TrackballControls( camera, renderer.domElement );

	// LIGHT
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);


	// FLOOR
	var bostonTexture = new THREE.TextureLoader().load( 'images/boston.png' );
	var bostonMaterial = new THREE.MeshBasicMaterial( { map: bostonTexture, alphaTest: 0.5, transparent: true} );
	var floorGeometry = new THREE.PlaneGeometry(20,20); //10,10);
	var floor = new THREE.Mesh(floorGeometry, bostonMaterial);
	floor.position.z = 0.05;
	scene.add(floor);
	
	// bgcolor
	renderer.setClearColor( 0x000, 1 );
}

function graph_geometry_from_equation(equation){
	xRange = xMax - xMin;
	yRange = yMax - yMin;
	zFunc = Parser.parse(equation).toJSFunction( ['x','y'] );
	var meshFunction = function(x, y, target) 
	{
		x = xRange * x + xMin;
		y = yRange * y + yMin;
		var z = zFunc(x,y);
		if ( isNaN(z) ){
		    target.set(0, 0, 0);			
		}
		else{
			target.set(x, y, z);
		}
	};
	
	return new THREE.ParametricGeometry( meshFunction, segments, segments, true );		
}


function make_topology(iter) {

	var pickupGeometry = graph_geometry_from_equation(make_equation(data_full[iter], 2));
	var dropoffGeometry = graph_geometry_from_equation(make_equation(data_full[iter], 3));


	consumables.forEach(x => scene.remove(x));

	var pickupsWireframe = new THREE.Mesh(pickupGeometry, new THREE.MeshBasicMaterial( { 
			color: PICKUP_COLOR, 
			wireframe: true,
		} ));

	var dropoffsWireframe = new THREE.Mesh(dropoffGeometry, new THREE.MeshBasicMaterial( { 
			color: DROPOFF_COLOR, 
			wireframe: true,
		} ));

	consumables = [
		pickupsWireframe, 
		dropoffsWireframe, 
	];

	consumables.forEach(x => scene.add(x));
}


function make_equation(points, h_index){
	// take a list of lists containing [x1, y1, h1] and return an equation
	// x1 and y1 must be non-negative
	var equation = '';
	var fudge = 0.1;
	for (var i=0; i<points.length; i++){
		var point = points[i];

		var x_str = point[0] < 0 ? '+'+Math.abs(point[0]) : '-'+point[0];
		var y_str = point[1] < 0 ? '+'+Math.abs(point[1]) : '-'+point[1];

		if (point[h_index] >= 0){
			equation += '+';
		}
		equation += point[h_index]*fudge + '/(1+20*((x'+x_str+')^2+(y'+y_str+')^2)) '
	}
	return equation;
}
		

function animate() {
    requestAnimationFrame( animate );
	render();		
	update();
}


function render() {
	renderer.render( scene, camera );
}

function update() {	
	controls.update();
}


function make_graph(pickups, dropoffs){

	function convert_for_rickshaw(arr){
		var arr_data = [];
		for (var i=0; i<arr.length; i++){
			arr_data.push({'x':i, 'y': arr[i]});
		}
		return arr_data;
	}

	var graph = new Rickshaw.Graph( {
		element: document.getElementById("rickshaw-chart"),
		width: $(document).width(), 
		height: 70,
		renderer: 'line',
		series: [
			{
				color: '#e41a1c', // red
				data: convert_for_rickshaw(pickups),
				name: 'taxi pickups'
			}, 
			{
				color: 'lightskyblue',
				data: convert_for_rickshaw(dropoffs),
				name: 'taxi dropoffs'
			}, 
		]
	} );

	graph.render();

	var legend = document.querySelector('#legend');

	var Hover = Rickshaw.Class.create(Rickshaw.Graph.HoverDetail, {

		render: function(args) {

			$(legend).empty();
	
			args.detail.forEach( function(d) {
				// x_hover = d.formattedXValue;
				// slider_value_changed();

				var line = document.createElement('div');
				line.className = 'line';

				var swatch = document.createElement('div');
				swatch.className = 'swatch';
				swatch.style.backgroundColor = d.series.color;

				var label = document.createElement('div');
				label.className = 'label';
				label.innerHTML = '' + d.formattedYValue + ' ' + d.name + ' / 15 min';

				line.appendChild(swatch);
				line.appendChild(label);
				legend.appendChild(line);

				var dot = document.createElement('div');
				dot.className = 'dot';
				dot.style.top = graph.y(d.value.y0 + d.value.y) + 'px';
				dot.style.borderColor = d.series.color;

				this.element.appendChild(dot);
				dot.className = 'dot active';


				this.show();

			}, this );
	        }
	});

	var hover = new Hover( { graph: graph,
							 xFormatter: function(x) {return x;},
							 yFormatter: function(y) {return y;} } ); 	
}


function init_timeline(){
	var pickups = _.map(data_full, timestep => _.sum(_.map(timestep, x => x[2])));
	var dropoffs = _.map(data_full, timestep => _.sum(_.map(timestep, x => x[3])));
	make_graph(pickups, dropoffs);


	// Track user hover on the timeline.
	$('#rickshaw-chart').mousemove(function(event){
		var iter = x_hover_to_iter(event.pageX);
		show_data_for(iter);
	});

	var init_event = $.Event('mousemove');
	init_event.pageX = 0;
	$('#rickshaw-chart').trigger(init_event);	
}

$(document).ready(function(){
	init_threejs();
	init_timeline();
	animate();
});