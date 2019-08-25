import User from '../models/User';
import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import authConfig from '../../config/auth';

class sessionController {
  async store(req, res) {
    //data validation
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      password: Yup.string()
        .min(6)
        .required(),
    });
    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'request does not valid' });
    }

    //verify login
    const { email, password } = req.body;

    const user = User.findOne();
  }
}

export default new sessionController();
