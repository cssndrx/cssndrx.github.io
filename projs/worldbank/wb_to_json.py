import csv
import collections


def get_headers(row, headers):
	headers = dict([ (x, 0) for x in headers ])

	for header in headers:
		headers[header] = row.index(header)
	return headers

class AgeException(Exception):
	pass
     # def __init__(self):
     #     pass
     # def __str__(self):
     #     pass

def cory_pull(header_names):
	def to_json(headers, row):
		def is_valid(row):
			return row[ind]
		def to_tuple(header, row, ind):

			if header == 'panch_name':
				return (header, 'P1 ' + row[ind])

			if header == 'age' and int(row[ind]) < 18:
				raise AgeException()
			return (header, row[ind])

		return dict([ to_tuple(header, row, ind) for header, ind in headers.items() if is_valid(row) ])

	filter_names = ['panch_name',	'hab_name', 'clust_name',	'blockname', 'age']
	header_names.extend(filter_names)

	header_ind = header_names.index('panch_name')

	## super header
	with open('data.csv', 'rb') as csvfile:
		print 'here'

		headers = {}
		output = []

		spamreader = csv.reader(csvfile) 
		for i, row in enumerate(spamreader):
			if i == 0:
				headers = get_headers(row, header_names)
				continue
			try:
				row_dict = to_json(headers, row)
			except AgeException:
				continue
			if row_dict:
				output.append(row_dict)

		with open('data/brains.js', 'w+') as f:
			f.write('full_brains = ' + str(output) + ';')

	return output


def pull_data(data_name, header_names):
	def to_json(headers, row):
		def is_valid(row):
			return row[ind]

		def clean(x):
			if x == 'Not Applicable':
				return 'N/A'
			if x == 'Family members':
				return 'Family'
			return x

		return dict([ (header, clean(row[ind])) for header, ind in headers.items() if is_valid(row) ])

	## super header
	with open('data.csv', 'rb') as csvfile:
		headers = {}
		output = []

		spamreader = csv.reader(csvfile) 
		for i, row in enumerate(spamreader):
			if i == 0:
				headers = get_headers(row, header_names)
				continue

			row_dict = to_json(headers, row)
			if row_dict:
				output.append(row_dict)

		if data_name:
			with open('data/'+data_name+'.js', 'w') as f:
				f.write(data_name + ' = ' + str(output) + ';')

	return output


def get_bins(data):
	## todo: think about how to handle missing data better

	output = {}
	for key in data[0].keys():
		to_count = [x.get(key) for x in data]
		counter = collections.Counter(to_count)
		
		freqs =  [(k,v) for k,v in counter.items() if k]
		output[key] = freqs

	return output


# def make_wellbeing_data():
# 	#'loc_elec_cont' is blank
# 	groupings = {
# 		'social':  
# 		['visit_parent', 'loan_dec', 'out_emp', 'respect_cbo', 'prob_solve', 'soc_dem_iss', 'vote', 'pol_involve', ], 
		
# 		'technical' : 
# 		# 'cant_text_read' is backwards
# 		 ['comp_use', 'hh_mobile', 'mobile_use', 'cant_text_read'], 
		
# 		 'economic': 
# 		# 'bus_dev_train' pretty sparse
# 		# could not find code for 'do you have all the facilities you need for your business'
# 		 ['num_eat_daily', 'veg_consume', 'veg_cost', 'fruit_consume', 'fruit_cost', 'newclothes' ],
		
# 		'other' : 
# 		['defeacation', 'treat_self_ill', 'san_napkin']
# 	}

