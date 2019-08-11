(function () {
  'use strict';

  angular.module('ShoppingListCheckOff', [])
    .controller('ToBuyController', ToBuyController)
    .controller('AlreadyBoughtController', AlreadyBoughtController)
    .service('ShoppingListCheckOffService', ShoppingListCheckOffService);

  ToBuyController.$inject = ['ShoppingListCheckOffService'];
  function ToBuyController(ShoppingListCheckOffService) {
    var thisController = this;
    var shoppingList = ['cookie', 'chip', 'soda', 'apple', 'bannana', 'pear'];

    //
    thisController.items = ShoppingListCheckOffService.randomList(shoppingList);
    thisController.boughtItem = function (itemIndex) {
      ShoppingListCheckOffService.boughtItem(itemIndex);
    }
  }

  AlreadyBoughtController.$inject = ['ShoppingListCheckOffService'];
  function AlreadyBoughtController(ShoppingListCheckOffService) {
    var thisController = this;

    thisController.items = ShoppingListCheckOffService.getBoughtItems();
  }

  function ShoppingListCheckOffService() {
    var service = this;

    // List of items
    var items = [];
    var itemsBought = [];

    service.randomList = function (shoppingList) {
      var listLength = shoppingList.length;

      for (var i = 0; i < listLength; i++) {
        var item = {};
        var randomIndex = Math.floor(Math.random() * shoppingList.length);

        // Initalize item object with values and push to items array
        item.quantity = Math.floor(Math.random() * 10) + 1;
        item.name = item.quantity === 1 ? shoppingList[randomIndex] : shoppingList[randomIndex] + 's';
        items.push(item);

        // Remove duplicate values
        shoppingList.splice(randomIndex, 1);
        listLength -= 1;
      }

      return items
    }

    service.boughtItem = function (itemIndex) {
      itemsBought.push(items[itemIndex]);
      items.splice(itemIndex, 1);
    }

    service.getBoughtItems = function() {
      return itemsBought;
    }
  }
})();
