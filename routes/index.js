var express = require('express');
var router = express.Router();
var fs = require('fs');

ObjectID = require('mongoskin').ObjectID;

// SET to READONLY MODE AND USE CACHE
var mode = "read-only";
// var mode = "read-write";

/* GET home page. */
router.get('/', function(req, res) {
  if (mode === "read-only") {
    readFromFile("cache", function(items) {
      res.render('index',
        { title: 'Guitar Tabssss',
          songs: JSON.parse(items)
      });
    });
  } else {
    req.db.collection('songs').find().toArray(function (err, items) {
      if(!err) {
        // update cache file
        writeToFile("cache", JSON.stringify(items));
      }

      res.render('index',
        { title: 'Guitar Tabssss',
          songs: items
      });
    });
  }
});

router.get('/:id', function(req, res) {
    if (mode === "read-only") {
      readFromFile("cache", function(data) {
        var items = JSON.parse(data),
            item = {};

        for(var i=0; i<items.length; i++) {
          if(items[i]._id === req.params.id) {
            item = items[i];
          }
        }
        res.render('detail',
              { title: item.artist + " - " + item.title,
                song: item });
      });
    } else {
      var db = req.db;
      db.collection('songs').findById(new ObjectID(req.params.id), function (err, item) {
            res.render('detail',
              { title: item.artist + " - " + item.title,
                song: item });
        });
    }
});

router.get('/edit/:id', function(req, res) {
    var db = req.db;
    db.collection('songs').findById(new ObjectID(req.params.id), function (err, item) {
          res.render('edit',
            { title: 'edit ' + item.title,
              song: item });
      });
});

router.get('/list', function(req, res) {
    var db = req.db;
    db.collection('songs').find().toArray(function (err, items) {
          res.json(items);
      });
});

router.get('/new', function(req, res) {
    var db = req.db;
    // This line of code will get distinct artists out to populate a dropdown
    // Also sorts it
    db.collection('songs').aggregate([{'$group': {_id: {artist: '$artist'}}},
    {'$sort' : {'_id.artist' : 1}}], function (err, items) {
      if (err) {
        res.send("There was a problem reading stuff.");
      } else {
        res.render('new',
          {
            title: 'New song',
            items: items
          });
      }
    });
});

router.post('/save', function(req, res) {

    var db = req.db;
    var song = req.body.song;

    var collection = db.collection('songs');

    collection.updateById(new ObjectID(song._id), extractSongFromJsonData(song), function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        } else {
            res.send("OK.");
        }
    });
});

router.post('/update/:id', function(req, res) {

    var db = req.db;

    var collection = db.collection('songs');

    // $set used to only update the properties that I pass - we are not updating the words array
    collection.updateById(new ObjectID(req.params.id), {$set: extractMetaFromRequestBody(req.body)}, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        } else {
            res.location("/edit/" + req.params.id);
            res.redirect("/edit/" + req.params.id);
        }
    });
});

router.post('/new', function(req, res) {

    var db = req.db;

    var collection = db.collection('songs');

    collection.insert(extractSongFromRequestBody(req.body), function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        } else {
            res.location("/edit/" + doc[0]._id);
            res.redirect("/edit/" + doc[0]._id);
        }
    });
});

function extractSongFromRequestBody(body) {
    return {
        "artist" : body.artist,
        "title" : body.title,
        "words" : stringToWordsArray(body.words),
        "video" : body.video,
        "capo" : body.capo || 0
    }
}

function extractMetaFromRequestBody(body) {
    return {
        "artist" : body.artist,
        "title" : body.title,
        "video" : body.video,
        "capo" : body.capo || 0
    }
}

function extractSongFromJsonData(json) {
    return {
        "artist" : json.artist,
        "title" : json.title,
        "words" : json.words,
        "video" : json.video,
        "capo"  : json.capo || 0
    }
}

function stringToWordsArray(str) {
  var initial = str.split(" "),
      final = [];

  for(var i = 0; i < initial.length; i++) {
      final.push({ note: "", text: initial[i]});
  }

  return final;
}

function writeToFile(path, data) {
  fs.writeFile(path, data, function(err) {
    if (err) throw err;
    console.log("Updated cache Succes");
  });
}

function readFromFile(path, callback) {
  fs.readFile(path, function (err, data) {
    if (err) console.console.log(err.message);
    callback(data);
  });
}

module.exports = router;
