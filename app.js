var express=require('express')
var sql=require('mysql2')
var path=require('path');
var bp=require('body-parser')
var encodedata=bp.urlencoded({extended:true})

var app=express()
var client=sql.createConnection({
    host:'localhost',
    user:'root',
    password:'Durga3006@sql',
    database:'canteen'
})

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'public')));

app.get('/',function(req,res){
    res.render('home')
})
app.get('/admin',function(req,res){
    res.render('admin_login')
})
app.get('/user',function(req,res){
    res.render('user')
})
app.get('/register',function(req,res){
    res.render('reg')
})
app.post('/register',encodedata,function(req,res){
    var name=req.body.name;
    var rno=req.body.rno;
    var phno=req.body.phno;
    var pwd=req.body.pwd;
    console.log(name,rno,phno,pwd)
    var sql="INSERT INTO details(rno,name,pwd,phno) VALUES('"+rno+"','"+name+"','"+pwd+"','"+phno+"')"
    client.connect(function(err){
        if(err) throw err;
    client.query(sql,function(err,result){
        if(err){
            throw err;
        }
        else{
            var sql1="create table "+rno+" (tokenid int(5),items json,cost int,status varchar(15),orderdate date,deliverydate date,primary key (tokenid))"
            client.query(sql1,function(err,data){
                if(err) throw err
                console.log('table created')
            })
            res.redirect('/user')
        }
    })
})
})

app.get('/login',function(req,res){
    res.render('login')
})
app.post('/login',encodedata,function(req,res){
    var rno=req.body.rno;
    var pwd=req.body.pwd;
    client.connect(function(err){
        if(err) throw err;
        else{
            var sql1="select * from details"
            client.query(sql1,function(err,data){
                if(err) throw err;
                var flag=0;
                for(let x of data){
                    if(x['rno']==rno && x['pwd']==pwd){
                        console.log(rno,pwd)
                        flag=1;
                    }
                }
                if(flag==1)
                {
                    console.log("valid user");
                    res.redirect('/user')
                }
                else{
                    console.log("invalid user");
                    res.redirect('/user');
                }
            })
        }
    })
})

app.get('/token',function(req,res)
{
    const size=2;
    const min=Math.pow(10,size-1);
    const max=Math.pow(10,size)-1;
    const randnum=Math.floor(Math.random()*(max-min+1))+min;
    console.log(randnum);
    res.send('<h1>generating token</h1>');
})

app.get('/odetails',function(req,res){
    var sql="select * from rno"
    client.connect(function(err){
        if(err) throw err
        client.query(sql,function(err,data){
            // console.log(data)
            console.log("data displayed");
            if(err) throw err
            else{
                res.render('orderdetails',{title:'my orders',action:'ordetails',sampleData:data})
            }
        })
    })
})
app.listen(2002)