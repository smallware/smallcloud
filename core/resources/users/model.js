var bcrypt = require('bcryptjs');


module.exports = {
  //name: 'Users',
  atts: {
    id: {
      type: S.orm.types.STRING,
      primaryKey: true
    },
    firstname: {
      type: S.orm.types.STRING
    },
    lastname: {
      type: S.orm.types.STRING
    },
    email: {
      type: S.orm.types.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: S.orm.types.STRING,
      set: function(pwd){

        // Obtain pwd hash
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(pwd, salt);

        // Set password hash
        this.setDataValue('password', hash);
      }
    },
    avatar: {
      type: S.orm.types.STRING
    }
  },
  relations: [
    {
      type: 'belongsToMany',
      model: 'groups',
      options: { through: 'users_groups' }
    }
  ],
  options: {
    instanceMethods: {
      validatePwd: function(pwd){
        return bcrypt.compareSync(pwd, this.password);
      },
      getFullName: function(){
        return this.getDataValue('firstname') + ' ' + this.getDataValue('lastname');
      }
    }
  }
};