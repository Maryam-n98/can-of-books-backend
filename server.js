'use strict';

//import all packages that we need
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');

//save all methodes inside express 
const server = express();
//open backend server to recieve all requests
server.use(cors());

//parse any requested data by axios.post
server.use(express.json());

//define the port of this backend server
const PORT = process.env.PORT;

//start listining on this port, be ready to recieve any request
server.listen(PORT, () => {
    console.log(`I\'m listening on PORT ${PORT}`);
});

//get this request if the route was '/'
server.get('/', proofOfLif);
function proofOfLif(req, res) {
    console.log('home server route');
    res.send(x);
}

//connect mongo with express server locally
// mongoose.connect('mongodb://localhost:27017/books',
//     { useNewUrlParser: true, useUnifiedTopology: true });

    //connect mongo with express server deloyed
mongoose.connect(process.env.MONGODB_URI ,
{ useNewUrlParser: true, useUnifiedTopology: true });

//create collection #1 


//create first schema for books
const faviourateBookSchema = new mongoose.Schema({
    bookTitle: String,
    bookImage: String,
    bookDescription: String,
});

//create second schema for users
const userInfoSchema = new mongoose.Schema({
    userName: String,
    userEmail: String,
    books: [faviourateBookSchema],

});


//create first model (connect the model with collection and schema)
const userInfoModel = mongoose.model('userCollection', userInfoSchema);



//create function to create the collection, model data and seading them in the database
function seadUserCollections() {

    //create model data based on schema structure, 1st user
    const ahmad = new userInfoModel({
        userName: 'Ahmad Abu Osbeh',
        userEmail: 'ahmadabuosbeh20@gmail.com',
        books: [
            {
                bookTitle: 'Mechanical Dseign',
                bookImage: 'https://easyengineering.net/wp-content/uploads/2017/10/91nknEz3tXL.jpg',
                bookDescription: 'Shigley\'s Mechanical Engineering Design is intended for students beginning the study of mechanical engineering design. Students will find that the text inherently directs them into familiarity with both the basics of design decisions and the standards of industrial components. It combines the straightforward focus on fundamentals that instructors have come to expect, with a modern emphasis on design and new applications. This edition maintains the well-designed approach that has made this book the standard in machine design for nearly 50 years.',
            }
            ,
            {
                bookTitle: 'Thermodynamics',
                bookImage: 'https://qph.fs.quoracdn.net/main-qimg-d6eee7e15558e2d5b6d16197d5fd8f3c.webp',
                bookDescription: 'This textbook is for a one semester introductory course in thermodynamics, primarily for use in a mechanical or aerospace engineering program, although it could also be used in an engineering science curriculum. The book contains a section on the geometry of curves and surfaces, in order to review those parts of calculus that are needed in thermodynamics for interpolation and in discussing thermodynamic equations of state of simple substances. It presents the First Law of Thermodynamics as an equation for the time rate of change of system energy, the same way that Newton’s Law of Motion, an equation for the time rate of change of system momentum, is presented in Dynamics. Moreover, this emphasis illustrates the importance of the equation to the study of heat transfer and fluid mechanics. New thermodynamic properties, such as internal energy and entropy, are introduced with a motivating discussion rather than by abstract postulation, and connection is made with kinetic theory.',
            }

        ]
    });

    //create model data based on schema structure, 2nd user
    const maryam = new userInfoModel({
        userName: 'Mariam Alnajjar',
        userEmail: 'mariam.mohannad98@gmail.com',
        books: [
            {
                bookTitle: 'Fliud Power',
                bookImage: 'https://i2.wp.com/mechanicalengineeringbookspdf.com/wp-content/uploads/2018/08/fluid-mechanics-by-RK-bansal.jpg?resize=238%2C300&ssl=1',
                bookDescription: 'Design, operate, and maintain fluid and pneumatic power equipment using the expert information contained in this authoritative volume. Fluid Power Engineering presents a comprehensive approach to hydraulic systems engineering with a solid grounding in hydrodynamic theory. The book explains how to create accurate mathematical models, select and assemble components, and integrate powerful servo valves and actuators. You will also learn how to build low-loss transmission lines, analyze system performance, and optimize efficiency.',
            },
            {
                bookTitle: 'Wind and Solar Power Systems',
                bookImage: 'https://m.media-amazon.com/images/I/41+Uikg0IhL._SL500_.jpg',
                bookDescription: 'This book provides technological and socio-economic coverage of renewable energy. It discusses wind power technologies, solar photovoltaic technologies, large-scale energy storage technologies, and ancillary power systems. In this new edition, the book addresses advancements that have been made in renewable energy: grid-connected power plants, power electronics converters, and multi-phase conversion systems. The text has been revised to include up-to-date material, statistics, and current technology trends.',
            }

        ]
    });

    // console.log('ahmad', ahmad);
    // console.log('maryam', maryam);
    ahmad.save();
    maryam.save();

}

