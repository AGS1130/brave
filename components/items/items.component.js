(function () {
  'use strict';

  angular.module('MenuApp')
    .component('items', {
      templateUrl: 'components/items/items.component.html',
      bindings: {
        categories: '<',
        items: '<'
      }
    });

})();