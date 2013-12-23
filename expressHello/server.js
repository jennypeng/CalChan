var express = require('express');
var app = express();
var mdb = require('mongodb');
var db;
var collection;
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

var content = {};
content.posts = {};
content.title = "Home";
content.boards = ['a', 'b', 'c', 'd'];

app.get('/', function(req, res){
    console.log(content.posts);
    res.render('index', content);
});

app.post('/post-entry', function(req, res){
    content.title = "pls";
    name = req.body.post.user;
    body = req.body.post.content;
    collection.insert({name: name, body: body}, {w:1}, function(err, result){
        if(err){console.log(err); return;}
        collection.findAll
    });
    content.posts[name] = body;
    res.redirect('/');})

app.listen(3000);
console.log("listening on port 3000");