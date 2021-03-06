'use strict';

var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var User = require('../models/user-model');
var Item = require('../models/item-model');
var mongoose = require('mongoose');
const MetaInspector = require('node-metainspector');


/* ______________
|               |
|  API SUMMARY: |
|_______________| */

//#1: Finding the logged in user (to display their PROFILE INFO).
//#2: USER FAVORITES list for profile info.
//#3: Finding a friend (to display FREIND PROFILE).
//#4: Adding a NEW ITEM to the wishlist.
//#5: DELETE ITEM from the wishlist (removes it from both Mongo models).
//#6: EDIT ITEM on a wishlist. (Updates both Mongo models).
//#7: REORDER ITEMS on wishlist.
//#8: FAVORITE FRIEND WISHLIST. (Also adds the user to friends 'favorited by' key).
//#9: FOLLOWING A FRIEND. (Also adds the user to friends 'followers' key).
//#10: SHOW FRIENDS FOLLOWERS / FOLLOWING.
//#11: DISPLAY FAVORITED BY. (When clicking on the star on a friends wishlist - all favorited by.)
//#12: LIKE FRIENDS ITEMS.
//#13: Changing PRIVACY SETTINGS --> From public TO PRIVATE. (Sets to private, and removes user from every other users favorites, following, and followers lists.)
//#14: Changing PRIVACY SETTINGS --> From private TO PUBLIC.
//#15: CHECKING PRIVACY setting (when click on search box in Navbar).


//API Route #1: Finding the logged in user (to display their PROFILE INFO).
router.get('/me', function(req, res) {
  User.findById(req.user, function(err, user) {
    res.status(err ? 400 : 200).send(err || user)
  }).populate('items')
});


//API Route #2: USER FAVORITES list for profile info.
router.get('/favoritesdata', function(req, res) {
  User.findById(req.user, function(err, user) {
    res.status(err ? 400 : 200).send(err || user)
  }).populate('favorites')
});


//API Route #3: Finding a friend (to display FREIND PROFILE).
router.post('/me/friend', function(req, res) {
  var friendId = req.body.params.fid;
  User.findOne({'facebook': friendId}, function(err, user){
    res.status(err ? 400 : 200).send(err || user)
  }).populate('items')
});



//API Route #4: Adding a NEW ITEM to the wishlist.
router.post('/me/items', function(req, res) {
  // console.log('THIS IS THE REQUEST', req.body)
  let item_link = req.body.link

  // STEP 1: NEED THIS BEFORE
  var client = new MetaInspector(item_link, {timeout: 50000});

  client.on('fetch', function(){
    var item_description = client.description
    // STEP 2: NEED TO DO THIS AFTER
    User.findById(req.user, function(err, user) {
      // console.log('INSIDE USER FIND', user)
      if (!user) {
        return res.status(400).send({ message: 'User not found' });
      }
      Item.submit(req.body, function(err, savedItem) {
        console.log('INSIDE ITEM SUBMITTTED', savedItem)
        console.log('AUTOMATED ITEM DESCRIPTION', item_description)
        user.items.push(savedItem);
        user.save(function(err, user) {
          res.send(user);
        })
      });
    });
  })

  client.on('error', function(err){
    console.error('err', err)
  })

  client.fetch();


  // User.findById(req.user, function(err, user) {
  //   console.log('INSIDE USER FIND', user)
  //   // console.log('AUTOMATED ITEM DESCRIPTION', item_description)
  //   if (!user) {
  //     return res.status(400).send({ message: 'User not found' });
  //   }
  //   Item.submit(req.body, function(err, savedItem) {
  //     console.log('INSIDE ITEM SUBMITTTED', savedItem)
  //     // console.log('AUTOMATED ITEM DESCRIPTION', item_description)
  //     user.items.push(savedItem);
  //     user.save(function(err, user) {
  //       res.send(user);
  //     })
  //   });
  // });

});


//API Route #5: DELETE ITEM from the wishlist (removes it from both Mongo models).
router.put('/me/deleteitem', function(req, res) {
  var clickedItemId = req.body._id;
  var objectId = mongoose.Types.ObjectId(clickedItemId);

  User.findByIdAndUpdate(req.user, {$pull : { "items" : objectId }}, function(err, user) {
    if(err){
      res.status(400).send(err);
    }
    Item.findByIdAndRemove(clickedItemId, function(err, item){
      res.send(user);
    });
  })
});


//API Route #6: EDIT ITEM on a wishlist. (Updates both Mongo models).
router.put('/me/edititem', function(req, res) {
  var editItem = req.body;
  console.log('editem', req.body)
  Item.update( {"_id": editItem.id}, { "name": editItem.name, "link": editItem.link }, function(err, item) {
    var edittedItem = {
      name: editItem.name,
      link: editItem.link
    }
    // res.send(item, edittedItem); #outdated
    // can just use 200 because we know for certain it didn't fail if reached
    res.status(200).send(edittedItem)

  });
});


