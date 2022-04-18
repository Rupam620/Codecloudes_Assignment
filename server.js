const express = require('express')
const path = require('path');
const http = require('http')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('./model/user');

const bodyParser = require('body-parser')
const { JsonWebTokenError } = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
const server = http.createServer(app);
app.use(express.static('public'))
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
JWT_SECRET = 'asdfghjwerty34567][hgv';

mongoose.connect('mongodb+srv://rup620:Rupam12345@cluster0.kkr7b.mongodb.net/CodecloudesTask?retryWrites=true&w=majority' || 'mongodb://localhost:27017/neww', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true
});

app.get('/', (req, res) => {

})
console.log(mongoose.connection.readyState);

app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());

//login route


app.post('/login' , async (req, res) => {
    const {usertype, username, password: plainTextpassword } = req.body;
    var user;
    if(usertype === 'user'){
    user = await User.findOne({$and:[{username}, {usertype: false}]}).lean();
    }else{
    user  = await User.findOne({$and: [{username}, {usertype: true}]}).lean();
    }
    console.log(username,plainTextpassword);
    if(!user){
        return res.json({state: 'error', error: 'Invalid username!!'});
    }

    if(await bcrypt.compare(plainTextpassword, user.password)){
        // username and password matched
        const token = jwt.sign({
            id: user._id,
            username: user.username,
            usertype: usertype

        }, 
            JWT_SECRET
        );
        return res.json({state: 'ok', data: token});
    }

    return res.json({state: 'error', error: 'Invalid password!!'});
})

app.post('/authenticate', async (req, res) => {
    const {token, usertype} = req.body;
    //console.log(token);
    try{
        const user = jwt.verify(token,JWT_SECRET);
        //console.log(user);
        if(user.usertype === usertype){
        return res.json({state: 'ok', username: user.username});
        }else{
            return res.json({state: 'error' , error: 'Please ... Log in'});
        }
    } catch(error){
        console.log(error);
        return res.json({state: 'error' , error: 'Oops.. \nSomething went wrong'});
    }
})
app.post('/getResult', async (req, res) =>{
    const {token, long1, lat1} = req.body;
    try{
        const usr = jwt.verify(token,JWT_SECRET);
        var result = false;
        const user = await User.findOneAndUpdate({ $and: [{usertype: false}, {username: usr.username}]}, {long: long1, lat: lat1});
        const admin = await User.findOne({usertype: true},'long lat');
        console.log(admin.long, admin.lat);
        var dist = distance(lat1, long1,admin.lat, admin.long );
        if(dist<100){
            result= true;
        }
        return res.json({ state: 'ok', result, dist});
    }catch(error){
        console.log(error);
        return res.json({state:'error'})
    }
})
app.post('/setLocation', async (req, res) => {
    const {token, long1, lat1} = req.body;
    try{
        const user = jwt.verify(token,JWT_SECRET);

        const admin = await User.findOneAndUpdate({ $and: [{usertype: true}, {username: user.username}]}, {long: long1, lat: lat1});
        return res.json({ state: 'ok'});
    }catch(error){
        console.log(error);
        return res.json({state:'error'})
    }
})

app.post('/register', async (req, res) =>{
    //console.log(req.body);
    const {username, password: plainTextpassword } = req.body;
    //if(plainTextpassword.length <8)
        //return res.json({status: 'error', error: 'Password should be atleast 8 characters'});
    const password = await bcrypt.hash(plainTextpassword ,  10 );
    
    try{
        const response = await User.create({
            usertype: false, username, password
        });
        console.log('Usr created successfully ', response);
    }catch(error){
        //  console.log(JSON.stringify(error));
        if(error.code === 11000)
            return res.json({status: 'error', error: 'Username already in use.'});
        else
            throw error;
    }

    res.json({ status: 'ok'});
});
function distance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }


const PORT  =  process.env.PORT || 3000;
server.listen(PORT, ()=> console.log(`Server started at ${PORT} `));
