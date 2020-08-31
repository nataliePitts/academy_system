//Import Mongoose framework >>
const mongoose = require('mongoose');

// << --- Creating the Schema --- >>

//Create a Schema for courses >>
var take_course = new mongoose.Schema({ courses:{
                                         grade:        {type:Number, require:true, min:0, max: 100},
                                         courseid:     {type:String, required:true}
}});

//Create a Schema for students >>
var student_schema = new mongoose.Schema({ 
                                           id:         {type: String, lengh: {min:8, max:8}, required:true},
                                           name:       {type: String, maxlength: 50, required:true},
                                           city:       {type: String, maxlength: 50, required:true},
                                           toar:       {type: String, enum: ["BA","MA","PHD"], required:true},
                                           courses:    [take_course]
}, { collection:'students' });
// create mongoose's model object & export object model -- >>
module.exports = global.academy_db.model('',student_schema);