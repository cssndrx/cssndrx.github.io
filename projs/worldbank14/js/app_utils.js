function get_current(){
	return isdefined($('#nowshowing-dropdown').val()) ? $('#nowshowing-dropdown').val() : 'all';
}

function get_comparison(){
	return isdefined($('#compare-dropdown').val()) ? $('#compare-dropdown').val() : 'none';
}

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

	if (match_by == 'none'){
		return [];
	}

	return _.filter(full_brains, function(x){
		if (match_by == 'all'){
			return true;
		}

		return x[fields[0]] == match_by || x[fields[1]] == match_by || x[fields[2]] == match_by || x[fields[3]] == match_by;
	});
}

function to_tamil(text){
	var translations = {
		'diet': 'உணவு',
		'face forces': 'முகசக்திகள்',
		'asset change': 'சொத்துக்களில் மாற்றம்',
		'flowers and marriage': 'திருமணம்',
		'both': 'இருவரும்',
		'self': 'சுயமாக',
		'husband': 'கணவர்',
		'family members': 'குடும்ப உறுப்பினர்கள்',
		'yes': 'ஆம்',
		'no': 'இல்லை',
		'somewhat': 'ஓரளவிற்கு',
		"don't know what a napkin is": 'நாப்கின் என்றால் தெரியாது',
		'private toilet': 'தனிநபர் கழிவறை',
		'public toilet': 'பொதுக் கழிப்பிடம்',
		'outside': 'திறந்த வெளி கழிப்பிடம்',
		'thrice a day': 'மூன்று வேளை',
		'twice a day': 'இரண்டு வேளை',
		'once a day': 'ஒரு வேளை',
		'once a year': 'வருடத்திற்கு ஒரு முறை',
		'once in six months': 'ஆறு மாதத்திற்கு ஒரு முறை',
		'once in three months': 'மூன்று மாதத்திற்கு ஒரு முறை',
		'all': 'அனைத்து',
		'none': 'யாரும்',
		'health and sanitation': 'சுகாதாரம் மற்றும் உடல் நலம்',
		'technical': 'தொழில்நுட்பம்',
		'social': 'சமூகம்',
		'community': 'சமுதாயம்',
		'economic': 'பொருளாதாரம்',

	};
	if (isdefined(translations[text.toLowerCase()])){
		return translations[text.toLowerCase()];			
	}
	return text;
}

function get_photograph(question_id){
	var filter_images_dict = {
		'comp_use': 'computerusage.JPG',
		'pol_involve': 'woman_at_mic.jpg', //'womanspeaking.JPG',
		'treat_self_ill': 'doctor.JPG',
		'prob_solve': 'circle_meeting.jpg', //'circleofwomen.JPG',
		'defeacation': 'woman_toilet.jpg',
		'san_napkin': 'whisper2.jpg',
		'mobile_use': 'womancell.jpg',
		'out_emp': 'businesswoman.jpg',
		'text_tamil': 'redphone.jpg',
		'personal_mobile': 'doyouownmobile.JPG', // 'colorful_phone.jpg',
		'vote': 'votercard.jpg',
		'soc_dem_iss': 'demonstration_hands.jpg', //'demonstration.JPG',
		'newclothes': 'brightclothes.jpg',
		'num_eat_daily': 'bananleaffood.jpeg',
		'visit_parent': 'couplehouse.jpg',
		'loan_dec': 'womanbank.jpg',
		'out_emp': 'walkinghandbag.jpg',		
	}
	return filter_images_dict[question_id];

}

function get_histogram_symbols(indicator, choices){
	if (choices[0] == 'Yes' && choices.length == 2){			
		return ['images/yes.png', 'images/no.png'];
	}

	if (choices[0] == 'Yes' && choices[1] == 'Somewhat'){
		return ['images/yes.png', 'images/somewhat.png', 'images/no.png'];
	}

	if (choices[0] == 'Yes' && choices[2] == "Don't know what a napkin is"){
		return ['images/yes.png', 'images/no.png', 'images/dontknow.png'];
	}

	if (choices[0] == 'Thrice a day'){
		return ['images/bananaleaf3.png', 'images/bananaleaf2.png', 'images/bananaleaf2.jpeg',];
	}

	if (choices[0] == 'Private toilet'){
		return ['images/indian-toilet.png', 'images/publictoilet.jpg', 'images/grass.png'];
	}

	if (choices[0] == 'Once in three months'){
		return ['images/saree4.png', 'images/saree2.png', 'images/saree.png'];
	}

	return choices.map(function(choice){
		if (choice == 'Both'){				
			return 'images/both.png';
		}
		else if (choice == 'Self'){
			return 'images/woman.png';
		}
		else if (choice == 'Husband'){
			return 'images/man.png';
		}
		else if (choice == 'Family members'){
			return 'images/family.png';
		}
		else{				
			return '';
		}

	});
}

