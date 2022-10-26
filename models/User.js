const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
	name: {
		type: String,
		maxlength: 50
	},
	email: {
		type: String,
		trim: true,          // 중간의 space를 없애줌!
		unique: 1
	},
	password: {
		type: String,
		minlength: 4
	},
	lastname:{
		type: String,
		maxlength: 50
	},
	role: {
		type: Number,
		default: 0
	},
	image: String,
	token: {
		type: String
	},      // 유효성검사 쓸ㄹ수잇오용
	tokenExp: {
		type: Number
	}
})

userSchema.pre('save', function(next){
	var user = this;   // == userSchema

	if(user.isModified('password')){

		// 비밀번호 암호화
		bcrypt.genSalt(saltRounds, function(err, salt){
			if(err) return next(err);
			bcrypt.hash(user.password, salt, function(err, hash){
				if(err) return next(err);
				user.password = hash;
				next();
			})
		})
	} else {
		next();
	}
}) 

userSchema.methods.comparePassword = function(plainPassword, cb) {
	// 입력하는 비밀번호와 암호화된 비밀번호 비교 
	// 암호화된 비밀번호를 복호화 할 순 없음, 다시 원 비밀번호를 암호화시켜서 비교 
	bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
		if(err) return cb(err);
			cb(null, isMatch);
	})
}

//userSchema의 스키마(json필드)에 token과 tokenExp값 설정해주기
// 입력값 -> token: { type: String }, tokenExp : { type: Number },
userSchema.methods.generateToken = function(cb){
	// jsonwebtoken을 이용해서 토큰 생성하기
	var user = this;
	var token = jwt.sign(user._id.toHexString(), 'secretToken')
	
	// user._id + 'secretToken' 으로 token을 만듬 
	// token 해석시 'secretToken'을 넣으면 user._id가 나옴
	user.token = token
	user.save(function(err, user) {
		if(err) return cb(err)
		cb(null, user)
	})
}

const User = mongoose.model('User', userSchema);        //('model의 이름', Schema), Schema를 Model로 감싸줌
module.exports = { User };           // 다른 파일에서도 쓸 수 있게 export