var orderings = {
	'visit_parent': ['Self', 'Husband', 'Family members'],				
	'mobile_use': ['Yes', 'Somewhat', 'No'],
	'loan_dec': ['Both', 'Self', 'Husband', 'Family members'],
	'treat_self_ill' : ['Private hospital', 'Government hospital', 'Medical shop', 'Own treatment', ],
	'num_eat_daily' : ['Thrice a day', 'Twice a day', 'Once a day', ],
	'veg_cost' : ['Above Rs. 1500', 'Rs. 1001 - Rs. 1500', 'Rs. 500 - Rs. 1000', 'Less than Rs. 500',], 
	'fruit_cost' : ['Above Rs. 1500', 'Rs. 1001 - Rs. 1500', 'Rs. 500 - Rs. 1000', 'Less than Rs. 500',], 
	'meat_cost' : ['Above Rs. 1500', 'Rs. 1001 - Rs. 1500', 'Rs. 500 - Rs. 1000', 'Less than Rs. 500',], 
	'veg_consume' : ['Daily', '2-3 times a per week', 'Weekly', '2-3 times per month', 'Monthly', ],
	'fruit_consume' : ['Daily', '2-3 times a per week', 'Weekly', '2-3 times per month', 'Monthly', ],
	'san_napkin': ['Yes', 'No', "Don't know what a napkin is", ],
//	'newclothes': ['Once a month', 'Once in three months', 'Once in six months', 'Festival times', 'Once a year', ],
//	'newclothes': ['Once a month', 'Once in three months', 'Once in six months', 'Once a year', ],
	'newclothes': ['Once in three months', 'Once in six months', 'Once a year', ],

	'defeacation': ['Private toilet', 'Public toilet', 'Outside'],
	'age_marriage': ['Below 15', '15 to 17 years', '17 to 19 years', '19 to 21 years', '21 and above'].reverse(),

// others used just for the first item --> to calculate the index
	'dec_children': ['Self'],
	'clothesdecisionmaker': ['NONE'], 
	'dec_children_edu_mar': ['My opinion is accepted'],
	'rel_spouse': ['No'],

};



// assumes rank ordering 
function get_colors(weights){
	var bright = '#79c430'; // '#81c341'; //'#64d613';    
	var mid = '#bae4b3'; // '#95d16a';  

	if (weights.length == 2){
		return [bright, 'grey'];
	}
	if (weights.length == 3){
		return [bright, 'lightgray', 'gray'];
	}

	// else, return spectrum
	if (weights.length < 6){
		return [bright, mid, 'lightgray', 'gray', 'black'];			
	}

	return [bright, mid, 'lightgray', 'silver', 'gray', 'black'];		
}


function get_color(value){
	// // darkgrey to lightgrey
	var greys = ['#525252', '#969696', '#cccccc'];
	// // // lightgreen to darkgreen
	// var greens = ['#bae4b3', '#74c476', '#238b45'];
	// var colors = extend(greys, greens);

	var colors = [greys[0], greys[1], '#9dcf5c', '#77aa36', '#588f11', '#22571a']
	if (value == 1){
		return colors[colors.length-1];
	}

	var unit = 1/(colors.length-1);
	var low = Math.floor(value/unit);

	var scale = d3.scale.linear().range( [colors[low], colors[low+1]] );
	var x = value - unit*low;

	return scale(x);
}

function get_container_color(value){
	var scale = d3.scale.linear().range( ['black', 'white'] );
	var color = scale(value);
	var d = d3.rgb(color);
	return 'rgba('+d.r+','+d.g+','+d.b+',0.3)';
}

// function make_swatches(){
// 	$('#header').append('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
// 	range(0, 1, .1).forEach(function(x){
// 		var color=get_color(x);
// 		var $swatch = $('<div style="display:inline-block; width:50px;height:50px;"></div>');
// 		$swatch.css('background-color', color);
// 		$('#header').append($swatch);
// 	});
// }
// make_swatches();

// function get_goodness(question_id, match_by){
// 	// check the goodness cach	

// }

function get_goodness(question_id, match_by){

	if (match_by == 'none'){
		return 0;
	}

	function find_best_answer(question_id){
		var yes_questions =	['out_emp', 'respect_cbo', 'vote', 'soc_dem_iss', 'prob_solve', 'pol_involve', 'comp_use', 'dec_marriage', 'last_pers_eat', 'land', 'house', 'livestock', 'poultry', 'tv', 'vehicles', 'elec_app', 'houseextension', 'personal_mobile', 'text_tamil'];
		if (yes_questions.indexOf(question_id) > -1){
			return 'Yes';
		}

		try{
			var best_answer = orderings[question_id][0];
			return best_answer;		
		}catch (e) {
			console.log('find_best_answer failing for ' + question_id);
			debugger;
			return 0;
		}
	}

	// don't filter unless you have to -- filtering is expensive
	var all_data;
	if (match_by == get_current()){
		all_data = brains;
	}else if (match_by == get_comparison()){
		all_data = comparison_brains;
	}else{
		all_data = match_by_location(match_by);
	}
	
	var answers = _.countBy(all_data, function(x){
		return x[question_id];
	});

	var best_answer = find_best_answer(question_id);
	var num_best_answers = isdefined(answers[best_answer]) ? answers[best_answer] : 0;

	// for the food expenditures, we want to add in two more answers
	// 	'fruit_cost' : ['Above Rs. 1500', 'Rs. 1001 - Rs. 1500', 'Rs. 500 - Rs. 1000', 'Less than Rs. 500',], 
	if (question_id == 'meat_cost' || question_id == 'fruit_cost' || question_id == 'veg_cost'){
		var additional_best_answers = isdefined(answers['Rs. 1001 - Rs. 1500']) ? answers['Rs. 1001 - Rs. 1500'] : 0;
		num_best_answers += additional_best_answers;
	}

	var result = num_best_answers / sum(_.values(answers));

	if (isNaN(result)){
		debugger;
	}
	return result;
}

var index_sections = {
	'social': ['visit_parent', 'loan_dec', 'out_emp'],
	'equality': ['dec_children', 'visit_parent', 'dec_children_edu_mar', 'clothesdecisionmaker'],
	'community': ['respect_cbo', 'vote', 'soc_dem_iss', 'prob_solve', 'pol_involve'],
	'technology': ['comp_use', 'mobile_use',],
	'economic': ['veg_cost', 'fruit_cost', 'meat_cost', ],
	'marriage' : ['age_marriage', 'dec_marriage', 'rel_spouse',],
	'food': ['last_pers_eat'],
	'sanitation': ['defeacation', 'san_napkin'],
	'asset-slide' : ['land', 'house', 'livestock', 'poultry', 'tv', 'vehicles', 'elec_app', 'houseextension'],
};


index_score_cache = {};

function get_index_score(section, match_by){
	// this is slow on the profile so we cache what we find (saves 500ms)
	var key = section + ' ' + match_by;
	if (isdefined(index_score_cache[key])){
		return index_score_cache[key];
	}else{
		var value = compute_index_score(section, match_by);
		index_score_cache[key] = value;
		return value;
	}
}

function compute_index_score(section, match_by){
	function to_key(section){
		if (section == 'technical'){
			return 'technology';
		}
		if (section == 'other'){
			return 'sanitation';
		}
		return section.toLowerCase();
	}

	var question_ids = index_sections[to_key(section)];
	if (!isdefined(question_ids)){
		debugger;
	}

	var scores = question_ids.map(function(question_id){
		// find_goodness(question_id, current_level)
		return get_goodness(question_id, match_by);
	});
	return avg(scores);
}