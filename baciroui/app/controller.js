app.controller('menuCtrl', function ($scope, $rootScope, $routeParams, $location, $http, Data, $cookieStore) {
    $scope.logout = function () {
        $cookieStore.remove('user_auth');
        delete $rootScope.auth;
        window.location = 'login.html';
        // Data.getphp('logout').then(function (results) {
        //     // Data.toast(results);
        //     // $cookieStore.remove('user_auth');
        //     // delete $rootScope.auth;
        //     // window.location = 'login.html';
        // });
    }
    $scope.linkUser = function () {
    	$location.path('user');
    	$scope.init();
    }
    $scope.linkDashboard = function () {
    	$location.path('dashboard');
    	$scope.init();
    }
    $scope.linkConfiguration = function () {
    	$location.path('configuration');
    	$scope.init();
    }
    $scope.linkActivity = function () {
    	$location.path('activity');
    	$scope.init();
    }
    $scope.linkHistory = function () {
    	$location.path('history');
    	$scope.init();
    }
    $scope.linkSubmitJob = function () {
    	$location.path('submitJob');
    	$scope.init();
    }
    $scope.linkCrawl = function () {
        $location.path('crawl');
        $scope.init();
    }
    $scope.linkSearch = function () {
        $location.path('search');
        $scope.init();
    }
    $scope.linkFlume = function () {
        $location.path('flume');
        $scope.init();
    }
    $scope.linkData = function () {
        $location.path('data');
        $scope.init();
    }
    $scope.linkD3js = function () {
        $location.path('d3js');
        $scope.init();
    }
    $scope.linkImage = function () {
        $location.path('image');
        $scope.init();
    }
    $scope.init = function () {
        var id = $location.path().split("/");
        if(id[1]==''){
          id[1]='dashboard';
      }
      $( 'li' ).removeClass( 'active' )
      $( '#menu-'+id[1] ).addClass( 'active' )

  }
  $scope.init();
});