// seadUserCollections();


//recieve this request and send the response for the client
server.get('/books', seadBooksCollections)
//receive the axios.post request
server.post('/addbook', addBookHandler);
//receive the axios.delete request
server.delete('/deletebook/:index', deleteBookHandler);
//receive the axios.put request
server.put('/updatebook/:index', updateBookHandler);



// http://localhost:3003/books?email=ahmadabuosbeh20@gmail.com
function seadBooksCollections(req, res) {
    let requestedEmail = req.query.email;
    //    let responsedData =[book1,book2,book3,book4];
    userInfoModel.find({ userEmail: requestedEmail }, function (err, userData) {
        if (err) {
            console.log('did not work')
        } else {

            res.send(userData);

            // console.log('requestedEmail', requestedEmail);
            // console.log('userData', userData);




        }
    });




}

//data from front-end here

//add book data to DB from frontend to backend by axios.post

//  const bookData={
//     bookTitle: this.state.bookTitle,
//     bookUrl: this.state.bookUrl,
//     bookDesecription:this.state.bookDesecription,
//   }
// let postReqUl =`${serverRoute}/addbook`,bookData
//   const addBook = await axios.post(`${serverRoute}/addbook`,bookData);



function addBookHandler(req, res) {
    console.log('req.body', req.body);
    let userEmail = req.body.userEmail
    userInfoModel.find({ userEmail: userEmail }, function (err, userData) {
        if (err) {
            console.log('did not work')
        } else {
            // console.log('userData before pushing', userData[0]);
            userData[0].books.push(
                {
                    bookTitle: req.body.bookTitle,
                    bookImage: req.body.bookUrl,
                    bookDescription: req.body.bookDesecription,
                }
            )
            
            // console.log('requestedEmail', requestedEmail);
            // console.log('userData after pushing', userData[0]);
            
            userData[0].save();
            
            
            res.send(userData[0].books);

        }
    });
}

//data from frontend here
 //delete function
//  deleteFunctoin = async(index)=>{
//     const userEmail ={
//       userEmail: this.props.auth0.user.email,
//      }
//      console.log('userEmail',userEmail);
//      console.log('index',index);
//     let newArrAfterDeleteing = await axios.delete(`${this.state.serverRoute}/deletebook/${index}`,{params:userEmail})
     
//   }



function deleteBookHandler(req,res) {
    
const index = req.params.index;
const userEmail = req.query.userEmail;
console.log('index',index);
console.log('userEmail',userEmail);

userInfoModel.find({ userEmail: userEmail }, function (err, userData) {
    if (err) {
        console.log('did not work')
    } else {
       let newBookArr= userData[0].books.filter((item,idx)=>{
            if (index != idx)
            return item;

        });
        
        userData[0].books=newBookArr;
        userData[0].save();

        // console.log('userData 2222', userData);
        // console.log('userData[0] 2222', userData[0]);
        
        res.send(userData[0].books);



    }
});


}

//create update function handeler

function updateBookHandler(req,res) {
    
    const index = req.params.index;
    const {bookDescription,bookImage,bookTitle,userEmail}=req.body
    console.log('index',index);
    console.log('userEmail',userEmail);
    
    userInfoModel.find({ userEmail: userEmail }, function (err, userData) {
        if (err) {
            console.log('did not work')
        } else {
        // userData[0].books.splice(index,2,{
        //     bookTitle: bookTitle,
        //     bookImage: bookImage,
        //     bookDescription: bookDescription,
        // });
        
        
        userData[0].books[index]={
            bookTitle: bookTitle,
            bookImage: bookImage,
            bookDescription: bookDescription,
        }
            
    
            console.log('userData[0].books', userData[0].books);
            console.log('userData[0] ', userData[0]);

            userData[0].save();
            res.send(userData[0].books);
            
            console.log('response ', userData[0].books);
           
    
    
    
        }
    });
    
    
    }