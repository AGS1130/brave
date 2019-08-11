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
  }

  function resolveNumberQuery(data, query) {
    var foundData = [];
    var numQuery = parseFloat(query);

    angular.forEach(data, function (value) {
      var hasId = value.id && value.id === numQuery;
      var priceIsLarge = value.price_large && Math.round(value.price_large) === Math.round(numQuery);
      var priceIsSmall = value.price_small && Math.round(value.price_small) === Math.round(numQuery);

      if (hasId) {
        foundData.push(value);
      } else if (priceIsLarge) {
        foundData.push(value);
      } else if (priceIsSmall) {
        foundData.push(value);
      }
    });

    return foundData;
  }

  function resolveStringQuery(data, query) {
    var foundData = [];
    var sanitizedQuery = sanitizeString(query).length;

    if (sanitizedQuery.length) {
      angular.forEach(data, function (value) {
        var hasName = value.name && sanitizeString(value.name).indexOf(sanitizedQuery) !== -1;
        var hasShortName = value.short_name && sanitizeString(value.short_name).indexOf(sanitizedQuery) !== -1;
        var hasDescription = value.description && sanitizeString(value.description).indexOf(sanitizedQuery) !== -1;
        var hasLargePortion = value.large_portion_name && sanitizeString(value.large_portion_name).indexOf(sanitizedQuery) !== -1;
        var hasSmallPortion = value.small_portion_name && sanitizeString(value.small_portion_name).indexOf(sanitizedQuery) !== -1;

        if (hasName) {
          foundData.push(value);
        } else if (hasShortName) {
          foundData.push(value);
        } else if (hasDescription) {
          foundData.push(value);
        } else if (hasLargePortion) {
          foundData.push(value);
        } else if (hasSmallPortion) {
          foundData.push(value);
        }
      });
    }

    return foundData;
  }

  function sanitizeString(query) {
    var trimLowerCase = query.toLowerCase().trim();
    var res = trimLowerCase.replace(/[^a-zA-Z0-9]/g, '');

    return res;
  }
})();