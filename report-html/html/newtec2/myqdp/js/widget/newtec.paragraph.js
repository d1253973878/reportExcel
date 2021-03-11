;(function(){
	if(Newtec.Paragraph != undefined){
	console.error('newtec.paragraph.js已经被引入!');
		return ;
		}
	Newtec.Utils.addCSS("widget/newtec-paragraph.css")
	Newtec.Paragraph=function(params){
		this.defaults = {
				bodyClass:'',
				align:'',
				content:'',
				imgs:'',
				dbclickImg:true,//双击图片放大
				begin:true,//新的一段落
				spaceContent:"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
				title:'',
				titleClass:'',
				steps:[],
		};
		 $(true,this.defaults,params);
	};
	Newtec.Paragraph.exte(Newtec.Base,'paragraph');
	Newtec.Paragraph.prototype.createNewtecJQ=function(params){
		var align=params['align'],
		defaults=this.defaults,
		content=params['content'],
		imgs=params['imgs'],
		newtecJQ=$("<div id='"+this.id+"' class='newtec-paragraph "+(align&&align!="bottom"?"align-tag":"")+" "+params['bodyClass']+" '></div>"),
		imgDiv=$("<div class='img-div'></div>"),
		contentDiv=$("<div class='content-div'>"+(defaults['begin']?defaults['spaceContent']:"")+content+"</div>");
		if(params['title']){
			newtecJQ.append("<p class='paragraph-title "+(params['titleClass']||"")+"'>"+params['title']+"</p>");
		}
		newtecJQ.append(contentDiv).append(imgDiv);
		var steps=params.steps;
		if(steps&&Newtec.Utils.isArray(steps)){
			var html="";
			for(var i = 0; i < steps.length; i++) {
				html += "<p class='paragraph-step'><span class='step-num'>"+(i+1)+"、</span>"+steps[i]+"</p>";
			}
			contentDiv.append(html);
		}
		this.imgDiv=imgDiv;
		this.setImg(imgs);
		return newtecJQ;
	};
	Newtec.Paragraph.prototype.finsh=function(params){
		if(this.defaults['dbclickImg']){
			this.newtecJQ.on('dblclick','.img-item',function(){
				var src=$(this).attr('src')||$(this).find('img').attr('src');
				Newtec.Window.create({
					title:'图片',
					width:1520,height:800,
					body:'<img width="100%" src="'+src+'"/>'
				})
			});
			
		}
	};
	Newtec.Paragraph.prototype.setImg=function(imgs){
		if(Newtec.Utils.isArray(imgs)){
			for ( var i = 0; i < imgs.length; i++) {
				this.setImg(imgs[i]);
			}
		}else{
			if(Newtec.Utils.isJson(imgs)){
				var src=imgs['src'],html="",
				imgClass=imgs['class']?imgs['class']:"",
				title=imgs['title'],isTitle=title!==undefined;
				if(isTitle){
					html="<div class='img-item '><img class='"+imgClass+"' src='"+src+"'/><p class='img-title'>"+title+"</p></div>";
				}else{
					html="<img class='img-item "+imgClass+"' src='"+src+"'/>";
				}
			}else{
				html="<img class='img-item' src='"+imgs+"'/>";
			}
			this.imgDiv.append(html);
		}
	};
	Newtec.Module("Paragraph")
})();