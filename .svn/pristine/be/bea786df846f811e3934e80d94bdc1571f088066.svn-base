;(function(){
	if(!Newtec.Utils.isNull(Newtec.Lightgallery)){
		return ;
	}
	Newtec.Utils.addJS("lightgallery-all.min.js","thirdparty/lightgallery/js/");
	Newtec.Utils.addCSS("lightgallery.css","thirdparty/lightgallery/css/");
	Newtec.Lightgallery = function(params) {
		this.defaults = {
				data:[
				      {src:"myqdp/images/demo/sysadmin/addDataSource.png",},
				      {src:"myqdp/images/demo/sysadmin/appToPerson.png",},
				      {src:"myqdp/images/demo/sysadmin/createapp.png",},
				],
				lightParams:{
					download : true,
				},
					
					
				
		};
		$.extend(true,this.defaults,params);
	};
	Newtec.Lightgallery.exte(Newtec.Base,"lightgallery");
	Newtec.Lightgallery.over({
		createNewtecJQ:function(params){
			var that = this;
			var defaults = this.defaults;
			var data = defaults.data;
			var newtecJQ = $("<div class='demo-gallery'></div>");
			var ulJQ = $("<ul id='lightgallery' class='list-unstyled row'></ul>");
			
			for(var i = 0 ; i < data.length ; i++){
				var liJQ = $("<li class='col-xs-6 col-sm-4 col-md-3' data-src="+data[i].src+"><a href=''><img src="+data[i].src+"></a></li>");
				ulJQ.append(liJQ);
			}
			newtecJQ.append(ulJQ);
			ulJQ.lightGallery(defaults['lightParams']);
			return newtecJQ;
		},
	});
	Newtec.Module("Lightgallery")
})();