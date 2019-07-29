(function () {
  'use strict';

  angular.module('LunchCheck', []).controller('LunchCheckController', LunchCheckController);

  LunchCheckController.$inject = ['$scope'];

  function LunchCheckController($scope) {
    $scope.items = '';

    $scope.checkInput = function () {
      var items = $scope.items;
      var itemsArr = items.split(',');

      var res = outputValue(itemsArr);

      if (res === 0) {
        $scope.output = 'Please enter data first';
      } else if (res <= 3) {
        $scope.output = 'Enjoy!';
      } else {
        $scope.output = 'Too much!';
      }
    }
  }

  function outputValue(arr) {
    var count = 0;

    for (var item of arr) {
      var sanitizedItem = item.trim(); // I DO NOT CONSIDER AN EMPTY ITEM AS AN ITEM TOWARDS COUNT

      if (sanitizedItem.length !== 0) {
        count++;
      }
    }

    return count;
  }
})();