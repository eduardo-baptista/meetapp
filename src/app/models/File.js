import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        filename: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.SERVER_URL}/uploads/${this.path}`;
          },
        },
      },
      { sequelize }
    );
  }
}

export default File;