app.controller('visualCtrl', function ($scope, $rootScope, $routeParams, $location, $timeout, $http, $window, Data, dataConfiguration) {
    $scope.dataForm = {};
    $scope.dataForm.tableList = [];
    
    $scope.dataForm.selected_core_name = [];
    $scope.dataForm.resultsCoreId = [];
    $scope.dataForm.fl = {};


    $scope.dataForm.tableList = [
    {"id":0,"name":"Pie"},
    {"id":1,"name":"Bar"},
    {"id":2,"name":"Histogram"}
    ];

     $scope.processd3js = function(){
        //get core name
        var select_core_name = {};
        select_core_name.name = $scope.dataForm.selected_core_name.select_core;
        console.log(select_core_name);

        //get field name
        var fieldName = {};
        fieldName.name = $scope.dataForm.resultsCoreId.cores;
        console.log(fieldName);

        //get table model
        var tabelS = {};
        tabelS.id = $scope.dataForm.tabel_selected.id;
        tabelS.name = $scope.dataForm.tabel_selected.name;
        console.log(tabelS);

        //get the value of value
        var valuesForm = {};
        valuesForm.name = $scope.dataForm.valueFormText;
        console.log(valuesForm);

        //get the vertical and horizontal name
        var hName = {};
        hName.horizontal = $scope.dataForm.hName;
        console.log(hName);

        var vName = {};
        vName.vertical = $scope.dataForm.vName;
        console.log(vName);

        var urlName = {};
        urlName.url = 'http://192.168.1.91:8983/solr/myCore/select?q=*%3A*&wt=json&rows=0&facet=true&facet.field='+$scope.dataForm.resultsCoreId.cores+'&facet.limit=20';
        var solr_param = $scope.dataForm.selected_core_name.select_core+'/select?q=*%3A*&wt=json&rows=0&facet=true&facet.field='+$scope.dataForm.resultsCoreId.cores+'&facet.limit=20';
        console.log(urlName);

        //construct all data
        var d3jsData = {};
        d3jsData.corename = select_core_name;
        d3jsData.facedfield = fieldName;
        //d3jsData.tables = tabelS;
        d3jsData.horizontal = hName.horizontal;
        d3jsData.vertical = vName.vertical;
        d3jsData.url = urlName;

        console.log(d3jsData);

        $scope.data_ready = [];
        var facedDataAttr = [];
        var facedDataValue = [];

        Data.solrget(solr_param).then(function(data) {
            console.log('retrieve from solr');
            console.log(data);
            fcd = data;
            fcd = fcd.facet_counts.facet_fields;

            for(var key in fcd){
                
                fcd[key].forEach(function(arr, i) {

                    if (i%2 === 0) {
                      facedDataAttr.push(arr);
                    }
                    else if (i%2 != 0) {
                      facedDataValue.push(arr);
                    }
                });
              
            }
      
            jsonData = '[ \n';
            for (var i = 0; i < facedDataAttr.length; i++) {
                if (i < facedDataAttr.length-1) {
                    jsonData += '{\n"'+d3jsData.horizontal+'" : "'+facedDataAttr[i]+'","'+d3jsData.vertical+'" : '+facedDataValue[i]+'},'
                }
                else if (i === facedDataAttr.length-1) {
                    jsonData += '{\n"'+d3jsData.horizontal+'" : "'+facedDataAttr[i]+'","'+d3jsData.vertical+'" : '+facedDataValue[i]+'}'
                }
            }  

            jsonData += ']';
            console.log(jsonData);
            // data dimasukkan ke data_ready;
            var data = JSON.parse(jsonData);
            console.log(data);
            // panggil event 'data_ready'? daftarin event dulu,
            // fungsi yg dipanggil ketika siap construct grafik

            angular.module('showHideApp',[]).controller('visualCtrl', function($scope){
               $scope.submitted = function(){
                 $scope.show=true;
               }
               $scope.reset = function(){
                 $scope.show=false;
               }
           });
            
            var margin = {top: 30, right: 20, bottom: 200, left: 150},
            width = 600 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

            var x;
            var y;
            var xAxis;
            var yAxis;
             
            d3.select("svg").remove(); 
             
            var svg = d3.select("#hasil").append("svg")
                .style("background-color", 'white')
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            console.log(data);
            var col;
            var row;
            var xSel;
            var ySel;
                
            $.each(data, function(key, value){
              col=Object.keys(value)[0];
              row=Object.keys(value)[1];
              });
            console.log(row);

              data.forEach(function(d) {
                    d.col = d[col];
                    d.row = +d[row];
                    console.log(d.row+","+d.col);
                });

              x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .05);

              y = d3.scale.linear()
                .range([height, 0]);

              xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

              yAxis = d3.svg.axis()
                .scale(y)
                .orient("left").ticks(10);

              x.domain(data.map(function(d) { return d.col; }));
              y.domain([0, d3.max(data, function(d) { return d.row; })]);

              svg.append("g")
                  .attr("font-size", "12px")
                  .attr("fill", "none")
                  .attr("stroke", "black")
                  .attr("stroke-width","1px")
                  .attr("shape-rendering", "crispEdges")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + height + ")")
                  .call(xAxis)
                  .selectAll("text")
                  .style("text-anchor", "end")
                  .attr("dx", "-.8em")
                  .attr("dy", "-.55em")
                  .attr("transform", "rotate(-90)" );

              svg.append("g")
                  .attr("font-size", "12px")
                  .attr("fill", "none")
                  .attr("stroke", "black")
                  .attr("stroke-width","1px")
                  .attr("shape-rendering", "crispEdges")
                  .attr("class", "y axis")
                  .call(yAxis)
                  .append("text")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 5)
                  .attr("dy", ".71em")
                  .text(row);

              svg.selectAll("bar")
                  .data(data)
                  .enter().append("rect")
                  .attr("class", "bar")
                  .attr("fill","steelblue")
                  .attr("x", function(d) { return x(d.col); })
                  .attr("width", x.rangeBand())
                  .attr("y", function(d) { return y(d.row); })
                  .attr("height", function(d) { return height - y(d.row); });   

        });
        // $http({
        //     method : 'POST',
        //     url : 'http://192.168.43.146:3000/d3js/add',
        //     data : d3jsData,
        //     headers : {'Content-Type' : 'application/json'}
        // })
        // .success(function(data){
        //     console.log(data);});
                 
                };

            d3.select("#save").on("click", function(){
                var svg = document.querySelector("svg");
                var svgData = new XMLSerializer().serializeToString(svg);
                
                //console.log(html);
                var imgsrc = "data:image/svg+xml;base64," + btoa(svgData);
                var img = '<img src="'+imgsrc+'">'; 
                d3.select("#svgdataurl").html(img);
                    
                var canvas = document.querySelector("canvas"),
                context = canvas.getContext("2d");
                
                var image = new Image;
                image.src = imgsrc;
                image.onload = function() {
                context.drawImage(image, 0, 0);
                
                var a = document.createElement("a");
                a.download = "reportpng.png";
                a.href = canvas.toDataURL("image/png");
                a.click();
            };
            });
                   
            d3.select("#savepdf").on("click", function(){
                var svg = document.querySelector("svg");
                var svgData = new XMLSerializer().serializeToString(svg);
                
              //console.log(html);
                var imgsrc = 'data:image/svg+xml;base64,'+ btoa(svgData);
                var img = '<img src="'+imgsrc+'">'; 
                d3.select("#svgdataurl").html(img);
              
                    var canvas = document.getElementById('Canvas'),
                    context = canvas.getContext("2d");
                 
                var image = new Image;
                image.src = imgsrc;
                image.onload = function() {
                    context.drawImage(image, 0, 0);

                    // only jpeg is supported by jsPDF
                    var imgData = canvas.toDataURL("image/jpeg", 1.0);
                    var pdf = new jsPDF('l', 'mm', [297, 210]);
                    
                    pdf.addImage(imgData, 'JPEG', 0, 0);
                    var savepdf = document.getElementById('savepdf');
                    pdf.save("reportpdf.pdf");
                };
              });  
   

    $http({
        method: 'GET',
        url: 'http://192.168.1.91:3000/ingestion/collections',
    }).success(function (resultName) {
        $scope.dataForm.selected_core_name = resultName;
        console.log(resultName);
    });

     $scope.dataChangeCore = function(id){

     $http({
        method: 'GET',
        url: 'http://192.168.1.91:3000/ingestion/collections/'+$scope.dataForm.selected_core_name.select_core+'/fields',
    }).success(function (resultCore) {
        $scope.dataForm.resultsCoreId = resultCore.messages;
        console.log(resultCore.messages);

    });


        //get the type
        var source_types = $scope.dataForm.selected_core_name.select_core;

        // for (var i=0; i < $scope.dataForm.getCollections.messages.length; i++){
        //     if ($scope.dataForm.getCollections.messages == source_types) {
        //         $scope.dataForm.getCollections.messages = i;              
        //     }
        // }
        console.log($scope.dataForm.selected_core_name.select_core);
    };

});



