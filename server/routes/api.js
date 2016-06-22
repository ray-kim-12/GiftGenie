'use strict';

var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
// var async = require("async");


var User = require('../models/user-model');
var Item = require('../models/item-model');

//#1: Finding a user (to display their profile info).
router.get('/me', function(req, res) {
  User.findById(req.user, function(err, user) {
    res.status(err ? 400 : 200).send(err || user)
  }).populate('items')
});

//#2: Adding a new item to the wishlist.
router.post('/me/items', function(req, res) {
  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    Item.submit(req.body, function(err, savedItem) {
      user.items.push(savedItem);
      user.save(function(err, user) {
        res.send(user);
      })
    });
  });
});

//Route #3: Deleting an item from the wishlist (removes it from both Mongo models).
router.put('/me/items/delete', function(req, res) {
  // var clicked = req.body;
  var clickedItemId = req.body._id;
  // var clickedItemName = req.body.name;

  var mongoose = require('mongoose');
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

//Route #4: Editting an item on a wishlist (updates both Mongo models).

router.put('/me/items/edit', function(req, res) {
  var editItem = req.body;
  var editItemId = editItem.id;

  var editItemName = editItem.name;
  var editItemLink = editItem.link;

  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    // var new = user.items.ObjectId.str;

    // cannot read property 'str' of undefined error needs to be fixed;
    User.update( {"items" : { $elemMatch: { "_id": editItemId.str }}},
    { "name": editItemName, "link": editItemLink },
    function(err, user) {
      if(err){
        res.status(400).send(err);
      }
      Item.update( {"_id": editItemId},
      { "name": editItemName,
      "link": editItemLink },
      function(err, item) {
        res.send(user);
      });
    });
  });
});

router.put('/me/items/order', function(req, res){
  var newUserItems = [];
  var newItemsOrderArr = req.body;

  for (var i = 0; i < newItemsOrderArr.length; i++){
    var mongoId = newItemsOrderArr[i]._id;
    newUserItems.push(mongoId);
  }

  User.findById(req.user, function(err, user){
    var userItems = user.items;
    User.update({"_id": req.user}, {$set : {"items" : newUserItems}}, function(err, user){
      res.send(user)
    })
  })
})

// Favorite User's Wishlist
router.put('/me/star', function(req, res){
// console.log(req.body, 'req.body')
  var starred_friend = req.body._id;

  User.findById(req.user, function(err, user){
    if (!user){
      return res.status(400).send({messages: 'User Not Found'})
    }

    if (user.favorites.indexOf(starred_friend) > -1){
      User.update({"_id": req.user}, {$pull: {"favorites": starred_friend}}, function(err, user){
        if(err){ res.status(400).send(err);}
          console.log('wishlist already in the favorites array');
          console.log('wishlist unfavorited');
        })
      return;
    }

    User.update({"_id": req.user}, {$push: {"favorites": starred_friend}}, function(err, user){
      if(err){ res.status(400).send(err);}
      console.log('this is the user that was added to your favorite', user)
      res.send(user)
    })
  });
})

// router.put('/me/following', function(req, res){

//   console.log('req.user', req.user)
//   console.log('REQ BODY QEQWEQWEQWEQWEWE',req.body)
//   var followingThisPerson =  req.body._id

//   User.findById(req.user, function(err, user){
//     if (!user) {return res.status(400).send({messages: 'User Not Found'}) }

//     if (user.following.indexOf(followingThisPerson) > -1){
//       User.update({"_id": req.user}, {$pull: {"following": followingThisPerson}}, function(err, user){
//         if (err) {res.status(400).send(err)}
//           console.log('already following this user; now UNFOLLOWING THIS USER', user)
//       })
//       return;
//     }


//     User.update({"_id": req.user}, {$push: {"following": followingThisPerson}}, function(err, user){
//       if (err) {res.status(400).send(err);}
//         console.log('this is the user you are following now', user)
//       res.send(user)
//     })
//   });
// })

