function village_viz(){
	function show_circles(){
		$('.swatch').remove();
		
		$('.village-pic:visible').each(function(ind){
			var score = $(this).data('score');

			var $bar = $('<div style="position:absolute;"></div>');
			$bar.addClass('swatch');
			$bar.css('background-color', get_color(score));
			$bar.css('top', $(this).position().top + $(this).height() + 3);
			$bar.css('left', $(this).position().left + $(this).width()/2);

			$(this).parent().append($bar);
		});

		// // add the circles into the symbol pics
		// $('.symbol-pic:visible').each(function(ind){
		// 	var score = $(this).find('img').data('score');

		// 	var $bar = $('<div></div>');
		// 	$bar.addClass('swatch');
		// 	$bar.css('background-color', get_color(score));
		// 	$bar.width(20).height(20);

		// 	$(this).append('<br>');
		// 	$(this).append($bar);
		// });

	}

	function toggle_scene(){
		$main.toggle();
		$comp.toggle();

		show_circles();
	}

	var $main = make_village_scene(get_current());
	var $comp = make_village_scene(get_comparison());

	// $main.find('.header').text(get_current());
	// $comp.find('.header').text(get_comparison());
	$main.find('.header').text(get_current() + ' | ');
	$main.find('.header').append($('<a></a>').text(get_comparison()).click(toggle_scene) );

	$comp.find('.header').append($('<a></a>').text(get_current()).click(toggle_scene) );
	$comp.find('.header').append(' | ' + get_comparison());



	$('#village-scenes').empty();

	// var $button = $('<button>Compare</button>');
	// $button.click();

	// $('#village-scenes').append($button);
	$('#village-scenes').append($main);
	$('#village-scenes').append($comp);
	$comp.hide();

	// for each section of the village scene
	var $bkg = $("img[src='images/back.png']");
	filter_image($bkg, .2);

	// add in a little indicator bar to the bottom of each filter image
	show_circles();

	$('.village-pic').mouseenter(function(){
		$(this).height($(this).height()*1.1);
	});

	$('.village-pic').mouseleave(function(){
		$(this).height($(this).height()*10/11);
	});

}

function make_village_scene(match_by){
	var $widget = $('#village-scene').clone();
	$widget.css('display', 'inline-block');
	$widget.removeAttr('id');


	// get the ordering for each question
	_.pairs(index_sections).forEach(function (pair){
		var section = pair[0];

		var $village_pic = $widget.find("a[href='#" + section + "']").find('img');
		if ($village_pic.length == 0){
			debugger;
		}

		var average = get_index_score(section, match_by);
		filter_image($village_pic, average);
		// score used for generating the bars
		$village_pic.data('score', average);

		if (match_by == get_current()){
			var img_src = $village_pic.attr('src');
			if (img_src == "images/village-flowers.png"){
				img_src = "images/village-flowers-lesswide.png";
			}
			filter_image($("img[src='" + img_src + "']"), average);			
			$("img[src='" + img_src + "']").data('score', average);
		}

	});

	return $widget;
}

