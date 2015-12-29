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