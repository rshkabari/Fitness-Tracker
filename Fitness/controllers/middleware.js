//Checks if user is Logged in
exports.isLoggedIn = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
};

//Checks if user is Logged out
exports.isLoggedOut = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        next();
    } else {
        res.redirect('/'); // Redirect to a different route like a user dashboard
    }
};

//Error Handler
exports.errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
};

//Logging
exports.logRequests = (req, res, next) => {
    console.log(`Received ${req.method} request on ${req.url}`);
    next();
};
