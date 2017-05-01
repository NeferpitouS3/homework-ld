/**
 * Created by Neferpitou on 2017/4/6.
 */
function noLogin(req,res,next) {
    if(!req.session.user){
        return res.redirect('/login');
    }
    next();
}
exports.noLogin = noLogin;