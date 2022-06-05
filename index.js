const express = require('express')   // 다운받은 express 모듈을 가져옴
const app = express()           // 가져온 express function 사용
const port = 5000                 // 사용할 port number, 임의적으로 사용 가능
const mongoose = require('mongoose')    // mongoose 어플리케이션 사용




app.get('/', (req, res) => {
    res.send('2022-05-30,31일 생성 완료')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

mongoose.connect('mongodb+srv://str121:1234@nodetest.uysaq.mongodb.net/?retryWrites=true&w=majority', {
	useNewUrlParser: true
    // , userUnifiedTopology: true, userCresteIndex: true, useFindAndModify: true   // 에러
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))