app.controller('dataCtrl', function ($scope, $rootScope, $routeParams, $location, $timeout, $http, $window, Data, dataConfiguration) {


    // ============== data start here =============== //

    $scope.initParams = function(fileType, type_identity, id) {
        // make sure it empty
        $scope.dataForm[fileType][id].params = [];
        
        // get the id of the selected config template
        var selected_type = $scope.dataForm[fileType][id][type_identity];
        console.log(selected_type);
        
        // params list
        var config_params = $scope.dataConfig[fileType][selected_type].params;
        
        // iterate through every object in selected config params template
        config_params.forEach(function(item, idx) {
            // append to selected params
            $scope.dataForm[fileType][id].params.push({
                "name": item.name
            });
        });
    };

    // initialise somepart here before use
    // because it should be initialised
    // or everything won't work.
    $scope.dataForm = {}; // flume form object
    $scope.dataConfig = {}; // initialise config
    $scope.dataForm.fileType = []; // fileType
    $scope.dataForm.collections = []; // collections
    $scope.dataForm.collect_data = []; // collect_data
    $scope.dataForm.globalType = []; // globalType
    $scope.dataForm.params = [];
    $scope.dataForm.url = [];
    $scope.dataForm.modeList = [];
    $scope.dataForm.pr = {};
    $scope.dataForm.file = [];

    $scope.dataForm.getCollections = [];
    $scope.dataForm.getMessages = [];
    $scope.dataForm.getCollectionsID = [];

    var uploadedCount = 0;

    $scope.files = [];
    $scope.file = {};

    $scope.uploadFiles = function() {

        var files = angular.copy($scope.files);

        if ($scope.file) {
            files.push($scope.file);
        }

        if (files.length === 0) {
            $window.alert('Please select files!');
            return false;
        }

        for (var i = files.length - 1; i >= 0; i--) {
            var file = files[i];
            $http.post('server.php', file)
            .success(function(res){
                uploadedCount ++;
                if (uploadedCount == files.length) {
                    $window.alert('File has been uploaded');
                }
            });
        }
    };


    $scope.processForm = function(){

            //CONSTRUCT THE JSON Data
            //show table selected
            var tabelShow = {};
            tabelShow.id = $scope.dataForm.tabel_selected.id;
            tabelShow.name = $scope.dataForm.tabel_selected.name;
            console.log(tabelShow);

            //show mode online or offline
            var modeShow = {};
            modeShow.id = $scope.dataForm.mode_selected.id;
            modeShow.name = $scope.dataForm.mode_selected.name;
            modeShow.url = $scope.dataForm.mode_selected.url;
            if ($scope.dataForm.mode_selected=='Offline') {
                modeShow.fileName = $scope.dataForm.mode_selected.file.base64;
            }
            console.log(modeShow);

            //show filetype
            var fileTypeShow = {};
            $scope.dataForm.fileType[0].params = $scope.dataForm.params;

            fileTypeShow.id=$scope.dataForm.fileType[0].fileType_id;
            fileTypeShow.name=$scope.dataForm.fileType[0].fileType;
            fileTypeShow.params=$scope.dataForm.params;

            console.log(fileTypeShow);

            var dataCollections = {};
            dataCollections.name = $scope.dataForm.getCollections.select_collections;
            dataCollections.params = $scope.dataForm.pr;

            console.log(dataCollections);


            //show all json data and will be store to solr
            var showAlldata = {};
            showAlldata.tabel = tabelShow;
            showAlldata.modeSelect = modeShow;
            showAlldata.fileTypeSelect = fileTypeShow;
            showAlldata.collections_data = dataCollections;
            console.log(showAlldata);

            // $http({
            //     method : 'POST',
            //     url : 'http://localhost:3000/ingestion/add',
            //     data : showAlldata,
            //     headers : {'Content-Type' : 'application/json'}
            // })
            // .success(function(data){
            //     console.log(data);

            // });
            Data.toast({
                'status': 'info',
                'message': 'Please wait for message response'
            });
            Data.ingestionpost('add', showAlldata).then(function(result) {
                $location.path('data');
                Data.toast(result);
            });
        };

        
        //GET THE DATA IN THE COLLECTIONS

        // $http({
        //     method: 'GET',
        //     url: 'http://localhost:3000/ingestion/collections',
        // }).success(function (result) {
        //     $scope.dataForm.getCollections = result;
        //     console.log(result);
        // });
        Data.ingestionget('collections').then(function(result) {
            $scope.dataForm.getCollections = result;
            console.log(result);
        });

        $scope.dataForm.modeList = [
        {"id":0,"name":"Offline"},
        {"id":1,"name":"Online"}
        ];

        $scope.dataForm.url =[
        {
            'url':'',
            'name':$scope.dataForm.modeList[0].name
        }
        ];

        $scope.dataForm.fileName =[
        {
            'fileName':'',
            'name':$scope.dataForm.modeList[0].name
        }
        ];

        $scope.dataForm.tableList = [
        {"id":0,"name":"Pie"},
        {"id":1,"name":"Bar"},
        {"id":2,"name":"Histogram"}
        ];

        $scope.dataForm.globalType = [
        { 'id': 0,'type': 'string' },
        { 'id': 1, 'type': 'float' },
        { 'id': 2, 'type': 'integer'},
        { 'id': 3, 'type': 'double'},
        { 'id': 5, 'type': 'varchar'},
        { 'id': 6, 'type': 'datetime'}
        ];

        $scope.dataInit = function() {

        $scope.dataConfig = dataConfiguration; // returned from service

        $scope.tableToggleCollections = false;

        // init default source
        $scope.dataForm.fileType.push({
            'fileType': $scope.dataConfig.fileType[0].name, // default source
            'fileType_id': 0,
            'params': [], // default to no params at all,
                        // it should be set when the user do something with it
                        'toggle': false
                    });
        
        $scope.initParams('fileType', 'fileType_id', 0);

    };

    //add a row in the array
    $scope.addRow = function(){

        $scope.dataForm.params.push(
        {
            'col': '',
            'type': $scope.dataForm.globalType[0].type,
        });
    };

 // remove the selected row
 $scope.removeRow = function(index){
    // remove the row specified in index
    if (confirm("Really want to remove?")) {
        $scope.dataForm.params.splice( index, 1);
    }
};


    // function to change the flume source, given id
    $scope.dataChangefileType = function(id) {

        // get the type
        var source_type = $scope.dataForm.fileType[id].fileType; // get type
        
        // set right config source id
        for (var i=0; i < $scope.dataConfig.fileType.length; i++) {
            if ($scope.dataConfig.fileType[i].name == source_type) {
                $scope.dataForm.fileType[id].fileType_id = i;
                // re-init source params
                $scope.initParams('fileType', 'fileType_id', id);
                return;
            }
        }
        
        console.log('udated id ' + id);
    };

    $scope.dataChangecollections = function(id){

     $http({
        method: 'GET',
        url: 'http://192.168.43.199:3000/ingestion/collections/'+$scope.dataForm.getCollections.select_collections+'/fields',
    }).success(function (resultID) {
        $scope.dataForm.getCollectionsID = resultID.messages;
        console.log(resultID.messages);

    });


        //get the type
        var source_types = $scope.dataForm.getCollections.select_collections;

        for (var i=0; i < $scope.dataForm.getCollections.messages.length; i++){
            if ($scope.dataForm.getCollections.messages == source_types) {
                $scope.dataForm.getCollections.messages = i;              
            }
        }
        console.log($scope.dataForm.getCollections.select_collections);
    };

       
    // table toggle
    $scope.toggleTable = function(id) {
        $scope.dataForm.fileType[id].toggle = !$scope.dataForm.fileType[id].toggle;
    };

     // table toggle
     $scope.toggleTableCollections = function() {
        $scope.tableToggleCollections = !$scope.tableToggleCollections;
    };

    
    //=================== Remove method for flume =================//
    $scope.removefileType = function(id) {
        if (confirm("Really remove this source?")) {
            $scope.dataForm.fileType.splice(id,1);
        }
        
    };  
    
    // init flume
    $scope.dataInit();

});


