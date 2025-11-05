const checkPassword = require("../utils/checkPassword");

exports.getLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (err) {
    console.error("getLogin hata:", err);
    throw err;
  }
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  const { auth, user } = await checkPassword.check(email, password);
  if (auth) {
    req.session.userId = user.id;
    res.redirect("/");
  } else {
    req.session.alert = {
      message: "E-posta veya şifre hatalı!",
      type: "danger",
    };
    return res.redirect("/login");
  }
};

exports.getLogout = (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout hata: ", err);
        req.session.alert = {
          message: "Oturum sonlandırma işlemi başarısız.",
          type: "warning",
        };
        return res.redirect("/");
      }
      res.clearCookie("connect.sid");
      return res.redirect("/login");
    });
  } else {
    return res.redirect("/login");
  }
};
