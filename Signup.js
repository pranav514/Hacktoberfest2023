const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Admin routes
const secretKey = 'sc3t';
const generateJWT = (user) => {
  const payload = {
    username : user.username,
    password : user.password
  }
  return jwt.sign(payload , secretKey , {expiresIn : '1h'});

}

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1]; //SPLIT THE AUTHHEADER BY THE SPACE AND TAKE THE 1 INDEXED STRING i.e THE TOKEN

    jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

const authenticateJWTUser = (req,res,next) => {
  const authHeader = req.headers.authorization;
  if(authHeader){
    const token = authHeader.split('')[1];
    jwt.verify(token,secretKey, (err,user) => {
      if(err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  }
  else{
    res.sendStatus(401);
  }
};



app.post('/admin/signup', (req, res) => {
  const admin = req.body;
  const existingAdmin = ADMINS.find( (u) => u.username === req.body.username);
  if(existingAdmin){
    res.status(403).json({
      message : "admin already exist"
    })
  }
  else{
    ADMINS.push(admin);
    // const token = generateJwt(admin);
    res.status(200).json({
      message : "admin created succesfully"
    })
  }
});

app.post('/admin/login', (req, res) => {
  const admin = {
    username : req.headers.username,
    password : req.headers.password
  }
  // const admin = req.headers;
  const checkLogin = ADMINS.find( (u) => u.username === admin.username && u.password === admin.password);
  if(checkLogin){
    const token = generateJWT(admin);
    
    res.status(200).json({
      message : "login succesfully",
      token : token,
    })

  }
  else{
    res.status(403).json({
      message : "login failed"
    })
  }
});

app.post('/admin/courses',authenticateJWT ,(req, res) => {
  const newCourse = req.body;
  newCourse.id = COURSES.length + 1;
  COURSES.push(newCourse);
  res.status(200).json({
    message : "new course created"
  })

});

app.put('/admin/courses/:courseId', (req, res) => {
  const id = req.params.id;
  const updatedCourse = req.body;
  const courseIndex = COURSES.findIndex(course => course.id === id);
  if(courseIndex != -1){
    COURSES[courseIndex] = {...COURSES[courseIndex], ...updatedCourse};
    res.status(200).json({
      message : "course updated sucessfully"
    })
  }
  else{
    res.status(403).json('course not updated');
  }
});

app.get('/admin/courses', authenticateJWT, (req, res) => {
  res.status(200).json({
    courses : COURSES
  })
});

// User routes
app.post('/users/signup', (req, res) => {
  const user = req.body;
  const existingUser = Users.find((a) => a.username === req.body.username);
  if(existingUser){
    res.status(403).json({
      message : "user already exists"
    })
  }
  else{
    USERS.push(user);
    const token = generateJWT(user);
    res.json({
      message : "user created succesfully" , token
    })
  }
});

app.post('/users/login', (req, res) => {
  // logic to log in user
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
