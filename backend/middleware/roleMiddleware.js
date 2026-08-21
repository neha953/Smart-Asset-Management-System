const authorizeRole = (...roles) => {

    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const role = req.user.role;

        if (roles.includes(role)) {
            return next();
        }

        // SubAdmin automatically gets VIEW-ONLY access to any
        // route that allows "Admin" - they can see everything,
        // but can never add/edit/delete anything.
        if (role === "SubAdmin" && roles.includes("Admin") && req.method === "GET") {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "Access Forbidden"
        });

    };

};

module.exports = authorizeRole;