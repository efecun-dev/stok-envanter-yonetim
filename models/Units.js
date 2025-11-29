const db = require("../config/database");

class Units {
  constructor(row) {
    this.id = row.id;
    this.ad = row.ad;
    this.kod = row.kod;
    this.kategori = row.kategori;
    this.aciklama = row.aciklama;
  }

  static async getUnits() {
    try {
      let sql = `SELECT * FROM units`;
      const [rows] = await db.query(sql);
      return rows.map((row) => new Units(row));
    } catch (err) {
      console.error("Units.getUnits hata: ", err);
      throw err;
    }
  }
}

module.exports = Units;
