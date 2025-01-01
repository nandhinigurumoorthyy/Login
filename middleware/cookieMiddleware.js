function cookieGuard(request, response, next) {
  console.log("request.cookies", request.cookies);

  if (request.cookies.auth) {
    next();
  } else {
    return res.redirect(`${process.env.NODE_ENV==="development?"?"http":"https"}://${req.headers["host"]}/signin`);
  }
}
module.exports = { cookieGuard };
