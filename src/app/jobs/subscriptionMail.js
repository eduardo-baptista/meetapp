import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../libs/Mail';

class subscriptionMail {
  get key() {
    return 'subscriptionMail';
  }

  async handle({ data }) {
    const { emailData } = data;

    // send mail to provider about the cancel
    Mail.sendMail({
      to: `${emailData.promoter.name} <${emailData.promoter.email}>`,
      subject: 'Inscrição registrada',
      template: 'subscription',
      context: {
        promoter: emailData.promoter.name,
        user: emailData.user,
        title: emailData.title,
        location: emailData.location,
        date: format(
          parseISO(emailData.date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new subscriptionMail();
