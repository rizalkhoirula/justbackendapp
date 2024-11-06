const { Sequelize, DataTypes, Model } = require("sequelize");
const bcryptjs = require("bcryptjs");
const validator = require("validator");

// Koneksi ke database
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
});

// Definisi model User
class User extends Model {
  async comparePassword(reqPassword) {
    return await bcryptjs.compare(reqPassword, this.password);
  }
}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: {
        msg: "username sudah digunakan",
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "email sudah digunakan",
      },
      validate: {
        isEmail: {
          msg: "email harus berformat email",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6],
          msg: "password harus minimal 6 karakter",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
    token: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "User",
    timestamps: true,
    hooks: {
      beforeSave: async (user) => {
        if (user.changed("password")) {
          const salt = await bcryptjs.genSalt(10);
          user.password = await bcryptjs.hash(user.password, salt);
        }
      },
    },
  }
);

module.exports = User;
