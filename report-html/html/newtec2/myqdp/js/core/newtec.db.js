//离线存储
function openDB () {
        var version=myDB.version || 1;
        var name = myDB.name;
        var request=window.indexedDB.open(name,version);
        request.onerror=function(e){
            console.log(e.currentTarget.error.message);
        };
        request.onsuccess=function(e){
            myDB.db=e.target.result;
        };
        request.onupgradeneeded=function(e){
            var db=e.target.result;
            if(!db.objectStoreNames.contains('myqdpds')){
                db.createObjectStore('myqdpds',{keyPath:"dsName"});
            }
            console.log('DB version changed to '+version);
        };
    }

var students=[{ 
        id:1001, 
        name:"Byron", 
        age:24 
    },{ 
        id:1002, 
        name:"Frank", 
        age:30 
    },{ 
        id:1003, 
        name:"Aaron", 
        age:26 
    }];

 
function addData(storeName,datas){
	var db = myDB.db;
        var transaction=db.transaction(storeName,'readwrite'); 
        var store=transaction.objectStore(storeName); 

        for(var ds in datas){
        	//datas[ds]['fields'] = undefined;
        	/* alert(ds+"=="+Newtec.Utils.json2str(datas[ds])); */
            store.put(datas[ds]);
        	//store.add({'dsName':ds,'id':'asdfdsfdd撒旦法',ts:['a','b'],'a':{sdaf:'asdf'}});
        }
    }

var myDB={
        name:'myqdpDB',
        version:4,
        db:null
    };
function getDataByKey(db,storeName,value){
    var transaction=db.transaction(storeName,'readwrite'); 
    var store=transaction.objectStore(storeName); 
    var request=store.get(value); 
    request.onsuccess=function(e){ 
        var student=e.target.result; 
        console.log(student); 
    };
}  
//deleteDB();
openDB();

Newtec.DS.loadAll(function(){
//	alert('之后12：'+Newtec.Utils.json2str(Newtec.DS.network.fields[0]));
});
    setTimeout(function(){
    	clearObjectStore("myqdpds");
        addData('myqdpds',Newtec.ds);
        getDataByKey(myDB.db,"myqdpds","aa");
        /* closeDB(myDB.db);*/
     //   deleteDB(myDB.name); 
    },1000);
    
    function clearObjectStore(storeName){
    	var db = myDB.db;
        var transaction=db.transaction(storeName,'readwrite'); 
        var store=transaction.objectStore(storeName); 
        store.clear();
}
    function deleteDB(){
        indexedDB.deleteDatabase(myDB.name);
    }