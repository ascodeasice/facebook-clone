// verify Token
exports.verifyToken = (req, res, next) => {
    // Get the auth header value
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }
}