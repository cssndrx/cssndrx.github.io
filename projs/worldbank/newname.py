raw = """pipnumber	pip_num
pipcat	pip_cat
panchayat_name	panch_name
habitation_name	hab_name
cluster_name	clust_name
shgmemberorganizations	shg_member_org
shgtraininglast5years	shg_train_5
loantaken	loan_taken
familyinfluenceloan	loan_influence
maritalstatus	marital_status
ageatmarriage	age_marriage
decisionformarriage	dec_marriage
relatedtospouse	rel_spouse
relationshiptospouse	blood_spouse
numberofchildren	num_children
decisiononnumberofchildren	dec_children
childreneducationandmarriage	dec_children_edu_mar
familyplanning	fam_plan
familyplanningawareness	fam_plan_aware
familyplanningfollowup	fam_plan_follow
visitingparentshouse	visit_parent
loansdecisionmaker	loan_dec
outsideemployment	out_emp
respectstatusafterjoiningcbo	respect_cbo
respectfromwhomcbo	respect_cbo_who
problemsolvingwithincbo	prob_solve
numberoftimesadaytoeat	num_eat_daily
lastpersontoeatsenough	last_pers_eat
vegetableconsumption	veg_consume
vegetablecost	veg_cost
fruitsconsumption	fruit_consume
fruitcost	fruit_cost
meatconsumption	meat_consume
meatcost	meat_cost
rationshoppurchasessufficient	ration_sufficient
wantingatoilet	want_toilet
treatmentofselfifill	treat_self_ill
treatmentofmalememberifill	treat_male_ill
sanitarynapkins	san_napkin
bloodtest	blood_test
bloodtestlocation	blood_test_loc
familymemberinsured	fam_insure
insurance_accident	insurance_acc
insurance_medical	insurance_med
loansforbusinessdevelopment	loan_bus_dev
businessdevelopmenttraining	bus_dev_train
businesslocation	bus_loc
clgmembership	member_clg
livelihoodsassetsinsurance	live_asset_ins
businessinfrastructure	bus_infra
monthlyearnings	month_earn
numberofearningmembers	earn_members
goingfornregs	going_nrega
numberofdaysworkednregs	nrega_days
reasonnotgoingfornregs	notgoing_nrega
youthskillstraining	youth_train
employmentforyouthskillstrain	emp_youth_train
electricalappliances	elec_app
electricalappliances5	elec_app5
domesticviolence	dom_violence
sexualabuse	sex_abuse
domesticviolencediscussedamong	dom_vio_discussed
socialissuesdemonstration	soc_dem_iss
goalofsocialissuesparticipati	soc_dem_goal
voteinfluence	vote_inf
politicsinvolvement	pol_involve
purposeofpoliticalinvolvement	purpose_pol_involve
localelectionscontesting	loc_elec_cont
reasonforlocalelectionpartici	reas_loc_elec_cont
computerusage	comp_use
needforcomputer	need_comp
householdmobilephone	hh_mobile
personalmobilephone	personal_mobile
mobilephoneusage	mobile_use
atmcardusage	atm_use"""

rows = raw.split('\n')
for row in rows:
	if len(row.split('\t')) == 2:
		a, b = row.split('\t')
#		print 'a %s b %s' %(a, b)
		print "sed -e 's/%s/%s/' wb_to_json.py > wb_to_json.py.tmp && mv wb_to_json.py.tmp wb_to_json.py" %(a, b)
		print "sed -e 's/%s/%s/' js/indices.js > js/indices.js.tmp && mv js/indices.js.tmp js/indices.js"%(a, b)
		print "sed -e 's/%s/%s/' js/hierarchy.js > js/hierarchy.js.tmp && mv js/hierarchy.js.tmp js/hierarchy.js"%(a, b)
		print "sed -e 's/%s/%s/' js/viz.js > js/viz.js.tmp && mv js/viz.js.tmp js/viz.js"%(a, b)
		print

	else:
		print 'row', row