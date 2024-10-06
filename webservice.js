var express = require('express')
var bodyParser=require('body-parser')
var app=express()
app.use(bodyParser())

var mysql = require('mysql')

var con=mysql.createConnection({host:'capstone-project-db-1',port:3306,
user:'root',password:'root',database:'demo'})


app.get("/",function(request,response){
    var mydate=new Date();
    con.connect(function(err){
        if (err) throw err
        console.log("data base connected ...")
        
    
        sql="select * from employee"
        con.query(sql,function(err,result){
            if (err) throw err
            response.send(result)
        })
    
    con.end()    
    })
    
});
app.get("/hello",function(request,response){
    var mydate=new Date();
    response.send("hello world...."+mydate.toDateString())
});

app.post("/hi",function(request,response){
    var data=request.body;
    response.send(data)
})

app.put("/update",function(request,response){
  
    response.send("hello world...using PUT")
})

app.delete("/remove",function(request,response){
  
    response.send("hello world...using DELETE")
})

app.listen(8787);