app.controller('flumeCtrl', function ($scope, $rootScope, $routeParams, $location, $timeout, $http, $window, Data, flumeConfiguration, $interval, toaster) {

    $scope.linkAddagent = function () {
        $location.path('flume/add');
    }

    $scope.linkCancel = function () {
        $location.path('flume');
    }
    /*$scope.AddAgent = function(){
        Data.post('user', {
            agentname: $scope.flumeForm.agentname,
            source: $scope.flumeForm.source,
            channel: $scope.flumeForm.channel,
            sink: $scope.flumeForm.sink,
            role: $scope.flumeForm.role
        }).then(function (results) {
            Data.toast(results);
            if (results.status == "success") {
                $location.path('user');
            }
        });
    };*/

    /*$scope.deleteAgent = function (id) {
        var deleteUser = $window.confirm('Are you absolutely sure you want to delete?');
        if(deleteUser){
            Data.delete('user/'+id).then(function (results) {
                Data.toast(results);
                $scope.loaduser();
            }); 
        }
    }*/


    
    
    // ============== Flume start here =============== //

    $scope.initParams = function(type, type_identity, id) {
    	// make sure it empty
    	$scope.flumeForm[type][id].params = [];
    	
    	// get the id of the selected config template
    	var selected_type = $scope.flumeForm[type][id][type_identity];
    	console.log(selected_type);
    	
    	// params list
    	var config_params = $scope.flumeConfig[type][selected_type].params;
    	
    	// iterate through every object in selected config params template
    	config_params.forEach(function(item, idx) {
    		// append to selected params
    		$scope.flumeForm[type][id].params.push({
    			"name": item.name,
    			"value": item.value,
    			"required": item.required
    		});
    	});
    };
    
    // initialise somepart here before use
    // because it should be initialised
    // or everything won't work.
    $scope.flumeForm = {}; // flume form object
    $scope.flumeConfig = {}; // initialise config
    $scope.flumeForm.agentName = '';
	$scope.flumeForm.sources = []; // sources
	$scope.flumeForm.channels = []; // channels
	$scope.flumeForm.sinks = []; // sinks
	$scope.flumeForm.connectors = []; // connectors
	$scope.flumeForm.relations = {}; // consist of {'c_name': {sources:[], sink: ''}}
	$scope.flumeForm.register_ready = false;

    $scope.reloadConfig = function() {
        // error maybe will happen here???
        Data.getflumeconfig('list').then(function(data) {
            if (data.code == 1) {
                $scope.flumeConfigFromServer = data.message;
            } else {
                $scope.flumeConfigFromServer = [];
                alert('Error while connecting to flume server');
            }
        });
    }

    // every 10 seconds reload
    $interval(function() {
        $scope.reloadConfig();
        console.log('config reloaded');
    }, 10000);

    $scope.flumeInit = function() {
    	
    	$scope.flumeConfig = flumeConfiguration; // returned from service

    	// init default source
    	$scope.flumeForm.sources.push({
    		'type': $scope.flumeConfig.sources[0].name, // default source
    		'source_id': 0,
    		'params': [], // default to no params at all,
    					// it should be set when the user do something with it
                      'toggle': false,
                      'source_name': '',
                  });
    	
    	$scope.initParams('sources', 'source_id', 0);
    	
    	// init default channel
    	$scope.flumeForm.channels.push({
    		'type': $scope.flumeConfig.channels[0].name, // default channel
    		'channel_id': 0,
    		'params': [], // default to no params at all,
    					// it should be set when the user do something with it
                      'toggle': false,
                      'channel_name': '',
                  });
    	$scope.initParams('channels', 'channel_id', 0);
    	
    	// init default sink
    	$scope.flumeForm.sinks.push({
    		'type': $scope.flumeConfig.sinks[0].name, // default sink
    		'sink_id': 0,
    		'params': [], // default to no params at all,
    					// it should be set when the user do something with it
                      'toggle': false,
                      'sink_name': '',
                  });
    	$scope.initParams('sinks', 'sink_id', 0);

        $scope.reloadConfig();
    };

    // run flume
    $scope.runFlume = function(conf) {
        console.log(conf);
        if (conf.status == 'down') {
            console.log('enter the data');
            Data.runflume('run', conf).then(function(data) {
                Data.toast(data);
                if(data.code == 1) {
                   // alert(data.message);
                   $scope.reloadConfig(); 
               } else {
                    // alert(data.message);
                }
            });
        }
    }

    $scope.stopFlume = function(conf) {
        console.log(conf);
        if (conf.status == 'up') {
            console.log('start to kill flume');
            Data.flumekillprocess({'filename': conf.filename}).then(function(data) {
                Data.toast(data);
                if (data.code == 1) {
                    // alert(data.message);
                    $scope.reloadConfig();
                } else {
                    // alert(data.message);
                }
            });
        }
    }

    $scope.deleteConfiguration = function(conf) {
        console.log('delete configuration');
        if (confirm('Really delete this configuration file?')) {
            if (conf.status == 'up') {
                alert('Stop it first before deleting the configuration');
            } else {
                Data.flumedeleteconfig({'filename': conf.filename}).then(function(data) {
                    Data.toast(data);
                    if (data.code == 1) {
                        // alert(data.message);
                        $scope.reloadConfig();
                    } else {
                        // alert(data.message);
                    }
                });
            }
        }
        
    }
    
    // adding source to sources
    $scope.flumeAddSource = function() {
    	var last_index = $scope.flumeForm.sources.length;
    	$scope.flumeForm.sources.push({
    		'type': 'avro',
    		'source_id': 0,
    		'params': [
    		
    		],
    		'toggle': true,
    		'source_name': '',
    	});
    	
    	// fill selected source params
    	$scope.initParams('sources', 'source_id', last_index);
    	console.log('add source event');
    };
    
    // adding channel to channels
    $scope.flumeAddChannel = function() {
    	var last_index = $scope.flumeForm.channels.length;
    	$scope.flumeForm.channels.push({
    		'type': 'memory',
    		'channel_id': 0,
    		'params': [
    		
    		],
    		'toggle': true,
    		'channel_name': '',
    	});
    	
    	// fill selected channel params
    	$scope.initParams('channels', 'channel_id', last_index);
    	console.log('add channel event');
    };
    
    // adding sink to sinks
    $scope.flumeAddSink = function() {
    	var last_index = $scope.flumeForm.sinks.length;
    	$scope.flumeForm.sinks.push({
    		'type': 'hdfs',
    		'sink_id': 0,
    		'params': [
    		
    		],
    		'toggle': true,
    		'sink_name': '',
    	});
    	
    	// fill selected channel params
    	$scope.initParams('sinks', 'sink_id', last_index);
    	console.log('add sink event');
    };
    
    // add connector
    $scope.flumeAddConnector = function() {
    	$scope.flumeForm.connectors.push({
    		'sources': []
    	});
    	console.log($scope.flumeForm.connectors);
    };
    
    // flume remove connector
    $scope.flumeRemoveConnector = function(item) {
    	$scope.flumeForm.connectors.splice(item,1);
    	
    	console.log($scope.flumeForm.connectors);
    };
    
    // function to change the flume source, given id
    $scope.flumeChangeSource = function(id) {
    	
    	// get the type
    	var source_type = $scope.flumeForm.sources[id].type; // get type
    	
    	// set right config source id
    	for (var i=0; i < $scope.flumeConfig.sources.length; i++) {
    		if ($scope.flumeConfig.sources[i].name == source_type) {
    			$scope.flumeForm.sources[id].source_id = i;
    			// re-init source params
    			$scope.initParams('sources', 'source_id', id);
    			return;
    		}
    	}
    	
    	console.log('udated id ' + id);
    };
    
    // function to change the flume channel, given id
    $scope.flumeChangeChannel = function(id) {
    	
    	// get the type
    	var channel_type = $scope.flumeForm.channels[id].type; // get type
    	
    	// set right config channel id
    	for (var i=0; i < $scope.flumeConfig.channels.length; i++) {
    		if ($scope.flumeConfig.channels[i].name == channel_type) {
    			$scope.flumeForm.channels[id].channel_id = i;
    			// re-init channel params
    			$scope.initParams('channels', 'channel_id', id);
    			return;
    		}
    	}
    	
    };
    
    // function to change the flume sink, given id
    $scope.flumeChangeSink = function(id) {
    	
    	// get the type
    	var sink_type = $scope.flumeForm.sinks[id].type; // get type
    	
    	// clear params
    	$scope.flumeForm.sinks[id].params = {};
    	
    	// set right config channel id
    	for (var i=0; i < $scope.flumeConfig.sinks.length; i++) {
    		if ($scope.flumeConfig.sinks[i].name == sink_type) {
    			$scope.flumeForm.sinks[id].sink_id = i;
    			// re-init sink params
    			$scope.initParams('sinks', 'sink_id', id);
    			return;
    		}
    	}
    	
    };

    // method to register flume config to the server
    // return error or success, based on the message
    // if something goes right, then redirect to flume home
    // else stay here.....
    $scope.registerConfig = function() {
        // everything is OK
        Data.postflumeconfig('add', $scope.flumeForm).then(function(results){
            if (results.code == 1) {
                // alert('File ' + results.message.filename + ' ' + results.message.alert);
                var msg = 'File ' + results.message.filename + ' ' + results.message.alert
                toaster.pop("success", "", msg, 3000, 'trustedHtml');
                $location.path('flume');
            } else {
                toaster.pop("error", "", msg, 3000, 'trustedHtml');
                // alert(results.message.alert);
            }
        });
    };
    
    // table toggle
    $scope.toggleTable = function(id) {
    	$scope.flumeForm.sources[id].toggle = !$scope.flumeForm.sources[id].toggle;
    };
    $scope.toggleChannelTable = function(id) {
    	$scope.flumeForm.channels[id].toggle = !$scope.flumeForm.channels[id].toggle;
    };
    $scope.toggleSinkTable = function(id) {
    	$scope.flumeForm.sinks[id].toggle = !$scope.flumeForm.sinks[id].toggle;
    };
    
    $scope.preview = function() {
    	var sor='';
    	
    	console.log($scope.flumeForm.sources);
    	
    	/*for (var i=0; i < $scope.flumeForm.sources.length; i++) {
    		sor += $scope.flumeForm.sources[i].source_name + ' ';
    	}
    	var source_statement = $scope.flumeForm.agentName + '.sources = ' + sor;*/
    	
    	$(document).ready(function() {

    		// iterator
    		var i;
    		
    		var err_params = false;
    		
    		// check agent
    		if($scope.flumeForm.agentName == '') {
    			return alert('Agent name should be filled');
    		}
    		
    		// checking source
    		var slen = $scope.flumeForm.sources.length;
    		for (i=0; i < slen; i++) {
    			if ($scope.flumeForm.sources[i].source_name=='') {
    				return alert('All Source name should be filled');
    			}
    			
    			// check params
    			$scope.flumeForm.sources[i].params.forEach(function(item, id){
    				if (item.reaquired == 'yes') {
    					if (item.name != 'channels') {
    						if (item.value == '') {
    							err_params = true;
    						}
    					}
    				}
    			});
    		}
    		
    		// checking channel
    		var clen = $scope.flumeForm.channels.length;
    		for (i=0; i < clen; i++) {
    			if ($scope.flumeForm.channels[i].channel_name=='') {
    				return alert('All Channel name should be filled');
    			}
    			
    			// check params
    			$scope.flumeForm.channels[i].params.forEach(function(item, id) {
    				if (item.required == 'yes') {
    					if (item.value == '') {
    						err_params = true;
    					}
    				}
    			});
    		}
    		
    		// checking sink
    		var sklen = $scope.flumeForm.sinks.length;
    		for (i=0; i < sklen; i++) {
    			if ($scope.flumeForm.sinks[i].sink_name=='') {
    				return alert('All sink name should be filled');
    			}
    			
    			// check params
    			$scope.flumeForm.sinks[i].params.forEach(function(item, id) {
    				if (item.required == 'yes') {
    					if (item.name != 'channel') {
    						if (item.value == '') {
    							err_params = true;
    						}
    					}
    				}
    			});
    		}
    		
    		if (err_params) {
    			return alert('Required params (*) should be filled');
    		}
    		
    		$scope.flumeForm.connectors = []; // unused var
    		
    		// use slen to iterate through source
    		
    		// it is used to check if a channel already connected to a sink.....
    		var connected_channel_sink = [];
    		
    		var bad_connected_sink = false;
    		var slen = $scope.flumeForm.sources.length;
    		var chlen = $scope.flumeForm.channels.length;
    		for (i=0; i < chlen; i++) {
    			
    			var j;
    			for(j=0; j < slen; j++) {
    				if ($('#connector_source_'+i+'_'+j).is(":checked")) {
    					// bad practice here
    					// please whoever you are, improve this code?
    					// maybe change the data structure?
    					
    					$scope.flumeForm.sources[j].params.forEach(function(item, id) {
    						if (item.name == 'channels') {
    							if ($scope.flumeForm.register_ready) {
    								item.value = ''; // reset again
    							}
    							item.value += $scope.flumeForm.channels[i].channel_name + ' ';
    						}
    					});
    				}
    				
    			}
    			
    			if (connected_channel_sink.indexOf($('#connector_sink_'+i).val()) == -1) {
    				var sink_id = $('#connector_sink_'+i).val()
					// set the value of sink channel
					$scope.flumeForm.sinks[sink_id].params.forEach(function(item, id) {
						if (item.name == 'channel') {
							item.value = $scope.flumeForm.channels[i].channel_name;
						}
					});
					connected_channel_sink.push(sink_id);
					
				} else {
					bad_connected_sink = true;
					return alert('One channel just for one sink');
				}
          }

          if (bad_connected_sink) {
             return alert('One channel just for one sink');
         }

    		// alert('Ready to register the flume config');
            toaster.pop("success", "", 'Ready to register the flume config', 3000, 'trustedHtml');
            $scope.flumeForm.register_ready = true;
        });
    	console.log(source_statement);
    	
    }
    
    //=================== Remove method for flume =================//
    $scope.removeFlumeSource = function(id) {
    	if (confirm("Really remove this source?")) {
    		$scope.flumeForm.sources.splice(id,1);
    	}
    	
    };
    
    $scope.removeFlumeChannel = function(id) {
    	if (confirm("Really remove this channel?")) {
    		$scope.flumeForm.channels.splice(id,1);
    	}
    };
    
    $scope.removeFlumeSink = function(id) {
    	if (confirm("Really remove this sink?")) {
    		$scope.flumeForm.sinks.splice(id,1);
    	}
    };
    
    
    // init flume
    $scope.flumeInit();

});

