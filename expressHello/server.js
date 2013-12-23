var express = require('express');
var app = express();
var mdb = require('mongodb');
var db;
var collection;
boards = ['a', 'b', 'c', 'd'];
mdb.connect("mongodb://Hello:World@dharma.mongohq.com:10063/Expressr", 
            function(err, base){
                if (err){return console.dir(err);}
                db = base;
                collection = db.collection('posts');
                console.log("db connected");
            })

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname+'/public'));
app.use(express.bodyParser());

app.get('/', function(req, res){
    getPosts(function(content){
        res.render('index', {"title":"Home", "boards":boards, "posts": content});
    });
});

app.post('/post-entry', function(req, res){
    collection.insert({name: req.body.post.user, body: req.body.post.content}, {w:1}, function(err, result){
        if(err){console.log(err); return;}
        console.log("post success");
    });
    res.redirect('/');})

app.listen(3000);
console.log("listening on port 3000");

function getPosts(callback){
    collection.find({}).toArray(function(err, docs){
        if(err){console.log(err); return;}
        if(docs.length > 0){
            callback(docs);
        }
    })
}