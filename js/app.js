var app = angular.module("clinicApp", ["firebase", "ngRoute"]);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/patient/:patientId', {
            templateUrl: 'partials/patient-view.html',
            controller: 'PatientViewCtrl'
    })
    .when('/patients/create', {
            templateUrl: 'partials/patient-create.html',
            controller: 'PatientCreateCtrl'
    })
    .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'
    })
    .otherwise({
        redirectTo: '/login'
    });

    // configure html5 to get links working on jsfiddle
    //$locationProvider.html5Mode(true);
});

app.run(function($location, $rootScope, Auth, AuthData) {
    $rootScope.authData = AuthData;
    $rootScope.$on('$locationChangeStart', function(event, newUrl) {
        if (newUrl.indexOf("login") > -1 || Auth.$getAuth()) {
            $rootScope.auth = Auth;
            console.log(Auth.$getAuth());
            //Todo OK
        } else {
            console.log("Forbidden! log required!");
            event.preventDefault();
            $location.path("/login");
        }
    });
    
});