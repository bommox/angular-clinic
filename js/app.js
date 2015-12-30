var app = angular.module("clinicApp", ["firebase", "ngRoute"]);

app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

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
    .otherwise({
        redirectTo: '/patients/create'
    });

    // configure html5 to get links working on jsfiddle
    //$locationProvider.html5Mode(true);
});

app.factory('toast', function($window) {
    return function(msg, time) {
        time = time || 3000;
        $window.Materialize.toast(msg, time);
    };
});

app.controller('PatientListCtrl', function ($scope, $firebaseArray) {
  
  var ref = new Firebase("https://angularclinic.firebaseio.com/patients");
  // download the data into a local object
  $scope.patients = $firebaseArray(ref);
  $scope.daysToBirthday = function(date) {
    if (date === undefined) 
        return 999;
    var today = new Date();
    date = new Date(date);
    date.setYear(today.getFullYear());
    var days = Math.round(Math.min(today-date)/(1000*60*60*24));
    if (days > 180) 
        days -= 365;
    return Math.abs(days);
  };
  $scope.submitNewName = function() {
        $scope.patients.$add($scope.newName);
        $scope.newName = "";
  };
});

app.controller('PatientCreateCtrl', function ($scope, $firebaseArray, toast, $location) {
  
  var refPatiens = new Firebase("https://angularclinic.firebaseio.com/patients");
  
  $scope.newpatient = $scope.newpatient || {};
  $scope.newpatient.pinned = false;
  $scope.newpatient.birthInput = new Date();
        
  $scope.createNewPatient = function() {  
      $scope.newpatient.birth = $scope.newpatient.birthInput.getTime();
        $firebaseArray(refPatiens).$add($scope.newpatient).then(function(ref) {
            toast("Usuario " + $scope.newpatient.name + $scope.newpatient.surname + " creado");
            $location.path("/patient/" + ref.key());
        });
  };
  $scope.resetNewPatient = function() {
        $scope.newpatient.name = "";
        $scope.newpatient.surname = "";
        $scope.newpatient.email = "";
        $scope.newpatient.phone = "";
  };
});

app.controller('PatientViewCtrl', function ($scope, $firebaseObject, $routeParams, toast) {
  
  var refPatient = new Firebase("https://angularclinic.firebaseio.com/patients/" + $routeParams.patientId);
  
  $scope.patient = $firebaseObject(refPatient).$loaded().then(function(data) {
      $scope.patient = data;
      $scope.patient.birthInput = new Date($scope.patient.birth);
      console.log(data);
  }).catch(function() {console.error("Error");});
  
  $scope.patient.pinned = false;
  
  $scope.updatePatient = function() {
      $scope.patient.birth = $scope.patient.birthInput.getTime();
      $scope.patient.$save().then(function() {
            $scope.patient.birthInput = new Date($scope.patient.birth);
            $scope.patientViewForm.$setPristine(); 
            toast("Usuario actualizado", 1200);
      });
  };
  
  $scope.confirmDeletePatient = function() {
     jQuery("#modalConfirmDelete").openModal();
  };
  
  $scope.deletePatient = function() {
     toast("Usuario " + $scope.patient.name + " " + $scope.patient.surname + " eliminado");
     $scope.patient.$remove();
  };
});