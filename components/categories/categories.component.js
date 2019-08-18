(function () {
  'use strict';

  angular.module('MenuApp')
    .component('categories', {
      templateUrl: 'components/categories/categories.component.html',
      bindings: {
        categories: '<'
      }
    });

})();