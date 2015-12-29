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

app.controller('PatientListCtrl', function ($scope, $firebaseArray) {
  
  var ref = new Firebase("https://angularclinic.firebaseio.com/patients");
  // download the data into a local object
  $scope.patients = $firebaseArray(ref);
  $scope.submitNewName = function() {
        $scope.patients.$add($scope.newName);
        $scope.newName = "";
  };
});

app.controller('PatientCreateCtrl', function ($scope, $firebaseArray) {
  
  var refPatiens = new Firebase("https://angularclinic.firebaseio.com/patients");
  
  $scope.createNewPatient = function() {        
        $firebaseArray(refPatiens).$add($scope.newpatient);
        Materialize.toast("Usuario " + $scope.newpatient.name + " creado", 5000);
        $scope.resetNewPatient();
  };
  $scope.resetNewPatient = function() {
        $scope.newpatient.name = "";
        $scope.newpatient.surname = "";
        $scope.newpatient.email = "";
        $scope.newpatient.phone = "";
  };
});

app.controller('PatientViewCtrl', function ($scope, $firebaseObject, $routeParams) {
  
  var refPatient = new Firebase("https://angularclinic.firebaseio.com/patients/" + $routeParams.patientId);
  
  $scope.patient = $firebaseObject(refPatient);
  
  $scope.updatePatient = function() {
      $scope.patient.$save();      
      Materialize.toast("Usuario actualizado", 5000);
  };
  
  $scope.confirmDeletePatient = function() {
     jQuery("#modalConfirmDelete").openModal();
  };
  
  $scope.deletePatient = function() {
     Materialize.toast("Usuario " + $scope.patient.name + " " + $scope.patient.surname + "eliminado", 5000);
     $scope.patient.$remove();
  };
});