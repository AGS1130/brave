(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService);

  NarrowItDownController.$inject = ['$scope', 'MenuSearchService'];
  function NarrowItDownController($scope, MenuSearchService) {
    $scope.query = '';
    var found;

    $scope.getData = function () {
      var query = $scope.query;

      if (!found) {
        MenuSearchService.getMatchedMenuItems(successHandler, failureHandler);
      } else if (found.length) {
        var returnRes = MenuSearchService.parseQuery(found, query);
      }
    }

    function successHandler(res) {
      var query = $scope.query;
      found = res;
      var returnRes = MenuSearchService.parseQuery(found, query);
    }

    function failureHandler(err) {
      return err;
    }
  }

  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http) {
    var service = this;

    service.getMatchedMenuItems = function (successHandler, failureHandler) {
      return $http.get('https://davids-restaurant.herokuapp.com/menu_items.json')
        .then(function (res) {
          var payload = res.data;
          if (payload.menu_items) {
            return successHandler(payload.menu_items);
          } else {
            return [];
          }
        }).catch(function (err) {
          failureHandler(err);
        });
    }

    service.parseQuery = function (data, query) {
      var checkIfNum = !isNaN(parseFloat(query));
      var foundData = resolveQuery(checkIfNum, data, query);

      return foundData;
    }
  }

  function resolveQuery(ifNum, data, query) {
    var foundData = [];
    var sanitizedQuery = ifNum ? parseFloat(query) : sanitizeString(query);

    angular.forEach(data, function (dataObj) {
      var dataIn = false;
      angular.forEach(dataObj, function (value) {
        var finalCondition;

        if(ifNum && typeof value === 'number'){
          finalCondition = value === sanitizedQuery || Math.round(value) === Math.round(sanitizedQuery);
        } else if(!ifNum && typeof value === 'string') {
          finalCondition = sanitizeString(value).indexOf(sanitizedQuery) !== -1;
        }

        if (!dataIn && finalCondition) {
          foundData.push(dataObj);
          dataIn = true;
        }
      })
    });

    console.log(foundData)

    return foundData;
  }

  function sanitizeString(query) {
    var trimLowerCase = query.toLowerCase().trim();
    var res = trimLowerCase.replace(/[^a-zA-Z0-9]/g, '');

    return res;
  }
})();