var RegisterForm = angular.module("RegisterForm",[]);

RegisterForm.controller("RegisterCtrl",function($scope,$http){

	$scope.memberForm = {};
	var config = {
                headers : {
                    'key': '96f7be8fa7af5e537d165a21dcd3f7626b2a09cb4af4307d00eab41126abeb8c',
                    'Content-Type': 'application/json'
                }
            }
	// var serviceBase = 'http://192.168.1.177:3001/';
	var serviceBase = 'api/v1/';
    
	$scope.RegisterMember = function(){
		// alert(JSON.stringify($scope.memberForm.firstname));
		// return;
		$http.post(
			serviceBase + 'user',
			{
				firstname: $scope.memberForm.firstname,
	            lastname: $scope.memberForm.lastname,
	            email: $scope.memberForm.email,
	            password: $scope.memberForm.password,
	            role: 'operator'
			},
			config
		).success(function(data){
			window.location = "login.html?q=reg";
		}).error(function(data){
			alert(data.message);
		});
	};
	
});
