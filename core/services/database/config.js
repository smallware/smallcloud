
module.exports = {
  name: 'smalldev',
  username: 'smalldev',
  password: 'smalldev',
  options: {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,

    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  }
};