# 	pretty_question = {'visit_parent': "Who decides visits to your parents' home?",
# 		'loan_dec': "Who makes decisions on loans and assets in your family?",
# 		'out_emp': "Does your family allow you to pursue employment outside the house?",
# 		'respect_cbo' : "Have you gained respect after joining a SHG/CBO?",
# 		'prob_solve' : "Have you been involved in solving problems within your SHG/CBO?", 
# 		'soc_dem_iss' : "Have you been in any demonstration on social issues?", 
# 		'vote' : "Do you vote?", 
# 		'pol_involve': "Are you interested in getting involved in politics?",
# 		'comp_use' : "Have you used a computer?", 
# 		'hh_mobile' : "Do you have a phone?", 
# 		'mobile_use' : "Can you use a mobile phone on your own?", 
# 		'cant_text_read' : "Can you read and send text messages?",
# 		'num_eat_daily': "How many times a day do you eat?", 
# 		'veg_consume' : "How often do you consume vegetables?", 
# 		'veg_cost' : "How much do you spend on the purchase of vegetables in a month?", 
# 		'fruit_consume' : "How often do you consume fruits?", 
# 		'fruit_cost' : "How much do you spend on the purchase of fruits in a month?", 
# 		'newclothes' : "How many times a year do you purchase new clothes for yourself?",
# 		'defeacation' : "Where do you go to defecate?", 
# 		'treat_self_ill': "If you are ill, what is the first method of treatment that you take?", 
# 		'san_napkin' : "Have you used sanitary napkins during your menstrual period?",		
# 	}

# 	orderings = {
# 		'treat_self_ill' : ['Private hospital', 'Government hospital', 'Medical shop', 'Own treatment', ],
# 		'num_eat_daily' : ['Thrice a day', 'Twice a day', 'Once a day', ],
# 		'veg_cost' : ['Above Rs. 1500', 'Rs. 1001 - Rs. 1500', 'Rs. 500 - Rs. 1000', 'Less than Rs. 500',], 
# 		'fruit_cost' : ['Above Rs. 1500', 'Rs. 1001 - Rs. 1500', 'Rs. 500 - Rs. 1000', 'Less than Rs. 500',], 
# 		'veg_consume' : ['Daily', '2-3 times a per week', 'Weekly', '2-3 times per month', 'Monthly', ],
# 		'fruit_consume' : ['Daily', '2-3 times a per week', 'Weekly', '2-3 times per month', 'Monthly', ],
# 		'san_napkin': ['Yes', 'No', "Don't know what a napkin is", ],
# 		'newclothes': ['Once a month', 'Once in three months', 'Once in six months', 'Festival times', 'Once a year', ],
# 	}

# 	wellbeing_headers = sum(groupings.values(), [])
# 	data = pull_data('wellbeing_data', wellbeing_headers)
# 	bins = get_bins(data)

# 	def find_group(indicator):
# 		for k, v in groupings.items():
# 			if indicator in v:
# 				return k

# 	def get_symbols(indicator, choices):
# 		if choices[0] == 'Yes':
# 			return ['images/yes.png', 'images/no.png']

# 		symbols = []
# 		for choice in choices:
# 			if choice == 'Both':
# 				symbols.append('images/both.png')
# 			elif choice == 'Self':
# 				symbols.append('images/woman.png')
# 			elif choice == 'Husband':
# 				symbols.append('images/man.png')
# 			elif choice == 'Family members':
# 				symbols.append('images/family.png')
# 			else:
# 				symbols.append('')

# 		return symbols

# 	goodnesses = dict([ ('#'+x+'-wellbeing', []) for x in groupings.keys()])

# 	with open('data/histograms_to_run.js', 'w') as f:
# 		for indicator, aggregate in get_bins(data).items():
# 			if indicator in orderings:
# 				aggregate.sort(key = lambda x: orderings[indicator].index(x[0]))

# 			group = find_group(indicator)
# 			weights = [x[1] for x in aggregate]
# 			choices = [x[0] for x in aggregate]
# 			output_str = '''	symbol_histogram('#%(group)s-wellbeing', {
# 		question: "%(question)s",
# 		labels: %(choices)s,
# 		weights: %(weights)s,
# 		choice: 0,
# 		symbols: %(symbols)s,
# 	});
# ''' % {	'question' : pretty_question[indicator], 
# 		'choices' : choices, 
# 		'weights': weights,
# 		'group': group,
# 		'symbols': get_symbols(indicator, choices)}

# 			f.write(output_str)

# 			goodness = float(aggregate[0][1]) / sum(weights)
# 			goodnesses['#'+group+'-wellbeing'].append( goodness )

