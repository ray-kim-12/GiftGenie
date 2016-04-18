'use strict';

let app = angular.module('App', ['satellizer', 'ui.router']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $authProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'app/components/home/home.html',
    controller: 'HomeCtrl'
  })
  .state('my-wishlist', {
    url: '/',
    templateUrl: 'app/components/my-wishlist/my-wishlist.html',
    controller: 'MyWishListCtrl'
  })
  .state('starred-lists', {
    url: '/',
    templateUrl: 'app/components/starred-lists/starred-lists.html',
    controller: 'StarredLists'
  })

  $authProvider.facebook({
    clientId: '247255738962232'
  });
});
