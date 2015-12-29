var app = angular.module("clinicApp", ["firebase"]);

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
  // download the data into a local object
  var getKey = function() {
    return   $scope.newpatient.surname + $scope.newpatient.name;
  };
  $scope.createNewPatient = function() {        
        $firebaseArray(refPatiens).$add($scope.newpatient);
        $scope.resetNewPatient();
  };
  $scope.resetNewPatient = function() {
        $scope.newpatient.name = "";
        $scope.newpatient.surname = "";
        $scope.newpatient.email = "";
        $scope.newpatient.phone = "";
  };
});