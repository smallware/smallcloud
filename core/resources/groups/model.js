
module.exports = {
  atts: {
    id: {
      type: S.orm.types.STRING,
      primaryKey: true
    },
    name: {
      type: S.orm.types.STRING,
      unique: true
    },
    icon: {
      type: S.orm.types.STRING
    }
  },
  relations: [
    {
      type: 'belongsToMany',
      model: 'users',
      options: { through: 'users_groups' }
    }
  ],
  options: {}
};