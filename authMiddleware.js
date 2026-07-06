const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET || 'yourSecretKey');  // Split to remove 'Bearer'
        req.user = decoded;  // Attach user info from token
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};
