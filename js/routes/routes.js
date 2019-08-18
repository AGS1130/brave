(function () {
  'use strict';
    
  angular.module('MenuApp')
  .config(RoutesConfig);
    
  RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
  function RoutesConfig($stateProvider, $urlRouterProvider) {

    // Redirect to home page if no other URL matches
    $urlRouterProvider.otherwise('/');

    // *** Set up UI states ***
    $stateProvider

    // Home page
    .state('home', {
      url: '/',
      templateUrl: '../templates/page-4-template.html'
    })

    // Menu categories
    .state('categories', {
      url: '/categories',
      templateUrl: '../components/categories/categories.component.html',
      controller: 'CategoriesController as ctrl',
      resolve: {
        categories: ['MenuDataService', function (MenuDataService) {
          return MenuDataService.getAllCategories();
        }]
      }
    })

    // Items of one category
    .state('items', {
      url: '/items/{categoryId}',
      templateUrl: '../components/items/items.component.html',
      controller: 'ItemsController as ctrl',
      resolve: {
        items: ['MenuDataService', '$stateParams', function (MenuDataService, $stateParams) {
          return MenuDataService.getItemsForCategory($stateParams.categoryId);
        }]
      }
    });
  }
})();