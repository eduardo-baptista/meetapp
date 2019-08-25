import User from '../models/User';
import * as Yup from 'yup';

class userController {
  async store(req, res) {
    //data validation
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'request does not valid' });
    }

    //verify user exist
    const userExist = await User.findOne({ where: { email: req.body.email } });
    if (userExist)
      return res.status(400).json({ error: 'user already exists' });

    //save the new user
    const { id, name, email } = await User.create(req.body);
    res.json({ id, name, email });
  }

  async update(req, res) {
    //data validation
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) => {
          oldPassword ? field.required() : field;
        }),
      confirmPassword: Yup.string().when('password', (password, field) => {
        password ? field.required().oneOf([Yup.ref('password')]) : field;
      }),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'request does not valid' });
    }

    //verify email exist
    // const user

    //verify oldPassword is correct

    //update user
  }
}

export default new userController();