function make_wellbeing_histograms(){

	var filter_images_dict = {
		'comp_use': 'computerusage.JPG',
		'pol_involve': 'woman_at_mic.jpg', //'womanspeaking.JPG',
		'treat_self_ill': 'doctor.JPG',
		'prob_solve': 'circle_meeting.jpg', //'circleofwomen.JPG',
		'defeacation': 'woman_toilet.jpg',
		'san_napkin': 'whisper2.jpg',
		'mobile_use': 'womancell.jpg',
		'out_emp': 'businesswoman.jpg',
		'cant_text_read': 'redphone.jpg',
		'personal_mobile': 'doyouownmobile.JPG', // 'colorful_phone.jpg',
		'vote': 'votercard.jpg',
		'soc_dem_iss': 'demonstration_hands.jpg', //'demonstration.JPG',
		'newclothes': 'brightclothes.jpg',
		'num_eat_daily': 'bananleaffood.jpeg',
		'visit_parent': 'couplehouse.jpg',
		'loan_dec': 'womanbank.jpg',
		'out_emp': 'walkinghandbag.jpg',		
	}


	//'loc_elec_cont' is blank
	var categories = {
		'social':  
		['loan_dec', 'out_emp', ], //['visit_parent',
		
		'community': 
		['respect_cbo', 'prob_solve', 'soc_dem_iss', 'vote', 'pol_involve', ],

		'technical' : 
		// 'cant_text_read' is backwards
		 ['comp_use', 'personal_mobile', 'mobile_use', 'cant_text_read'], 
		
		 'economic': 
		// 'bus_dev_train' pretty sparse
		// could not find code for 'do you have all the facilities you need for your business'
//		 ['num_eat_daily', 'veg_consume', 'veg_cost', 'fruit_consume', 'fruit_cost', 'newclothes' ],
		 ['num_eat_daily', 'newclothes' ],
		
		'other' : 
		['defeacation', 'san_napkin'] //'treat_self_ill'
	};


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
		'cant_text_read' : "Can you read and send text messages?",
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
		'cant_text_read' : "உங்களால் கைபேசி மூலம் செய்திகளை படிக்க மற்றும் அனுப்ப முடியுமா?",
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

	function get_symbols(indicator, choices){
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

	brains = brains.map(function(datum){
		if (datum.newclothes == 'Festival times'){
			datum.newclothes = 'Once in six months'
		}

		if (datum.newclothes == 'Once a month'){
			datum.newclothes = 'Once in three months'
		}


		if (!isdefined(datum.personal_mobile)){
			datum.personal_mobile = 'No';
		}
		return datum;
	});


	// the data arrives and now we get to bundle it together
	// worry about performance later
	_.pairs(categories).forEach(function (pair){
		var header = pair[0];
		var question_ids = pair[1];

		question_ids.forEach(function(question_id){

			var grouping = _.groupBy(brains, function(x){ return x[question_id]; });
			var choices = _.keys(grouping); 
			var weights = _.values(grouping).map(function(arr){
				return arr.length;
			});	

			function without_ind(arr, ind){
				var initial = arr.slice(0, ind);
				if (ind+1 < arr.length){
					var rest = arr.slice(ind+1);
					extend(initial, rest);
				}
				return initial;
			}

			// remove undefined
			if (choices.indexOf('undefined') != -1){
				var ind = choices.indexOf('undefined');
				choices = _.without(choices, 'undefined');
				weights = without_ind(weights, ind); 
			}

			if (choices.indexOf('Not Applicable') != -1){
				var ind = choices.indexOf('Not Applicable');
				choices = _.without(choices, 'Not Applicable');
				weights = without_ind(weights, ind); 
			}

			// add in the other known answers
			if (question_id in orderings){
				var full_answers = orderings[question_id];
				full_answers.forEach(function (full_answer){
					if (choices.indexOf(full_answer) == -1){
						choices.push(full_answer);
						weights.push(0);
					}
				});
			}

			// make sure yes and no do not appear alone
			if (choices.length == 1){
				if (choices[0] == 'Yes'){
					choices.push('No');
					weights.push(0);
				}
				if (choices[0] == 'No'){
					choices.push('Yes');
					weights.push(0);
				}
			}

			// sort by ordering
			var zipped = _.zip(choices, weights);
			zipped = _.sortBy(zipped, function (zip){
				if (question_id in orderings){
					return orderings[question_id].indexOf(zip[0]);
				}
				if (zipped.length == 2){
					if (zip[0] == 'Yes'){
						return -1;
					}
					if (zip[0] == 'No'){
						return 1;
					}
				}
				return 0;
			}); //, {'num_choices': zipped.length}); //, {'question_id' : question_id, 'orderings': orderings});

			var unzipped = _.zip.apply(_, zipped);
			choices = unzipped[0];
			weights = unzipped[1];


			var header_text = $('#'+ header+ '-wellbeing').data('header');
//			$('#'+ header+ '-wellbeing').find('.header').text( header_text );
			$('#'+ header+ '-wellbeing').find('.header').html(is_english() ? '<p>' + header_text + '</p>' : '<p>' + to_tamil(header_text) + '</p>');

			$('#'+ header+ '-wellbeing').find('.now-showing').css('background-color', get_color(get_index_score( header, get_current() )));
			$('#'+ header+ '-wellbeing').find('.comparing-with').css('background-color', get_color(get_index_score( header, get_comparison() )));

			symbol_histogram('#'+header+'-wellbeing', {
				question_id: question_id,
				question: is_english() ? pretty_question[question_id] : pretty_question_tamil[question_id],
				labels: choices, 
				weights: weights,
				choice: 0,
				symbols: get_symbols(question_id, choices),
				filter_image: filter_images_dict[question_id],
			});
		});
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
//	console.log('text ' + text);
	if (isdefined(translations[text.toLowerCase()])){
		return translations[text.toLowerCase()];			
	}
	return text;
}

function symbol_histogram(selector, data, variant){

	var glance_images = {'#technical-wellbeing' : 'tablet.jpg', 
					'#social-wellbeing': 'sari.jpg',
					'#community-wellbeing': 'community.jpg',
					'#economic-wellbeing': 'rupees2.jpg',
					'#other-wellbeing': 'sanitation.jpg',
					};

	if (selector in glance_images){
		variant = 'symbol-hist';
	}

	var $widget = $('<td class="hist-question"></td>');

	if (isdefined(data.question_id)){
		$widget.attr('id', data.question_id);
	}
	var colors =  isdefined(data.colors)? data.colors: get_colors(data.weights);

	var $title = $('<div>'+ data.question +'</div>');
	$widget.append($title);

	var weights = normalize_weights(data.weights);
	weights.forEach(function (weight, ind){

		if (variant == 'symbol-hist'){
			var $align = $('<tr></tr>');
			var $sym = $('<img>');
			$sym.attr('src', data.symbols[ind]);
			$sym.height(40).width(40);
			$widget.append( $align.append(  $('<td></td>').append($sym) )) ;
		}


		var $bar = is_english() ? $('<div class="histogram-bar" style="color:white; display:inline-block; overflow:hidden; font-weight: bolder; padding-left: 2px; text-shadow: black 0.1em 0.1em 0.2em; "></div>') : $('<div class="histogram-bar" style="color:black; display:inline-block; overflow:hidden; font-weight: bolder; padding-left: 2px; "></div>');
		var scale_factor = 400;
		$bar.width(weight * scale_factor);
		$bar.css('background-color', colors[ind]);

		var $overflow = is_english() ? $('<div class="overflow" style="position:absolute; left:0px; top: 0px; font-weight: bolder; color: white; padding-left: 2px; text-shadow: black 0.08em 0.08em 0.1em;"></div>') : $('<div class="overflow" style="position:absolute; left:0px; top: 0px; font-weight: bolder; color: black; padding-left: 2px; "></div>');
		$overflow.text(is_english() ? data.labels[ind] : to_tamil(data.labels[ind]));
		$overflow.width(scale_factor);

		if (variant != 'symbol-hist'){
			$bar.text(data.labels[ind]);
		}
	
		if (variant === 'symbol-bar' || variant === 'blowup-bar'){

			if (weight * scale_factor > 30){
				$bar.css('background-image', "url('" + data.symbols[ind] + "')");
				$bar.css('background-size', '30px 30px');
			} 
		}

		if (variant == 'symbol-hist'){
			var $cell = $('<td style="position:relative;"></td>');
			$cell.append($bar);
			$cell.append($overflow);
			$widget.append($align.append($cell));
		}else{
			$widget.append($bar);					
		}

		if (variant === 'hist'){
			$widget.append('<br>');			
		}
	});

	var $row = $('<tr></tr>');
	$row.append($widget);

	if (isdefined(glance_images[selector])){
		function make_glance_image(score){
			var $img = $('<img class="glance-icon"></img>');
			var img_src = isdefined(data.filter_image) ? data.filter_image : glance_images[selector];
			$img.attr('src', 'images/' + img_src);
			// 0th item may not be the good one, if everyone answers the same
			filter_image($img, score);  
			return $img;		
		}

		var $bar = $('<div style="margin-left: 10px;"></div>');
		// $bar.height(5);
		// $bar.width(weights[0]*100+'%');
		$bar.addClass('swatch');
		$bar.css('background-color', get_color(weights[0]));

		$row.append($('<td style="text-align:center;"></td>').append(make_glance_image(weights[0])).append('<br>').append($bar ) );

		// todo: get the value for the comparison
		var comparison_goodness = get_goodness(data.question_id, get_comparison());
		$bar = $('<div style="margin-left: 10px;"></div>');
		// $bar.height(5);
		// $bar.width(comparison_goodness*100+'%');
		$bar.addClass('swatch');
		$bar.css('background-color', get_color(comparison_goodness));


		$row.append($('<td style="text-align:center;" class="comparison"></td>').append(make_glance_image(comparison_goodness)).append('<br>').append($bar )  );

	}

	if (selector in glance_images){
		$(selector + ' tr').first().append($row);
	}else{
		$(selector).append($row);
	}

}

function diet_viz(){
	var diet_text = is_english() ? 'The diet of families from the village are shown. The size of food items on the plate indicate the frequencies at which people consume vegetables, meat, and fruit -- larger items are consumed more frequently. Colored rupees indicate how much money was spent on each type of food. An empty banana leaf indicates that the last person did not have enough to eat. Click to different families.' :
	'கிராமத்தில் உள்ள குடும்பங்களின் உணவு முறை பற்றி கீழே கொடுக்கப்பட்டுள்ளன. தட்டில் உள்ள உணவு பொருட்கள் மக்கள் உட்கொள்ளும் காய்கறிகள், இறைச்சி, பழங்கள் ஆகியவற்றின் அளவை குறிக்கிறது - பெரியதாக தென்படும் உணவு பொருள் மக்கள் அடிக்கடி உட்கொள்வதை குறிக்கிறது. தட்டின் கீழ் கலர்கலராக உள்ள ருபாய் நோட்டுகள் ஒவ்வொரு உணவு பொருளுக்கும் செலவிட்ட தொகையை குறிக்கிறது. காலியாக உள்ள வாழை இலை குடும்பத்தில் கடைசியாக உணவு உட்கொள்ளும் நபருக்கான போதிய உணவு இல்லை என்பதை சுட்டிகாட்டுகிறது. படவுருவை அழுத்துவதன் மூலம் வெவ்வேறு குடும்பங்களை காண இயலும்.';
	$('#diet').append($('<p></p>').text(diet_text));

	$('#diet').append(diet_plates(brains, get_current(), 'food')); 

	var comparison_brains = match_by_location(get_comparison());
	if (comparison_brains.length > 0){
		$('#diet').append(diet_plates(comparison_brains, get_comparison(), 'food'));
	}
}

function make_header(match_by, section){
	return $('<div class="section-header"></div>').text(match_by).css('background-color', get_color(get_index_score(section, match_by)));
}

function diet_plates(data, match_by, section){
	var $container = $('<div style="display:inline-block; vertical-align:top;"></div>');

	$container.append(make_header(match_by, section));

	var subset;
	if (get_comparison() == 'none'){
		$container.width('100%');		
		subset = rand_sample(data, Math.min(30, data.length));
	}else{
		$container.width('45%');
		subset = rand_sample(data, Math.min(12, data.length));
//		$container.css('border', '3px solid lightgrey');
	}

	// daily, weekly, monthly
	// does the last person who eats have enough to eat?

	var frequency = ['Daily', '2-3 times a per week', 'Weekly', 'Monthly'];
	var money = ['Less than Rs. 500', 'Rs. 500 - Rs. 1000', 'Rs. 1001 - Rs. 1500', 'Above Rs. 1500'];

	function get_scale_down(freq){
		var ind = frequency.indexOf(freq);
		return lerp(ind, 0, frequency.length, 1, .2);
	}

	function add_money_bags($widget, datum){
		function add_bag(bag_type, num_bags){
			range(num_bags).forEach(function(){
				// var $img = $('<img width="25px">').attr('src', 'images/money-' + bag_type +'.png');
				// $widget.children('.cost').append($img);		

				var img_src = bag_type == 'veg' ? 'images/rupee-symbol-white.png' : 'images/rupee-symbol.png';
				var $img = $('<img style="margin-right:1px;" width="13px">').attr('src', img_src);
				var bkg_color = '#7C15AC'; // eggplant purple
				if (bag_type == 'meat'){
					bkg_color = '#F1AB56';
				}
				if (bag_type == 'fruit'){
					bkg_color = '#F37007'; 
				}
				$img.css('background-color', bkg_color);
				$widget.children('.cost').append($img);		

			});
		}

		['veg', 'meat', 'fruit'].forEach(function(food_type){
			if (isdefined(datum[food_type+'_cost'])){
				var ind = money.indexOf(datum[food_type+'_cost']);
				add_bag(food_type, ind+1);
			}
		});

	}

	_.sortBy(subset, function(datum){
		// sort by wealthiest plates first
		return -1*sum(['veg', 'meat', 'fruit'].map(function(food_type){
			if (isdefined(datum[food_type+'_cost'])){
				var ind = money.indexOf(datum[food_type+'_cost']);
				return ind+1;
			}else{
				return 0;
			}
		}));

	}).forEach(function(datum){
		var $widget = $('#diet-widget').clone();
		$widget.css('display', 'inline-block');
		var $images = $widget.children('img');

		$container.append($widget);

		if (datum['last_pers_eat'] == 'No'){
			//$widget.children('.grain').height(60);
			$widget.children('.grain').hide();
			$widget.children('.meat').hide();
			$widget.children('.fruit').hide();
			$widget.children('.veg').hide();
		}

		if (datum['meat'] == 'No'){
			$widget.children('.meat').hide();
		}

		['veg', 'meat', 'fruit'].forEach(function(food_type){
			var scale = get_scale_down(datum[food_type+'_consume']);
			var $entry = $widget.children('.' + food_type);

			var fruit_adj = food_type == 'fruit' ? .8 : 1;
			$entry.width(60*scale * fruit_adj);

			if (food_type == 'meat'){
				$entry.css('left', 130/2 - $entry.width()/2);
			}
			if (food_type == 'fruit'){
				$entry.css('top', 130/2 - $entry.height()/2);
			}
			if (food_type == 'veg'){
				$entry.css('top', 130/3 - $entry.height()/2);
			}
		});

		// add the money bags
		add_money_bags($widget, datum);


	});

	$container.click(function(){
		$container.empty();
		$container.replaceWith(diet_plates(data, match_by, section));		
	});
	
	return $container;

}

function make_stem_leaf_plot(data, grouping_type, match_by, section){
	var $widget = $('#stemleaf-plot').clone();
	$widget.css('display', 'inline-block');
	$widget.removeAttr('id');

	$widget.append(make_header(match_by, section));

	var num_flowers;

	if (get_comparison() == 'none'){
		$widget.width('100%');		
		num_flowers = 70;
	}else{
		$widget.width('45%');
		num_flowers = 30;
	}


	var display_width = 800;
	var flowers_per_row = 25;
	var width = display_width/flowers_per_row;

	// var flower_height = 170; // to be changed
	// var num_rows = Math.min(4, Math.floor(data.length/flowers_per_row)+1); // to be determined

//	$widget.width(display_width);
	// $widget.height(flower_height * num_rows);

	var ages = ['Below 15', '15 to 17 years', '17 to 19 years', '19 to 21 years', '21 and above']; //5 different heights
	//todo: could turn this into stem and leaf diagram 

	function add_flower(selector, datum){
		var $container = $('<div style="position:relative;display:inline-block;"></div>');
		$container.width(width);

		var $stem = $('<img src="images/stem4.png" style="position:absolute;">');
		var $flower = $('<img src="images/flower.png" style="position:absolute;">');

		if (datum.dec_marriage == 'No'){
			$flower.attr('src', 'images/unbloomed.png');
		}
		$flower.width(width);

		var ind = ages.indexOf(datum.age_marriage);
		$stem.height(eerp(ind, 0, ages.length-1, 25, 75, 5));

		// scale the stem based on age
		// color the flower based on consent
		$flower.css('background-color', datum.rel_spouse == 'Yes' ?  'rgb(240,108,43)': 'rgb(240,237,43)');

		$stem.css({bottom: 0, left: width/2+2});
		$flower.css({bottom: $stem.height()+$flower.height(), left: 0});

		$container.append($stem);
		$container.append($flower);
		$container.height($stem.height()+$flower.height() + 50);

		add_leaves(datum.num_children);
		function add_leaves(num_leaves){
			range(num_leaves).forEach(function(ind){

				$leaf = $('<img src="images/leaf.png" style="position:absolute;">');
				$leaf.width(width/2.5);

				var rely = Math.floor(ind/2) * 5;
				var relx = ind % 2 == 1 ? 7 : 20;

				$leaf.css({bottom: rely + $stem.height()/3, 
						left: relx});

				ind % 2 == 1 ? rotate_image($leaf, 210) : rotate_image($leaf, 300);

				$container.append($leaf);
			});
		}

		$(selector).append($container);
	}

	// filter out undefineds
	data = _.without(data.map(function(x){
		if (isdefined(x.age_marriage)){
			return x;
		}
		return null;
	}), null);


	var subset = rand_sample(data, Math.min(num_flowers, data.length));

	subset.sort(function(a, b){

		if (ages.indexOf(a.age_marriage) < ages.indexOf(b.age_marriage)){
			return 1;
		}else if (ages.indexOf(a.age_marriage) > ages.indexOf(b.age_marriage)){
			return -1;
		}else{

			if (a.rel_spouse == 'Yes' && b.rel_spouse == 'No'){
				return 1;
			}

			if (b.rel_spouse == 'Yes' && a.rel_spouse == 'No'){
				return -1;
			}

			if (a.dec_marriage == 'Yes' && b.dec_marriage == 'No'){
				return 1;
			}

			if (b.dec_marriage == 'Yes' && a.dec_marriage == 'No'){
				return -1;
			}

			if (a.num_children < b.num_children){
				return 1;
			} else{
				return -1;
			}

			return 0;

		}

	});


	// group the subset
	var grouping_type = isdefined(grouping_type) ? grouping_type : 'age_marriage';
	var grouping = _.groupBy(subset, function(x){ return x[grouping_type]; });

//	grouping = _.groupBy(subset, function(x){ return x.dec_marriage; });
	//grouping = _.groupBy(subset, function(x){ return x.rel_spouse; });

	var most_in_bin = max(_.values(grouping).map(function(x){
		return x.length;
	}));
	var width = Math.min(display_width/most_in_bin, 30);

	var pairs = _.pairs(grouping).forEach(function(pair){
		var bin = pair[0];
		var entities = pair[1];

		var $bin = $('<div></div>');
		entities.forEach(function(x){
			add_flower($bin, x);
		});

		$widget.append($bin);
	});

	// ages.forEach(function(age, ind){
	// 	var $bin = $('<div></div>');

	// 	if (isdefined(grouping[age])){
	// 		var entities = grouping[age];
	// 		entities.forEach(function(x){
	// 			add_flower($bin, x);
	// 		});
	// 	}else{
	// 		var bin_height = eerp(ind, 0, ages.length-1, 25, 75, 5) + width + 50;
	// 		$bin.height(bin_height);
	// 	}
	// 	$widget.append($bin);
	// });

	$widget.click(function(){
		$(this).empty();
		$(this).replaceWith(make_stem_leaf_plot(data, grouping_type, match_by, section));		
	});


	return $widget;
}

// load images onto canvas
function make_face_diagram(brains, field){

	var orderings_dict = {
		'visit_parent': {'Self' : 'woman', 
								'Husband': 'man', 
								'Family members': 'family'},				
		'dec_children': {'Self': 'woman', 
									 'Husband': 'man', 
									 'Family members': 'family'},
		'clothesdecisionmaker': {'NONE': 'woman',
					 			'1) Husband': 'man', 
								'#2) parents': 'family', 
								'#3) son / daughter': 'family', 
								'#4) family member': 'family' },
		'dec_children_edu_mar': {'My opinion is accepted': 'woman',
										 'My opinion is accepted sometimes': 'man', 
										 'My opinion is not accepted': 'man', 
										 'My opinion is totally rejected': 'man'} ,
	};


	var results = _.pluck(brains, field);
	var counts = _.countBy(results, function (answer){
		return orderings_dict[field][answer];
	});

	['woman', 'man', 'family'].forEach(function (x){
		if (! _.has(counts, x)){
			counts[x] = 0;
		}
	});
	// warning: assumes that all undefineds are due to skip patterns!
	counts['undefined'] = 0; 

	var num_responses = sum(_.values(counts));

	// scale the size of the woman's face up and down
	var $widget = $('#face-forces').clone();
	$widget.css('display', 'inline-block');

//	var color_scale = d3.scale.linear().range(['grey', 'rgb(205,165,47)']);
//	var color_scale = d3.scale.linear().range(['grey', '#64d613']);

	var goodness = counts['woman']/num_responses;

	$widget.css('background-color', get_color(goodness));

	var $imgs = $widget.children('img').each(function(ind){

		$(this).css('vertical-align', 'bottom');

		// get the data attribute 
		var repr = $(this).attr('class');
		// make the size what it should be
		var face_width = counts[repr] / num_responses * 80;
		$(this).width( face_width );			


	// draw the bar to show the dimension and lessen the tufte problem
		var $lines = $widget.last();
		var $bar = $('<div style="background-color:black; display:inline-block; margin-right: 2px; margin-left: 2px;"></div>');
		$bar.width(face_width);
		$bar.height(5);
		$lines.append($bar);
	}); 


	$widget.css('padding', 4);

	return $widget;
}


function make_equality_table(){
//	var brains = match_by_location(get_current());
	var comparison_brains = match_by_location(get_comparison());

	var long_form = {'dec_children_edu_mar' : "your child's education and marriage",
					'clothesdecisionmaker': "your clothing", 
					'dec_children': "the number of children",
					'visit_parent': "when to visit your parents house"};
	var images = {	'dec_children_edu_mar' : 'educationmarriage.png',
					'clothesdecisionmaker': 'saree-big.png',
					'dec_children' : 'baby.jpg',
					'visit_parent' : 'bus.png', //'parentshouse.png',
	};

	var decisions = _.keys(long_form);

	var $widget = $('#equality-table');
	var $header = $('<tr></tr>');
	$header.append($('<td></td>'));

	if (comparison_brains.length > 0){
		$header.append( $('<td></td>').append($('<td></td>').append(make_header(get_current(), 'equality'))).append($('<td></td>').append(make_header(get_comparison(), 'equality') )));		
	}else{
		$header.append($('<td></td>').append(make_header(get_current(), 'equality') ));		
	}

	$widget.append($header);

	decisions.forEach(function(decision, ind){
		var $question = $('<h5></h5>');

		if (is_english()){
			if (decision == 'dec_children_edu_mar'){
				$question.text("Is your opinion accepted related to your child's education and marriage?");
			}else{
				$question.text('Who makes the decisions regarding ' + long_form[decision] + '?');			
			}			
		}else{
			if (decision == 'dec_children_edu_mar'){
				$question.text('உங்கள் குழந்தைகளின் கல்வி மற்றும் திருமணம் போன்ற முக்கியமான நிகழ்வுகளில் உங்களின் கருத்து ஏற்கப்படுகிறதா?');
			}
			if (decision == 'clothesdecisionmaker'){
				$question.text('உங்கள் ஆடை சார்ந்த முடிவுகளை எடுப்பது யார்?');
			}
			if (decision == 'dec_children'){
				$question.text('உங்கள குடும்பத்தில் குழந்தைகளின் எண்ணிக்கையை நிர்ணயிப்பது யார்?');
			}
			if (decision == 'visit_parent'){
				$question.text('நீங்கள் பெற்றோர் வீட்டிற்கு செல்ல வேண்டுமெனில் முடிவெடுப்பது யார்?');
			}
		}

		var $row = $('<tr></tr>');

		var $img = $('<img></img>').attr('src', 'images/' + images[decision]).height(100).css('max-width', 160);			
		$row.append($('<td style="padding-right: 40px; text-align: center;"></td>').append($img));

		$question.append('<br>');

		var $faces = $('<div></div>');
		$faces.append($('<div style="display:inline-block; width:50%"></div>').append(make_face_diagram( brains, decision )) );

		if (comparison_brains.length > 0) {
			$faces.append($('<div style="display:inline-block; width:50%"></div>').append(make_face_diagram( comparison_brains, decision )) ) ;
		}
		$row.append($('<td style="width:400px;"></td>').append($question).append($faces));

		$widget.append($row);
	});
}

function make_assets_viz(data, match_by, section){
	var $container = $('#assets-container').clone();
	$container.removeAttr('id');
	$container.css('display', 'inline-block');

	$container.append(make_header(match_by, section));

	var subset;

	if (get_comparison() == 'none'){
		$container.width('100%');		
		subset = rand_sample(data, Math.min(30, data.length)); //27
	}else{
		$container.width('50%');
		subset = rand_sample(data, Math.min(15, data.length)); //9
	}

	var entities = ['land', 'house', 'livestock', 'poultry', 'tv', 'vehicles', 'elec_app', 'houseextension'];




	function get_count(arr, value){
		return sum(arr.map(function(x){
			return x === value ? 1 : 0;
		}));
	}

	function type_of_change(datum){
		var now = get_count(entities.map(function(entity){
			return datum[entity];
		}), 'Yes');
		var then = get_count(entities.map(function(entity){
			return datum[entity+'5'];
		}), 'Yes');

		var diff = now-then;

		// put in a correction for houseextension
		if (datum['houseextension'] == 'No' && datum['houseextension5'] == 'Yes'){
			return diff+1; // don't count dissapearing houseextension as a loss
		}

		return diff;

	}

	// insert each 
	_.sortBy(subset, function(datum){
		// +1 point for everything they own now
		var now = get_count(entities.map(function(entity){
			return datum[entity];
		}), 'Yes');

		// +.1 point for everything they gained?

		// -.1 point for everything they lost?
		return -1*now;

	}).forEach(function(datum){
		var $widget = $('.asset-widget').first().clone();
		$widget.css('display', 'inline-block');
		$widget.css('background-color', '#C78D3B');

		entities.forEach(function(entity){
			if (datum[entity] == 'No'){

				// if they used to have it, give it a red bkg
				if (datum[entity+'5'] == 'Yes' && entity != 'houseextension'){
					$widget.find('.' + entity).parent().css('background-color', 'red'); //get_color(0));
					filter_image($widget.find('.' + entity), 0);
//					darken_image($widget.find('.' + entity), 0.5);

				}else{
					$widget.find('.' + entity).css('visibility', 'hidden'); 
				}
			}

			// if they gained it in the last 5 years, give it a green bkg
			if (datum[entity] == 'Yes' && datum[entity+'5'] == 'No'){
					$widget.find('.' + entity).parent().css('background-color', get_color(1));				
			}

		});

		$container.append($widget);

		var amount = 0;
		if (type_of_change(datum) > 0){
			amount = type_of_change(datum);
			$widget.css('border', get_color(1) +' solid ' + amount + 'px');			
		}
		if (type_of_change(datum) < 0){
			amount = Math.abs(type_of_change(datum));
			$widget.css('border', 'red solid ' + amount + 'px');			
		}

		$widget.css('margin', 8-amount);


		var out_string = "";
		entities.forEach(function(entity){
			out_string += ' ' + entity + " " + datum[entity] + ' ' + datum[entity+'5'];
		});
		console.log(out_string);
		console.log('changemaount ' + type_of_change(datum));

	});


	$container.click(function(){
		$container.empty(); 
		$container.replaceWith(make_assets_viz(data, match_by, section));		
	});


	return $container;
}



function add_symbol_pics(){

	$('.symbol-pic').remove();

	var mapping = {'Face forces': 'house.png',
		'Social': 'scooter.png',
		'Community': 'well.png',
		'Technical': 'technology2.png',
		'Health and Sanitation': 'toilet.png',
		'Economic': 'economy.png',
		'Diet': 'bananatree.png',
		'Asset change': 'assetbox.png',
		'Flowers and marriage': 'village-flowers-lesswide.png'
	};

	for (var label in mapping){
		var display_label = is_english() ? label : to_tamil(label);
		var $container = $("h3:contains('" + display_label + "')");

		if ($container.length == 0){
			$container = $(".table-header:visible:contains('" + display_label + "')")
		}

		var $widget = $('<span class="symbol-pic" style="text-align:center; display:inline-block; margin-right: 10px;"></span>');
		var $img = $('<img style="max-height:60px; max-width:60px;" />');
		$img.attr('src', 'images/' + mapping[label]);

		$widget.append($img);
		$container.prepend($widget);
	}


}

function viz(){
	var comparison_brains = match_by_location(get_comparison());

	$("#equality-table").empty();
	make_equality_table(brains, brains);

	$('.flowers').empty();
	$('#stemleaf-plots').empty();
	$('#stemleaf-plots').append(make_stem_leaf_plot(brains, 'age_marriage', get_current(), 'marriage')); 
	if (comparison_brains.length > 0){
		$('#stemleaf-plots').append(make_stem_leaf_plot(comparison_brains, 'age_marriage', get_comparison(), 'marriage')); 
	}
	 

	$('#diet').empty();
	diet_viz();

	$('.wellbeing-table').empty();
	var $container = $('<tr class="container"></tr>');
	$container.append($('<tr> <td class="table-header header" ></td>  <td class="table-header now-showing hist-question"></td> <td class="table-header comparing-with hist-question comparison"></td> </tr>'));

	$('.wellbeing-table').append($container);
	make_wellbeing_histograms();


	$("#big-assets-container").empty();
	$('#big-assets-container').append(is_english() ? '<h3>Asset change</h3>' : '<h3>சொத்துக்களில் மாற்றம்</h3>');

	var assets_text = is_english() ? 'The change in assets of families in the village are shown. Green items have been gained in the last five years. Red items have been lost. Unshaded items were in possession both five years ago and now. Click to see different families.' : 
	'குடும்ப சொத்துக்களில் ஏற்பட்ட மாற்றத்தை பற்றி காட்டப்பட்டுள்ளது. பச்சை நிறத்தில் இருப்பது கடந்த ஐந்து ஆண்டுகளில் பெறப்பட்டதையும், சிவப்பு நிறத்தில் இருப்பது இழந்ததையும் குறிக்கிறது. அவர்களை சுற்றி கலர் இல்லாமல் இருப்பது ஐந்து ஆண்டுகளுக்கு முன்பு இருந்த அதே நிலைமையில் இருக்கிறார்கள் என்பதை பிரதிபலிக்கிறது.';
	$('#big-assets-container').append($('<p></p>').text(assets_text));
	$('#big-assets-container').append( make_assets_viz(brains, get_current(), 'asset-slide')); 


	if (comparison_brains.length > 0){
		$('#big-assets-container').append( make_assets_viz(comparison_brains, get_comparison(), 'asset-slide')); 
	}

	$('.old').hide();


//	$('#color-joints').empty();
//	make_color_joints(brains);

	add_symbol_pics();
	village_viz();

}


// function make_assets_viz(data){

// 	var $container = $('#assets-container').clone();
// 	$container.removeAttr('id');
// 	$container.css('display', 'inline-block');

// 	var data;

// 	if (get_comparison() == 'none'){
// 		$container.width('100%');		
// 		data = rand_sample(data, Math.min(28, data.length));
// 	}else{
// 		$container.width('45%');
// 		data = rand_sample(data, Math.min(12, data.length));
// 	}

// 	var entities = ['land', 'house', 'livestock', 'poultry', 'tv', 'vehicles', 'elec_app', 'houseextension'];

// 	function get_count(arr, value){
// 		return sum(arr.map(function(x){
// 			return x === value ? 1 : 0;
// 		}));
// 	}

// 	function type_of_change(datum){
// 		var now = get_count(entities.map(function(entity){
// 			return datum[entity];
// 		}), 'Yes');
// 		var then = get_count(entities.map(function(entity){
// 			return datum[entity+'5'];
// 		}), 'Yes');
// 		return now-then;
// 	}


// 	var $newcont = $container.children().eq(1);
// 	var $oldcont = $container.children().eq(2);

// 	// insert each 
// 	data.forEach(function(datum){
// 		var $widget = $('.asset-widget').first().clone();
// 		$widget.css('display', 'inline-block');
// //		$widget.css('background-image', 'url(images/wood.jpg)');
// 		$widget.css('background-color', '#C78D3B');

// 		entities.forEach(function(entity){
// 			if (datum[entity] == 'No'){
// 				$widget.find('.' + entity).css('visibility', 'hidden'); 
// 			}
// 		});

// 		$newcont.append($widget);

// 		var $widget5 = $('.asset-widget').first().clone();
// 		$widget5.css('display', 'inline-block');
// //		$widget5.css('background-image', 'url(images/grey-wood.jpg)');
// //		$widget5.css('background-image', 'url(images/wood.jpg)');
// 		$widget5.css('background-color', '#c99c5c');

// 		entities.forEach(function(entity){
// 			if (datum[entity+'5'] == 'No'){
// 				$widget5.find('.' + entity).css('visibility', 'hidden'); 
// 			}
// 		});

// 		$oldcont.append($widget5);
// 		var amount = 0;
// 		if (type_of_change(datum) > 0){
// 			amount = type_of_change(datum);
// 			$widget.css('border', 'green solid ' + amount + 'px');			
// 			$widget5.css('border', 'green solid ' + amount + 'px');			
// 		}
// 		if (type_of_change(datum) < 0){
// 			amount = Math.abs(type_of_change(datum));
// 			$widget.css('border', 'red solid ' + amount + 'px');			
// 			$widget5.css('border', 'red solid ' + amount + 'px');			
// 		}

// 		$widget.css('margin-left', 8-amount);
// 		$widget.css('margin-right', 8-amount);
// 		$widget5.css('margin-left', 8-amount);
// 		$widget5.css('margin-right', 8-amount);

// 	});


// 	// $newcont.click(function(){
// 	// 	$container.empty();
// 	// 	$container.replaceWith(make_assets_viz(data));		
// 	// });

// 	// $oldcont.click(function(){
// 	// 	$container.empty();
// 	// 	$container.replaceWith(make_assets_viz(data));	
// 	// });


// 	return $container;
// }
