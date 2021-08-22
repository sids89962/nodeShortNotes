const passport =  require('passport')
const express =  require('express');
const router =  express.Router()
//Login/google
// @route GET /auth/google

router.get('/google',passport.authenticate('google',{scope : ['profile']}))

//@route GET/auth/google/callback
router.get('/google/callback',passport.authenticate('google',{failureRedirect : '/' }),
 (req,res) => {
    res.redirect('/dashboard')
} )


//@desc logout user
// @route /auth/logout

router.get('/logout',(req,res)=> {
    req.logout()
    res.redirect('/')
})



module.exports = router