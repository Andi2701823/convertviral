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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.EmailAutomation = exports.emailTemplates = void 0;
exports.createEmailService = createEmailService;
exports.sendWaitlistConfirmation = sendWaitlistConfirmation;
exports.sendLeadMagnetWelcome = sendLeadMagnetWelcome;
exports.sendLaunchNotification = sendLaunchNotification;
// Email templates
exports.emailTemplates = {
    waitlistConfirmation: {
        subject: function (planType) { return "Welcome to ConvertViral ".concat(planType, " Waitlist! \uD83C\uDF89"); },
        html: function (data) { return "\n      <!DOCTYPE html>\n      <html>\n      <head>\n        <meta charset=\"utf-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Welcome to ConvertViral Waitlist</title>\n        <style>\n          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }\n          .container { max-width: 600px; margin: 0 auto; padding: 20px; }\n          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }\n          .content { background: white; padding: 30px; border: 1px solid #e1e5e9; }\n          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }\n          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; }\n          .discount-code { background: #f0f9ff; border: 2px dashed #0ea5e9; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }\n          .social-links { margin: 20px 0; }\n          .social-links a { display: inline-block; margin: 0 10px; }\n        </style>\n      </head>\n      <body>\n        <div class=\"container\">\n          <div class=\"header\">\n            <h1>\uD83C\uDF89 You're on the list!</h1>\n            <p>Welcome to ConvertViral ".concat(data.planType, " waitlist</p>\n          </div>\n          \n          <div class=\"content\">\n            <h2>Hi ").concat(data.name, "!</h2>\n            \n            <p>Thank you for joining the ConvertViral ").concat(data.planType, " waitlist! You're now part of an exclusive group getting early access to our premium features.</p>\n            \n            <div class=\"discount-code\">\n              <h3>\uD83C\uDF81 Your Early Bird Discount Code</h3>\n              <h2 style=\"color: #0ea5e9; font-family: monospace; letter-spacing: 2px;\">").concat(data.discountCode, "</h2>\n              <p><strong>Save 50% when ").concat(data.planType, " launches!</strong></p>\n            </div>\n            \n            <h3>What happens next?</h3>\n            <ul>\n              <li>\uD83D\uDCE7 We'll email you the moment ").concat(data.planType, " features go live</li>\n              <li>\uD83C\uDFAF You'll get priority access before the general public</li>\n              <li>\uD83D\uDCB0 Your 50% discount will be automatically applied</li>\n              <li>\uD83D\uDE80 Plus exclusive bonuses for early supporters</li>\n            </ul>\n            \n            <h3>Share & Earn More Rewards</h3>\n            <p>Share your referral code <strong>").concat(data.referralCode, "</strong> with friends and earn additional bonuses:</p>\n            <ul>\n              <li>3 referrals = Extra 10% discount</li>\n              <li>5 referrals = Free month when you upgrade</li>\n              <li>10+ referrals = Lifetime 20% discount</li>\n            </ul>\n            \n            <div class=\"social-links\">\n              <a href=\"https://twitter.com/intent/tweet?text=I'm%20waiting%20for%20@ConvertViral%20").concat(data.planType, "%20features!%20Join%20me%20with%20code%20").concat(data.referralCode, "%20for%20early%20bird%20pricing%20\uD83D\uDE80&url=https://convertviral.com/pricing\" class=\"button\">Share on Twitter</a>\n              <a href=\"https://www.facebook.com/sharer/sharer.php?u=https://convertviral.com/pricing\" class=\"button\">Share on Facebook</a>\n            </div>\n            \n            <p>Questions? Just reply to this email - we're here to help!</p>\n            \n            <p>Best regards,<br>The ConvertViral Team</p>\n          </div>\n          \n          <div class=\"footer\">\n            <p>ConvertViral - Professional File Conversion Made Simple</p>\n            <p><a href=\"https://convertviral.com/unsubscribe?email=").concat(data.email, "\">Unsubscribe</a> | <a href=\"https://convertviral.com/privacy\">Privacy Policy</a></p>\n          </div>\n        </div>\n      </body>\n      </html>\n    "); }
    },
    leadMagnetWelcome: {
        subject: function (magnetType) { return "Your Free ".concat(magnetType.charAt(0).toUpperCase() + magnetType.slice(1), " is Ready! \uD83D\uDCDA"); },
        html: function (data) { return "\n      <!DOCTYPE html>\n      <html>\n      <head>\n        <meta charset=\"utf-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Your Free Download is Ready</title>\n        <style>\n          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }\n          .container { max-width: 600px; margin: 0 auto; padding: 20px; }\n          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }\n          .content { background: white; padding: 30px; border: 1px solid #e1e5e9; }\n          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }\n          .download-button { display: inline-block; background: #10b981; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 18px; margin: 20px 0; }\n          .bonus-section { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; }\n        </style>\n      </head>\n      <body>\n        <div class=\"container\">\n          <div class=\"header\">\n            <h1>\uD83D\uDCDA Your Download is Ready!</h1>\n            <p>Thanks for downloading our ".concat(data.magnetType, "</p>\n          </div>\n          \n          <div class=\"content\">\n            <h2>Hi ").concat(data.name, "!</h2>\n            \n            <p>Thank you for downloading our ").concat(data.magnetType, "! You can access it using the button below:</p>\n            \n            <div style=\"text-align: center;\">\n              <a href=\"").concat(data.downloadUrl, "\" class=\"download-button\">\uD83D\uDCE5 Download Your ").concat(data.magnetType, "</a>\n            </div>\n            \n            <p><small>This download link will be active for 7 days.</small></p>\n            \n            <div class=\"bonus-section\">\n              <h3>\uD83C\uDF81 Bonus: Want More Free Resources?</h3>\n              <p>As a thank you, here are some additional free resources:</p>\n              <ul>\n                <li><a href=\"https://convertviral.com/blog/conversion-tips\">10 Pro Conversion Tips</a></li>\n                <li><a href=\"https://convertviral.com/tools/batch-converter\">Free Batch Converter Tool</a></li>\n                <li><a href=\"https://convertviral.com/templates\">Professional Templates</a></li>\n              </ul>\n            </div>\n            \n            <h3>What's Next?</h3>\n            <p>Over the next few days, I'll send you:</p>\n            <ul>\n              <li>\uD83D\uDCD6 Advanced conversion techniques</li>\n              <li>\uD83D\uDEE0\uFE0F Tool recommendations and reviews</li>\n              <li>\uD83D\uDCA1 Pro tips from industry experts</li>\n              <li>\uD83C\uDFAF Exclusive offers and early access</li>\n            </ul>\n            \n            <p>Questions about the ").concat(data.magnetType, "? Just reply to this email!</p>\n            \n            <p>Best regards,<br>The ConvertViral Team</p>\n          </div>\n          \n          <div class=\"footer\">\n            <p>ConvertViral - Professional File Conversion Made Simple</p>\n            <p><a href=\"https://convertviral.com/unsubscribe?email=").concat(data.email, "\">Unsubscribe</a> | <a href=\"https://convertviral.com/privacy\">Privacy Policy</a></p>\n          </div>\n        </div>\n      </body>\n      </html>\n    "); }
    },
    launchNotification: {
        subject: function () { return "\uD83D\uDE80 ConvertViral Premium is LIVE! Your 50% discount is waiting..."; },
        html: function (data) { return "\n      <!DOCTYPE html>\n      <html>\n      <head>\n        <meta charset=\"utf-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Premium Features Are Live!</title>\n        <style>\n          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }\n          .container { max-width: 600px; margin: 0 auto; padding: 20px; }\n          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }\n          .content { background: white; padding: 30px; border: 1px solid #e1e5e9; }\n          .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }\n          .cta-button { display: inline-block; background: #f59e0b; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 18px; margin: 20px 0; }\n          .urgency { background: #fef2f2; border: 2px solid #ef4444; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }\n          .features { background: #f0f9ff; padding: 20px; margin: 20px 0; border-radius: 8px; }\n        </style>\n      </head>\n      <body>\n        <div class=\"container\">\n          <div class=\"header\">\n            <h1>\uD83D\uDE80 IT'S HERE!</h1>\n            <p>ConvertViral Premium is officially LIVE</p>\n          </div>\n          \n          <div class=\"content\">\n            <h2>Hi ".concat(data.name, "!</h2>\n            \n            <p>The wait is over! ConvertViral Premium features are now live and ready for you to use.</p>\n            \n            <div class=\"urgency\">\n              <h3>\u23F0 Your 50% Early Bird Discount Expires in 48 Hours!</h3>\n              <p>Use code: <strong style=\"font-size: 24px; color: #ef4444;\">").concat(data.discountCode, "</strong></p>\n            </div>\n            \n            <div class=\"features\">\n              <h3>\uD83C\uDFAF What You Get with Premium:</h3>\n              <ul>\n                <li>\u2705 Unlimited file conversions</li>\n                <li>\u2705 500MB file size limit</li>\n                <li>\u2705 No watermarks</li>\n                <li>\u2705 Priority processing</li>\n                <li>\u2705 Batch conversion</li>\n                <li>\u2705 Advanced format options</li>\n                <li>\u2705 Email support</li>\n              </ul>\n            </div>\n            \n            <div style=\"text-align: center;\">\n              <a href=\"https://convertviral.com/upgrade?code=").concat(data.discountCode, "\" class=\"cta-button\">\uD83C\uDF89 Claim Your 50% Discount Now</a>\n            </div>\n            \n            <p><strong>Remember:</strong> This early bird pricing is only available for the first 48 hours and only for waitlist members like you.</p>\n            \n            <p>After that, Premium goes to regular pricing at $4.99/month.</p>\n            \n            <p>Thank you for being part of our journey from the beginning!</p>\n            \n            <p>Best regards,<br>The ConvertViral Team</p>\n          </div>\n          \n          <div class=\"footer\">\n            <p>ConvertViral - Professional File Conversion Made Simple</p>\n            <p><a href=\"https://convertviral.com/unsubscribe?email=").concat(data.email, "\">Unsubscribe</a> | <a href=\"https://convertviral.com/privacy\">Privacy Policy</a></p>\n          </div>\n        </div>\n      </body>\n      </html>\n    "); }
    }
};
// Mock email service for development
var MockEmailService = /** @class */ (function () {
    function MockEmailService() {
    }
    MockEmailService.prototype.send = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('📧 Mock Email Sent:', {
                            to: params.to,
                            subject: params.subject,
                            from: params.from || 'noreply@convertviral.com',
                            htmlLength: params.html.length
                        });
                        // Simulate email delivery delay
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                    case 1:
                        // Simulate email delivery delay
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return MockEmailService;
}());
// Email service factory
function createEmailService() {
    // In production, you would return the actual email service
    // For example, with SendGrid:
    /*
    if (process.env.SENDGRID_API_KEY) {
      return new SendGridEmailService(process.env.SENDGRID_API_KEY);
    }
    */
    // For now, return mock service
    return new MockEmailService();
}
// Email automation functions
function sendWaitlistConfirmation(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var emailService, template;
        var email = _b.email, name = _b.name, planType = _b.planType, discountCode = _b.discountCode, referralCode = _b.referralCode;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    emailService = createEmailService();
                    template = exports.emailTemplates.waitlistConfirmation;
                    return [4 /*yield*/, emailService.send({
                            to: email,
                            subject: template.subject(planType),
                            html: template.html({ name: name, planType: planType, discountCode: discountCode, referralCode: referralCode, email: email })
                        })];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function sendLeadMagnetWelcome(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var emailService, template;
        var email = _b.email, name = _b.name, magnetType = _b.magnetType, downloadUrl = _b.downloadUrl;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    emailService = createEmailService();
                    template = exports.emailTemplates.leadMagnetWelcome;
                    return [4 /*yield*/, emailService.send({
                            to: email,
                            subject: template.subject(magnetType),
                            html: template.html({ name: name, magnetType: magnetType, downloadUrl: downloadUrl, email: email })
                        })];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function sendLaunchNotification(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var emailService, template;
        var email = _b.email, name = _b.name, planType = _b.planType, discountCode = _b.discountCode;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    emailService = createEmailService();
                    template = exports.emailTemplates.launchNotification;
                    return [4 /*yield*/, emailService.send({
                            to: email,
                            subject: template.subject(),
                            html: template.html({ name: name, planType: planType, discountCode: discountCode, email: email })
                        })];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Email automation scheduler (you would typically use a job queue like Bull or Agenda)
var EmailAutomation = /** @class */ (function () {
    function EmailAutomation() {
    }
    EmailAutomation.scheduleWaitlistSequence = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var email = _b.email, name = _b.name, planType = _b.planType, discountCode = _b.discountCode, referralCode = _b.referralCode;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: 
                    // Send immediate confirmation
                    return [4 /*yield*/, sendWaitlistConfirmation({ email: email, name: name, planType: planType, discountCode: discountCode, referralCode: referralCode })];
                    case 1:
                        // Send immediate confirmation
                        _c.sent();
                        // Schedule follow-up emails (in production, use a job queue)
                        console.log('📅 Scheduled email sequence for:', email);
                        return [2 /*return*/];
                }
            });
        });
    };
    EmailAutomation.scheduleLeadMagnetSequence = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var email = _b.email, name = _b.name, magnetType = _b.magnetType, downloadUrl = _b.downloadUrl;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: 
                    // Send immediate welcome with download
                    return [4 /*yield*/, sendLeadMagnetWelcome({ email: email, name: name, magnetType: magnetType, downloadUrl: downloadUrl })];
                    case 1:
                        // Send immediate welcome with download
                        _c.sent();
                        // Schedule follow-up emails
                        console.log('📅 Scheduled lead magnet sequence for:', email);
                        return [2 /*return*/];
                }
            });
        });
    };
    return EmailAutomation;
}());
exports.EmailAutomation = EmailAutomation;
