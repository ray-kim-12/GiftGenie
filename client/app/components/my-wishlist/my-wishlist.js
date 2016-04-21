'use strict';

angular
.module('App')
.controller('MyWishListCtrl', ['$scope', '$state', '$auth', '$http', '$window', 'Account', MyWishListCtrl])

function MyWishListCtrl($scope, $state, $auth, $http, $window, Account){
  console.log('In My Wishlist Controller.')
  // $scope.items = [];

  if(!$auth.isAuthenticated()){
    return $state.go('home');
  }

    Account.getProfile()
    .then(function(response) {
      $scope.user = response.data;
    })
    .catch(function(response) {
      console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
    });




  $scope.add_new = function(item){
    console.log('item', item)
    $scope.name = item.name;
    $scope.link = item.link;
    $scope.items.push({
      name: $scope.name,
      link: $scope.link
    })
    $scope.item.name = '';
    $scope.item.link = '';
    console.log('add new item')
  }

  $scope.edit = function(item){
    console.log('item to edit', item)
    $scope.item.name = item.name;
    $scope.item.link = item.link;
    console.log('edit item')
  }
  $scope.save_changes = function(item){
    console.log('item to save changes', item)
    $scope.item.name = item.name;
    $scope.item.link= item.link;
    $scope.add_new(item);
    $scope.delete();
    console.log('edit item')
  }

  $scope.delete = function($index){
    console.log('delete', $index);
    var item_to_delete = $scope.items[$index];
    console.log('item to delete', item_to_delete);
    $scope.items.splice($index, 1);

    // API.delete_item({ name: item_to_delete.name }, function (success) {
    //   $scope.items.splice($index, 1);
    // });
  }

  $scope.star = function(){
    console.log('starred this person');
  }


}
