var express = require('express');
var app = express();
var mdb = require('mongodb');
var fs = require('fs');
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
app.use('/img',express.static(__dirname+'/public/uploads'));
app.use(express.bodyParser());

app.get('/', function(req, res){
    getPosts(function(content){ //in order to get most updated content use callback to wait for database response
        res.render('index', {"title":"Home", "boards":boards, "posts": content});
    });
});

app.post('/post-entry', function(req, res){
    if(!req.body.post.user){
        req.body.post.user = "Anonymous";
    }
    if(req.files.image){ //if there's an attached image save image and add image field
        fs.readFile(req.files.image.path, function(err, data){
            var newPath = __dirname + "/public/uploads/" + req.files.image.name;
            fs.writeFile(newPath, data, function(err) {if(err){console.log(err)}else{console.log("written")}});
        })
        collection.insert({name: req.body.post.user, body: req.body.post.content, image: "/img/"+req.files.image.name}, {w:1}, function(err, result){
            if(err){console.log(err); return;}
            console.log("post success");
            res.redirect('/'); //don't redirect until action compelete
        });
    }
    else{
        collection.insert({name: req.body.post.user, body: req.body.post.content}, {w:1}, function(err, result){
            if(err){console.log(err); return;}
            console.log("post success");
            res.redirect('/');
        });
    }
    })

app.listen(3000);
console.log("listening on port 3000");

function getPosts(callback){
    collection.find({}).toArray(function(err, docs){
        if(err){console.log(err); return;}
        if(docs.length > 0){
            callback(docs.reverse());
        }
    })
}