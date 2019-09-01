import * as Yup from 'yup';
import Meetup from '../models/Meetup';

class meetupController {
  async store(req, res) {
    //input validation
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date()
        .isValid()
        .required(),
      image_id: Yup.number()
        .positive()
        .required(),
    });
    if (!(await schema.validate(req.body))) {
      res.status(400).json({ error: 'request does not valid' });
    }
  }
}

export default new meetupController();
