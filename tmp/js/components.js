(function(module) {
try {
  module = angular.module('faq');
} catch (e) {
  module = angular.module('faq', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('faq/faq.html',
    '<div class="main_container">\n' +
    '\n' +
    '  <div class="faq container">\n' +
    '    <h1>Frequently Asked Questions</h1>\n' +
    '    <div class="search_faq_container">\n' +
    '      <input type="text" ng-model="search" class="search_faqs" placeholder="What Question Do You Have?">\n' +
    '    </div>\n' +
    '\n' +
    '    <ul class="faquestions">\n' +
    '      <li ng-repeat="faq in faqs | filter:search">\n' +
    '        <h5 ng-click="getAnswer($index)">{{faq.question}}</h5><br>\n' +
    '        <h6 class="faq_answers" ng-if="showAnswer" >{{faq.answer}}</h6>\n' +
    '      </li>\n' +
    '    </ul>\n' +
    '  </div>\n' +
    '\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('friendWishlist');
} catch (e) {
  module = angular.module('friendWishlist', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('friend-wishlist/friend-wishlist.html',
    '<div class="main_container">\n' +
    '\n' +
    '  <div class="profile container col-xs-3">\n' +
    '    <div class="pro_pic_container col-xs-12">\n' +
    '      <img ng-src="https://graph.facebook.com/{{pro_pic}}/picture?type=large" class="col-xs-12 pro_pic">\n' +
    '    </div>\n' +
    '    <div class="pro_info col-xs-12">\n' +
    '      <p><i class="fa fa-user"></i>\n' +
    '        {{display_name}}\n' +
    '      </p>\n' +
    '      <p><i class="fa fa-birthday-cake"></i> {{birthday}}</p>\n' +
    '      <p class="email_address"><i class="fa fa-envelope-o"></i>{{email}}</p>\n' +
    '    </div>\n' +
    '    <div class="pro_info_stats col-xs-12">\n' +
    '      <p ng-click="goToFollowing()" class="following col-xs-6">Following\n' +
    '        <span class="nums">{{following}}</span>\n' +
    '      </p>\n' +
    '      <p ng-click="goToFollowers()" class="followers col-xs-6">Followers\n' +
    '        <span class="nums">{{followers}}</span>\n' +
    '      </p>\n' +
    '    </div>\n' +
    '    <div class="pro_info_btns col-xs-12">\n' +
    '      <button ng-click="followUser(user)" class="col-xs-12 follow">\n' +
    '        <div class="btn btn-primary col-xs-12"  ng-if="follow" ng-mouseover="unfollowBtnShow()">Following</div>\n' +
    '        <div ng-show="unfollow" class="btn btn-danger col-xs-12" ng-mouseout="followBtnShow()">Unfollow </div>\n' +
    '        <div class="btn btn-primary col-xs-12"  ng-if="!follow && !unfollow">Follow</div>\n' +
    '      </button>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '\n' +
    '  <div class="wishlist_container container col-xs-8" ng-if="!followingPage && !followersPage">\n' +
    '    <div class="title_container">\n' +
    '      <h2 class="my_wishlist_title">My WishList</h2>\n' +
    '      <!-- \'You, Rachel Slater & 1232 Others Favorited Your WishList\' -->\n' +
    '\n' +
    '      <span class="favorited">\n' +
    '        <!-- when not clicked on -->\n' +
    '        <div class="FavByStarContainer">\n' +
    '          <div class="favy" ng-class="{is_favoriting: favWishList, star_btn: yellowStar}" ng-click="star(user)"> </div>\n' +
    '          <p>By\n' +
    '            <span data-toggle="modal" data-target="#showFavBy">{{favoritedByLength}}\n' +
    '              <span ng-if="favoritedByLength < 2">Person</span>\n' +
    '              <span ng-if="favoritedByLength >= 2">People</span>\n' +
    '            </span>\n' +
    '          </p>\n' +
    '        </div>\n' +
    '      </span>\n' +
    '\n' +
    '    </div>\n' +
    '    <div class="bottom_container">\n' +
    '      <input type="text" placeholder="Search Wishlist" ng-model="search" class="searchItems">\n' +
    '      <ol ng-model="items" class="wishlist_items" >\n' +
    '        <li class="wishlist_items_container" ng-repeat="item in items | filter:search">\n' +
    '          <a href="{{item.link}}" class="wishlist_item friendlist_items" target="_blank"> {{item.name}} </a>\n' +
    '          <div class="likey" ng-class="{is_animating: like_heart.indexOf($index) > -1, liked_item : like_heart.indexOf($index) > -1   }" ng-click="like_item(item, $index)">\n' +
    '<!--           <span class="itemsLikeCount">\n' +
    '            {{item.likedByFriends.length}}\n' +
    '          </span> -->\n' +
    '          </div>\n' +
    '        </li>\n' +
    '      </ol>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '\n' +
    '<!-- following -->\n' +
    '\n' +
    '<div class="main_container" ng-if="followingPage && !followersPage">\n' +
    '  <div class="wishlist_container container col-xs-8">\n' +
    '    <div class="title_container">\n' +
    '      <h2 class="my_wishlist_title">Following</h2>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="bottom_container">\n' +
    '      <input ng-model="following.name" placeholder="Search Following" class="col-xs-12">\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="bottom_container">\n' +
    '      <li ng-repeat="following in followingModel | filter:following.name" class="following col-xs-12 col-sm-6 col-md-4" ng-click="goToOthers(following)">\n' +
    '        <img ng-src="https://graph.facebook.com/{{following.id}}/picture?type=large" class="followers_pic">\n' +
    '        <h6 class="user_name">{{following.name}}</h6>\n' +
    '      </li>\n' +
    '    </div>\n' +
    '\n' +
    '  </div>\n' +
    '</div>\n' +
    '\n' +
    '<!-- followers -->\n' +
    '\n' +
    '<div class="main_container" ng-if="followersPage && !followingPage">\n' +
    '  <div class="wishlist_container container col-xs-8">\n' +
    '    <div class="title_container">\n' +
    '      <h2 class="my_wishlist_title">Followers</h2>\n' +
    '    </div>\n' +
    '    <div class="bottom_container">\n' +
    '      <input ng-model="followers.name" placeholder="Search Followers" class="col-xs-12">\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="bottom_container">\n' +
    '      <li ng-repeat="follower in followersModel | filter:following.name" class="followers col-xs-12 col-sm-6 col-md-4" ng-click="goToOthers(follower)">\n' +
    '        <img ng-src="https://graph.facebook.com/{{follower.id}}/picture?type=large" class="followers_pic">\n' +
    '        <h6 class="user_name">{{follower.name}}</h6>\n' +
    '      </li>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '\n' +
    '<!-- Modal -->\n' +
    '<!-- show users that favorited your wishlist -->\n' +
    '<div class="modal fade" id="showFavBy" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\n' +
    '  <div class="modal-dialog favoritedBy" role="document">\n' +
    '    <div class="modal-content">\n' +
    '      <div class="modal-header">\n' +
    '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n' +
    '        <h4 class="modal-title" id="myModalLabel">Favorited By {{favoritedByLength}}  </h4>\n' +
    '      </div>\n' +
    '      <div class="modal-body">\n' +
    '        <li ng-repeat="fav in favoritedByModel" class="favoritedByModal">\n' +
    '          <img ng-src="https://graph.facebook.com/{{fav.fbookId}}/picture?type=small" alt="">\n' +
    '          <p> {{fav.name}} </p>\n' +
    '        </li>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '\n' +
    '<!-- show people who liekd an item on your list -->\n' +
    '<div class="modal fade" id="showLikedItem" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\n' +
    '  <div class="modal-dialog showFavBy" role="document">\n' +
    '    <div class="modal-content">\n' +
    '      <div class="modal-header">\n' +
    '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n' +
    '        <h4 class="modal-title" id="myModalLabel">Liked By {{likedByLength}}  </h4>\n' +
    '      </div>\n' +
    '      <div class="modal-body">\n' +
    '\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('myWishlist');
} catch (e) {
  module = angular.module('myWishlist', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('my-wishlist/my-wishlist.html',
    '<div class="main_container">\n' +
    '\n' +
    '  <div class="profile container col-xs-3">\n' +
    '    <div class="pro_pic_container col-xs-12">\n' +
    '      <img ng-src="https://graph.facebook.com/{{pro_pic}}/picture?type=large" class="col-xs-12 pro_pic">\n' +
    '    </div>\n' +
    '    <div class="pro_info col-xs-12">\n' +
    '      <p><i class="fa fa-user"></i>\n' +
    '        {{display_name}}\n' +
    '      </p>\n' +
    '      <p><i class="fa fa-birthday-cake"></i> {{birthday}}</p>\n' +
    '      <p class="email_address"><i class="fa fa-envelope-o"></i>{{email}}</p>\n' +
    '    </div>\n' +
    '    <div class="pro_info_stats col-xs-12">\n' +
    '      <p ng-click="goToFollowing()" class="following col-xs-6">Following\n' +
    '        <span class="nums">{{followingCount}}</span>\n' +
    '      </p>\n' +
    '      <p ng-click="goToFollowers()" class="followers col-xs-6">Followers\n' +
    '        <span class="nums">{{followersCount}}</span>\n' +
    '      </p>\n' +
    '    </div>\n' +
    '    <div class="pro_info_btns col-xs-12">\n' +
    '      <button ng-click="goToSettings()" class=" btn btn-info settings col-xs-12">\n' +
    '        <i class="fa fa-cog" aria-hidden="true"></i>\n' +
    '      </button>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '\n' +
    '  <div class="wishlist_container container col-xs-8" ng-if="!starred && !settings && !followingPage && !followersPage">\n' +
    '    <div class="title_container">\n' +
    '      <h2 class="my_wishlist_title">My WishList</h2> <br>\n' +
    '      <span class="favorited">\n' +
    '        <!-- when not clicked on -->\n' +
    '        <div class="FavByStarContainer">\n' +
    '          <i class="fa fa-star mine"></i>\n' +
    '          <p>By\n' +
    '            <span data-toggle="modal" data-target="#showFavBy">{{favoritedByLength}}\n' +
    '              <span ng-if="favoritedByLength < 2" >Person</span>\n' +
    '              <span ng-if="favoritedByLength >= 2">People</span>\n' +
    '            </span>\n' +
    '          </p>\n' +
    '        </div>\n' +
    '      </span>\n' +
    '    </div>\n' +
    '  <div class="bottom_container col-xs-12">\n' +
    '    <div class="top_line">\n' +
    '      <button type="button" class="add_btn btn btn-primary" data-toggle="modal" data-target="#myModal">\n' +
    '        ADD\n' +
    '      </button>\n' +
    '      <input type="text" placeholder="Search Wishlist" ng-model="search" class="searchItems">\n' +
    '    </div>\n' +
    '\n' +
    '    <ol ui-sortable="sortableOptions" ng-model="items" class="wishlist_items" >\n' +
    '      <li class="wishlist_items_container" ng-repeat="item in items | filter:search">\n' +
    '        <a href="{{item.link}}" class="wishlist_item" target="_blank"> {{item.name}} </a>\n' +
    '        <i class="fa fa-pencil-square-o" ng-click="edit(item)" data-toggle="modal" data-target="#edit"></i>\n' +
    '        <i class="fa fa-trash" ng-click="delete(item, $index)"></i>\n' +
    '      </li>\n' +
    '    </ol>\n' +
    '  </div>\n' +
    '</div>\n' +
    '</div>\n' +
    '\n' +
    '<!-- settings -->\n' +
    '\n' +
    '<div class="main_container" ng-if="settings && !followingPage && !followersPage">\n' +
    '  <div class="wishlist_container container col-xs-8">\n' +
    '    <div class="title_container">\n' +
    '      <h2 class="my_wishlist_title">Settings Container</h2>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="bottom_container">\n' +
    '      Privacy:\n' +
    '      <input type="radio" name="privacy" value="public" ng-click="makePublic()" ng-checked="public"> Public\n' +
    '      <input type="radio" name="privacy" value="private" ng-click="makePrivate()" ng-checked="private"> Private\n' +
    '      <div ng-if="public">Your Account is Public</div>\n' +
    '      <div ng-if="private">Your Account is Private</div>\n' +
    '    </div>\n' +
    '\n' +
    '  </div>\n' +
    '</div>\n' +
    '\n' +
    '<!-- following -->\n' +
    '\n' +
    '<div class="main_container" ng-if="followingPage && !followersPage && !settings">\n' +
    '  <div class="wishlist_container container col-xs-8">\n' +
    '    <div class="title_container">\n' +
    '      <h2 class="my_wishlist_title">Following</h2>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="bottom_container">\n' +
    '      <input ng-model="following.name" placeholder="Search Following" class="col-xs-12">\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="bottom_container">\n' +
    '      <li ng-repeat="following in followingModel | filter:following.name" class="following col-xs-12 col-sm-6 col-md-4" ng-click="goToOthers(following)">\n' +
    '        <img ng-src="https://graph.facebook.com/{{following.id}}/picture?type=large" class="followers_pic">\n' +
    '        <h6 class="user_name">{{following.name}}</h6>\n' +
    '      </li>\n' +
    '    </div>\n' +
    '\n' +
    '  </div>\n' +
    '</div>\n' +
    '\n' +
    '<!-- followers -->\n' +
    '\n' +
    '<div class="main_container" ng-if="followersPage && !followingPage && !settings">\n' +
    '  <div class="wishlist_container container col-xs-8">\n' +
    '    <div class="title_container">\n' +
    '      <h2 class="my_wishlist_title">Followers</h2>\n' +
    '    </div>\n' +
    '    <div class="bottom_container">\n' +
    '      <input ng-model="followers.name" placeholder="Search Followers" class="col-xs-12">\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="bottom_container">\n' +
    '      <li ng-repeat="follower in followersModel | filter:following.name" class="followers col-xs-12 col-sm-6 col-md-4" ng-click="goToOthers(follower)">\n' +
    '        <img ng-src="https://graph.facebook.com/{{follower.id}}/picture?type=large" class="followers_pic">\n' +
    '        <h6 class="user_name">{{follower.name}}</h6>\n' +
    '      </li>\n' +
    '    </div>\n' +
    '\n' +
    '  </div>\n' +
    '</div>\n' +
    '\n' +
    '<!-- starred -->\n' +
    '\n' +
    '<div class="main_container" ng-if="starred && !followersPage && !followingPage && !settings">\n' +
    '  <div class="wishlist_container container col-xs-8">\n' +
    '    <div class="title_container">\n' +
    '      <h2 class="my_wishlist_title">Starred People</h2>\n' +
    '    </div>\n' +
    '    <div class="bottom_container">\n' +
    '      <input ng-model="starred.name" placeholder="Search starred" class="col-xs-12 starred">\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="bottom_container starred">\n' +
    '      <div ng-model="favorites">\n' +
    '        <div ng-repeat="favorite in favsModel | filter:favorite.name">\n' +
    '          <div class="user_card col-xs-12 col-sm-6 col-md-4" ng-click="goToOthers(favorite)">\n' +
    '            <img ng-src="https://graph.facebook.com/{{favorite.id}}/picture?type=large" ng-click="show_user_info()" class="followers_pic"></img>\n' +
    '            <h6 class="user_name">{{favorite.name}}</h6>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '\n' +
    '  </div>\n' +
    '</div>\n' +
    '\n' +
    '<!-- Modal -->\n' +
    '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\n' +
    '  <div class="modal-dialog" role="document">\n' +
    '    <div class="modal-content">\n' +
    '      <div class="modal-header">\n' +
    '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n' +
    '        <h4 class="modal-title" id="myModalLabel">Wishes To Be Granted</h4>\n' +
    '      </div>\n' +
    '      <div class="modal-body">\n' +
    '        <form name="addItemForm" novalidate>\n' +
    '          <input type="text" placeholder="Link" ng-model="item.link" required>\n' +
    '          <input type="text" placeholder="Item Name" ng-model="item.name" required>\n' +
    '        </form>\n' +
    '      </div>\n' +
    '      <div class="modal-footer">\n' +
    '        <button type="button" class="btn btn-primary" ng-click="add(item, user)" data-dismiss="modal" ng-disabled="addItemForm.$invalid">Add Wish</button>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '\n' +
    '<div class="modal fade" id="edit" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" ng-keydown="$event.which === 13 && save_changes(item, editItemId)">\n' +
    '  <div class="modal-dialog" role="document">\n' +
    '    <div class="modal-content">\n' +
    '      <div class="modal-header">\n' +
    '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n' +
    '        <h4 class="modal-title" id="myModalLabel">Update Your Wish</h4>\n' +
    '      </div>\n' +
    '      <div class="modal-body">\n' +
    '        <form name="editForm" novalidate>\n' +
    '          <input type="text" placeholder="link" ng-model="item.link" required >\n' +
    '          <input type="text" placeholder="Item Name" ng-model="item.name" required>\n' +
    '        </form>\n' +
    '      </div>\n' +
    '      <div class="modal-footer">\n' +
    '        <button type="button" class="btn btn-primary" ng-click="save_changes(item, editItemId)" data-dismiss="modal" ng-disabled="editForm.$invalid">Save changes</button>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '\n' +
    '<div class="modal fade" id="showFavBy" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\n' +
    '  <div class="modal-dialog favoritedBy" role="document">\n' +
    '    <div class="modal-content">\n' +
    '      <div class="modal-header">\n' +
    '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n' +
    '        <h4 class="modal-title" id="myModalLabel">Favorited By {{favoritedByLength}}  </h4>\n' +
    '      </div>\n' +
    '      <div class="modal-body">\n' +
    '        <li ng-repeat="favoritedBy in favoritedByModel" class="favoritedByModal">\n' +
    '          <img ng-src="https://graph.facebook.com/{{favoritedBy.fbookId}}/picture?type=small" alt="">\n' +
    '          <p> {{favoritedBy.name}} </p>\n' +
    '        </li>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('home');
} catch (e) {
  module = angular.module('home', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('home/home.html',
    '<!-- <div class="logo_container">\n' +
    '  <h1 class="logo">GiFTGENiE</h1>\n' +
    '  <p class="logo">No More Unwanted Gifts</p>\n' +
    '</div> -->\n' +
    '\n' +
    '\n' +
    '\n' +
    '  <div class="logo_container">\n' +
    '    <h1 class="logo">GiFTGENiE</h1>\n' +
    '    <p class="logo">\n' +
    '      No More Unwanted\n' +
    '      <span class="stationary">Gifts</span>\n' +
    '      <div class="rw-words rw-words-2">\n' +
    '        <span>Birthday</span>\n' +
    '        <span>Wedding </span>\n' +
    '        <span>Christmas</span>\n' +
    '        <span>Graduation</span>\n' +
    '        <!-- anniversary -->\n' +
    '        <!-- valentine -->\n' +
    '      </div>\n' +
    '    </p>\n' +
    '\n' +
    '  </div>\n' +
    '\n' +
    '  <div class="home_container" ng-if="!loggedIn">\n' +
    '    <div class="button_container">\n' +
    '  <!--       make sure there is no slash after my-wishlist or it will screw up\n' +
    '      the reason is because its already defined in app.routes.js\n' +
    '      so id is automatically put into the url because its defined in app.routes.js -->\n' +
    '      <button ng-click="authenticate(\'facebook\')" class="fb_btn" ui-sref="my-wishlist({id: facebookId})">\n' +
    '        <img src="dist/images/facebook.jpg" alt="facebook-logo" class="fb_logo">\n' +
    '        Login with Facebook\n' +
    '      </button>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '\n' +
    '  <img src="https://67.media.tumblr.com/56300441954bbce6771e5d0918356f81/tumblr_nl7entl3Rc1tyvd17o1_500.gif" alt="Cutie" class="rach">\n' +
    '\n' +
    '');
}]);
})();