//API Route #7: REORDER ITEMS on wishlist.
router.put('/me/itemreorder', function(req, res){
  var newItemOrder = [];
  var updatedItemOrder = req.body;

  for (var i = 0; i < updatedItemOrder.length; i++){
    var mongoId = updatedItemOrder[i]._id;
    newItemOrder.push(mongoId);
  }

  User.findById(req.user, function(err, user){
    var userItems = user.items;
    User.update({"_id": req.user}, {$set : {"items" : newItemOrder}}, function(err, user){
      res.send(user)
    })
  })
})


//API Route #8: FAVORITE FRIEND WISHLIST. (Also adds the user to friends 'favorited by' key).
router.put('/me/favorite', function(req, res){
  var starred_friend = req.body._id;

  User.findById(req.user, function(err, user){
    if (!user){
      return res.status(400).send({messages: 'User Not Found'})
    }
    //If that logged in user has already favorited this friend's wishlist:
    //Task a) They're removed from friend's 'favorited by'.
    if (req.body.favoritedBy.indexOf(req.user) > -1){
      User.update({"_id": req.body._id}, {$pull: {"favoritedBy": req.user}}, function(err, user){
        if (err) {res.status(400).send(err);}
      })
    }
    //Task b) The friend is removed from the user's favorites.
    if (user.favorites.indexOf(starred_friend) > -1){
      User.update({"_id": req.user}, {$pull: {"favorites": starred_friend}}, function(err, user){
        if(err){ res.status(400).send(err);}
      })
      return;
    }

    User.update({"_id": req.body._id}, {$push: {"favoritedBy": req.user}}, function(err, user){
      if (err) {res.status(400).send(err);}
      res.write('The user who is favoriting a friends wishlist has been added to the friends favorited by.')
    })

    User.update({"_id": req.user}, {$push: {"favorites": starred_friend}}, function(err, user){
      if(err){ res.status(400).send(err);}
      res.write('The friend has been added to the users favorites.')
      res.end();
    })
  });
})


//API Route #9: FOLLOWING A FRIEND. (Also adds the user to friends 'followers' key).
router.put('/me/following', function(req, res){

  var personFollowingYou = req.user;
  var followingThisPerson =  req.body._id

  User.findById(req.user, function(err, user){
    if (!user) {return res.status(400).send({messages: 'User Not Found'}) }

    //If that logged in user has already followed this friend:
    //Task a) They're removed from user's following list - so have unfollowed.
    if (user.following.indexOf(followingThisPerson) > -1){
      User.update({"_id": req.user}, {$pull: {"following": followingThisPerson}}, function(err, user){
        if (err) {res.status(400).send(err)}
      })
    }
    //Task b) Removing the user from friends followers list.
    if (req.body.followers.indexOf(personFollowingYou) > -1){
      User.update({"_id": followingThisPerson}, {$pull: {"followers": personFollowingYou}}, function(err, user){
        if (err) {res.status(400).send(err);}
      })
      return;
    }


    User.update({"_id": req.user}, {$push: {"following": followingThisPerson}}, function(err, user){
      if (err) {res.status(400).send(err);}
      res.write('You are now following this friend.')
    })
    User.update({"_id": req.body._id}, {$push: {"followers": personFollowingYou }}, function(err, user){
      if (err) {res.status(400).send(err);}
      res.write('You are listed as a follower of your friend.')
      res.end();
    })
  });
})


//API Route #10: SHOW FRIENDS FOLLOWERS / FOLLOWING.
router.post('/friend/showfriendfollows', function(req, res){
  var followMongoIdArray = req.body.params.friendIds;

  var allFollowUsers = [];
  for (var i = 0; i < followMongoIdArray.length; i++){
    var eachFollow = followMongoIdArray[i];

    User.findById({"_id": eachFollow}, function(err, user) {
      if (err) {res.status(400).send(err)}
      var everyUser = user;
      allFollowUsers.push(everyUser);
      var userCheck = user._id;
      if(followMongoIdArray.length === allFollowUsers.length) {
        res.send(allFollowUsers)
      }
    })
  }
})


//API Route #11: DISPLAY FAVORITED BY. (When clicking on the star on a friends wishlist - all favorited by.)
router.post('/me/favoritedby', function(req, res){
  var favoritedByMongoIdArray = req.body.params.favoritedByIds;

  var allFavoritedBy = [];
  for (var i = 0; i < favoritedByMongoIdArray.length; i++){
    var eachFavoritedBy = favoritedByMongoIdArray[i];

    User.findById({"_id": eachFavoritedBy}, function(err, user) {
      if (err) {res.status(400).send(err)}
      var everyUser = user;
      allFavoritedBy.push(everyUser);
      var userCheck = user._id;
      if(favoritedByMongoIdArray.length === allFavoritedBy.length) {
        res.send(allFavoritedBy)
      }
    })
  }
})


//API Route #12: LIKE FRIENDS ITEMS.
router.put('/items/liked', function(req, res){
  var likedItem = req.body._id

  User.findById(req.user, function(err, user){

    //If that logged in user has already liked the friends item:
    if (user.liked.indexOf(likedItem) > -1) {
      User.update({"_id": req.user}, {$pull: {"liked": likedItem}}, function(err, user){
        if (err) {res.status(400).send(err)}
      })
      return;
    }

    User.update({"_id": req.user}, {$push: {"liked": likedItem}}, function(err, user){
      if (err) {res.status(400).send(err)}
      res.send(user);
    })
  })
})


