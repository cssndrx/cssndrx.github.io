function discrete_equal_to(ans_arr, arr){
	var epsilon = .0001;
	return ans_arr.every(function (x, ind) { return Math.abs(x-arr[ind]) < epsilon; });	
}

function discrete_proportional_to(ans_arr, arr){
	var norm_ans = normalize_discrete(ans_arr);
	var norm_arr = normalize_discrete(arr);

	return discrete_equal_to(norm_ans, norm_arr);
}

function discrete_posterior(prior, likelihood){
	return prior.map(function (x, ind){ return x*likelihood[ind]; });
}

function normalize_discrete(belief){
	return belief.map(function(x){ return x / sum(belief);});
}

// missile vs missile not
function make_samples(num_samples, process, argslist){
	var samples = [];

	for (var i=0; i<argslist.length; i++){
		var args = argslist[i];
		samples.push( range(num_samples).map(function (x){
			return process.apply(null, args);
		}) );
	}
	return samples;		
}


function normalize_belief(belief, x0, x1){
	var delta = (x1 - x0) / belief.length;

	// the area needs to sum to 1
	var curr_area = sum(belief)*delta;
	return belief.map(function (x){ return x/curr_area});
}

function ev(belief, x0, x1){
	var delta = (x1 - x0) / belief.length;

	belief = normalize_belief(belief, x0, x1); // todo: do we want to do this here?
	return sum(belief.map(function (p, ind){ return p * (x0 + ind*delta) * delta; }) );
}


// function make_pdf(func, params){
// 	var samples = range(0, 1, .01);
// 	return samples.map(function (elt){ return func.apply(null, [elt, params])});
// }


// formatter

////////////////////// sampling functions

function bernoulli(p){
	return Math.random() < p ? 1 : 0;
}

function geometric(p){
	count = 1;
	while (Math.random() > p){
		count++;
	}
	return count;
}

function poisson(lambda){
	var dist = new PoissonRandomPrimitive();
	return dist.sample_impl([lambda]);
}

function uniform(a, b){
	var dist = new UniformRandomPrimitive();
	return dist.sample_impl(arguments);
}

function normal(mean, std){
	var dist = new GaussianRandomPrimitive();
	return dist.sample_impl(arguments);
}

function binomial(n, p){
	var count = 0;
	for (var i=0; i<n; i++){
		if (Math.random() < p){
			count++;
		}
	}
	return count;
}

////////////////////// dist functions
function geometric_pdf(x, p){
	// return p * Math.pow(1-p, x);
	return p * Math.pow(1-p, x-1);
}

function geometric_cdf(x, p){
	return 1-Math.pow(1-p, x);
}

function geometric_inv(y, p){
	return Math.log(1-y) / Math.log(1-p);
}

// todo: turn the wrappy thing into a plot
function wrappy_thing(p){
	var result = '';

	var points_of_interest = [.01, .05, .1, .25, .5];

	var exp_x = geometric_cdf(1/p, p);
	points_of_interest.push(Math.min(exp_x, 1-exp_x));

	points_of_interest.sort();

	// display
	result += 'p = ' + p + ' EV = ' + format_number(1/p, 1) + '<br> <table class="widget">';
	points_of_interest.forEach(function (elt, ind){
		var low = geometric_inv(elt, p);
		var high = geometric_inv(1-elt, p);

		low = d3.format('.0f')(low);
		high = d3.format('.0f')(high);

		low = low < 1 ? ' - ' : low;
		high = high < 1 ? ' - ' : high;

		var elt_disp = d3.format('.0f')(elt*100);

		result += '<tr><td>' + elt_disp + '%:</td><td>' + low + '</td><td>' + high + '</td></tr>';
	});

	result+='</table>';
	return result;
}


function cumsum(arr){
	if (arr.length < 1){
		return [];
	}

	var total = [arr[0]];
	for (var i=1; i<arr.length; i++){
		total.push(last(total) + arr[i]);
	}
	return total;
}

function cumavg(arr){
	var cumsums = cumsum(arr);
	for (var i=0; i<cumsums.length; i++){
		cumsums[i] /= (i+1);
	}
	return cumsums;
}

function mean(arr){
	if (arr.length === 0){
		return null;
	}
	return sum(arr)/arr.length;
}

function variance(arr){
	if (arr.length === 0){
		return null;
	}

	var mn = mean(arr);

	var total = 0;
	for (var i=0; i<arr.length; i++){
		total += (arr[i]-mn)*(arr[i]-mn);
	}
	return total / arr.length;
}

function std(arr){
	if (arr.length === 0){
		return null;
	}
	return Math.sqrt(variance(arr));
}

function aggregate_statistics(arr){
	return 'n: ' + arr.length + '<br>mean: ' + format_number(mean(arr), 2) + '<br>var: ' + format_number(variance(arr), 2) + '<br>std: ' + format_number(std(arr), 2);
}


