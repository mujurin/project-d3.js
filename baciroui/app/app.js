var app = angular.module('dasboard', ['ngRoute', 'ngAnimate', 'toaster','angularUtils.directives.dirPagination','ui.bootstrap','angularFileUpload','ngCookies']);

app.config(['$routeProvider',
  function ($routeProvider) {
        $routeProvider.
        when('/dashboard', {
            title: 'Login',
            templateUrl: 'partials/dashboard.html'
        })
            .when('/', {
                title: 'Dashboard',
                templateUrl: 'partials/dashboard.html',
                role: '0'
            })
            .when('/user', {
                title: 'User',
                templateUrl: 'partials/user.html',
                reloadOnSearch: false,
                role: '0'
            })
            .when('/user/add', {
                title: 'User',
                templateUrl: 'partials/adduser.html',
                role: '0'
            })
            .when('/user/edit/:id', {
                title: 'User',
                templateUrl: 'partials/edituser.html',
                resolve: {
                    userID: function ($route) {
                        return $route.current.params.id;
                    }
                },
                role: '0'
            })
            .when('/configuration', {
                title: 'User',
                templateUrl: 'partials/configuration.html',
                role: '0'
            })
			.when('/submitJob', {
                title: 'User',
                templateUrl: 'partials/submitJob.html',
                role: '0'
            })
            .when('/activity', {
                title: 'User',
                templateUrl: 'partials/activity.html',
                role: '0'
            })
            .when('/history', {
                title: 'User',
                templateUrl: 'partials/history.html',
                role: '0'
            })
            .when('/crawl', {
                title: 'User',
                templateUrl: 'partials/crawl.html',
                role: '0'
            })
            .when('/search', {
                title: 'Search',
                templateUrl: 'partials/search.html',
                role: '0'
            })
            .when('/data', {
                title: 'Data',
                templateUrl: 'partials/data.html',
                role: '0'
            })
            .when('/d3js', {
                title: 'Data',
                templateUrl: 'partials/d3js.html',
                role: '0'
            })
            .when('/postData', {
                title: 'postData',
                templateUrl: 'partials/post.php',
                role: '0'
            })
            .when('/flume', {
                title: 'Flume',
                templateUrl: 'partials/flume.html',
                role: '0'
            })
            .when('/flume/add', {
                title: 'User',
                templateUrl: 'partials/addagent.html',
                role: '0'
            })

			.when('/image', {
                title: 'Image',
                templateUrl: 'partials/image.html',
                role: '0'
            })
            .otherwise({
                redirectTo: '/error404'
            });
  }])
    .run(function ($rootScope, $location, Data, $cookieStore) {

        var auth = $cookieStore.get('user_auth');

        if (!!auth == false) {
            //window.location = "login.html";
        } else {
            $rootScope.auth = auth;
        }

        // not used anymore
        // $rootScope.$on("$routeChangeStart", function (event, next, current) {
        //     $rootScope.auth = {};
        //     $rootScope.auth.authenticated = false;
        //     Data.getphp('session').then(function (results) {
        //         //alert(JSON.stringify(results, null, 4));
        //         if (results.uid) {
        //             $rootScope.auth.authenticated = true;
        //             $rootScope.auth.uid = results.uid;
        //             $rootScope.auth.name = results.name;
        //             $rootScope.auth.email = results.email;
        //         } else {
        //             window.location = "login.html";
        //         }
        //     });
        // });
    });