;(function(){
if(Newtec.Jsmind != undefined){
		console.warn('newtec.jsmind.js已经被引入!');
		return ;
	}
Newtec.Utils.addCSS("jsmind.css","thirdparty/jsmind/css/");
Newtec.Utils.addJS("jsmind.js",'thirdparty/jsmind/js/');
Newtec.Jsmind = function (params) {
	//2.
	this.defaults = {
			height:600,
			click:null,
			options:{
				 theme:'primary',
			}
				
    };
	this.defaults=$.extend(true,this.defaults,params);
};
Newtec.Jsmind.exte(Newtec.Base,'jsmind');
Newtec.Jsmind.over({
	createNewtecJQ:function(params){
		var defaults=this.defaults;
		var height=defaults.height;
		newtecJQ=$("<div class='newtec-jsmind' id='"+this.id+"' style='height:"+height+"px;'></div>");
		
		return newtecJQ;
	},
	finsh:function(params){
		var defaults=this.defaults;
		var options=defaults.options;
		var newtecJQ=this.newtecJQ;
		var click=params.click
		
		if(Newtec.Utils.isFunction(click)){
			newtecJQ.on('click','jmnodes>jmnode',function(e){
				var nodeid=$(this).attr('nodeid');
				console.info("----------<<<,");
				click(nodeid,e);
			})
		}
		options.container=this.id;
		var datas=defaults.datas||textData;
		var mind={
			meta : {
				name:'',
				author:'',
				version:''
			},
			format:'node_array',
			data:datas
		}
		setTimeout(function(){
			jsMind.show(options,mind)
		},100);
	},
});
var textData= [
 			   {"id":"root", "isroot":true, "topic":"jsMind","expanded":false},
			   {"id":"sub1", "parentid":"root", "topic":"<p>sub1</p><p>sub12</p>","expanded":false},
               {"id":"sub11", "parentid":"sub1", "topic":"sub11","expanded":false},
               {"id":"sub12", "parentid":"sub1", "topic":"sub12","expanded":false},
               {"id":"sub13", "parentid":"sub1", "topic":"sub13","expanded":false},
               {"id":"sub2", "parentid":"root", "topic":"sub2","expanded":false},
               {"id":"sub21", "parentid":"sub2", "topic":"sub21","expanded":false},
               {"id":"sub22", "parentid":"sub2", "topic":"sub22","expanded":false},
               {"id":"sub3", "parentid":"root", "topic":"sub3","expanded":false},
               {"id":"sub31", "parentid":"sub3", "topic":"sub31","expanded":false},
               {"id":"sub4", "parentid":"root", "topic":"sub4","expanded":false},
               {"id":"sub41", "parentid":"sub4", "topic":"sub41","expanded":false},
               {"id":"sub42", "parentid":"sub4", "topic":"sub42","expanded":false},
               {"id":"sub5", "parentid":"root", "topic":"sub5","expanded":false},
               {"id":"sub51", "parentid":"sub5", "topic":"sub51","expanded":false},
               {"id":"sub52", "parentid":"sub5", "topic":"sub52","expanded":false},
               {"id":"sub521", "parentid":"sub52", "topic":"sub521","expanded":false},
			]
	Newtec.Module("Jsmind")
})();