app.controller('userCtrl', function ($scope, $rootScope, $routeParams, $location, $timeout, $http, $window, Data) {
    /*$scope.currentPage = 1;
    $scope.pageSize = 8;
    $scope.user = {}
    $scope.loaduser = function(page){
        $scope.response = {};
        $scope.response.code = 2;
        Data.get('user').success(function (results) {
            $scope.response = results;
            if($scope.response.code == 1){
                $scope.status = true;
                $scope.data = $scope.response.message;
            } else {
                $scope.status = false;
                $scope.data = "Data not available";
            }
        }).error(function (results, status){
                $scope.status = false;
                $scope.data = "Data not available";
        });
    }*/

    $scope.currentPage = 1;
    $scope.pageSize = 8;
    $scope.user = {}
    $scope.loaduser = function(){
        $scope.response = {};
        $http.get(' http://192.168.1.231:3001/user/read/96f7be8fa7af5e537d165a21dcd3f7626b2a09cb4af4307d00eab41126abeb8c').
        success(function(data) {
           if(data.code == 1){
            $scope.status = true;
            $scope.data = data.message;
        } else {
            $scope.status = false;
            $scope.data = "Data not available, please check your oozie/hadoop service";
        }

    }).error(function (data, status){
        $scope.status = false;
        $scope.data = "Data not available, please check your oozie/hadoop service";
        
    });
}

$scope.AddApikey = function(uid){
  Data.postphp('apikey', {
    uid: uid,

}).then(function (results) { 
 $scope.loaduser();
 $location.path('user');
});
};

	/*$scope.AddApikey = function(uid){
        $http.post('http://192.168.1.231:3001/apikey/create/96f7be8fa7af5e537d165a21dcd3f7626b2a09cb4af4307d00eab41126abeb8c', {
            uid: uid,
        }).then(function (results) {
            Data.toast(results);
            if (results.status == "success") {
                $location.path('user');
            }
        });
    };*/

    $scope.orderByMe = function(x) {
        $scope.myOrderBy = x;
    }

    $scope.linkAdduser = function () {
        $location.path('user/add');
    }

    $scope.linkAddagent = function () {
        $location.path('flume/add');
    }

    $scope.linkCancel = function () {
        $location.path('user');
    }
    $scope.AddMember = function(){
        Data.post('user', {
            firstname: $scope.memberForm.firstname,
            lastname: $scope.memberForm.lastname,
            email: $scope.memberForm.email,
            password: $scope.memberForm.password,
            password: $scope.memberForm.role
        }).then(function (results) {
            Data.toast(results);
            if (results.status == "success") {
                $location.path('user');
            }
        });
    };

    $scope.deleteMember = function (id) {
        var deleteUser = $window.confirm('Are you absolutely sure you want to delete?');
        if(deleteUser){
            Data.delete('user/'+id).then(function (results) {
                Data.toast(results);
                $scope.loaduser();
            }); 
        }
    }

    $scope.linkEdit = function (id) {
        $location.path('user/edit/'+id);
    }

    $scope.loadEditUser = function (){
        Data.get('user/'+$routeParams.id).then(function (results) {
            if(results.data.code == 1){
                $scope.status = true;
                $scope.user = results.data.message[0]
                // alert(JSON.stringify($scope.user));
            } else {
                $scope.status = false;
                $location.path('user');
            }
        });
    }

    $scope.EditMember = function(id){
        if($scope.user.password != ''){
            $scope.update = {
              firstname: $scope.user.firstname,
              lastname: $scope.user.lastname,
              email: $scope.user.email,
              password: $scope.user.password,
              role: $scope.user.role
          }
      } else {
        $scope.update = {
         firstname: $scope.user.firstname,
         lastname: $scope.user.lastname,
         email: $scope.user.email,
         role: $scope.user.role
     }
 }

 Data.put('user/'+id, $scope.update).then(function (results) {
    var data = {status: 'success', message: 'success update data' };
    Data.toast(data);
    if (results.status == "success") {
        $location.path('user');
    }
});
};

$scope.init = function () {
   $scope.loaduser();
}

$scope.init();
});

