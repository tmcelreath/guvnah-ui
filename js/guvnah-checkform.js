var checkformModule = angular.module('checkformModule', ['ui.bootstrap'])
.controller('checkformController', function($scope, $http, $modal, $log) {
//var checkFormController = function($scope, $modal, $log, $http) {
        $scope.formData = {"level":"ERROR", "platform":"DESKTOP", "sort":"RULE", "wcag2a":true};
        $scope.htmlline = 'NADA';

        $scope.render = function(e) {
            return $(e).html();
        }

        $scope.submitForm = function() {

            $scope.message = 'Checking . . . ';
            $scope.results = [];
            $scope.numberOfResults = 0;
            $scope.errors = null;
            $scope.html = [];
            $scope.excelurl = null;
            $scope.currentRule = {};
            $scope.currentElement = {};

            if(!$scope.formData.url) {
                $scope.errors = ['!! Please enter a URL !!'];
                return;
            }

            var rulesetval = "";
            if($scope.formData.section508) {
                rulesetval = rulesetval = "SECTION508";
            }
            if($scope.formData.wcag2a) {
                if(rulesetval.length>0) {
                    rulesetval = rulesetval + ",";
                }
                rulesetval = rulesetval + "WCAG2A";
            }
            if($scope.formData.linkverification) {
                if(rulesetval.length>0) {
                    rulesetval = rulesetval + ",";
                }
                rulesetval = rulesetval + "LINKVERIFICATION"
            }
            $scope.formData.ruleset=rulesetval;

            $http({
                    method  : 'POST',
                    url     : 'http://' + location.host + '/guvnah-service/checkurl',
                    data    : $.param($scope.formData),  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            })
            .success(function(data) {
                $scope.message = data.message + ": Number of Results: " + data.numberOfResults;
                $scope.results = data.results;
                $scope.numberOfResults = data.numberOfResults;
                $scope.numberOfElements = data.numberOfElements;
                $scope.numberOfRules = data.numberOfRules;
                var str = [];
                for(var p in $scope.formData) {
                    if ($scope.formData.hasOwnProperty(p)) {
                        str.push(p + "=" + encodeURIComponent($scope.formData[p]));
                    } 
                }
                $scope.excelurl = "http://" + location.host + "/guvnah-service/checkurl_excel?" + str.join("&");
                for(i=0;i<data.html.length;i++) {
                    $scope.html[i]={"lineNumber":i+1, "value":data.html[i]};
                }
            })
            .error(function(one, two, three) {
                $scope.message = one;
                alert(one + "|" + two + "|" + three);
            });
        }

        $scope.openHtmlSummary = function (rule, element) {
            $scope.currentRule = rule;
            $scope.currentElement = element;
            var modalInstance = $modal.open({
                templateUrl: 'htmlSummary.html',
                controller: HtmlSummaryCtrl,
                windowClass: 'modal-large',
                resolve: {
                    lines: function () {
                        return $scope.html;
                    },
                    rule: function() {
                        return $scope.currentRule;
                    },
                    element: function() {
                        return $scope.currentElement;
                    }  
                }
            });

            modalInstance.result.then(function () {
                //
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    });

    var HtmlSummaryCtrl = function ($scope, $modalInstance, lines, rule, element) {

      $scope.lines = lines;
      $scope.rule = rule;
      $scope.element = element;
      $scope.currentLine = element.lineNumber;
      $scope.selectedlines = [];
      $scope.minline = ((element.lineNumber - 10) > 0) ? (element.lineNumber - 10) : 0;
      $scope.maxline = ((element.lineNumber + 10) < lines.length) ? (element.lineNumber + 10) : lines.length;
     
      var counter = 0;
      for(var i=$scope.minline; i<$scope.maxline; i++) {
        $scope.selectedlines[counter] = lines[i];
        counter++;
      }

      $scope.ok = function () {
        $modalInstance.close();
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

    };
 
