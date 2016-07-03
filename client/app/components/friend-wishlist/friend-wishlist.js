'use strict';

angular
.module('App')
.controller('FriendlistCtrl', ['$scope', '$state', '$auth', '$http', '$window', 'UserSvc', '$rootScope', '$stateParams', 'getUser', 'getFriend', FriendlistCtrl])

function FriendlistCtrl($scope, $state, $auth, $http, $window, UserSvc, $rootScope, $stateParams, getUser, getFriend) {

  var friendId = $stateParams.fid;
  $scope.followersPage = false;
  $scope.followingPage = false;

  /* _______________________
  |                         |
  |  Logged In User's Data: |
  |_________________________| */

  var favoritesIdArr = getUser.data.favorites;
  var followingFriendIdArr = getUser.data.following;
  var likedItemsArr = getUser.data.liked;
  $rootScope.display_name = getUser.data.displayName;

  /* _______________
  |                 |
  |  Friend's Data: |
  |_________________| */

  $scope.user = getFriend.data;
  $scope.id = getFriend.data._id;
  $scope.items = getFriend.data.items;
  $rootScope.friendFollowers = getFriend.data.followers;
  $rootScope.friendFollowing = getFriend.data.following;
  $rootScope.friendId = getFriend.data._id;
  $scope.display_name = getFriend.data.displayName
  $scope.email = getFriend.data.email
  $scope.pro_pic = getFriend.data.facebook
  $scope.friendsLengthh = getFriend.data.friends.length;
  $scope.allFriendFriends = getFriend.data.friends;
  $scope.following = getFriend.data.following.length;
  $scope.followers = getFriend.data.followers.length;

  $scope.birthday = getFriend.data.birthday;
  if ($scope.birthday == undefined){
    $scope.birthday = ' N/A '
  }

  var friendItems = getFriend.data.items;
  var allTheLikedItemsArr= [];
  for (var i = 0; i < friendItems.length; i++){
    var each_likeable_item = friendItems[i];
    if (likedItemsArr.indexOf(each_likeable_item) > -1 ) {
      allTheLikedItemsArr.push(i)
      $scope.like_heart =  allTheLikedItemsArr;
    }
  }

  var friendFavId = getFriend.data._id;
  if (favoritesIdArr.indexOf(friendFavId) > -1){
    $rootScope.yellowStar = 'star_btn';
    $scope.favWishList = true;
  }

  if(followingFriendIdArr.indexOf($scope.id) > -1 ){
    $rootScope.follow = true;
  } else {
    $rootScope.follow = false;
  }

  var friendFriendArray = [];
  var friendsIdArr = []
  for (var i=0; i<getFriend.data.friends.length; i++) {
    var friendFriendName = getFriend.data.friends[i].name;
    var friendId = getFriend.data.friends[i].id;
    friendFriendArray.push(friendFriendName);
    friendsIdArr.push(friendId);
  }

  $scope.friends = friendFriendArray;
  $scope.friendsLength = friendFriendArray.length;

  /* ______________
  |                |
  |  Favorited By: |
  |________________| */

  $rootScope.friendFavoritedByArr = getFriend.data.favoritedBy;
  $rootScope.favoritedByLength = getFriend.data.favoritedBy.length;

  var allFriendFavoritedBy = $rootScope.friendFavoritedByArr;
  UserSvc.displayFaves(allFriendFavoritedBy)
  .then((response) => {
    var allFriendFavoritedBy = response.data;
    $rootScope.favoritedByModel = [];

    for (var i=0; i<allFriendFavoritedBy.length; i++) {
      var eachFriendFavoritedBy = allFriendFavoritedBy[i];
      var name = eachFriendFavoritedBy.displayName;
      var fbookId = eachFriendFavoritedBy.facebook;

      $rootScope.favoritedByModel[i] = {
        "name": name,
        "fbookId": fbookId
      }
    }
  })
  .catch((err) => {
  });

  /* ___________________
  |                     |
  |  Like Friend Items: |
  |_____________________| */

  $scope.like_item = (item, $index) => {
    if ($scope.like_heart != undefined && $scope.like_heart.indexOf($index) > -1 ) {
      console.log('------------> SCENARIO #1 - UNLIKING');
      var theIndex = $index;
      var parsed = parseInt($index);
      var arrayToRemoveFrom = $scope.like_heart;
      arrayToRemoveFrom.splice(arrayToRemoveFrom.indexOf(parsed), 1)
    } else if ($scope.like_heart == undefined ){
      console.log('------------> SCENARIO #2 - LIKING (WHEN ITS THE FIRST LIKE.)');
      $scope.like_heart = [];
      $scope.like_heart.push($index)
      console.log('after pushing index into like_heart',$scope.like_heart)
      console.log('------------> SCENARIO #3 - LIKING (WHEN ALREADY SOME LIKED.)');
      $scope.like_heart.push($index)
    }

    UserSvc.likeItem(item)
    .then((res) => {
    })
    .catch((err) => {
    })
  }

  /* _______________________
  |                         |
  |  Star Friends Wishlist: |
  |_________________________| */

  $scope.star = (user) => {
    $scope.favWishList ? $scope.favWishList = false : $scope.favWishList = 'is_favoriting'

    if ($rootScope.yellowStar === undefined){
      $rootScope.yellowStar = 'star_btn'
    } else {
      $rootScope.yellowStar = undefined
    }
    UserSvc.starPerson(user)
  }

  /* _______________
  |                 |
  |  Follow Friend: |
  |_________________| */

  $scope.followUser = (user) => {
    var tmpFriendId = user._id
    if (followingFriendIdArr.indexOf(tmpFriendId) > -1){
      followingFriendIdArr.pop(tmpFriendId)
      $scope.unfollow = false;
    } else {
      followingFriendIdArr.push(tmpFriendId)
      window.location.reload()
      // $scope.unfollow = true;
      // $scope.follow = false;
    }
    UserSvc.followPerson(user)
  }

  /* _________________________
  |                           |
  |  Follow/Unfollow Buttons: |
  |___________________________| */

  $scope.unfollowBtnShow = () => {
    // console.log('should show RED unfollow button & hide following button')
    $rootScope.follow = false;
    $rootScope.unfollow = true;
  }

  $scope.followBtnShow = () => {
    // console.log('should show follow button only')
    $rootScope.follow = true;
    $rootScope.unfollow = false;
  }

  /* ________________
  |                  |
  |  View followers: |
  |__________________| */

  $scope.goToFollowers = () => {
    $scope.followersPage = true;
    $scope.followingPage = false;
    var allFollowers = $rootScope.friendFollowers;

    UserSvc.showFollow(allFollowers)
    .then((response) => {
      var theFollowers = response.data;
      $rootScope.followersModel = [];

      for (var i=0; i<theFollowers.length; i++) {
        var eachFollower = theFollowers[i];
        var name = eachFollower.displayName;
        var id = eachFollower.facebook;

        $rootScope.followersModel[i] = {
          "name": name,
          "id": id
        }
      }
    })
  }

  /* ________________
  |                  |
  |  View following: |
  |__________________| */

  $scope.goToFollowing = () => {
    $scope.followingPage = true;
    $scope.followersPage = false;
    var allFollowing = $rootScope.friendFollowing;

    UserSvc.showFollow(allFollowing)
    .then((response) => {
      var theFollowing = response.data;
      $rootScope.followingModel = [];

      for (var i=0; i<theFollowing.length; i++) {
        var eachFollowing = theFollowing[i];
        var name = eachFollowing.displayName;
        var id = eachFollowing.facebook;

        $rootScope.followingModel[i] = {
          "name": name,
          "id": id
        }
      }
    })
  }
}
