// process the pre_full_brains into pre_full_brains
// based on the new data specification

full_brains = full_brains.map(function(datum){
	function make_clothes_decision_maker(){
		// todo: figure out what to do with this

			// 'clothesdecisionmaker': {'NONE': 'woman',
			// 			 			'1) Husband': 'man', 
			// 						'#2) parents': 'family', 
			// 						'#3) son / daughter': 'family', 
			// 						'#4) family member': 'family' },

		var to_merge = ['cdm_husband', 'cdm_parents', 'cdm_child', 'cdm_family'];
		var conversion = ['1) Husband', '#2) parents', '#3) son / daughter', '#4) family member'];

		var triggered = false;
		to_merge.forEach(function(party, ind){
			if (datum[party] == '1'){
				datum['clothesdecisionmaker'] = conversion[ind];
				triggered = true;
			}
		});

		if (!triggered){
			datum['clothesdecisionmaker'] = 'NONE';
		}
	}

	function convert_brains(question_ids, mapping){
		for (var i=0; i<question_ids.length; i++){
			var question_id = question_ids[i];

			if (isdefined(datum[question_id])){
				var val = parseInt(datum[question_id]);				
			}else{
				continue;
			}

			if (!isdefined(mapping[val])){
				debugger;
			}
			datum[question_id] = mapping[val];
		}
	}

	var yesnomap = {'1': 'Yes', '0': 'No'};

	convert_brains(['dec_children_edu_mar'], {'1': 'My opinion is accepted', '2': 'My opinion is not accepted', '3': 'My opinion is accepted sometimes', '4': 'My opinion is totally rejected'});
	convert_brains(['age_marriage'], {'1': 'Below 15', '2': '15 to 17 years', '3': '17 to 19 years', '4': '19 to 21 years', '5': '21 and above'});
	convert_brains(['out_emp', 'respect_cbo', 'prob_solve', 'soc_dem_iss', 'vote', 'pol_involve', 'last_pers_eat', 'dec_marriage', 'rel_spouse', 'clothespreference'], yesnomap);
	convert_brains(['loan_dec', 'visit_parent', 'dec_children'], {'1': 'Self', '2': 'Husband', '3': 'Family members', '4': 'Both'});
	convert_brains(['comp_use', 'personal_mobile', 'text_tamil'], yesnomap);
	convert_brains(['mobile_use'], {'1': 'Yes', '2': 'Somewhat', '3': 'No'});
	convert_brains(['land', 'house', 'livestock', 'poultry', 'tv', 'vehicles', 'elec_app', 'houseextension'], yesnomap);
	convert_brains(['land5', 'house5', 'livestock5', 'poultry5', 'tv5', 'vehicles5', 'elec_app5', 'houseextension5'], yesnomap);
	convert_brains(['num_eat_daily'], {'3': 'Once a day', '2': 'Twice a day', '1': 'Thrice a day'});
	convert_brains(['defeacation'], {'1': 'Outside', '2': 'Public toilet', '3': 'Private toilet'});
	convert_brains(['newclothes'], {'1': 'Once in three months', '2': 'Once in six months', '3': 'Festival times', '4': 'Once a year'});
	convert_brains(['san_napkin'], {'1': 'Yes', '2': 'No', '3': "Don't know what a napkin is"});

//	'Less than Rs. 500', 'Rs. 500 - Rs. 1000', 'Rs. 1001 - Rs. 1500', 'Above Rs. 1500'
	convert_brains(['fruit_cost', 'veg_cost', 'meat_cost'],  {'1': 'Less than Rs. 500', '2': 'Rs. 500 - Rs. 1000', '3': 'Rs. 1001 - Rs. 1500', '4': 'Above Rs. 1500'});
	convert_brains(['fruit_consume', 'veg_consume', 'meat_consume'], {'1': 'Daily', '2': '2-3 times a per week', '3': 'Weekly', '4': '2-3 times per month', '5': 'Monthly'});	
	make_clothes_decision_maker();

	return datum;
});


// processing this takes 400ms on initial load
// will just process it once and save it

// var textFile = null,
//   makeTextFile = function (text) {
//     var data = new Blob([text], {type: 'text/plain'});

//     // If we are replacing a previously generated file we need to
//     // manually revoke the object URL to avoid memory leaks.
//     if (textFile !== null) {
//       window.URL.revokeObjectURL(textFile);
//     }

//     textFile = window.URL.createObjectURL(data);

//     // returns a URL you can use as a href
//     return textFile;
//   };

// makeTextFile(JSON.stringify(full_brains));

//console.log(JSON.stringify(full_brains));