import Sequelize from 'sequelize';
import databaseConfig from './../config/database';

//models
import User from '../app/models/User';
import File from '../app/models/File';

const models = [User, File];

class DataBase {
  constructor() {
    this.init();
  }
  init() {
    this.connection = new Sequelize(databaseConfig);
    models.forEach(model => model.init(this.connection));
  }
}

export default new DataBase();
