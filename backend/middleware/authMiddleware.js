import jwt from 'jsonwebtoken'
import asyncHandler from './asyncHandler.js'
import User from '../models/userModel.js'

//////////////////// Protect Middleware:
// Protect routes
const protect = asyncHandler(async( req, res, next)=>{ // next is like 'okay we're done here move on to the next middleware'
    let token
    
    // Read the jwt from the cookie
    token = req.cookies.jwt // req.cookies.whateverYouNamedIt we named it jwt

    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            // Now this user object (req.user) will be in our req object in all our routes and it will be the user that's logged in!
            req.user = await User.findById(decoded.userId).select('-password') // minus password means we don't want the password
            next()
        } catch (error) {
            console.log(error);
            res.status(401)
            throw new Error('Not authorized, token failed')
        }
    } else {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})

///////////////// Admin Middleware
const admin = (req, res, next)=>{
    if(req.user && req.user.isAdmin){
        next()
    } else {
        res.status(401)
        throw new Error('Not authorized as admin')
    }
}

export {protect, admin}