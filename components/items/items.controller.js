(function () {
  'use strict';

  angular.module('MenuApp')
    .controller('ItemsController', ItemsController);

  ItemsController.$inject = ['items'];
  function ItemsController(items) {
    var ctrl = this;
    ctrl.category = items['category']['name'];
    ctrl.items = items['menu_items'];
  }

})();