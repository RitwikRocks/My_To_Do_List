//Modules that are required

const express=require("express");
const bodyParser=require("body-parser");
const date=require(__dirname+"/date.js");
const mongoose=require("mongoose");
const _=require("lodash");

// making app for express and using body parser to fetch data from ejs file
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
//setting viewEngine for ejs File
app.set("view engine","ejs");
//adding static files in public folder to render
app.use(express.static("public"));


//connecting to localdatabase
//mongoose.connect('mongodb://127.0.0.1:27017/todolist');

mongoose.connect("mongodb+srv://admin-ritwik:liza2004@cluster0.9cxyet5.mongodb.net/todolist");

//creating schema for collection tasks
const taskschema=new mongoose.Schema({
    name:String
});

//creating schema for collection lists
const listschema=new mongoose.Schema({
    name:String,
    items:[taskschema]
})
// making the mongoose model from the Schema
const Task=mongoose.model("task",taskschema);
const List=mongoose.model("list",listschema);




//creating the items of collections which are initially present
const item1=new Task({
      name:"Welecome to my List"
})
const item2=new Task({
    name:"Type the text and press +"
})
const item3=new Task({
    name:" <- TO delete the item"
})

//creating array of objects 
const objects=[item1,item2,item3];



// localhost default route call get function
app.get("/",function(req,res){
    let day=date.date();
    // to find the data in database and to store it in foundItem and if it is has
    //length 0 then we add the initial files else
    //we render the files of foundItem 
    Task.find({}).then(function(foundItem){
        if(foundItem.length ===0)
        {
            Task.insertMany(objects);
            res.redirect('/');
        }
        else
        res.render("list",{kindOfDay:day,itemlist:foundItem});
       })
    

});

//here we are using params function to dynamically create a route and then make a 
//custom list with the name of the customRoute in the typed route address
app.get("/:customNameList",function(req,res){
    const customNameList=_.capitalize(req.params.customNameList);
    // to find the data in database and to store it in foundlist and if it is has
    //length 0 then we add the initial files else
    //we render the files of foundItem
    List.findOne({name:customNameList}).then(function(foundlist){
           
            if(!foundlist)
            {
                const list=new List({
                    name:customNameList,
                    items:objects
                })
                list.save();
                res.redirect("/"+customNameList);
            }
            else
            {
                console.log("YES");
                res.render("list",{kindOfDay:customNameList,itemlist:foundlist.items});
            }
        
    })
    
})

// this is used to fetch the data which is input in the form and then to 
// add that data in the default route or the custom route by identifying the
//listName from the fetched form details and then adding the files in the database
// and then redirecting it to the desired route for file to be displayed there
app.post("/",function(req,res){
    let item=req.body.list;
    const nitem=new Task({
        name:item
    })

    let listName=req.body.button;
    let day=date.date();
  
    day=day.slice(0, day.indexOf(' '));
    if(listName===day)
    {
        nitem.save();
        res.redirect("/");

    }
    else{
        List.findOne({name:listName}).then(function(listitem){
              listitem.items.push(nitem);
              listitem.save();
              res.redirect("/"+listName);
        })
    }
        
    
    
// this post request is used to delete the items from the default
//or the custom route by first identifying the name of the route and then
// fetching the id of the item to be deleted and then deleting it from the
//database.
})

app.post("/remove",function(req,res){

    const rem=req.body.checkbox;
    
    const listName=req.body.listname;
    let day=date.date();
  
    day=day.slice(0, day.indexOf(' '));
    if(listName===day)
    {
        Task.findByIdAndRemove(rem).then(function(err){
            if(err)
            console.log(err);
            res.redirect("/");
        })
        

    }
    else{
        //this is used to findAndUpdate the data $pull is default MONGODB feature which we 
        //are using for our database
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:rem}}}).then(function(err){
            if(err)
            console.log(err);

            res.redirect("/"+listName);
        })
    }
    
   
})
// we are using port 3000 for our localhost server and then starting the server in the web browser.
app.listen(3000,function(){
    console.log("Server Started");
})