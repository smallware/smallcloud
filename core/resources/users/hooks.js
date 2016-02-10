
module.exports = {

  startup: function *(){

    // XXX
    //console.log('STARTUP:', this);

    // Make sure there is an admin user (and group)
    yield S.users.create({
      id: 'admin',
      email: 'admin@smallcloud.com',
      password: 'smalldev'
    });

    // Get admin group instance
    var adminGrp = yield S.get('database').models.groups.findById('admin');

    // Get users resource instance
    var usersRes = yield S.get('database').models.resources.findById('users');

    // Get groups resource instance
    var groupsRes = yield S.get('database').models.resources.findById('groups');

    // Enforce user policies
    yield usersRes.addGroup(adminGrp, {
      fetch:  true,
      create: true,
      update: true,
      remove: true
    });

    // Enforce group policies
    yield groupsRes.addGroup(adminGrp, {
      fetch:  true,
      create: true,
      update: true,
      remove: true
    });

  },

  create: function *(next){

    // XXX
    console.log('>>> Resource "users" CREATE middleware hook');

    //yield next;


    // Result parser
    var parser = function(instance, created){
      this.response.instance = instance;
      this.response.created  = created;
    };

    // Create the user
    yield S.get('database').models[this.request.resource].findOrCreate({
      where: {id: this.request.params.id},
      defaults: this.request.params
    }).spread(parser.bind(this));

    // Was a user created?
    if( !this.response.created )
      return;

    // Create a group for the user
    var grpInstance = yield S.get('database').models.groups.findOrCreate({
      where: {id: this.request.params.id},
      defaults: {
        id: this.request.params.id,
        name: this.request.params.id
      }
    }).then(function(data){
      return data[0];
    });

    // XXX
    console.log('>>> INSTANCE:', this.response.instance);

    // Associate user to it's group
    this.response.instance.addGroup(grpInstance);

  },

  update: function *(next){

    // XXX
    console.log('>>> Resource "users" UPDATE middleware hook');

    // TODO: Only allow update same user

    yield next;

  }

};