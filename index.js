const express = require('express')   // 다운받은 express 모듈을 가져옴
const app = express()           // 가져온 express function 사용
const port = 5000                 // 사용할 port number, 임의적으로 사용 가능

const mongoose = require('mongoose');    // mongoose 어플리케이션 사용
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { User } = require("./models/User");
const config = require('./config/key');


//application/x-www-form-urlencoded -> url encoded 형태로 오는 데이터 처리
app.use(bodyParser.urlencoded({extended:true}));
//aplication/json -> json 형태로 오는 데이터 처리
app.use(bodyParser.json());
app.use(cookieParser());


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

mongoose.connect(config.mongoURI, {
	useNewUrlParser: true
    // , userUnifiedTopology: true, userCresteIndex: true, useFindAndModify: true   // 에러
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))




app.get('/', (req, res) => {
	res.send('2022-05-30,31일 생성 완료')
})

app.post('/regTest', (req, res) => {
	const user = new User(req.body)
	let now =  new Date();
	res.send(now + "\n" + user);
})

app.post('/register', (req, res) => {
	// 회원가입 할 때 필요한 정보들을 (client에서 가져오면) 그것들을 DB에 넣어준다
	// body-parser가 
	const user = new User(req.body)
	// 몽고DB의 save메소드
	user.save((err, userInfo) => {
		if(err) return res.json({ success: false, err });
		return res.status(200).json({ success: true, userInfo });
	})
})

app.post('/test/login', (req, res) => {
	// 요청된 이메일을 데이터베이스에 있는지 찾는다.
	User.findOne({ email: req.body.email }, (err, user) => {
		if(!user){
			return res.json({
				loginSuccess: false,
				message: "제공된 이메일에 해당하는 유저가 없습니다"
			})
		}
		// 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
		user.comparePassword(req.body.password, (err, isMatch) => {
			if(!isMatch)
				return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
			// 비밀번호까지 맞다면 토큰 생성
			user.generateToken((err, user) => {
				if(err) return res.status(400).send(err);
				// 토큰을 저장 (쿠키/로컬스토리지,... etc)
				// 쿠키에 토큰 저장
				res.cookie("x_auth", user.token).status(200).json({ loginSuccess: true, userId: user._id })
			})
		})
	})
})