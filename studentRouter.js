//
const express = require('express');
const studentRoutes = express.Router(); 
let StudentModel = require('../models/studentModel');
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//app.use(urlencodedParser);
const mongooseModel = require('../models/mongooseModel');

// << -- Get home page -->>
studentRoutes.get('/', function(req,res){
    var toar_type = {BA:false,MA:false,PHD:false}
    StudentModel.find({},function(err,students){
        if(!err) {
            res.render('index.pug',{ students: students,
                                     toar_type:toar_type
            }); 
            }
            else{
                res.send("Could not retrieve users");
                } 
        }); 
    });
// << -- After filter Result -- >>
studentRoutes.post('/', function (req, res) {
        //Object filter: $expr with and action >>
        var filter = {"$expr":  {"$and" : [ ] } };     
        if (city.trim() != ''){
            // If city is not empty add it to the filter >>
            filter ["$expr"]["$and"].push({"$eq": ["$city", city]});
        }    
        if (toar.trim() != ''){
            // If toar is not empty add it to the filter >>
            filter ["$expr"]["$and"].push({"$eq": ["$toar", toar]});
        }
        if (grade.trim() != ''){
                // If min AVG is not empty add it to the filter >>
                filter ["$expr"]["$and"].push({"$gte":[{"$avg":"$courses.grade"},parseInt(avg)]});
        }   
});

// (C) Create a new student >> Get page
studentRoutes.get('/add', function(req,res){
    console.log("Open add page");
    console.log(req.body);
    var toar_type = {BA:false,MA:false,PHD:false}
    res.render('addStudent.pug',{
        toar_type:toar_type
    });
});
// (C) Create a student >> Add to DB and replay "OK!" tot the clint 
studentRoutes.post('/add', urlencodedParser, function(req, res){
    var s_id = req.body.id.trim();
    var s_name = req.body.name.trim();
    var s_city = req.body.city.trim();
    var toar = req.body.toar;
    var toar_type = {BA:false,MA:false,PHD:false}
    toar_type[toar] = true;
    var add_Student = new StudentModel(req.body);
    var note = "ההוספה בוצעה בהצלחה!";
    add_Student.save(function(err,details_student){
        if(!err){
            console.log('The process succesed');
            console.log(details_student);
            res.render('addStudent.pug',{
                id: s_id,
                name:s_name,
                city:s_city,
                toar_type: toar_type,
                note
            });}
            else{res.send("Could not add student");
            console.log("ERROR: can not saving student");}   
    });
});

// (D) Delete a student >>
studentRoutes.post('/delete/:id',function (req,res) {
    let ids = req.params.id;
    console.log("Asked to delete a student: ", req.params.id);
    StudentModel.deleteOne({ id : ids }, function (err) {
        if (!err) { 
            console.log("Delete Ok!");
            res.redirect("http://localhost:8080/student");
            
        }
        else {
            res.send("Could not delete student");
   
        }
    });
});

// (U) Update Students Details >>
//Open page with all the Details -->>
studentRoutes.get('/update/:id', urlencodedParser, function(req,res){
    console.log("Asked to update student details");
    StudentModel.findOne({ id: req.params.id },function(err,students){
        console.log(students);
        let uid = students.id;
        let uname = students.name;
        let ucity = students.city;
        let utoar = students.toar;
        let ucourses = students.courses;
        if(!err) {
            res.render('updateStudent.pug',{ students : students,
                                             id : uid,
                                             name: uname,
                                             city: ucity,
                                             toar: utoar,
                                             courses: ucourses});
            }
            else{
                res.send("Could not retrieve users");
                } 
        }); 
    });
//After Update and Add courses -->>
studentRoutes.post('/update/:id', urlencodedParser, function(req,res){
    let id = req.params.id;
    var courseid = req.body.courseid.trim();
    var grade = req.body.grade.trim(); 
    var add_course = new StudentModel(req.body);
    var note = "ההוספה בוצעה בהצלחה!";
    StudentModel.findByIdAndUpdate({ id : req.params.id }, function(err,result){
           if(!err){
            add_Student.save(function(err,details_course){
            res.render('updateStudent.pug',{
                                            students: students,
                                            id : id,
                                            courseid: courseid,
                                            grade: grade,
                                            note   
                                          });
                                          console.log("Asked to Update Student");
           });
        }
           else
           {
                res.send("Not Update");
                 console.log("Not Update Details");
           }
        });
});


studentRoutes.use('/student',  studentRoutes);
module.exports =  studentRoutes ;
   