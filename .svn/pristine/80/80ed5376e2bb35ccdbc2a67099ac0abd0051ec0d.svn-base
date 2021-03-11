var map ;
onload = function(){
	
		map = new BMap.Map("allMap");
		map.enableScrollWheelZoom();
		map.centerAndZoom(new BMap.Point(121.4,31.2), 13);//上海
		map.setNetwork = function(n,networks){
			map.clearOverlays();//清除掉上次的所有标注
			var len = networks.length;
			if(len<=0) return ;
			if(!Newtec.Utils.isNull(n)){
				var jd = n.jd;
				var wd = n.wd;
				//创建查询的位置
				var pt = new BMap.Point(jd,wd);
				map.centerAndZoom(pt, 13);
//				var myIcon = new BMap.Icon("cp/images/fox.gif", new BMap.Size(300,157));
//				var marker2 = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
//				marker2.setLabel(new BMap.Label(n.address,{offset:new BMap.Size(0,0)}));
//				map.addOverlay(marker2);              // 将标注添加到地图中
			}else{
				map.centerAndZoom(new BMap.Point(networks[0].jd,networks[0].wd), 13);
			}
			/*for(i=0;i<len;i++){
				var network = networks[i];
//				alert(Newtec.Utils.json2str(network));
				network.inteImg = Newtec.Utils.isNull(network.inteImg)?'cp/images/default.png':'CPImgDownLoadServlet?img='+network.inteImg;
				setAddre(network,map);
			}*/
			var networkJson = {};
			for(i=0;i<len;i++){
				var network = networks[i];
				networkJson[Newtec.Utils.toFloat(network.jd)+"_"+Newtec.Utils.toFloat(network.wd)] = network;
			}
			setAddreBiger(networkJson);
		}
			/*var setAddre = function (network){
				var content =
					"<div style='width:500px;'>" + 
					"<div class='row'><div class='col-sm-8'><div class='rating inline'></div>" +
					"<div >" +
					"<B>网点地址：</B>"+Newtec.Utils.getValue(network['address'])+
					"<BR><B>所属街道：</B>"+Newtec.Utils.getValue(network['streetName'])+
					"<BR><B>联系电话：</B>"+Newtec.Utils.getValue(network['phone'])+
					"<BR><B>状&emsp;&emsp;态：</B>"+Newtec.Utils.getValue(network['status'])+
					"</div>" +
					"</div>" +
					"<div class='col-sm-4' style='margin-top:5px;'>" +
					"<img style='float:right;margin:4px' id='id_"+network['id']+"' src='"+network.inteImg+"' title='"+network['address']+"'/>" + 
					"</div></div>" +
					"</div>";
				
				var marker = new BMap.Marker(new BMap.Point(network.jd,network.wd));
				//alert(content);
				//alert(new BMap.Point(params['jd'],params['wd']));
				var infoWindow = new BMap.InfoWindow(content );  // 创建信息窗口对象
				map.addOverlay(marker);
				marker.addEventListener("click", function(){ 
//					alert(network.inteImg);
				   this.openInfoWindow(infoWindow);
				   //图片加载完毕重绘infowindow
				    document.getElementById('id_'+network['id']).onload = function (){
					   infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
					   
					   $('.rating').raty({
							'cancel' : true,
							'half' : true,
							score : network['xj'],
							'starType' : 'i',
							readOnly: true
						});
				   } 
				});
				
			}*/
		
		var setAddreBiger=function(networkJson){
//			alert(Newtec.Utils.json2str(networkJson));
			if(document.createElement('canvas').getContext){
				var points=[];
				for(var jwd in networkJson){
					var network = networkJson[jwd];
					points.push(new BMap.Point(network.jd,network.wd));
				}
				var options={
					//TINY(2px*2px) SMALLER(4px*4px) SMALL(8px*8px) NORMAL(10px*10px)BIG(16px*16px)BIGGER(20px*20px)HUGE(30px*30px)	
					size: BMAP_POINT_SIZE_BIGGER,
					//CIRCLE(圆形-默认)STAR(星形)SQUARE(方形)RHOMBUS(菱形)WATERDROP(水滴状，该类型无size和color属性)
		            shape: BMAP_POINT_SHAPE_STAR,
		            color: '#d340c3'
				}
				
				var pointCollection=new BMap.PointCollection(points, options);
				 var opts = {
						// width: 450, // 信息窗口宽度
						 height: 150, // 信息窗口高度
						 title:"", // 信息窗口标题
						 enableMessage: false,//设置允许信息窗发送短息
						 }
				 pointCollection.addEventListener('click', function (e) {
					 var jd=e.point.lng;
					 var wd=e.point.lat;
//					 alert("金稻谷"+(jd+"_"+wd));
					 var network = networkJson[jd+"_"+wd]
//					 alert(Newtec.Utils.json2str(network));
					 var imgSrc = Newtec.Utils.isNull(network.inteImg)?'cp/images/default.png':'CPImgDownLoadServlet?img='+network.inteImg+"&"+Newtec.Utils.uuid(10);
					 var  content =
							"<div style='width:500px;'>" + 
							"<div class='row'><div class='col-sm-8'><div class='rating inline'></div>" +
							"<div >" +
							"<B>网点地址：</B>"+Newtec.Utils.getValue(network['address'])+
							"<BR><B>所属街道：</B>"+Newtec.Utils.getValue(network['streetName'])+
							"<BR><B>联系电话：</B>"+Newtec.Utils.getValue(network['phone'])+
							"<BR><B>状&emsp;&emsp;态：</B>"+Newtec.Utils.getValue(network['status'])+
							"</div>" +
							"</div>" +
							"<div class='col-sm-4' style='margin-top:5px;'>" +
							"<img style='float:right;margin:4px ;width:150px;heigth:110px' id='id_"+network['id']+"' src='"+imgSrc+"' title='"+network['address']+"'/>" + 
							"</div></div>" +
							"</div>";
					 
					 $(document).on('load','#id_'+network['id'],function(){
					 infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
					   $('.rating').raty({
							'cancel' : true,
							'half' : true,
							score : network['xj'],
							'starType' : 'i',
							readOnly: true
						});		
				 });
				 
					 
					 var point = new BMap.Point(jd,wd);
					 var infowindow = new BMap.InfoWindow(content, opts);
					 map.openInfoWindow(infowindow, point);
			        });
				 map.addOverlay(pointCollection);
				
				
			}else{
				alert("------"+该浏览器不支持海量点数据);
			}
		}

	}

