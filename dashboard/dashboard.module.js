////////////////////////////////
// App : Dashboard
// Owner  : Suvethan
// Last changed date : 2017/11/14
// Version : 6.1.0.5
// Updated BY: Kasun
/////////////////////////////////
(function ()
{
  'use strict';

  angular
    .module('app.dashboard', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $urlRouterProvider, $sceDelegateProvider, msApiProvider, msNavigationServiceProvider, mesentitlementProvider)
  {
    mesentitlementProvider.setStateCheck("dashboard");

    $stateProvider
      .state('app.dashboard', {
        url    : '/dashboard',
        views  : {
          'dashboard@app': {
            templateUrl: 'app/main/dashboard/dashboard.html',
            controller : 'DashboardController as vm'
          }
        },
        resolve: {
          security: ['$q','mesentitlement','$timeout','$rootScope','$state','$mdDialog','$location', function($q,mesentitlement,$timeout,$rootScope,$state,$mdDialog,$location){
            var entitledStatesReturn = mesentitlement.stateDepResolver('dashboard');
            var firstLogin=null;
			  // if(!$rootScope.isSetBase){
				//   $timeout(function(){
				//   	$location.path('/guide');
				//   });
			  // }

            // if(entitledStatesReturn !== true){
            //   return $q.reject("unauthorized");
            // }
            // else
            // {
			//
            //   var checkFirstLogin = function () {
            //     console.log('checkFirstLogin started');
            //     firstLogin=localStorage.getItem("firstLogin");
            //     console.log(firstLogin);
            //     return firstLogin;
            //   };
            //
            //   do {
            //     $timeout(function() {
            //       console.log('Timeout started');
            //       checkFirstLogin();
            //       //var firstLogin=localStorage.getItem("firstLogin");
            //       //console.log(firstLogin);
            //       if(firstLogin=="" || firstLogin==undefined) {
            //         $rootScope.firstLoginDitected = true;
            //         //localStorage.removeItem('firstLogin');
            //         //Site Tour Extraction
            //         $rootScope.initSiteTour = function(ev) {
            //           $mdDialog.show({
            //             controller: 'SiteTourController as vm',
            //             templateUrl: 'app/main/sitetour/dialogs/siteTourDialog.html',
            //             targetEvent: ev,
            //             clickOutsideToClose:false
            //           }).then(function(answer) {
            //           }, function() {
            //           });
            //         };
            //         //debugger;
            //
            //         //$rootScope.firstLoginDitected = true;
            //         if($rootScope.firstLoginDitected === true){
            //           $rootScope.initSiteTour();
            //         }
            //         //return $q.reject("settings");
            //       }else if(firstLogin!="" || firstLogin!=undefined){
            //         return -1;
            //       }
            //     }, 5000);
            //   }while(firstLogin != null);
            //
            //   //debugger;
            //   $timeout(function() {
            //    console.log('Timeout started');
            //    checkFirstLogin();
            //    //var firstLogin=localStorage.getItem("firstLogin");
            //    //console.log(firstLogin);
            //    if(firstLogin=="" || firstLogin==undefined) {
            //      $rootScope.firstLoginDitected = true;
            //      //localStorage.removeItem('firstLogin');
            //      //Site Tour Extraction
            //      $rootScope.initSiteTour = function(ev) {
            //        $mdDialog.show({
            //          controller: 'SiteTourController as vm',
            //          templateUrl: 'app/main/sitetour/dialogs/siteTourDialog.html',
            //          targetEvent: ev,
            //          clickOutsideToClose:false
            //        }).then(function(answer) {
            //        }, function() {
            //        });
            //      };
            //      //debugger;
			//
            //      //$rootScope.firstLoginDitected = true;
            //      if($rootScope.firstLoginDitected === true){
            //        $rootScope.initSiteTour();
            //      }
            //      //return $q.reject("settings");
            //    }
            //    else
            //    {
            //      $timeout(checkFirstLogin(), 500);
            //      $rootScope.firstLoginDitected = false;
            //      //localStorage.removeItem('firstLogin');
            //    }
            //   }, 5000);
            // }
          }]
        },
        bodyClass: 'dashboard-project'
      });

	  $sceDelegateProvider.resourceUrlWhitelist([
		  // Allow same origin resource loads.
		  "self",
		  // Allow loading from Google maps
		  "http://azure.cloudcharge.com/services/reports**",

		  "https://azure.cloudcharge.com/services/reports**",

		  "http://app.cloudcharge.com/services/reports**",

		  "https://app.cloudcharge.com/services/reports**",

		  "https://cloudcharge.com/services/reports**"
	  ]);

    msApiProvider.register('dashboard.project', ['app/data/dashboard/project/data.json']);

    // Navigation

    msNavigationServiceProvider.saveItem('dashboard', {
      title    : 'Dashboard',
      state    : 'app.dashboard',
      weight   : 1
    });
  }
})();