//API Route #13: Changing PRIVACY SETTINGS --> From public TO PRIVATE. (Sets to private, and removes user from every other users favorites, following, and followers lists.)
router.put('/me/makeprivate', function(req, res){
  var newlyPrivateUser = req.user;

  User.findById(req.user, function(err, user){
    User.update({"_id": req.user}, {$set: {"private": true}}, function(err, user) {
      if (err) {res.status(400).send(err)}

      var mongoFormOfPrivateUser = mongoose.Types.ObjectId(newlyPrivateUser);
      var arrayForm = [mongoFormOfPrivateUser];

      User.find( {"favorites" : { $in : arrayForm }}, function(err, faves) {
        var usersWithPrivatedInFaves = faves;

        User.find( {"following" : { $in : arrayForm }}, function(err, following) {
          var usersWithPrivatedInFollowing = following;

          User.find( {"followers" : { $in : arrayForm }}, function(err, followers) {
            var usersWithPrivatedInFollowers = followers;

            User.find( {"favoritedBy" : { $in : arrayForm }}, function(err, favoritedBy) {
              var usersWithPrivatedInFavoritedBy = favoritedBy;

              //If logged in user is present in others favorites lists, they're removed:
              if(usersWithPrivatedInFaves.length > 0) {
                for (var i = 0; i < usersWithPrivatedInFaves.length; i++){
                  var theUser = usersWithPrivatedInFaves[i]._id;

                  var allFaveRemovals = [];
                  User.update({"_id": theUser}, {$pull: {"favorites": mongoFormOfPrivateUser}}, function(err, user) {
                    if (err) {res.status(400).send(err)}
                    var eachUser = user;
                    allFaveRemovals.push(eachUser)
                  })
                }
              }

              //If logged in user is present in others following lists, they're removed:
              if(usersWithPrivatedInFollowing.length > 0) {
                for (var i = 0; i < usersWithPrivatedInFollowing.length; i++){
                  var theUser = usersWithPrivatedInFollowing[i]._id;

                  var allFollowingRemovals = [];
                  User.update({"_id": theUser}, {$pull: {"following": mongoFormOfPrivateUser}}, function(err, user) {
                    if (err) {res.status(400).send(err)}
                    var eachUser = user;
                    allFollowingRemovals.push(eachUser)
                  })
                }
              }

              //If logged in user is present in others followers lists, they're removed:
              if(usersWithPrivatedInFollowers.length > 0) {
                for (var i = 0; i < usersWithPrivatedInFollowers.length; i++){
                  var theUser = usersWithPrivatedInFollowers[i]._id;

                  var allFollowersRemovals = [];
                  User.update({"_id": theUser}, {$pull: {"followers": mongoFormOfPrivateUser}}, function(err, user) {
                    if (err) {res.status(400).send(err)}
                    var eachUser = user;
                    allFollowersRemovals.push(eachUser)
                  })
                }
              }

              //If logged in user is present in others followers lists, they're removed:
              if(usersWithPrivatedInFavoritedBy.length > 0) {
                for (var i = 0; i < usersWithPrivatedInFavoritedBy.length; i++){
                  var theUser = usersWithPrivatedInFavoritedBy[i]._id;

                  var allFavoritedByRemovals = [];
                  User.update({"_id": theUser}, {$pull: {"favoritedBy": mongoFormOfPrivateUser}}, function(err, user) {
                    if (err) {res.status(400).send(err)}
                    var eachUser = user;
                    allFavoritedByRemovals.push(eachUser)
                  })
                }
              }
              res.send(user)
            })
          })
        })
      })
    })
  })
})


//API Route #14: Changing PRIVACY SETTINGS --> From private TO PUBLIC.
router.put('/me/makepublic', function(req, res){
  User.findById(req.user, function(err, user){
    User.update({"_id": req.user}, {$set: {"private": false}}, function(err, user) {
      if (err) {res.status(400).send(err)}
      res.send(user);
    })
  })
})


//API Route #15: CHECKING PRIVACY setting (when click on search box in Navbar).
router.post('/me/checkfriendprivacy', function(req, res) {
  var userMates = req.body.friends;

  User.find( {facebook: { $in : userMates }}, function(err, users) {
    var allFriends = users;
    var friendsWhoArePublic = [];
    var friendsWhoArePrivate = [];

    for (var i = 0; i < users.length; i++){
      if(users[i].private == false) {
        friendsWhoArePublic.push(users[i])
      } else if (users[i].private == true) {
        friendsWhoArePrivate.push(users[i])
      }
    }

    var idsOfPrivateMates = []
    for (var i = 0; i < friendsWhoArePrivate.length; i++){
      var mongoId = friendsWhoArePrivate[i]._id;
      idsOfPrivateMates.push(mongoId);
    }

    var data = {
      publicFriends: friendsWhoArePublic,
      privateFriends: friendsWhoArePrivate
    }

    if (err) console.error(err)
    res.send(data)
  })
})

module.exports = router;
