const mysql = require("mysql")
const bcrypt = require('bcryptjs')

const db = mysql.createConnection({
    host: process.env.database_host,
    user: process.env.database_user,
    password: process.env.database_password,
    database: process.env.database
})

//Handels Register
exports.register = (req, res) => {
  console.log(req.body);

  const { username, email, password, confirm_password } = req.body;

  db.query('SELECT username FROM users WHERE username = ?', [username], (error, results) => {
      if (error) {
          console.log(error);
      }
      if (results.length > 0) {
          return res.render('register', {
              message: 'Username is already in use'
          });
      }

      db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
          if (error) {
              console.log(error);
          }
          if (results.length > 0) {
              return res.render('register', {
                  message: 'Email is already in use'
              });
          } else if (password !== confirm_password) {
              return res.render('register', {
                  message: 'Passwords do not match'
              });
          }

          let hashedPassword = await bcrypt.hash(password, 8);
          console.log(hashedPassword);

          db.query('INSERT INTO users SET ?', { username: username, email: email, password: hashedPassword }, (error, results) => {
              if (error) {
                  console.log(error);
              } else {
                  return res.redirect('/login');
              }
          });
      });
  });
}


//Handels Login
exports.login = (req, res) => {
  console.log(req.body);

  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
      if (error) {
          console.log(error);
          return res.render('login', {
              message: 'Error occurred'
          });
      }
      if (results.length == 0) {
          return res.render('login', {
              message: 'Username does not exist'
          });
      }

      const user = results[0];
      
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        req.session.isLoggedIn = true;
        req.session.user = user; // Storing user info in session
        return res.redirect('/'); // Redirect to a dashboard or some other page
    } else {
        // Handle incorrect password
        res.render('login', {
            message: 'Password is Incorrect'
        })
        }
    
  });
};


// Controller function to handle activity logging
exports.activities = (req, res) => {
    // Destructure the activity_name and duration from the request body
    const { activity_name, duration } = req.body;
    // Get the user_id from the session
    const user_id = req.session.user.id; // Assuming you store user ID in session when logging in

    // Prepare the SQL query to insert the new activity
    const query = "INSERT INTO activities (user_id, activity_name, duration) VALUES (?, ?, ?)";

    // Execute the database query
    db.query(query, [user_id, activity_name, duration], (err, results) => {
        if (err) {
            // Handle error - send back a response indicating database error
            console.error('Error when inserting activity:', err);
            res.status(500).send('Error when logging activity');
        } else {
            // Redirect to the activities page or send a success response
            res.redirect('/activities'); // Or use res.status(200).send('Activity logged successfully');
        }
    });
};

