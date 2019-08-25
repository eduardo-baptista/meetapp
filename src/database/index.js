import Sequelize from 'sequelize';
import databaseConfig from './../config/database';

//modules
import User from '../app/models/User';

const models = [User];

class DataBase {
  constructor() {
    this.init();
  }
  init() {
    this.connection = new Sequelize(databaseConfig);
    models.forEach(model => model.init(Sequelize));
  }
}

export default new DataBase();
