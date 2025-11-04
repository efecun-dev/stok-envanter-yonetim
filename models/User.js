const db = require("../config/database.js");
const bcrypt = require("bcrypt");

class User {
  constructor(id, email, password, ad, soyad, role_id) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.ad = ad;
    this.soyad = soyad;
    this.role_id = role_id;
  }

  static async findByEmail(email) {
    try {
      const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      return rows.map(
        (row) =>
          new User(
            row.id,
            row.email,
            row.password,
            row.ad,
            row.soyad,
            row.role_id
          )
      );
    } catch (err) {
      console.error("User.findByEmail hata:", err);
      throw err;
    }
  }
}

module.exports = User;
