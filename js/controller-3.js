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
        console.log('Called AJAX!')
      } else if (found !== 'No Menu Items!') {
        var returnRes = MenuSearchService.parseQuery(found, query);
        console.log(returnRes);
        console.log('Did not call AJAX!')
      }
    }

    function successHandler(res) {
      found = res;
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
            return 'No Menu Items!';
          }
        }).catch(function (err) {
          failureHandler(err);
        });
    }

    service.parseQuery = function (data, query) {
      var checkIfNum = !isNaN(parseInt(query));
      var foundData = checkIfNum ? resolveNumberQuery(data, query) : resolveStringQuery(data, query);

      return foundData;
    }

    function resolveNumberQuery(data, query) {
      var foundData = [];
      var numQuery = parseFloat(query);
      angular.forEach(data, function (value) {
        if (value.id && value.id === numQuery) {
          foundData.push(value);
        } else if (value.price_large && value.price_large === numQuery) {
          foundData.push(value);
        } else if (value.price_small && value.price_small === numQuery) {
          foundData.push(value);
        }
      });

      return foundData;
    }

    function resolveStringQuery(data, query) {
      var foundData = [];
      angular.forEach(data, function (value) {
        if (value.name && value.name === query) {
          foundData.push(value);
        } else if (value.short_name && value.short_name === query) {
          foundData.push(value);
        } else if (value.large_portion_name && value.large_portion_name === query) {
          foundData.push(value);
        } else if (value.small_portion_name && value.small_portion_name === query) {
          foundData.push(value);
        }
      });

      return foundData;
    }
  }
})();