app.controller('crawlCtrl', function ($scope, $rootScope, $routeParams, $location, $timeout, $http, $window, Data) {
	$scope.statusrunning = false;
    $scope.cekstatus = function(){
        $scope.response = {};
        Data.getcrawl('status').success(function (results) {
            $scope.response = results;
            if($scope.response.message.status == true){
                $scope.statusrunning = true;
                $scope.datastatus = $scope.response.message;
            } else {
                $scope.statusrunning = false;
            }
        });
    }

    $scope.stop = function(pid){
        $scope.response = {};
        var url = 'crawling/'+pid+'/stop'
        Data.putcrawl(url).then(function (results) {
            $scope.response = results;
            if($scope.response.code == 1){
                $scope.statusrunning = false;
            } else {
                $scope.statusrunning = true;
            }
            $scope.loadhistory();
        });
    }

    $scope.loadhistory = function(){
        $scope.response = {};
        Data.getcrawl('history').success(function (results) {
            $scope.response = results;
            $('#loadinghistory').hide();
            if($scope.response.status == "success"){
                $scope.statushistory = true;
                $scope.data = $scope.response.message;
            } else {
                $scope.statushistory = false;
                $scope.error = $scope.response.message;
            }
        }).error(function (results, status){
            $scope.statushistory = false;
            $scope.error = $scope.response.message;
        });
    }

    $scope.crawlForm = {}	
    $scope.crawlForm.seedid = '';
    $scope.crawlForm.url = '';
    $scope.AddCrawl = function(){
      if($scope.crawlForm.url === '' || $scope.crawlForm.seedid === ''){
         alert('error');
         return;
     } 

     if($scope.crawlForm.seedid.seedid === undefined){
        var seedid = $scope.crawlForm.seedid;
    } else {
        var seedid = $scope.crawlForm.seedid.seedid;
    }

    var urlsstring = $scope.crawlForm.url + '';
    var urls = urlsstring.split('\n');

    Data.postcrawl('crawling', {
        seedid: seedid,
        url: urls

    }).then(function (results) {

        if (results.code == "1") {
            alert('crawl is runing');
				// $scope.cekstatus();
				$scope.loadhistory();
                $scope.loadseedid();
            } else {
                alert('error');
            }
        });
};

$scope.crawling = {}
$scope.loadcrawling= function(){
    $scope.response = {};
    $scope.response.code = 2;
    Data.getcrawl('crawling/70/[a-z]*').success(function (results) {
        $scope.response = results;
        if($scope.response.code == 1){
            $scope.statuscrawl = true;
            $scope.data1 = $scope.response.message;

            angular.forEach( $scope.data1, function(obj){
             obj["link"] = '#/search?q='+obj["text"];
             $scope.obj = $scope.data1;

         })

            $("#result_cloud").html('');
            $("#result_cloud").jQCloud($scope.data1);
        } else {
            $scope.statuscrawl = false;
            $("#result_cloud").html('<span style="color:#666">Data not available</span>');
        }
    }).error(function (results, status){
        $scope.statuscrawl = false;
        $("#result_cloud").html('<span style="color:#666">Data not available</span>');
    });
}

$scope.seeds = {};
$scope.loadseedid = function(){
    Data.getcrawl('seedid').success(function (results) {
        if(results.code == 1){
            $scope.seeds = results.message;
        }
    });
}

$scope.setSeeds = function(item){
    $scope.crawlForm.url = item.urls;
}

$scope.init = function () {
  $scope.cekstatus();
  $scope.loadcrawling();
  $scope.loadhistory();
  $scope.loadseedid();

  setInterval(function(){ 
     $scope.loadcrawling();
     $scope.loadhistory();

 }, 300000);
}

$scope.init();

});

