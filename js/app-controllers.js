
app.controller('LoginCtrl', function ($scope, $location, Auth, toast, $rootScope) {
    
    
    $scope.login = function(loginProvider) {
      $scope.error = null;
      
      Auth.$authWithOAuthPopup(loginProvider).then(function(authData) {
        toast("Login OK!");
        $location.path("patients/create");
      }).catch(function(error) {
        $scope.error = error;
        toast("Ha habido un error");
      });
    }

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