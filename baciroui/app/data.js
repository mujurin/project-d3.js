app.factory("Data", ['$http', 'toaster',
    function ($http, toaster) { // This service connects to our REST API

    	// THIS IS FOR TESTING ONLY
    	var serviceFlume = 'http://192.168.1.910:3000/flume/';
    	var serviceData = 'http://192.168.1.91:3000/ingestion/';
    	var serviceSolr = 'http://192.168.1.91:8983/solr/';

        var phpUrl = 'api/v1/';
        //var serviceBase = 'http://192.168.1.148:3001/'; //http://192.168.1.231:3001/oozie/listjob/
		var serviceOziee = 'http://192.168.1.231:3001/';
        var serviceBase = 'api/v1/';
		var servicecrawl = 'http://192.168.1.170:3001/';
		var servicebaciro = 'http://192.168.1.225:3001/';
		var servicehistory = serviceOziee;
        var config_post = {
                headers : {
                    'key': '96f7be8fa7af5e537d165a21dcd3f7626b2a09cb4af4307d00eab41126abeb8c',
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                }
            }

        var config_get = {
                headers : {
                    'key': '96f7be8fa7af5e537d165a21dcd3f7626b2a09cb4af4307d00eab41126abeb8c',
              }
            }

        var obj = {};
        obj.toast = function (data) {
            toaster.pop(data.status, "", data.message, 3000, 'trustedHtml');
        }
        obj.get = function (q) {
            return $http.get(serviceBase + q, config_get).success(function (results) {
                return results.data;
            });
        };
        obj.getphp = function (q) {
            return $http.get(phpUrl + q, config_get).then(function (results) {
                return results.data;
            });
        };
        obj.postphp = function (q, object) {
            return $http.post(phpUrl + q, object, config_post).then(function (results) {
                return results.data;
            });
        };
        obj.post = function (q, object) {
            return $http.post(serviceBase + q, object, config_post).then(function (results) {
                return results.data;
            });
        };
        obj.put = function (q, object, config) {
            return $http.put(serviceBase + q, object, config_post).then(function (results) {
                return results.data;
            });
        };
        obj.delete = function (q, config) {
            return $http.delete(serviceBase + q, config_post).then(function (results) {
                return results.data;
            });
        };
		
		obj.putcrawl = function (q, object, config) {
            return $http.put(servicecrawl + q, object, config_post).then(function (results) {
                return results.data;
            });
        };

		obj.getcrawl = function (q) {
            return $http.get(servicecrawl + q, config_get).success(function (results) {
                return results.data;
            });
        };
		
		obj.postcrawl = function (q, object) {
            return $http.post(servicecrawl + q, object, config_post).then(function (results) {
                return results.data;
            });
        };
		
		obj.postoziee = function (q, object) {
            return $http.post(serviceOziee + q, object, config_post).then(function (results) {
                return results.data;
            });
        };
		
		obj.getoziee = function (q) {
            return $http.get(serviceOziee + q, config_get).success(function (results) {
                return results.data;
            });
        };

        obj.checkozie = function(q) {
        	
        	return $http.get(serviceOziee + q).then(function (results) {
                return results.data;
            });
        }

        obj.getbaciro = function(q) {
        	return $http.get(servicebaciro + q).then(function (results) {
                return results.data;
            });
        }

        obj.getjobhistory = function(q) {
        	return $http.get(servicehistory + q).then(function (results) {
                return results.data;
            });
        }

        // method to deal with flume
        obj.postflumeconfig = function(q, object) {
        	return $http.post(serviceFlume + q, object, config_post).then(function(results){
        		return results.data;
        	});
        };

        obj.getflumeconfig = function(q) {
        	return $http.get(serviceFlume + q, config_get).then(function(results) {
        		return results.data;
        	});
        };

        obj.login = function(q, credential) {
        	return $http.post(servicebaciro + q, credential)
        	.then(function(results) {
        		return results.data;
        	}).catch(function(err, code) {
        		return err.data;
        	});
        };

        obj.runflume = function(q, object) {
        	return $http.post(serviceFlume + q, object, config_post).then(function(results){
        		return results.data;
        	});
        }

        obj.flumekillprocess = function(object) {
        	return $http.post(serviceFlume + 'kill', object, config_post).then(function(results) {
        		return results.data;
        	});
        }

        obj.flumedeleteconfig = function(object) {
        	return $http.post(serviceFlume + 'delete_config', object, config_post).then(function(results) {
        		return results.data;
        	});
        }

        obj.ingestionget = function(q) {
        	return $http.get(serviceData + q, config_get).then(function(result) {
        		return result.data;
        	});
        }

        obj.ingestionpost = function(q, object) {
        	return $http.post(serviceData + q, object, config_post).then(function(results) {
        		return results.data;
        	});
        }
        obj.solrget = function(q){
        	return $http.get(serviceSolr + q).then(function(res) {
        		return res.data;
        	});
        };

        return obj;
}]);