app.controller('searchCtrl', function ($scope, $rootScope, $routeParams, $location, $timeout, $http, $window, $log, Data) {
	$scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.post = {};
    $scope.search = function(search, page){
        $scope.response = {};
        start = (page-1)*10;
        var urlsearch = 'searching/'+search+'/text/'+start+'/100'
        Data.getcrawl(urlsearch).success(function (results) {
            $scope.response = results;
            if($scope.response.status == "success"){
                $scope.statussearch = true;
                $scope.datasearch = $scope.response.message.docs;
                $scope.numFound = $scope.response.message.numFound;
                $scope.start = $scope.response.message.start;
                /*alert(JSON.stringify($scope.datasearch));*/

            } else {
                $scope.statussearch = false;
                $scope.datasearch = $scope.response.message;
            } 

        });
    }

    $scope.pageChanged = function() {
        $log.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.limitword = function(word){
        var wordlimit = word.replace(/^(.{150}[^\s]*).*/, "$1");
        return wordlimit;
    }

    $scope.doGET = function (name,url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    $scope.changePage = function (){
        var id = $location.path().split("/");
        if(id[1]==''){
            id[1]='dashboard';
        }
        $( 'li' ).removeClass( 'active' )
        $( '#menu-'+id[1] ).addClass( 'active' )
    }

    $scope.init = function () {
        $scope.changePage();
        $scope.post.search = $scope.doGET('q');
        $scope.search($scope.post.search,1);
    }

    $scope.init();

});

app.controller('imageCtrl', function ($scope, $rootScope, $routeParams, $location, $timeout, $http, $window, $log, Data) {
	$scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.post = {};
    $scope.image = function(search, page){
        $scope.response = {};
        start = (page-1)*10;
        var urlimage = 'searching/'+search+'/image/'+start+'/100'
        /*var urlimage = 'searching/detik/image/0/10'*/
        Data.getcrawl(urlimage).success(function (results) {
            $scope.response = results;
            if($scope.response.status == "success"){
                $scope.statusimage = true;
                $scope.dataimage = $scope.response.message.docs;
                $scope.numFound = $scope.response.message.numFound;
                $scope.start = $scope.response.message.start;
                /*alert(JSON.stringify($scope.dataimage));*/

            } else {
                $scope.statusimage = false;
                $scope.dataimage = $scope.response.message;
            } 

        });
    }

    $scope.doGET = function (name,url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    $scope.changePage = function (){
        var id = $location.path().split("/");
        if(id[1]==''){
            id[1]='dashboard';
        }
        $( 'li' ).removeClass( 'active' )
        $( '#menu-'+id[1] ).addClass( 'active' )
    }

    $scope.init = function () {
        $scope.changePage();
        $scope.post.image = $scope.doGET('q');
        $scope.image($scope.post.image,1);
    }

    $scope.init();

});

app.controller('ozieeCtrl', function ($scope, $http ) {
	$scope.oziee = function(){
        $scope.response = {};
        $http.get('http://192.168.1.231:3001/oozie/listjob/96f7be8fa7af5e537d165a21dcd3f7626b2a09cb4af4307d00eab41126abeb8c/').
        success(function(dataoziee) {
           if(dataoziee.code == 1){
            $scope.statusoziee = true;
            $scope.dataoziee = dataoziee.message;
        } else {
            $scope.statusoziee = false;
            $scope.dataoziee = "Data not available, please check your oozie/hadoop service";
        }

    }).error(function (data, status){
        $scope.statusoziee = false;
        $scope.dataoziee = "Data not available, please check your oozie/hadoop service";
        
    });
}

$scope.init = function () {
   $scope.oziee();
}
$scope.init();
});

app.controller('jobCtrl', function ($scope, $modal, $log, $http, Data){
	$scope.AddJob = function(){
		Data.postphp('job', {
			workflowPath:  $scope.memberJob.cluster,
			namajar: $scope.memberJob.package,
			namaclass: $scope.memberJob.className,
			args: $scope.memberJob.parameter

		}).then(function (results) { 
			console.log(results);
			alert(JSON.stringify(results.message.jobid));
		});
	};

    $scope.reset = function() {
      $scope.memberJob.package = '';
      $scope.memberJob.className = '';
      $scope.memberJob.radio = '';
      $scope.memberJob.iventory = '';
      $scope.memberJob.parameter = '';
      $scope.memberJob.cluster = '';
		// Todo: Reset field to pristine state, its initial state!
	}; 
	
    $scope.choices = [{id:'memberJob1', itemNo:1},{id:'memberJob2', itemNo:2}];
    $scope.addNewChoice = function() 
    {
      var newItemNo = $scope.choices.length+1;
      console.log('addNewChoice number = '+newItemNo);
      $scope.choices.push({'id':'memberJob'+newItemNo, itemNo:newItemNo});
  };

  $scope.setArgs = function () 
  {
     $(document).ready(function() 
     {
       var arr_param = document.getElementsByClassName('member-job');
       var args = "";
       var arr_param_isset = [];
       for(var i=0; i < arr_param.length; i++)
       {
          if($(arr_param[i]).val() !== "" && $(arr_param[i]).val() !== '')
          {
             arr_param_isset.push($(arr_param[i]).val());
         }
     }

     if(arr_param_isset.length > 0)
     {
      if(arr_param_isset.length === 1)
      {
        args += arr_param_isset[0];
    }
    else if(arr_param_isset.length > 1)
    {
        arr_param_isset.forEach(function(param, j)
        {
									if(j === arr_param_isset.length-1) // last index isset
									{
										args += param;
									}
									else
									{
										args += param+" </arg> <arg>";
									}
								})
    }
}

$scope.memberJob.args = args;
console.log('args = '+args);
$('#id-args').val(args);
})
 }

 $scope.removeChoice = function() {
     var lastItem = $scope.choices.length-1;
     $scope.choices.splice(lastItem);
 };

});

app.controller('uploadCtrl', ['$scope', 'FileUploader', function($scope, FileUploader) {
    var uploader = $scope.uploader = new FileUploader({
        url: 'upload.php'
    });

    uploader.filters.push({
        name: 'customFilter',
        fn: function(item , options) {
            return this.queue.length < 10;
        }
    });


    uploader.onWhenAddingFileFailed = function(item, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };

    console.info('uploader', uploader);
}]);
