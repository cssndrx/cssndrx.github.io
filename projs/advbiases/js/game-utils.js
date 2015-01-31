/////////// demo utils
function color_bars(selector, inds){
	var bars = $(selector).find('.nv-bars').find('rect');
	restore_bars(selector); // default blue color

	// for selected indices change this orange
	//var to_color = area_indices[ind];
	inds.forEach(function (x){
		$(bars[x]).css('fill', 'orange');    							
	})
}

function restore_bars(selector){
	var bars = $(selector).find('.nv-bars').find('rect');
	bars.css('fill', '#1f77b4'); // default blue color		
}

/////////// game state utils

function set_message(selector, message){
	if ($(selector + ' .message').length == 0){
		$(selector).prepend('<div class="message"></div>');
	}
	$(selector + ' .message').html(message);
}


function set_guru_message(valence, message){
	var message = isdefined(message) ? message : guru_message(valence);

	$('#guru-message').html(message);
	$('#guru-message').css('background-color', valence === 'pos' ? 'rgba(0,255,0,.3)' : 'rgba(255,0,0,.3)');
	// todo: change the image of the guru depending on his happiness
}

function guru_message(valence){

	var responses;
	if (valence === 'neg'){
		responses = ['Try again, young grasshopper....',
		'Scratch your head and have another go.',
		'No, my dear. Think and try again.'];
	}
	if (valence === 'pos'){
		responses = ['Well done, pet cricket!',
		'I agree. Intuitive, right?',
		"Woo! You're getting the hang of things, I think."];
	}

	var ind = Math.floor(Math.random()*responses.length);
	return responses[ind];
}