const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Define schema for form data
const formDataSchema = new mongoose.Schema({
  name: String,
  email: String,
  number: String,
  message: String,
  subject: String
});

// Create model based on schema
const FormData = mongoose.model('FormData', formDataSchema);

app.use(bodyParser.urlencoded({ extended: true }));

// Set up static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine if rendering HTML files
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.post('/', function (req, res) {
  // Create FormData instance with request body
  let formData = new FormData({
    name: req.body.name,
    email: req.body.email,
    number: req.body.number,
    message: req.body.message,
    subject: req.body.subject
  });

  // Save form data to MongoDB
  formData.save()
    .then(() => {
      // Render success page if save is successful
      res.send("Thank you for contacting us. We will be in touch shortly.");
    })
    .catch((error) => {
      // Handle error, maybe render an error page
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/final', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Event listener for successful connection
mongoose.connection.once('open', function() {
  console.log('MongoDB connected successfully');
});

// Event listener for MongoDB connection error
mongoose.connection.on('error', function(error) {
  console.error('MongoDB connection error:', error);
});

// Start the server
const port = process.env.PORT || 4100;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
