import Sequelize from 'sequelize';
import databaseConfig from './../config/database';

//models
import User from '../app/models/User';
import File from '../app/models/File';
import Meetup from '../app/models/Meetup';

const models = [User, File, Meetup];

class DataBase {
  constructor() {
    this.init();
    this.associate();
  }
  init() {
    this.connection = new Sequelize(databaseConfig);
    models.forEach(model => model.init(this.connection));
  }

  associate() {
    models.forEach(model => {
      if (model.associate) {
        model.associate(this.connection.models);
      }
    });
  }
}

export default new DataBase();
