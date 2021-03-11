;(function(){
if(Newtec.Canvg != undefined){
		console.warn('newtec.menu.js已经被引入!');
		return ;
	}
Newtec.Utils.addJS("canvg.js","thirdparty/highcharts/lib/");
Newtec.Utils.addJS("rgbcolor.js","thirdparty/highcharts/lib/");
Newtec.Utils.addJS("exporting.js","thirdparty/highcharts/modules/");
Newtec.Canvg = function () {};
Newtec.Canvg.highchart2ImgData=function(highchartJQ){
	var highcharts=highchartJQ.highcharts();
	return this.svg2ImgData(highcharts.getSVG());
}
Newtec.Canvg.svg2ImgData=function(svgData){
	var testLayout=$("<canvas id='canvasId' style='display:none;'></canvas>");
	$('body').append(testLayout);
	canvg("canvasId", svgData);
	var imgData = testLayout[0].toDataURL("image/png");
	testLayout.remove();
	return imgData;
}
Newtec.Canvg.highchart2BASE64=function(highchartJQ){
	var imgData=Newtec.Canvg.highchart2ImgData(highchartJQ);
	return imgData&&imgData.substring(22)||null;
}
	Newtec.Module("Newtec.Canvg")
})();