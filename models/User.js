const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = mongoose.Schema({
	name: {
		type: String,
		maxlength: 50,
	},
	email: {
		type: String,
		trim: true,          // 중간의 space를 없애줌!
		unique: 1,
	},
	lastname:{
		type: String,
		maxlength: 50,
	},
	role: {
		type: Number,
		default: 0,
	},
	image: String,
	token: {
		type: String,
	},      // 유효성검사 쓸ㄹ수잇오용
	tokenExp: {
		type: Number,
	},
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


const User = mongoose.model('User', userSchema);        //('model의 이름', Schema), Schema를 Model로 감싸줌
module.exports = { User };           // 다른 파일에서도 쓸 수 있게 export