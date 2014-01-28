var rulesetModule = angular.module('rulesetModule', [], function($locationProvider) {
      $locationProvider.html5Mode(true);
});

rulesetModule.controller('rulesetController', function($scope, $location, $http) {
    //alert($location.search()['ruleset']);
    $scope.rulesetname = ($location.search()).ruleset;
    $scope.ruleset = {};


    $http({
        method  : 'GET',
        url     : 'http://' + location.host + '/java-achecker/ruleset/' + $scope.rulesetname,
                headers : { 'Content-Type': 'application/application-json' }  // set the headers so angular passing info as form data (not request payload)
            })
            .success(function(data) {
                //alert(data);
                $scope.ruleset = data;
            })
            .error(function(one, two, three) {
                $scope.message = one;
                alert(one + "|" + two + "|" + three);
            });


});
