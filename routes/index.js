var express = require('express');
var router = express.Router();
var validator = require("../public/javascripts/validator");
var bodyParser = require('body-parser');
var session = require("express-session");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var cookie = require("cookie-parser");

express().use(cookie(), function(err) {
	if (err) console.log(err);
});

var debug = require('debug')('signin:index');


/*按url申请打开详情*/
router.get('/detail', function(req, res, next) {
	req.session.user = req.cookies.user;
	var message;
	if (req.session.user.username == req.query.username || req.session.user.username != undefined && req.query.username == undefined) {
		message = "";
	} else {
		message = "只能够访问自己的数据"
	}
	res.render('detail', { title: "详情", user: req.session.user, message: message});
});

/*在详情页面post以退出*/
router.post('/detail', function(req, res, next) {
	res.cookie("user", {});
	req.session.user = {};
	console.log(">退出登录");
	res.redirect('/');
});


/*打开登录页面*/
router.get('/', function(req, res, next) {console.log(req.session);console.log(req.cookies);
	if (req.query.username != undefined) {
		res.redirect('/detail?username=' + req.query.username);
	} else if (req.cookies.user == undefined) {
		res.render('signin', { title: "登录" });
	} else if (req.cookies.user.username != undefined) {
		res.redirect('/detail');
	} else {
		res.render('signin', { title: "登录" });
	}
});

/*提交登录信息*/
router.post('/', function(req, res, next) {
	var user = req.body;
	login(req, res, user);
});


/*打开注册页面*/
router.get('/regist', function(req, res, next) {
	res.render('signup', { title: "注册", user: {} });
});

/*提交注册信息*/
router.post('/regist', function(req, res, next) {
	var user = req.body;
	var Msgs = [];
	checkUser(user, Msgs);
	register(req, res, user, Msgs);
});


router.all('*', function(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect('/regist');
	}
});

function login(req, res, user) {
	console.log(">登录");
	var mongodb = require('mongodb');
	var server = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
	var db = new mongodb.Db('userInfo', server, {safe:true});

	db.open(function(err, db) {
		console.log(">>打开数据库");
		if (!err) {
			db.collection('users', {safe:true}, function(err, collection) {
				console.log(">>>>进入数据集");
				if (!err) {
					collection.findOne({username: user.username, password: user.password}, function(err, doc) {
						console.log(">>>>>>查找用户");
						if (doc == null) {
							console.log(">>>>>>登录失败");
							res.render('signin', { message: "用户名或密码有误"});
						} else {
							req.session.user = doc;
							res.cookie("user", doc);
							res.redirect("/detail");
							console.log(">>>>>>登录成功");
						}
						db.close();
					});
				} else {
					console.log(err);
				}
			});
		} else {
			console.log(err);
		}
	});
}

function foundKey(key, doc, Msgs) {
	console.log(">>>>>>查找" + key);
	if (doc == null) {
		Msgs.push(validator.existence[key].correctMessage);
		return false;
	} else {
		Msgs.push(validator.existence[key].errorMessage);
		return true;
	}
}

function register(req, res, user, Msgs) {
	console.log(">注册");
	var mongodb = require('mongodb');
	var server = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
	var db = new mongodb.Db('userInfo', server, {safe:true});

	db.open(function(err, db) {
		console.log(">>打开数据库");
		if (!err) {
			db.collection('users', {safe:true}, function(err, collection) {
				console.log(">>>>进入数据集");
				if (!err) {
					var checked_username = false;
					var found_username = false;
					collection.findOne({username: user.username}, function(err, doc) {
						found_username = foundKey("username", doc, Msgs);
						checked_username = true;
					});

					var checked_studentID = false;
					var found_studentID = false;
					collection.findOne({studentID: user.studentID}, function(err, doc) {
						found_studentID = foundKey("studentID", doc, Msgs);
						checked_studentID = true;
					});

					var checked_phone = false;
					var found_phone = false;
					collection.findOne({phone: user.phone}, function(err, doc) {
						found_phone = foundKey("phone", doc, Msgs);
						checked_phone = true;
					});

					var checked_email = false;
					var found_email = false;
					collection.findOne({email: user.email}, function(err, doc) {
						found_email = foundKey("email", doc, Msgs);
						checked_email = true;
					});

					setTimeout(function() {
						if (checked_username && checked_studentID && checked_phone && checked_email) {
							if (found_username || found_studentID || found_phone || found_email) {
								db.close();
								console.log(Msgs);
								res.render('signup', { title: "注册", user: {}, message: Msgs });
							} else {
								collection.insert(user, {safe: true}, function(err, result) {
									console.log(">>>>>>注册成功");
									db.close();
									console.log(Msgs);
									req.session.user = user;
									res.cookie("user", user);
									res.redirect('/detail');
								});
							}
						}
					}, 1000);
				} else {
					console.log(err);
				}
			});
		} else {
			console.log(err);
		}
	});
}

function checkUser(user, Msgs) {
    for (var key in user) {
    	if (key == "confirmPassword") {
    		continue;
    	}
        if (!validator.fieldIsValid(key, user[key])) {
        	Msgs.push(validator.form[key].errorMessage);
        } else {
        	Msgs.push(validator.form[key].correctMessage);
        }
    }
}

function getErrorHtml(Msgs) {
    var element = Msgs.map(function(t) {
        return "<div class='errorInfo'>" + t + "</div>";
    });
    return element.join(" ");
}

module.exports = router;