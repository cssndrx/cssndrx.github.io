function filter_image(selector, score){
	//	var effect = score < .5 ? 'grayscale(' + (1-score) + ')' : 'saturate(' + (score*1.2) + ')';
	//	var effect = score < .5 ? 'grayscale(' + lerp(1-score, 0.5, 1, 0, 1) + ')' : 'saturate(' + lerp(score, 0.5, 1, 1, 1.7) + ')';
	var effect = 'saturate(' + lerp(score, 0, 1, 0, 1.1) + ')';

	$(selector).css({
	   'filter'         : effect,
	   '-webkit-filter' : effect,
	   '-moz-filter'    : effect,
	   '-o-filter'      : effect,
	   '-ms-filter'     : effect
	});
};

function darken_image(selector, score){
	var effect = 'brightness(' + score + ')';

	$(selector).css({
	   'filter'         : effect,
	   '-webkit-filter' : effect,
	   '-moz-filter'    : effect,
	   '-o-filter'      : effect,
	   '-ms-filter'     : effect
	});	
}


function get_uniques(question_id){
	var counts = _.countBy(full_brains, function (datum){
		return datum[question_id];
	});
	return _.keys(counts);
}

function match_by_location(match_by){ 
	var fields = ['hab_name', 'panch_name', 'clust_name',	'block_name'];

	return _.filter(full_brains, function(x){
		if (match_by == 'all'){
			return true;
		}

		return x[fields[0]] == match_by || x[fields[1]] == match_by || x[fields[2]] == match_by || x[fields[3]] == match_by;
	});
}
