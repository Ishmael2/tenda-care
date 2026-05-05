// src/middlewares/validateData.js
export const validateInteraction = (req, res, next) => {
    const { userId, actionType } = req.body;

    if (!userId || !actionType) {
        return res.status(400).json({ 
            error: "Missing required fields: userId and actionType are mandatory." 
        });
    }

    // If everything is okay, move to the next step (the controller)
    next();
};