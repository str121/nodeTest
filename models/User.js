const mongoose = require('mongoose');
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
const User = mongoose.model('User', userSchema);        //('model의 이름', Schema), Schema를 Model로 감싸줌
module.exports = { User };           // 다른 파일에서도 쓸 수 있게 export