function get_histogram_text(question_id, is_eng){
		var pretty_question = {'visit_parent': "Who decides visits to your parents' home?",
		'loan_dec': "Who makes decisions on loans and assets in your family?",
		'out_emp': "Does your family allow you to pursue employment outside the house?",
		'respect_cbo' : "Have you gained respect after joining a SHG/CBO?",
		'prob_solve' : "Have you been involved in solving problems within your SHG/CBO?", 
		'soc_dem_iss' : "Have you been in any demonstration on social issues?", 
		'vote' : "Do you vote?", 
		'pol_involve': "Are you interested in getting involved in politics?",
		'comp_use' : "Have you used a computer?", 
		'personal_mobile' : "Do you have a phone?", 
		'mobile_use' : "Can you use a mobile phone on your own?", 
		'text_tamil' : "Can you read and send text messages?",
		'num_eat_daily': "How many times a day do you eat?", 
		'veg_consume' : "How often do you consume vegetables?", 
		'veg_cost' : "How much do you spend on the purchase of vegetables in a month?", 
		'fruit_consume' : "How often do you consume fruits?", 
		'fruit_cost' : "How much do you spend on the purchase of fruits in a month?", 
		'newclothes' : "How many times a year do you purchase new clothes for yourself?",
		'defeacation' : "Where do you go to defecate?", 
		'treat_self_ill': "If you are ill, what is the first method of treatment that you take?", 
		'san_napkin' : "Have you used sanitary napkins during your menstrual period?",		
	};

	var pretty_question_tamil = {'visit_parent': "Who decides visits to your parents' home?",
		'loan_dec': "உங்களது குடும்பத்திற்கு கடன் மற்றும் சொத்துக்கள் வாங்குவதுகுறித்த செயல்பாடுகளை நிர்ணயிப்பது யார்?",
		'out_emp': "நீங்கள் வேலைக்கு செல்வதற்கு குடும்பத்தினர் அனுமதிக்கின்றார்களா?",
		'respect_cbo' : "நீங்கள் மக்கள் அமைப்பில் சேர்ந்த பிறகு உங்களுக்கு அங்கீகாரம் கிடைத்துள்ளதா?",
		'prob_solve' : "சுய உதவி குழு / மக்கள் அமைப்பில் ஏற்படும் பிரச்சனைகளுக்கு தீர்வு காணுவதில் உங்கள் பங்கேற்பு உள்ளதா?", 
		'soc_dem_iss' : "சமுதாய பிரச்சனைகள் குறித்த போராட்டங்களில் நீங்கள் ஈடுபட்டுள்ளீர்களா?", 
		'vote' : "நீங்கள் தேர்தலின் போது வாக்களிப்பீர்களா?", 
		'pol_involve': "உங்களுக்கு அரசியலில் ஈடுபட ஆர்வமுள்ளதா?",
		'comp_use' : "கணினி பயன்படுத்த தெரியுமா?", 
		'personal_mobile' : "உங்களிடம் கைபேசி உள்ளதா?", 
		'mobile_use' : "உங்களுக்கு தன்னிச்சையாக கைபேசியை பயன்படுத்த தெரியுமா?", 
		'text_tamil' : "உங்களால் கைபேசி மூலம் செய்திகளை படிக்க மற்றும் அனுப்ப முடியுமா?",
		'num_eat_daily': "ஒரு நாளைக்கு நீங்கள் எத்தனை வேளை உணவு எடுத்துக்கொள்கிறீர்கள்?", 
		'veg_consume' : "How often do you consume vegetables?", 
		'veg_cost' : "How much do you spend on the purchase of vegetables in a month?", 
		'fruit_consume' : "How often do you consume fruits?", 
		'fruit_cost' : "How much do you spend on the purchase of fruits in a month?", 
		'newclothes' : "நீங்கள் ஒரு வருடத்திற்கு எத்தனை முறை புதிய உடை எடுப்பீர்கள்?",
		'defeacation' : "நீங்கள் கழிப்பிடத்துக்கு எங்கு செல்வீர்கள்?", 
		'treat_self_ill': "If you are ill, what is the first method of treatment that you take?", 
		'san_napkin' : "நீங்கள் மாதவிடாய் காலங்களில் நாப்கின் பயன்படுத்துகிறீர்களா?",		
	};

	return is_eng ? pretty_question[question_id] : pretty_question_tamil[question_id];
}