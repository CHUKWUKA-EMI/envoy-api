"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var sgMail = require("@sendgrid/mail");
var dotenv = require("dotenv");
dotenv.config();
var Email = /** @class */ (function () {
    function Email() {
    }
    Email.prototype.sendEmail = function (to, subject, html) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, sgMail.send({
                                to: to,
                                subject: subject,
                                from: "Admin<" + process.env.SUPPORT_EMAIL + ">",
                                html: html,
                            })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_1 = _a.sent();
                        console.log(error_1);
                        throw new Error(error_1.message);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Email.prototype.constructWelcomeEmail = function (firstname, url, subject) {
        return "\n        <!doctype html>\n        <html>\n        <head>\n        <meta name=\"viewport\" content=\"width=device-width\">\n        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n        <title>" + subject + "</title>\n        <style media=\"all\" type=\"text/css\">\n        @media only screen and (max-width: 620px) {\n          table[class=body] h1,\n          table[class=body] h2,\n          table[class=body] h3,\n          table[class=body] h4 {\n            font-weight: 600 !important;\n          }\n          table[class=body] h1 {\n            font-size: 22px !important;\n          }\n          table[class=body] h2 {\n            font-size: 18px !important;\n          }\n          table[class=body] h3 {\n            font-size: 16px !important;\n          }\n          table[class=body] .content,\n          table[class=body] .wrapper {\n            padding: 10px !important;\n          }\n          table[class=body] .container {\n            padding: 0 !important;\n            width: 100% !important;\n          }\n          table[class=body] .btn table,\n          table[class=body] .btn a {\n            width: 100% !important;\n          }\n        }\n        </style>\n        </head>\n\n        <body style=\"margin: 0; font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 14px; height: 100% !important; line-height: 1.6em; -webkit-font-smoothing: antialiased; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; width: 100% !important; background-color: #f6f6f6;\">\n\n        <table class=\"body\" style=\"box-sizing: border-box; border-collapse: separate !important; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;\" width=\"100%\" bgcolor=\"#f6f6f6\">\n            <tr>\n                <td style=\"box-sizing: border-box; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; vertical-align: top;\" valign=\"top\"></td>\n                <td class=\"container\" style=\"box-sizing: border-box; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto !important; max-width: 580px; padding: 10px; width: 580px;\" width=\"580\" valign=\"top\">\n                    <div class=\"content\" style=\"box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;\">\n        <span class=\"preheader\" style=\"color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;\"></span>\n        <div class=\"header\" style=\"box-sizing: border-box; margin-bottom: 30px; margin-top: 20px; width: 100%;\">\n          <table style=\"box-sizing: border-box; border-collapse: separate !important; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;\" width=\"100%\">\n            <tr>\n              <td class=\"align-center\" style=\"box-sizing: border-box; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; vertical-align: top; text-align: center;\" valign=\"top\" align=\"center\">\n                <h1 style=\"color: #0d0d64;\n           font-weight: 900;\n           font-style: italic;\n           border: 1px solid #0d0d64;\n           border-width: 3px 3px 3px 3px;\n           width: fit-content,padding: 4px;\">ENVOY</h1>\n              </td>\n            </tr>\n          </table>\n        </div>\n        <table class=\"main\" style=\"box-sizing: border-box; border-collapse: separate !important; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border: 1px solid #e9e9e9; border-radius: 3px;\" width=\"100%\">\n          <tr>\n            <td class=\"wrapper\" style=\"box-sizing: border-box; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; vertical-align: top; padding: 30px;\" valign=\"top\">\n              <table style=\"box-sizing: border-box; border-collapse: separate !important; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;\" width=\"100%\">\n                <tr>\n                  <td style=\"box-sizing: border-box; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; vertical-align: top;\" valign=\"top\">\n                        \n\n                  <p style=\"font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; font-weight: bold; margin: 0; margin-bottom: 15px;\">Hello " + firstname + "</p>\n\n                 <p style=\"font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;\">Welcome to Envoy!</p>\n\t\t\t\t\t\t\t\t \n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<p style=\"font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;\">\n\t\t\t\t\t\t\t\t   <ul>\n\t\t\t\t\t\t\t\t\t   <li> <a style=\"background-color: #51A4FB;\n                color: white;\n                font-weight: 900;\n                border-radius: 1em;\n                border: none;\n                outline: none;\n                padding: 1em;\n\t\t\t\t\t\t\t\tmargin-top:10px;\n\t\t\t\t\t\t\t\tmargin-bottom:10px;\n                text-decoration: none;\" href=" + url + " target='_blank'>Verify Email</a></li>\n\t\t\t\t\t\t\t\t\t </ul>\n\t\t\t\t\t\t\t\t</p>\n\n                <p style=\"font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;\">Please Note that this verification link expires after 24 hours.</p>\n\n\t\t\t\t\t\t\t\t<p style=\"font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;\">Need any help? You can email<b><a href='mailto:" + process.env.SUPPORT_EMAIL + "' target='_blank'> the support</a></b></p>\n\n\t\t            <p style=\"font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;\">Cheers,<br/>The Envoy Team.</p>\n                </td>\n                </tr>\n              </table>\n            </td>\n          </tr>\n        </table>\n        <div class=\"footer\" style=\"box-sizing: border-box; clear: both; width: 100%;\">\n          <table style=\"box-sizing: border-box; border-collapse: separate !important; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; color: #999999; font-size: 12px;\" width=\"100%\">\n            <tr style=\"color: #999999; font-size: 12px;\">\n              <td class=\"align-center\" style=\"box-sizing: border-box; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; vertical-align: top; font-size: 12px; color: #999999; text-align: center; padding: 20px 0;\" valign=\"top\" align=\"center\">\n                  <p style=\"font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-weight: normal; margin: 0; margin-bottom: 15px; color: #999999; font-size: 12px; text-align: center;\">Questions? Email: pistischaris494@gmail.com or Call: +2347034969842</p>\n                <p style=\"font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-weight: normal; margin: 0; margin-bottom: 15px; color: #999999; font-size: 12px;\">Don't want to receive these emails? <a href=\"\" style=\"box-sizing: border-box; text-decoration: underline; color: #999999; font-size: 12px;\"><unsubscribe style=\"color: #999999; font-size: 12px;\">Unsubscribe</unsubscribe></a>.</p>\n              </td>\n            </tr>\n          </table>\n        </div>\n        </div>\n                </td>\n                <td style=\"box-sizing: border-box; font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 14px; vertical-align: top;\" valign=\"top\"></td>\n            </tr>\n        </table>\n\n        </body>\n        </html>\n    ";
    };
    return Email;
}());
exports.default = Email;
//# sourceMappingURL=email.js.map