# 	## write the aggregated values
# 	for key in goodnesses:
# 		goodnesses[key] = sum(goodnesses[key])/float(len(goodnesses[key]))

# 	with open('data/globals.js', 'w+') as f:
# 		f.write('goodnesses = ' + str(goodnesses) + ';')


def face_forces_data():
	## warning: pretty sparse
	data = pull_data(None, ['clothesdecisionmaker', 'dec_children_edu_mar', 'dec_children'])
	bins = get_bins(data)

	def process(values):
		values =  [x for x in values if x[0] not in ['NONE', 'Not Applicable']]
		return [ ( remove_stray(x[0]) , x[1]) for x in values]


	for indicator, values in bins.iteritems():
		bins[indicator] =  process(bins[indicator])
	

def remove_stray(x):
	return x.translate(None,'()#12345678').strip()

def raychart_data():
	def clean_row(row):
		row[0] = remove_stray(row[0])
		return row

	header_names = ['education', 'livelihoodactivity', 'month_earn']
	instances = search_data_for(header_names)
	instances = [ clean_row(row) for row in instances if any(row)]

	links = {}
	for row in instances:
		for i, value in enumerate(row):
			others = row[:i]
			if i < len(row) - 1:
				others += row[i+1:]

			if value:
				binned = links.setdefault(value, {})
				for other in others:
					if other:
						binned[other] = binned.setdefault(other, 0) + 1

	with open('data/freq_links.js', 'w') as f:
		max_size = max([max(x.values()) for x in links.values()])
		f.write('max_link_size = ' + str(max_size) + ';')
		f.write('link_data = ' + str(links) + ';')


def search_data_for(header_names):
	def to_json(headers, row):
		def is_valid(row):
			return row[ind]

		return dict([ (header, row[ind]) for header, ind in headers.items() if is_valid(row) ])

	with open('data.csv', 'rb') as csvfile:
		headers = {}
		output = []

		spamreader = csv.reader(csvfile) 
		for i, row in enumerate(spamreader):
			if i == 0:
				inds = get_headers(row, header_names).values()
				continue

			values = [row[ind] for ind in inds]
			output.append(values)

	return output



if __name__ == '__main__':
	# pull_data('flower_data', ['age_marriage', 'dec_marriage', 'rel_spouse', 'num_children'])
	# pull_data('diet_data', ['num_eat_daily', 'last_pers_eat', 'veg_consume', 'veg_cost', 'fruit_consume', 'fruit_cost', 'meat', 'meat_consume', 'meat_cost', 'ration_sufficient'])

	# make_wellbeing_data()
	# raychart_data()
	# face_forces_data()

	equality_data = ['dec_children', 'visit_parent', 'clothespreference', 'dec_children_edu_mar', 'clothesdecisionmaker']
	flower_data = ['age_marriage', 'dec_marriage', 'rel_spouse', 'num_children']
	diet_data = ['num_eat_daily', 'last_pers_eat', 'veg_consume', 'veg_cost', 'fruit_consume', 'fruit_cost', 'meat', 'meat_consume', 'meat_cost', 'ration_sufficient']


	wellbeing_data = ['visit_parent', 'loan_dec', 'out_emp', 'respect_cbo', 'prob_solve', 'soc_dem_iss', 'vote', 'pol_involve', ] \
	+ ['comp_use', 'personal_mobile', 'mobile_use', 'cant_text_read'] \
	+ ['num_eat_daily', 'veg_consume', 'veg_cost', 'fruit_consume', 'fruit_cost', 'newclothes' ] \
	+ ['defeacation', 'treat_self_ill', 'san_napkin']

	raychart_data = ['edu', 'livelihoodactivity', 'month_earn']

	assets = ['land', 'house', 'livestock', 'poultry', 'tv', 'vehicles', 'elec_app', 'houseextension']
	assets5 = [x+'5' for x in assets]

	general = ['nameoffemalehead',]

	cory_pull( list(set(general + flower_data + diet_data + equality_data + wellbeing_data + raychart_data + assets + assets5)) )