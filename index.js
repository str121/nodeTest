const express = require('express')   // 다운받은 express 모듈을 가져옴
const app = express()           // 가져온 express function 사용
const port = 5000                 // 사용할 port number, 임의적으로 사용 가능
const mongoose = require('mongoose')    // mongoose 어플리케이션 사용
const { User } = require("./models/User")
const config = require('./config/key')
const bodyParser = require('body-parser')



app.get('/', (req, res) => {
    res.send('2022-05-30,31일 생성 완료')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true
    // , userUnifiedTopology: true, userCresteIndex: true, useFindAndModify: true   // 에러
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))


//application/x-www-form-urlencoded, url encoded 형태로 오는 데이터 처리
app.use(bodyParser.urlencoded({extended:true}));
//aplication/json, json 형태로 오는 데이터 처리
app.use(bodyParser.json());

app.post('/regTest', (req, res) => {
	const user = new User(req.body)
	let now =  new Date();
	res.send(now + "\n" + user);
})

app.post('/register', (req, res) => {
	// 회원가입 할 때 필요한 정보들을 client에서 가져오면 그것들을 DB에 넣어준다
	// body-parser가 
	const user = new User(req.body)
	// 몽고DB의 save메소드
	user.save((err, userInfo) => {
		if(err) return res.json({ success: false, err });
		return res.status(200).json({ success: true });
	})
})