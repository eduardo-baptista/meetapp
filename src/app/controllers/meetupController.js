import * as Yup from 'yup';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import File from '../models/File';

class meetupController {
  async index(req, res) {
    const where = {};
    const page = req.query.page || 1;

    if (req.query.date) {
      const searchDate = parseISO(req.query.date);

      where.date = {
        [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
      };
    }

    const meetups = await Meetup.findAll({
      where,
      offset: page * 10 - 10,
      limit: page * 10,
      include: [{ model: File, as: 'banner' }],
    });

    res.json(meetups);
  }

  async store(req, res) {
    //input validation
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date()
        .min(new Date())
        .required(),
      image_id: Yup.number()
        .positive()
        .required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'request does not valid' });
    }

    const { userId: user_id } = req;

    // create meetup
    const meetup = await Meetup.create({ ...req.body, user_id });

    return res.json(meetup);
  }

  async update(req, res) {
    // input valitation
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.date().min(new Date()),
      image_id: Yup.number().positive(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'request does not valid' });
    }

    // get the meetup and verify the user id
    const meetup = await Meetup.findOne({
      where: {
        id: req.params.id,
        user_id: req.userId,
      },
    });

    if (!meetup) {
      return res.status(400).json({
        error: 'there is not meetup created for this user with this id',
      });
    }

    // update meetup
    const userUpdate = await meetup.update(req.body);

    return res.json(userUpdate);
  }

  async delete(req, res) {
    // get the meetup and verify the user id
    const meetup = await Meetup.findOne({
      where: {
        id: req.params.id,
        user_id: req.userId,
      },
    });

    if (!meetup) {
      return res.status(400).json({
        error: "don't have meetup created for this user with this id",
      });
    }

    // verify the date of the meetup
    if (meetup.past) {
      return res
        .status(400)
        .json({ error: 'You can not delete meetups that already happened' });
    }

    // delete the meetup
    await meetup.destroy();
    return res.json(meetup);
  }
}

export default new meetupController();
