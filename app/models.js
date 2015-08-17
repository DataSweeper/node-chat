var Sequelize = require( 'sequelize' );
var sequelize = new Sequelize('mysql://root@127.0.0.1:3306/chatapp');

exports.Users = sequelize.define ( 'users', {
  username: Sequelize.STRING,
  password: Sequelize.TEXT
})

