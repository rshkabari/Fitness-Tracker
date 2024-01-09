const express = require('express')
const { isLoggedIn, isLoggedOut } = require('../controllers/middleware');
const router = express.Router()
const mysql = require("mysql")

const db = mysql.createConnection({
    host: process.env.database_host,
    user: process.env.database_user,
    password: process.env.database_password,
    database: process.env.database
})


router.get('/', (req, res) => {
    if(req.session.user) {
        res.render('index', {
            username: req.session.user.username // Replace 'username' with the actual property name
        });
    } else {
        res.redirect('/login');
    }
});

router.get('/register', isLoggedOut, (req, res) => {
    res.render('register')
})

router.get('/login', isLoggedOut, (req, res) => {
    res.render('login')
})

router.get('/activities', isLoggedIn, (req, res) => {
    const user_id = req.session.user.id; // Assuming the user's ID is stored in the session
    const query = "SELECT * FROM activities WHERE user_id = ? ORDER BY date DESC LIMIT 10"; // Adjust the LIMIT as needed

    // Execute the query to get the recent activities
    db.query(query, [user_id], (err, results) => {
        if (err) {
            // handle error
            console.error('Error when fetching activities:', err);
            res.status(500).send("Error retrieving activities");
        } else {
            // Render the 'activities' view and pass the activities data to it
            res.render('activities', { activities: results });
        }
    });
});


router.get('/api/daily-activity', isLoggedIn, (req, res) => {
    const user_id = req.session.user.id;
    const today = new Date().toISOString().slice(0, 10); // Format as 'YYYY-MM-DD'

    const query = "SELECT SUM(duration) AS totalDuration FROM activities WHERE user_id = ? AND DATE(date) = ? GROUP BY DATE(date)";

    db.query(query, [user_id, today], (err, results) => {
        if (err) {
            console.error('Error fetching daily activity:', err);
            res.status(500).send('Error fetching daily activity');
        } else {
            // If no activities found for today, ensure we send back a duration of 0
            const totalDuration = results.length > 0 ? results[0].totalDuration : 0;
            res.json({ totalDuration: totalDuration });
        }
    });
});



router.get('/nutrition', isLoggedIn, (req, res) => {
    res.render('nutrition')
})

router.get('/goals', isLoggedIn, (req, res) => {
    res.render('goals')
})

router.get('/reports', isLoggedIn, (req, res) => {
    res.render('reports')
})

router.get('/progress', isLoggedIn, (req, res) => {
    res.render('progress')
})

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile')
})

router.get('/settings', isLoggedIn, (req, res) => {
    res.render('settings')
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Session destruction error:', err);
            return res.redirect('/dashboard'); // Redirect to a safe page in case of error
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.redirect('/login'); // Redirect to the login page after logout
    });
});
module.exports = router