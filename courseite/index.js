const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());


const courses = [
    { id: 1, name: 'Matematika' },
    { id: 2, name: 'Kimia' },
    { id: 3, name: 'Fisika' },
    { id: 4, name: 'Web Programming' }
];


app.get("/api/courses", (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
    //res.setHeader('Access-Control-Allow-Origin', '*');
    //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.send( courses );
});

app.options("/api/courses", (req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'POST');
    //res.setHeader('Access-Control-Allow-Methods', 'GET');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

app.options("/api/courses/:id", (req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});


app.get("/api/courses/:id", (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    const course = courses.find( c => c.id === parseInt(req.params.id) );
    if( !course ) res.status(404).send('The course with the given ID was not found.');
    res.send(course);
});


app.post("/api/courses", (req, res) => {
	
	res.header('Access-Control-Allow-Origin', '*');
	console.log(req.body);
    const {error} = validateCourse(req.body); 
	
    if( error ){
        
        return res.status(400).send(error.details[0].message);
    } 


    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);

});

app.put('/api/courses/:id', (req, res) => {
	res.header('Access-Control-Allow-Origin', '*');
	
	console.log(req.body);

    
    const {error} = validateCourse(req.body); 
    if( error ){
       
        return res.status(400).send(error.details[0].message);
    } 

    
    const course = courses.find( c => c.id === parseInt(req.params.id) );
    if( !course ) return res.status(404).send('The course with the given ID was not found.');

    
    course.name = req.body.name;
    res.send(course);

});



app.delete('/api/courses/:id', (req, res) => {

res.setHeader('Access-Control-Allow-Origin', '*');
    
    const course = courses.find( c => c.id === parseInt(req.params.id) );
    if( !course ) return res.status(404).send('The course with the given ID was not found.');

    // delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // return course yang berhasil dihapus
    res.send(course);

});








function validateCourse(course){
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(course);
}



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

