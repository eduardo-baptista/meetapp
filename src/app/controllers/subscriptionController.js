import * as Yup from 'yup';
import Subscription from '../models/Subscription';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import Queue from '../../libs/Queue';
import User from '../models/User';

class subscriptionController {
  async store(req, res) {
    // input validation
    const schema = Yup.object().shape({
      meetup_id: Yup.number().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'request does not valid' });
    }

    const { meetup_id } = req.body;

    // check exist and creator id
    const meetup = await Meetup.findOne({
      where: {
        id: meetup_id,
        user_id: {
          // search for different creators users
          [Op.ne]: req.userId,
        },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!meetup) {
      return res
        .status(400)
        .json({ error: 'this meetup is not valid to subscribe' });
    }

    //check the date
    if (meetup.past) {
      return res
        .status(400)
        .json({ error: 'Can not subscribe in a past meetup' });
    }

    // check if the user is already subscribe for this meetup
    const subscribeExist = await Subscription.findOne({
      where: {
        meetup_id,
        user_id: req.userId,
      },
    });

    if (subscribeExist) {
      return res
        .status(400)
        .json({ error: 'User already subscribed on this meetup' });
    }

    // check if user has a meetup in the same time
    const subscribeSameTime = await Subscription.findOne({
      where: {
        user_id: req.userId,
      },
      include: [{ model: Meetup, as: 'meetup', where: { date: meetup.date } }],
    });

    if (subscribeSameTime) {
      return res.status(400).json({ error: 'time do not available' });
    }

    // create the subscription
    const subscription = await Subscription.create({
      meetup_id,
      user_id: req.userId,
    });

    const user = await User.findByPk(req.userId);

    //send a email about the cancelation
    const emailData = {
      promoter: {
        name: meetup.user.name,
        email: meetup.user.email,
      },
      user: user.name,
      title: meetup.title,
      date: meetup.date,
      location: meetup.location,
    };
    await Queue.add('subscriptionMail', { emailData });

    return res.json(subscription);
  }
}

export default new subscriptionController();
