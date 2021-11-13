import * as sgMail from "@sendgrid/mail";
import * as dotenv from "dotenv";

dotenv.config();

class Email {
  async sendEmail(to: string, subject: string, html: string) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    try {
      return await sgMail.send({
        to,
        subject,
        from: `Admin<${process.env.SUPPORT_EMAIL}>`,
        html,
      });
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  constructWelcomeEmail(firstname: String, url: string, subject: string) {
    return `
        <!doctype html>
        <html>
        <head>
        <meta name="viewport" content="width=device-width">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>${subject}</title>
        <style media="all" type="text/css">
        @media only screen and (max-width: 620px) {
          table[class=body] h1,
          table[class=body] h2,
          table[class=body] h3,
          table[class=body] h4 {
            font-weight: 600 !important;
          }
          table[class=body] h1 {
            font-size: 22px !important;
          }
          table[class=body] h2 {
            font-size: 18px !important;
          }
          table[class=body] h3 {
            font-size: 16px !important;
          }
          table[class=body] .content,
          table[class=body] .wrapper {
            padding: 10px !important;
          }
          table[class=body] .container {
            padding: 0 !important;
            width: 100% !important;
          }
          table[class=body] .btn table,
          table[class=body] .btn a {
            width: 100% !important;
          }
        }
        </style>
        </head>

        <body style="margin: 0; font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 14px; height: 100% !important; line-height: 1.6em; -webkit-font-smoothing: antialiased; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; width: 100% !important; background-color: #f6f6f6;">

        <table class="body" style="box-sizing: border-box; border-collapse: separate !important; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;" width="100%" bgcolor="#f6f6f6">
            <tr>
                <td style="box-sizing: border-box; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; vertical-align: top;" valign="top"></td>
                <td class="container" style="box-sizing: border-box; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto !important; max-width: 580px; padding: 10px; width: 580px;" width="580" valign="top">
                    <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;">
        <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;"></span>
        <div class="header" style="box-sizing: border-box; margin-bottom: 30px; margin-top: 20px; width: 100%;">
          <table style="box-sizing: border-box; border-collapse: separate !important; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
            <tr>
              <td class="align-center" style="box-sizing: border-box; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; vertical-align: top; text-align: center;" valign="top" align="center">
                <h1 style="color: #0d0d64;
           font-weight: 900;
           font-style: italic;
           border: 1px solid #0d0d64;
           border-width: 3px 3px 3px 3px;
           width: fit-content,padding: 4px;">ENVOY</h1>
              </td>
            </tr>
          </table>
        </div>
        <table class="main" style="box-sizing: border-box; border-collapse: separate !important; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border: 1px solid #e9e9e9; border-radius: 3px;" width="100%">
          <tr>
            <td class="wrapper" style="box-sizing: border-box; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; vertical-align: top; padding: 30px;" valign="top">
              <table style="box-sizing: border-box; border-collapse: separate !important; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                <tr>
                  <td style="box-sizing: border-box; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; vertical-align: top;" valign="top">
                        

                  <p style="font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; font-weight: bold; margin: 0; margin-bottom: 15px;">Hello ${firstname}</p>

                 <p style=\"font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;\">Welcome to Envoy!</p>
								 
								
								<p style=\"font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;\">
								   <ul>
									   <li> <a style=\"background-color: #51A4FB;
                color: white;
                font-weight: 900;
                border-radius: 1em;
                border: none;
                outline: none;
                padding: 1em;
								margin-top:10px;
								margin-bottom:10px;
                text-decoration: none;\" href=${url} target='_blank'>Verify Email</a></li>
									 </ul>
								</p>

                <p style=\"font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;\">Please Note that this verification link expires after 24 hours.</p>

								<p style=\"font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;\">Need any help? You can email<b><a href='mailto:${process.env.SUPPORT_EMAIL}' target='_blank'> the support</a></b></p>

		            <p style=\"font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;\">Cheers,<br/>The Envoy Team.</p>
                </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <div class="footer" style="box-sizing: border-box; clear: both; width: 100%;">
          <table style="box-sizing: border-box; border-collapse: separate !important; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; color: #999999; font-size: 12px;" width="100%">
            <tr style="color: #999999; font-size: 12px;">
              <td class="align-center" style="box-sizing: border-box; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; vertical-align: top; font-size: 12px; color: #999999; text-align: center; padding: 20px 0;" valign="top" align="center">
                  <p style="font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-weight: normal; margin: 0; margin-bottom: 15px; color: #999999; font-size: 12px; text-align: center;">Questions? Email: pistischaris494@gmail.com or Call: +2347034969842</p>
                <p style="font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-weight: normal; margin: 0; margin-bottom: 15px; color: #999999; font-size: 12px;">Don't want to receive these emails? <a href="" style="box-sizing: border-box; text-decoration: underline; color: #999999; font-size: 12px;"><unsubscribe style="color: #999999; font-size: 12px;">Unsubscribe</unsubscribe></a>.</p>
              </td>
            </tr>
          </table>
        </div>
        </div>
                </td>
                <td style="box-sizing: border-box; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; vertical-align: top;" valign="top"></td>
            </tr>
        </table>

        </body>
        </html>
    `;
  }
}

export default Email;
