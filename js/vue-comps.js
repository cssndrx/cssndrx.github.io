Vue.component('project', {
  props: {
    project: {type: Object, required: true},
    headerHeight: {type: Number, default: 30},
  },
  computed: {
  	isMobile(){
  		// https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device
  		return /Mobi|Android/i.test(navigator.userAgent);
  	},
  	computedStyle(){
      // grid-template-rows: auto 1fr 150px;
      console.log(this.isMobile);
  		return {'grid-template-rows': this.isMobile ? 'auto auto 150px' : 'auto 1fr 150px'};
  	},
  },
  template: `
<a :href="project.link" style="display:inline-block; text-decoration: none">
	<div class="project" :style="computedStyle">

	<h3>{{project.name}}</h3>

	<p class="tagline">
		{{project.tagline}}
	</p>

	<div><img :src="'images/'+project.image" style="margin:0 auto"></div>


	</div>
</a>
  `
});

Vue.component('keep-in-touch', {
  template: `
<div class="keep-in-touch half">
<div class="grid" style="display: grid; grid-template-columns: 1fr 1fr 1fr; width: 160px">
<a href="https://twitter.com/cassandraxia"><img src="images/twitter.png"></a>
<a href="https://www.linkedin.com/in/cassandraxia/"><img style="margin-top: 4px" src="images/linkedin.png"></a>
<a href="https://climatebuddies.substack.com/"><img src="images/substack.png"></a>
<a href="https://twitter.com/cassandraxia" class="label half">Twitter</a>
<a href="https://www.linkedin.com/in/cassandraxia/" class="label half">LinkedIn</a>
<a href="https://climatebuddies.substack.com/" class="label half">Newsletter</a>
</div> 
  `
});

Vue.component('blog-post', {
  props: {
    title: {type: String, default: ''},
    date: {type: String, default: ''},
  },

  template: `
<div class="keep-in-touch half">
<div class="grid" style="display: grid; grid-template-columns: 1fr 1fr 1fr; width: 160px">
<a href="https://twitter.com/cassandraxia"><img src="images/twitter.png"></a>
<a href="https://www.linkedin.com/in/cassandraxia/"><img style="margin-top: 4px" src="images/linkedin.png"></a>
<a href="https://climatebuddies.substack.com/"><img src="images/substack.png"></a>
<a href="https://twitter.com/cassandraxia" class="label half">Twitter</a>
<a href="https://www.linkedin.com/in/cassandraxia/" class="label half">LinkedIn</a>
<a href="https://climatebuddies.substack.com/" class="label half">Newsletter</a>
</div> 
  `
});