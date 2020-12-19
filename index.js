const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors')
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');


require('dotenv').config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qcq3d.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('blogs'));
app.use(express.static('bestseller'));
app.use(express.static('trending'));
app.use(express.static('services'));
app.use(express.static('offer'));
app.use(express.static('mainHeader'));
app.use(fileUpload());




const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true  });

client.connect(err => {
  const blogCollection = client.db("blogItems").collection("blog");
  const BestSellCollection = client.db("bestSeller").collection("product");
  const trendingCollection = client.db("trendingProducts").collection("products");
  const offerCollection = client.db("offerProducts").collection("product");
  const mainHeaderCollection = client.db("mainHeader").collection("collection");
  const servicesCollection = client.db("services").collection("service");

  // get Api for blog creating
  app.post('/blogPost', (req, res ) =>{
    const message = req.body;
    console.log(message);
    blogCollection.insertOne(message);
  })

  // get Api for all blog
  app.get('/blogs',(req, res) =>{
    blogCollection.find()
    .toArray((err, documents) =>{
      res.send(documents);
    })
  })



// Recived a blog post and send to database
  app.post('/addBlog', (req, res) => {
   
      const title = req.body.title;
      const date = req.body.date;
      const author = req.body.author;
      const description = req.body.description;
     const file = req.files.file;


    const blogInfo = {title:title,date:date,author:author,description:description, img:file.name};
    // info gone to database
    blogCollection.insertOne(blogInfo)
    .then(result => res.send(result.insertedCount > 0))
    

    //Delete Blog Data from database



    //File Save in server
    file.mv(`${__dirname}/blogs/${file.name}`, err =>{
      if(err){
        console.log(err)
        return res.status(500).send({msg:'failed to upload '})
    }
   return res.send({name:file.name, path:`/${file.name}`})
      
    })

  })
  app.delete('/deletBlog',(req, res)=>{
    const targetId = req.query.id;

    blogCollection.deleteOne(
      { _id:ObjectId(`${targetId}`) } // specifies the document to delete
      )
      .then(result =>{
        if(result.deletedCount > 0){
          res.send(true)
        }else{
          res.send(false)
        }
      })
  })
  app.patch('/updateBlogProduct',(req, res) =>{
    console.log(req.body)
    const targetId = req.query.id;
    blogCollection.updateOne(
      { _id:ObjectId(`${targetId}`) },
      {
        $set:( {title: req.body.title, description: req.body.description, date: req.body.date })
      }
    )
    .then(result=>{
      console.log(result)
      res.send(result.modifiedCount > 0)
    })
  })





 // get Api for all blog
 app.get('/bestSellProducts',(req, res) =>{
  BestSellCollection.find()
  .toArray((err, documents) =>{
    res.send(documents);
  })
})


  // Recived a blog post and send to database
    app.post('/bestseller', (req, res) => {
    
      const title = req.body.title;
      const price = req.body.price;
  
    const file = req.files.file;


    const blogInfo = {title:title,price:price, img:file.name};
    // info gone to database
    BestSellCollection.insertOne(blogInfo);


    //File Save in server
    file.mv(`${__dirname}/bestseller/${file.name}`, err =>{
      if(err){
        return res.status(500).send({ msg: 'Server error'})
      }else{
        return res.status(200).send('File Upload')
      }
      
    })

    
  })



  app.delete('/deleteBestSeller',(req, res)=>{
    const targetId = req.query.id;

    BestSellCollection.deleteOne(
      { _id:ObjectId(`${targetId}`) } // specifies the document to delete
      )
      .then(result =>{
        if(result.deletedCount > 0){
          res.send(true)
        }else{
          res.send(false)
        }
      })
  })

  app.patch('/updateBestSeller',(req, res) =>{
    
    const targetId = req.query.id;
    
    BestSellCollection.updateOne(
      { _id:ObjectId(`${targetId}`) },
      {
        $set:( {title: req.body.title, price:req.body.price })
      }
    )
    .then(result=>{
      console.log(result)
      res.send(result.modifiedCount > 0)
    })
  })




 // get Api for all Trending Products
 app.get('/allTrendingProducts',(req, res) =>{
  trendingCollection.find()
  .toArray((err, documents) =>{
    res.send(documents);
  })
})


  // Recived a blog post and send to database
    app.post('/trendingProducts', (req, res) => {
    
      const title = req.body.title;
      const price = req.body.price;
      const offer = req.body.offer;
      const color = req.body.color;
      const newProduct = req.body.newProduct;
      const offerEnd = req.body.offerEnd;
  
    const file = req.files.file;


    const trendinginfo = {title:title,price:price,offer:offer, color:color, newProduct:newProduct, offerEnd:offerEnd, img:file.name};
    // info gone to database
    trendingCollection.insertOne(trendinginfo)
 
  
  


    //File Save in server
    file.mv(`${__dirname}/trending/${file.name}`, err =>{
      if(err){
        console.log(err)
        return res.status(500).send({msg:'failed to upload '})
      }
     return res.send({name:file.name, path:`/${file.name}`})
      
    })


    
  })

  app.delete('/deletTrending',(req, res)=>{
    const targetId = req.query.id;

    trendingCollection.deleteOne(
      { _id:ObjectId(`${targetId}`) } // specifies the document to delete
      )
      .then(result =>{
        if(result.deletedCount > 0){
          res.send(true)
        }else{
          res.send(false)
        }
      })
  })

  app.patch('/updateTrendingProduct',(req, res) =>{
    console.log(req.body)
    const targetId = req.query.id;
    
    trendingCollection.updateOne(
      { _id:ObjectId(`${targetId}`) },
      {
        $set:( {title: req.body.title, price:req.body.price, offer:req.body.offer,color: req.body.color, newProduct: req.body.newProduct, offerEnd: req.body.offerEnd })
      }
    )
    .then(result=>{

      res.send(result.modifiedCount > 0)
    })
  })



      // get Api for Offer Section
    app.get('/allOffer',(req, res) =>{
      offerCollection.find()
      .toArray((err, documents) =>{
        res.send(documents);
      })
    })


  // Recived a Offer post and send to database
    app.post('/offerPost', (req, res) => {
    
      const title = req.body.title;
      const offer = req.body.offer;

  
  
    const file = req.files.file;


    const offerInfo = {title:title,offer:offer, img:file.name};
    // info gone to database
    offerCollection.insertOne(offerInfo);


    //File Save in server
    file.mv(`${__dirname}/offer/${file.name}`, err =>{
      if(err){
        console.log(err)
        return res.status(500).send({msg:'failed to upload '})
      }
     return res.send({name:file.name, path:`/${file.name}`})
      
    })

    
  })

  app.delete('/deleteOffer',(req, res)=>{
    const targetId = req.query.id;

    offerCollection.deleteOne(
      { _id:ObjectId(`${targetId}`) } // specifies the document to delete
      )
      .then(result =>{
        if(result.deletedCount > 0){
          res.send(true)
        }else{
          res.send(false)
        }
      })
  })

  app.patch('/updateOffer',(req, res) =>{
    console.log(req.body)
    const targetId = req.query.id;
    
    offerCollection.updateOne(
      { _id:ObjectId(`${targetId}`) },
      {
        $set:( {title: req.body.title,  offer:req.body.offer })
      }
    )
    .then(result=>{

      res.send(result.modifiedCount > 0)
    })
  })











      // get Api for Main HEader Section
      app.get('/allMainHeader',(req, res) =>{
        mainHeaderCollection.find()
        .toArray((err, documents) =>{
          res.send(documents);
        })
      })
  
  
    // Recived a Main HEader &  send to database
      app.post('/addMainHeader', (req, res) => {
      
        const title = req.body.title;
        const session = req.body.session;
        const date = req.body.date;
 
      const file = req.files.file;
  
  
      const mainHeader = {title:title,session:session, date:date,  img:file.name};
      // info gone to database
      mainHeaderCollection.insertOne(mainHeader);
  
  
      //File Save in server
      file.mv(`${__dirname}/mainHeader/${file.name}`, err =>{
        if(err){
          console.log(err)
          return res.status(500).send({msg:'failed to upload '})
        }
       return res.send({name:file.name, path:`/${file.name}`})
        
        
      })
  
      
    })
    app.delete('/deletMainHeader',(req, res)=>{
      const targetId = req.query.id;
  
      mainHeaderCollection.deleteOne(
        { _id:ObjectId(`${targetId}`) } // specifies the document to delete
        )
        .then(result =>{
          if(result.deletedCount > 0){
            res.send(true)
          }else{
            res.send(false)
          }
        })
    })
    app.patch('/updateMainHeader',(req, res) =>{

      const targetId = req.query.id;
      mainHeaderCollection.updateOne(
        { _id:ObjectId(`${targetId}`) },
        {
          $set:( {title: req.body.title, session: req.body.session, date: req.body.date })
        }
      )
      .then(result=>{
        console.log(result)
        res.send(result.modifiedCount > 0)
      })
    })





    
  // get Api for all Servieces
  app.get('/services',(req, res) =>{
    servicesCollection.find()
    .toArray((err, documents) =>{
      res.send(documents);
    })
  })



// Recived a blog post and send to database
  app.post('/addService', (req, res) => {
   
      const title = req.body.title;
      const description = req.body.description;
     const file = req.files.file;


    const blogInfo = {title:title,description:description, img:file.name};
    // info gone to database
    servicesCollection.insertOne(blogInfo)
    .then(result => res.send(result.insertedCount > 0))
    

    //Delete Blog Data from database



    //File Save in server
    file.mv(`${__dirname}/services/${file.name}`, err =>{
      if(err){
        console.log(err)
        return res.status(500).send({msg:'failed to upload '})
    }
   return res.send({name:file.name, path:`/${file.name}`})
      
    })

  })
  app.delete('/deleteService',(req, res)=>{
    const targetId = req.query.id;

    servicesCollection.deleteOne(
      { _id:ObjectId(`${targetId}`) } // specifies the document to delete
      )
      .then(result =>{
        if(result.deletedCount > 0){
          res.send(true)
        }else{
          res.send(false)
        }
      })
  })
  app.patch('/updateService',(req, res) =>{
    console.log(req.body)
    const targetId = req.query.id;
    servicesCollection.updateOne(
      { _id:ObjectId(`${targetId}`) },
      {
        $set:( {title: req.body.title, description: req.body.description, date: req.body.date })
      }
    )
    .then(result=>{
      console.log(result)
      res.send(result.modifiedCount > 0)
    })
  })







});













app.get('/', (req, res) => {
  res.send('Hello World!')
})





app.listen(port ,()=>{console.log('localhost:5000 Running')})