router.put('/me/following', function(req, res){

<<<<<<< HEAD
  console.log('req.user', req.user)
  console.log('REQ BODY QEQWEQWEQWEQWEWE',req.body)
  var personFollowingYou = req.user;
  var followingThisPerson =  req.body._id

  User.findById(req.user, function(err, user){

    console.log('!#@@$%#$%@#$@#$#@$@#$@#$@#@#', user)

    if (!user) {return res.status(400).send({messages: 'User Not Found'}) }

    if (user.following.indexOf(followingThisPerson) > -1){
      User.update({"_id": req.user}, {$pull: {"following": followingThisPerson}}, function(err, user){
        if (err) {res.status(400).send(err)}
          console.log('already following this user; now UNFOLLOWING THIS USER', user)
      })
    }

    if (req.body.followers.indexOf(personFollowingYou) > -1){
      User.update({"_id": followingThisPerson}, {$pull: {"followers": personFollowingYou}}, function(err, user){
        if (err) {res.status(400).send(err);}
        console.log('the person you are trying to follow already has you in their followers array, therefore you are removed')
      })
      return;
    }


    User.update({"_id": req.user}, {$push: {"following": followingThisPerson}}, function(err, user){
      if (err) {res.status(400).send(err);}
        console.log('this is the user you are following now')
      res.write('this is the user you are following now')
    })

    User.update({"_id": req.body._id}, {$push: {"followers": personFollowingYou }}, function(err, user){
      if (err) {res.status(400).send(err);}
      console.log('your id has been added to the followers array of the person you are following')
      res.write('your id has been added to the followers array of the person you are following')
      res.end();
    })

  });
=======
  //   console.log('favorites array', user.favorites)
  //   console.log('req.user', req.user)
  //
  //   if (user.favorites.indexOf(req.user) > -1){
  //     User.update({"_id": req.user}, {$pull: {"favorites": req.user}}, function(err, user){
  //     if(err){ res.status(400).send(err);}
  //       console.log('wishlist already in the favorites array');
  //       console.log('wishlist unfavorited');
  //     })
  //     return;
  //   }

  //   // why can't we $push user.facebook ? it doesn;t save in robomongo
  //   User.update({"_id": req.user}, {$push: {"favorites": req.user}}, function(err, user){
  //     if(err){ res.status(400).send(err);}
  //     console.log('this is the user that was added to your favorite', user)
  //     res.send(user)
  //   })
  // })
>>>>>>> 61f58c0abdaee13b660da8c82020a82bf5d69ee9
})



router.post('/friend', function(req, res){
  // console.log('FRIEND FACEBOOK ID', req.body.params)
  var friendId = req.body.params.fid;

  User.findOne({'facebook': friendId}, function(err, user){

    console.log(user.items, 'USER*************************');
    var friendItems = user.items;
    console.log(friendItems, 'items');

    var mongoose = require('mongoose');
    friendItems = friendItems.map(function(id) { return mongoose.Types.ObjectId(id) });

    // var allFriendItems = [];

    Item.find( {_id: { $in : friendItems }}, function(err, items) {

      console.log(items, '<-------Items.');
      var allItems = items;

      var data = {
        user: user,
        items: allItems
      }

      console.log(data, 'DATA')
      if (err) console.error(err)
      res.send(data)
    })
  })
})

router.get('/favorites/data', function(req, res) {
  User.findById(req.user, function(err, user){
    if (!user){
      return res.status(400).send({messages: 'User Not Found'})
    }

    var faves = user.favorites;
    var mongoose = require('mongoose');
    faves = faves.map(function(id) { return mongoose.Types.ObjectId(id) });

    User.find( {_id: { $in : faves }}, function(err, faves) {
      var allFaveData = faves;

      var data = {
        user: user,
        favoritesData: faves
      }

      console.log(data, 'THE DATA.')
      if (err) console.error(err)
      res.send(data)
    })
  })
})


// like items;
router.put('/items/liked', function(req, res){
  var likedItem = req.body._id
    User.findById(req.user, function(err, user){

      if (user.liked.indexOf(likedItem) > -1) {
        console.log('item already liked')
        User.update({"_id": req.user}, {$pull: {"liked": likedItem}}, function(err, user){
          if (err) {res.status(400).send(err)}
          console.log('item unliked')
        })
        return;
      }

      console.log('user INSIDE @#$#$%Y#@$%^$#%^&$', user)
      User.update({"_id": req.user}, {$push: {"liked": likedItem}}, function(err, user){
        if (err) {res.status(400).send(err)}
          console.log('liked item added')
        res.send(user);
      })
    })
})


module.exports = router;