app.factory('dataConfiguration', function() {
	
	// configuration data for flume
	
	return {
    		'fileType': [
    			{
    				'name': 'csv',
    				'params':[]
    			},
				{ 
					"name": "txt",
    				'params':[]

				},
				{ 
					"name": "json",
    				'params':[]

				},
				{ 
					"name": "xml",
    				'params':[]
					
				},
    		],
    	};
});

app.factory('flumeConfiguration', function() {
	
	// configuration data for flume
	
	return {
    		'sources': [
    			{
    				'name': 'avro',
    				'params': [	
    					{"name":"channels", "value":"", "required":"yes"},
						{"name":"type", "value": "avro", "required":"yes"},
						{"name":"bind", "value":"", "required": ""},
						{"name":"port", "value": "", "required":"yes"},
						{"name":"threads", "value": "", "required":"no"},
						{"name":"threads", "value": "", "required":"no"},
						{"name":"selector.type", "value": "", "required":"no"},
						{"name":"interceptors", "value": "", "required":"no"},
						{"name":"compression-type", "value": "", "required":"no"},
						{"name":"ssl", "value": "", "required":"no"},
						{"name":"keystore", "value": "", "required":"no"},
						{"name":"keystore-password", "value": "", "required":"no"},
						{"name":"keystore-type", "value": "", "required":"no"},
						{"name":"exclude-protocols", "value": "", "required":"no"},
						{"name":"ipFilter", "value": "", "required":"no"},
						{"name":"ipFilterRules", "value": "", "required":"no"}
					]
				},
				{ 
					"name": "thrift",
				 	"params":[	
				 		{"name":"channels", "value":"", "required":"yes"},
						{"name":"type", "value": "thrift", "required":"yes"},
						{"name":"bind", "value":"", "required": ""},
						{"name":"port", "value": "", "required":"yes"},
						{"name":"threads", "value": "", "required":"no"},
						{"name":"selector.type", "value": "", "required":"no"},
						{"name":"interceptors", "value": "", "required":"no"},
						{"name":"ssl", "value": "", "required":"no"},
						{"name":"keystore", "value": "", "required":"no"},
						{"name":"keystore-password", "value": "", "required":"no"},
						{"name":"keystore-type", "value": "", "required":"no"},
						{"name":"exclude-protocols", "value": "", "required":"no"},
						{"name":"kerberos", "value": "", "required":"no"},
						{"name":"agent-principal", "value": "", "required":"no"},
						{"name":"agent-keytab", "value": "", "required":"no"}	
					]
				},
				{ 
					"name": "com.cloudera.flume.source.TwitterSource",
				 	"params":[	
				 		{"name":"channels", "value":"", "required":"yes"},
						{"name":"type", "value": "com.cloudera.flume.source.TwitterSource", "required":"yes"},
						{"name":"consumerKey", "value":"", "required": "yes"},
						{"name":"consumerSecret", "value": "", "required":"yes"},
						{"name":"accessToken", "value": "", "required":"yes"},
						{"name":"accessTokenSecret", "value": "", "required":"yes"},
						{"name":"keywords", "value": "", "required":"yes"},	
					]
				},
				{ 
					"name": "exec",
				 	"params":[	
				 		{"name":"channels", "value":"", "required":"yes"},
						{"name":"type", "value": "exec", "required":"yes"},
						{"name":"command", "value":"", "required": "yes"},
						{"name":"shell", "value": "", "required":"no"},
						{"name":"restartThrottle", "value": "", "required":"no"},
						{"name":"restart", "value": "", "required":"no"},
						{"name":"logStdErr", "value": "", "required":"no"},
						{"name":"batchSize", "value": "", "required":"no"},
						{"name":"batchTimeout", "value": "", "required":"no"},
						{"name":"selector.type", "value": "", "required":"no"},
						{"name":"interceptors", "value": "", "required":"no"},	
					]
				},
				{ 
					"name": "netcat",
				 	"params":[	
				 		{"name":"channels", "value":"", "required":"yes"},
						{"name":"type", "value": "netcat", "required":"yes"},
						{"name":"bind", "value":"", "required": "yes"},
						{"name":"port", "value": "", "required":"yes"},
						{"name":"max-line-length", "value": "", "required":"no"},
						{"name":"ack-every-event", "value": "", "required":"no"},						 
					]
				},
				{ 
					"name": "spooldir",
				 	"params":[	
				 		{"name":"channels", "value":"", "required":"yes"},
						{"name":"type", "value": "spooldir", "required":"yes"},
						{"name":"spoolDir", "value":"", "required": "yes"},
						{"name":"fileSuffix", "value": "", "required":"no"},
						{"name":"deletePolicy", "value": "", "required":"no"},
						{"name":"destinationName", "value": "", "required":"yes"},
						{"name":"destinationType", "value": "", "required":"yes"},
						{"name":"userName", "value": "", "required":"no"},
						{"name":"passwordFile", "value": "", "required":"no"},
						{"name":"batchSize", "value": "", "required":"no"},
						{"name":"converter.type", "value": "", "required":"no"},
						{"name":"converter.charset", "value": "", "required":"no"}, 
					]
				},
				{ 
					"name": "jms",
				 	"params":[	
				 		{"name":"channels", "value":"", "required":"yes"},
						{"name":"type", "value": "jms", "required":"yes"},
						{"name":"initialContextFactory", "value":"", "required": "yes"},
						{"name":"connectionFactory", "value": "", "required":"yes"},
						{"name":"providerURL", "value": "", "required":"yes"},
						{"name":"destinationName", "value": "", "required":"yes"},
						{"name":"destinationType", "value": "", "required":"yes"},
						{"name":"messageSelector", "value": "", "required":"no"},
						{"name":"userName", "value": "", "required":"no"},
						{"name":"passwordFile", "value": "", "required":"no"},
						{"name":"batchFile", "value": "100", "required":"no"},
						{"name":"converter.type", "value": "", "required":"no"},
						{"name":"converter.charset", "value": "", "required":"no"}, 
					]
				},
				{ 
					"name": "org.apache.flume.source.kafka.KafkaSource",
				 	"params":[	
				 		{"name":"channels", "value":"", "required":"yes"},
						{"name":"type", "value": "org.apache.flume.source.kafka.KafkaSource", "required":"yes"},
						{"name":"zookeeperConnect", "value":"", "required": "yes"},
						{"name":"groupId", "value": "", "required":"yes"},
						{"name":"topic", "value": "", "required":"yes"},
						{"name":"batchSize", "value": "", "required":"no"},
						{"name":"batchDurationMillis", "value": "", "required":"no"},
						{"name":"backoffSleepIncrement", "value": "", "required":"no"},
						{"name":"maxBackoffSleep", "value": "", "required":"no"}, 
					]
				},
				{ 
					"name": "seq",
				 	"params":[	
				 		{"name":"channels", "value":"", "required":"yes"},
						{"name":"type", "value": "seq", "required":"yes"},
						{"name":"selector.type", "value":"", "required": "no"},
						{"name":"interceptors", "value": "", "required":"no"},
						{"name":"batchSize", "value": "", "required":"no"},
					]
				},
				{ 
					"name": "http",
				 	"params":[	
				 		{"name":"channels", "value":"", "required":"yes"},
						{"name":"type", "value": "http", "required":"yes"},
						{"name":"port", "value":"", "required": "yes"},
						{"name":"handler", "value": "", "required":"no"},
						{"name":"bind", "value": "", "required":"no"},
						 
					]
				},
    		],
    		
    		'channels': [
    			{ 
    				"name": "memory",
		  			"params":[	
		  				{"name":"type", "value":"memory", "required":"yes"},
						{"name":"capacity", "value": "", "required":"no"},
						{"name":"transactionCapacity", "value":"", "required": "no"},
						{"name":"keep-alive", "value": "", "required":"no"},
						{"name":"byteCapacityBufferPercentage", "value": "", "required":"no"},
						{"name":"byteCapacity", "value": "", "required":"no"}, 
					]
				},
				{ 
					"name": "jdbc",
		  			"params":[	
		  				{"name":"type", "value":"jdbc", "required":"yes"},
						{"name":"db.type", "value": "", "required":"no"},
						{"name":"driver.class", "value": "", "required":"no"},
						{"name":"driver.url", "value": "", "required":"no"},
						{"name":"db.username", "value": "", "required":"no"},
						{"name":"db.password", "value": "", "required":"no"},
						{"name":"connection.properties.file", "value": "", "required":"no"},
						{"name":"create.schema", "value": "", "required":"no"},
						{"name":"create.index", "value": "", "required":"no"},
						{"name":"create.foreignkey", "value": "", "required":"no"},
						{"name":"transaction.isolation", "value": "", "required":"no"},
						{"name":"maximum.connections", "value": "", "required":"no"},
						{"name":"maximum.capacity", "value": "", "required":"no"},
						{"name":"sysprop.*", "value": "", "required":"no"},
						{"name":"sysprop.user.home", "value": "", "required":"no"},	
					]
				},
				{ 
					"name": "org.apache.flume.channel.kafka.KafkaChannel",
		  			"params":[	
		  				{"name":"type", "value":"org.apache.flume.channel.kafka.KafkaChannel", "required":"yes"},
						{"name":"brokerList", "value": "", "required":"yes"},
						{"name":"zookeeperConnect", "value": "", "required":"yes"},
						{"name":"topic", "value": "", "required":"no"},
						{"name":"groupId", "value": "", "required":"no"},
						{"name":"parseAsFlumeEvent", "value": "", "required":"no"},
						{"name":"readSmallestOffset", "value": "", "required":"no"},	
					]
				},
				{ 
					"name": "file",
		  			"params":[	
		  				{"name":"type", "value":"file", "required":"yes"},
						{"name":"checkpointDir", "value": "", "required":"no"},
						{"name":"useDualCheckpoints", "value": "", "required":"no"},
						{"name":"backupCheckpointDir", "value": "", "required":"no"},
						{"name":"dataDirs", "value": "", "required":"no"},
						{"name":"transactionCapacity", "value": "", "required":"no"},
						{"name":"checkpointInterval", "value": "", "required":"no"},	
					]
				},
    		],
    		
    		'sinks': [
    			{ 
    				"name": "hdfs",
		  			"params":[	
		  				{"name":"channel", "value":"", "required":"yes"},
						{"name":"type", "value": "hdfs", "required":"yes"},
						{"name":"hdfs.path", "value":"hdfs://", "required": "yes"},
						{"name":"hdfs.filePrefix", "value": "", "required":"no"},
						{"name":"hdfs.fileSuffix", "value": "", "required":"no"},
						{"name":"hdfs.inUsePrefix", "value": "", "required":"no"},
						{"name":"hdfs.inUseSuffix", "value": "", "required":"no"},
						{"name":"hdfs.rollInterval", "value": "", "required":"no"},
						{"name":"hdfs.rollSize", "value": "", "required":"no"},
						{"name":"hdfs.rollCount", "value": "", "required":"no"},
						{"name":"hdfs.idleTimeout", "value": "", "required":"no"},
						{"name":"hdfs.batchSize", "value": "", "required":"no"},
						{"name":"hdfs.codeC", "value": "", "required":"no"},
						{"name":"hdfs.fileType", "value": "", "required":"no"},
						{"name":"hdfs.maxOpenFiles", "value": "", "required":"no"},
						{"name":"hdfs.minBlockReplicas", "value": "", "required":"no"},
						{"name":"hdfs.callTimeout", "value": "", "required":"no"},
						{"name":"hdfs.threadsPoolSize", "value": "", "required":"no"},
						{"name":"hdfs.rollTimerPoolSize", "value": "", "required":"no"},
						{"name":"hdfs.kerberosPrincipal", "value": "", "required":"no"},
						{"name":"hdfs.kerberosKeytab", "value": "", "required":"no"},
						{"name":"hdfs.proxyUser", "value": "", "required":"no"},
						{"name":"hdfs.round", "value": "", "required":"no"},
						{"name":"hdfs.roundValue", "value": "", "required":"no"},
						{"name":"hdfs.roundUnit", "value": "", "required":"no"},
						{"name":"hdfs.timeZone", "value": "", "required":"no"},
						{"name":"hdfs.useLocalTimeStamp", "value": "", "required":"no"},
						{"name":"hdfs.closeTries", "value": "", "required":"no"},
						{"name":"hdfs.retryInterval", "value": "", "required":"no"},
						{"name":"serializer", "value": "", "required":"no"},
						{"name":"serializer.*", "value": "", "required":"no"}, ]
				},
				{ 
					"name": "logger",
		  			"params":[	
		  				{"name":"channel", "value":"", "required":"yes"},
						{"name":"type", "value": "logger", "required":"yes"},
						{"name":"maxBytesToLog", "value":"", "required": "no"}, 
					]
				},
				{ 
					"name": "irc",
		  			"params":[	
		  				{"name":"channel", "value":"", "required":"yes"},
						{"name":"type", "value": "irc", "required":"yes"},
						{"name":"hostname", "value":"", "required": "yes"},
						{"name":"port", "value":"", "required": "no"},
						{"name":"nick", "value":"", "required": "yes"},
						{"name":"user", "value":"", "required": "no"},
						{"name":"password", "value":"", "required": "no"},
						{"name":"chan", "value":"", "required": "yes"}, 
					]
				},
				{ 
					"name": "null",
		  			"params":[	
		  				{"name":"channel", "value":"", "required":"yes"},
						{"name":"type", "value": "null", "required":"yes"},
						{"name":"batchSize", "value": "", "required":"no"}, 
					]
				},
				{ 
					"name": "hbase",
		  			"params":[	
		  				{"name":"channel", "value":"", "required":"yes"},
						{"name":"type", "value": "hbase", "required":"yes"},
						{"name":"table", "value": "", "required":"yes"},
						{"name":"columnFamily", "value": "", "required":"yes"},
						{"name":"zookeeperQuorum", "value": "", "required":"no"},
						{"name":"znodeParent", "value": "", "required":"no"},
						{"name":"batchSize", "value": "", "required":"no"}, 
					]
				},
				{ 
					"name": "org.apache.flume.sink.solr.morphline.MorphlineSolrSink",
		  			"params":[	
		  				{"name":"channel", "value":"", "required":"yes"},
						{"name":"type", "value": "org.apache.flume.sink.solr.morphline.MorphlineSolrSink", "required":"yes"},
						{"name":"morphlineFile", "value": "", "required":"yes"},
						{"name":"morphlineId", "value": "", "required":"no"},
						{"name":"batchSize", "value": "", "required":"no"},
						{"name":"batchDurationMillis", "value": "", "required":"no"},
						{"name":"handlerClass", "value": "", "required":"no"}, 
					]
				},
				
    		]
    	};
});
