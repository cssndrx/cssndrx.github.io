var hierarchy;
var clusters;

var brains = _.clone(full_brains);


function make_hierarchy(){
	var fields = ['hab_name', 'panch_name', 'clust_name',	'block_name'];

	// gives the next immediately bigger one
	hierarchy = {};

	// take brains and figure out 
	brains.forEach(function(datum){
		for (var i=0; i<fields.length-1; i++){
			var field = fields[i];
			var superfield = fields[i+1];

			var field_value = datum[field];
			var superfield_value = datum[superfield];

			hierarchy[field_value] = superfield_value;

		}
	});


	// get the clusters, what else was grouped into the same superfield
	clusters = {};

	var pairs = _.pairs(hierarchy);
	pairs.forEach(function(pair){
		var lower = pair[0];
		var upper = pair[1];

		if (_.has(clusters, upper)){
			if (clusters[upper].indexOf(lower) == -1){
				// if (upper == 'Agamalai - Tribal'){
				// 	debugger;
				// }
				clusters[upper].push(lower);
			}
		}else{
			clusters[upper] = [lower, ];
		}
	});
}
make_hierarchy();


function get_similar(current){
	if (current == 'all'){
		// what to recommend??
		return [];
	}	

	// get copy of the similar array
	var similar = clusters[get_upper(current)].slice(0);

	var ind = similar.indexOf(current);
	similar.splice(ind, 1);
	return similar;
}



function get_comparators(current){
	if (current == 'all'){
		// what to recommend??
		return [];
	}	

	var similar = get_similar(get_current());
	similar.push(get_upper(current));
	return similar;
}

function get_upper(current){
	return hierarchy[current];
}

function get_district(current){
	if (current[0] == 'H' && current[2] == ' '){
		// hack for determining habitation
		return hierarchy[hierarchy[current]];
	}
	return hierarchy[current];
}
