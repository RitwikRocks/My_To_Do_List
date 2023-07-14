const express=require("express");
const bodyParser=require("body-parser");
const date=require(__dirname+"/date.js");
const mongoose=require("mongoose");
var items=[];
var worklist=[];

mongoose.connect('mongodb://127.0.0.1:27017/todolist');

const taskschema=new mongoose.Schema({
    name:String
});

const Task=mongoose.model("task",taskschema);



const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));


app.get("/",function(req,res){
    let day=date.date();

    res.render("list",{kindOfDay:day,itemlist:items});

});

app.post("/",function(req,res){
    let item=req.body.list;
    console.log(req.body.submit);
    if(req.body.button ==="Work"){
        worklist.push(item);
        res.redirect("/work");
    }
    else{
        items.push(item);
        res.redirect("/");
    }
    

})
app.get("/work",function(req,res){
   let name="Work List";
   res.render("list",{"kindOfDay":name,itemlist:worklist});
});
app.listen(3000,function(){
    console.log("Server Started");
})