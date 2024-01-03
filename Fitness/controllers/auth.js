const mysql = require("mysql")
const jwt = require('jsonwebtoken')
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

          res.redirect('/');
      } else {
          // Password does not match
          res.render('login', {
              message: 'Password is incorrect'
          });
      }
  });
};

exports.logout = (req, res) => {
    // Destroy the user's session
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            // Handle error - e.g., render an error page
            return res.render('error', {
                message: 'Error logging out'
            });
        }

        // Redirect to the login page or home page after logout
        res.redirect('/login');
    });
};
