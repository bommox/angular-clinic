app.factory('toast', function($window) {
    return function(msg, time) {
        time = time || 3000;
        $window.Materialize.toast(msg, time);
    };
});

app.factory("Auth", function($firebaseAuth, $location) {
    var ref = new Firebase("https://angularclinic.firebaseio.com");
    var auth = $firebaseAuth(ref);
    auth.$onAuth(function(authData) {
          if (authData === null) 
            $location.path("/login");
    });
    return auth;
  }
);

app.factory("AuthData", function(Auth) {
   var getData = function() {
       return Auth.$getAuth();
   };
   var getProvData = function() {
        var result = null;
        if (getData()) {
            result = getData()[getData().provider]['cachedUserProfile'];
        }  
        return result;
   };
   return {
              
       getShortName : function() {
           console.log("short name");
           var result = null;
           if (getData()) {
               if (getData().provider == 'google') {
                   result = getProvData().name;
               } else  if (getData().provider == 'facebook') {
                   result = getProvData().first_name;
               } 
           }
           return result;
       },
       
       getPicture : function() {
           var result = null;
           if (getData()) {
               if (getData().provider == 'google') {
                   result = getProvData().picture;
               } else  if (getData().provider == 'facebook') {
                   result = getProvData().picture.data.url;
               } 
           }
           return result;
       }
       
   } 
});