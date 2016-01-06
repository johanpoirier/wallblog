define(function() {
    var LAST_LOGIN_KEY = "lastLogin";
    
    return {
       isLogged: function() {
           var lastLogin = 0;
           if(window.sessionStorage) {
               lastLogin = window.sessionStorage.getItem(LAST_LOGIN_KEY);
           }
           else {
               lastLogin = window.lastLogin;
           }
            var now = new Date();
            return (lastLogin != 0) && ((now.getTime() - lastLogin) < 3600000);
       },
       
       setLoggedTime: function() {
            var now = new Date();
            if(window.sessionStorage) {
                window.sessionStorage.setItem(LAST_LOGIN_KEY, now.getTime());
            }
            else {
                window.lastLogin = now.getTime();
            }
       }
   } 
});