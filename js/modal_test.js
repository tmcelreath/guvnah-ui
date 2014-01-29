angular.module('plunker', ['ui.bootstrap']);
var ModalDemoCtrl = function ($scope, $modal, $log) {

  $scope.lines = ['line1', 'line2', 'line3', 'line4', 'line5', 'line6', 'line7', 'line8', 'line9', 'line10', 'line11', 'line12', 'line13', 'line14', 'line15'];
  $scope.currentline = 8;

  $scope.open = function () {
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl,
      windowClass: 'modal-large',
      resolve: {
        lines: function () {
          return $scope.lines;
        },
        currentline: function() {
          return $scope.currentline;
        }
      }
    });

    modalInstance.result.then(function () {
      //$scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
};

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

var ModalInstanceCtrl = function ($scope, $modalInstance, lines, currentline) {

  $scope.lines = lines;
  $scope.currentline = currentline;
  $scope.selectedlines = [];
  $scope.minline = ((currentline - 5) > 0) ? (currentline - 5) : 0;
  $scope.maxline = ((currentline + 5) < lines.length) ? (currentline + 5) : lines.length;

  var counter = 0;
  for(var i=$scope.minline; i<$scope.maxline; i++) {
    $scope.selectedlines[counter] = lines[i];
    counter++;
  }

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

};