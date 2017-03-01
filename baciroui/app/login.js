var app = angular.module("LoginForm",['ngRoute', 'ngAnimate', 'toaster', 'ngCookies']);

// app.config(['$httpProvider', function($httpProvider) {
//     // add key
//     $httpProvider.defaults.headers.common['key'] = '96f7be8fa7af5e537d165a21dcd3f7626b2a09cb4af4307d00eab41126abeb8c';
// }]);



app.controller("LoginCtrl",function($scope, $rootScope, $routeParams, $location, $http, $timeout, toaster, Data, $cookieStore){

	$scope.loginForm = {};
    $scope.baciroStatus = {};

	$scope.doLogin = function (data) {
        
        Data.login('user/read/96f7be8fa7af5e537d165a21dcd3f7626b2a09cb4af4307d00eab41126abeb8c',
        {
            email: data.email,
            password: data.password,
        }).then(function(result) {
            
            console.log(result);
            Data.toast(result);

            if (result.status == "success") {
                // set cookie here
                var user_auth = {
                    'firstname': result.message.firstname,
                    'lastname': result.message.lastname,
                    'name': result.message.firstname + ' ' + result.message.lastname,
                    'email': result.message.email,
                    'authenticated': true
                }
                $cookieStore.put('user_auth', user_auth);

                window.location = "index.html";
            }
        }).catch(function(result) {
            
        });
        
    };

    $scope.checkService = function() {

        toaster.pop({
            type: 'info', 
            title: 'Check service started', 
            body: 'Please wait.....',
            timeout: 5000,
            toasterId: 1,
        });

        Data.getbaciro('user/read/96f7be8fa7af5e537d165a21dcd3f7626b2a09cb4af4307d00eab41126abeb8c').then(function(results) {
            console.log(results);
            if (results.code == 1) {
                $scope.baciroStatus.baciro = true;
            } else {
                $scope.baciroStatus.baciro = false;
            }
        });

        Data.checkozie('oozie/listjob/96f7be8fa7af5e537d165a21dcd3f7626b2a09cb4af4307d00eab41126abeb8c').then(function(results) {
            console.log(results);
            if (results.code == 1) {
                $scope.baciroStatus.oziee = true;
            } else {
                $scope.baciroStatus.oziee = false;
            }
        });

        Data.getjobhistory('historyserver/96f7be8fa7af5e537d165a21dcd3f7626b2a09cb4af4307d00eab41126abeb8c/info/').then(function(results) {
            console.log(results);
            if (results.code == 1) {
                $scope.baciroStatus.history = true;
            } else {
                $scope.baciroStatus.history = false;
            }
        });
    };
	
	/*$scope.doLogin = function(){
		Data.postphp('login', {
			email:  $scope.loginForm.email,
			password: $scope.loginForm.password

		}).then(function (results) { 
			Data.toast(results);
			if (results.status == "success") {
				alert(JSON.stringify(results.message.apikey));
                window.location.href = "/baciroui/#/";
            }
			console.log(results);
			alert(JSON.stringify(results.message.apikey));
		});
	};*/

    $scope.doToast = function () {
        var q = $scope.doGET('q'); 
        if(q=="reg"){
            $scope.data = {status:'error', message:'tessss'};
            Data.toast($scope.data);
            alert('Register Success');
        } 
    };

    $scope.doGET = function (q,s) {
            s = (s) ? s : window.location.search;
            var re = new RegExp('&amp;'+q+'=([^&amp;]*)','i');
            return (s=s.replace(/^\?/,'&amp;').match(re)) ?s=s[1] :s='';
    };

    $scope.init = function () {
        $timeout(function() {
            var q = $scope.doGET('q');
            if(q=="reg"){
                $scope.data = {status:'success', message:'Register Success'};
                Data.toast($scope.data);
            }
        }, 1000);

        $scope.checkService();
    }
    $scope.init();
	
});

app.run(['$http', '$cookieStore', function($http, $cookieStore) {
    var auth = $cookieStore.get('user_auth');
    console.log('run ');

    if (!!auth == true) {
        window.location = "index.html";
    }       
}]);