function isdefined(x){
  return x !== undefined;
}

function forcefit(x, a, b){
  return Math.min(Math.max(x, a), b);
}

function car(arr){
  return arr[0];
}

function cdr(arr){
  return arr.slice(1, arr.length);
}

function sum(arr){
  var total = 0;
  for (var i=0; i<arr.length; i++){
    total += arr[i];
  }
  return total;
}

function avg(arr){
  return arr.length === 0 ? null : sum(arr)/arr.length;
}

function zeroes(n){
  var arr = [];
  for (var i=0; i<n; i++){
    arr.push(0);
  }  
  return arr;
}

function list_add(a, b){
  var new_list = [];
  for (var i=0; i<a.length; i++){
    new_list.push(a[i]);
  }  
  for (var i=0; i<b.length; i++){
    new_list.push(b[i]);
  }
  return new_list;
}

function choose(arr){
  var ind = Math.floor(Math.random()*arr.length);
  return arr[ind];
}

function range(a, b, inc){
  var arr = [];
  var start, end, step;

  if (arguments.length === 1){
    start = 0;
    end = a;
    step = 1;
  }
  else if (arguments.length === 2){
    start = a;
    end = b;
    step = 1;
  }
  else{
    start = a;
    end = b;
    step = inc;
  }

  for (var i=start; i<end; i+=step){
    arr.push(i);
  }
  return arr;    
}

function max(arr){
  return _.max(arr);
}

function min(arr){
  return _.min(arr);
}

function rand_int(a, b){
	a = Math.floor(a);
	b = Math.floor(b);
	return Math.floor(Math.random()*(b-a)) + a;
}

function last(arr){
  return arr[arr.length-1];
}

function repeat(num_times, thing){
  if (_.isFunction(thing)){
    return range(num_times).map(function(){ return thing.apply();});    
  }
  return range(num_times).map(function(){ return thing;});
}

function format_number(val, num_decimal){
  if (!_.isNumber(val)){
    return val;
  }
  var formatter = Math.pow(10, num_decimal);
  return Math.round(val*formatter)/formatter;
}

function lerp(from_x, from_lo, from_hi, to_lo, to_hi){
  var scale = (to_lo-to_hi)/(from_lo-from_hi);
  return to_lo + (from_x-from_lo)*scale;
}