const db = require("../config/database.js");
const bcrypt = require("bcrypt");

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.ad = data.ad;
    this.soyad = data.soyad;
    this.role_id = data.role_id;
  }

  static async findByEmail(email) {
    try {
      const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      return rows.map((row) => new User(row));
    } catch (err) {
      console.error("User.findByEmail hata:", err);
      throw err;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
      return rows.map((row) => new User(row));
    } catch (err) {
      console.error("User.findById hata: ", err);
      throw err;
    }
  }
}

module.exports = User;
