const Joi = require('joi');

const express = require('express');
const app = express();

app.use(express.json());

const user = [
    
];

app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers' : '*'
    });
    next();
});

app.post('/api/login', (req, res) => {
	console.log(req.body);
	var email = user.find( c => c.email === req.body.email);
	
	if(!email)
		return res.json("Either email or password is incorrect");
	
	if(email.password !== req.body.password)
		return res.json("Either email or password is incorrect");
	
	return res.json("You are logged in...");
    
});

app.get("/api/user", (req, res) => {
    return res.json(user);
});

app.get('/api/user/:id', (req, res) => {
    const tempuser = user.find( c => c.id === parseInt(req.params.id) );
    if (!tempuser) return res.status(404).send('ID not found.');
    return res.json(tempuser);
})

app.post('/api/user', (req, res) => {
	
	var info = validate(req.body);
	
	console.log(info);
	
	if( info.error ){
        // 400 Bad Request
        return res.status(400).json(info.error.details[0].message);
    }
	
	info = user.find( c => c.email === req.body.email );
	console.log(info);
	  
    if (info) {
        return res.json("This email has already been registered, please choose another email");
    }

    const tempuser = {
        id: user.length + 1,
        email: req.body.email,
		password: req.body.password
    };
    user.push(tempuser);
    return res.json(tempuser);
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

function validate(information) {
	
    const schema = Joi.object({
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
		 email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    });
    
	return schema.validate(information);
}