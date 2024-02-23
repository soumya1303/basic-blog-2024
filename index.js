const express = require("express");
const _ = require("lodash");
const app = express();
const PORT = process.env.PORT || 3000;

const mongoose = require("mongoose");

const homeStartingContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Amet tellus cras adipiscing enim eu. Rhoncus aenean vel elit scelerisque mauris. Libero nunc consequat interdum varius sit amet mattis. Tempus iaculis urna id volutpat lacus laoreet non curabitur gravida. Suspendisse potenti nullam ac tortor vitae purus faucibus ornare suspendisse. Nibh tortor id aliquet lectus proin nibh nisl condimentum id. Turpis cursus in hac habitasse. Urna duis convallis convallis tellus. In pellentesque massa placerat duis ultricies lacus sed turpis"

const aboutStartingContent = "Leo a diam sollicitudin tempor id eu nisl nunc mi. Id semper risus in hendrerit gravida rutrum. Rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt lobortis. Sed turpis tincidunt id aliquet. Luctus accumsan tortor posuere ac ut consequat semper viverra nam. Tincidunt augue interdum velit euismod. Quisque id diam vel quam elementum. Tellus elementum sagittis vitae et leo duis. Egestas fringilla phasellus faucibus scelerisque. Urna neque viverra justo nec ultrices dui sapien eget mi."

const contactStartingContent = "Urna condimentum mattis pellentesque id nibh tortor id aliquet lectus. Habitant morbi tristique senectus et netus et malesuada fames ac. Vestibulum sed arcu non odio euismod lacinia at quis risus. Facilisis mauris sit amet massa vitae. Aliquam id diam maecenas ultricies mi eget mauris pharetra et. A cras semper auctor neque vitae tempus. Sed odio morbi quis commodo odio aenean sed. Eget gravida cum sociis natoque penatibus et magnis dis. Senectus et netus et malesuada fames ac turpis"

const blogObjectArr = [];

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/fs24");

const blogSchema = new mongoose.Schema({
    blogTitle:{
        type:String,
        required:true
    },
    blogText:{
        type:String,
        required:true
    }
});
const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

app.get("/", async (req, res)=>{

    try {
        const resp = await Blog.find({}, {});
        res.render("home",{foo:resp});

    } catch (error) {
        console.log (error)
    }

});

app.get("/about", (req, res)=>{
    res.render("about",{foo:aboutStartingContent});
});

app.get("/contact", (req, res)=>{
    res.render("contact",{foo:contactStartingContent});
});

app.get("/compose", (req, res)=>{
    res.render("compose",{});
});

app.get("/blogs/:blogTitle",  async (req, res)=>{

    let blogTitle = req.params.blogTitle;
    let blogItem;

    try {
        const resp = await Blog.find({}, {});
    
        resp.forEach((e) => {
            if (_.lowerCase(e.blogTitle.toString()) === _.lowerCase(blogTitle.toString()))
            {blogItem=e;   
            } 
        });

    } catch (error) {
        console.log(error);
    } finally{
        res.render("blogpost", {foo:blogItem});
    }
    
})

app.post("/", async (req, res)=> {

    const blogItem = {
        blogTitle : req.body.blogTitle,
        blogText : req.body.blogText
    }
    
    try {
        const resp = await Blog.create(blogItem);
         
    } catch (error) {
        console.log(error);
    } finally{
        res.redirect("/");
    }
    
});

app.listen(PORT, ()=>{
    console.log("Application started in running mode.");
});
