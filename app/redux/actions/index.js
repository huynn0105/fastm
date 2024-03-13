const appActions = require('./app');
const bankActions = require('./bank');
const contactActions = require('./contact');
const generalActions = require('./general');
const giftActions = require('./gift');
const knowledgeActions = require('./knowledge');
const loginActivityActions = require('./loginActivitiy');
const subscriptionActions = require('./subscription');
const moneyActions = require('./money');
const navigationActions = require('./navigation');
const newsActions = require('./news');
const notificationActions = require('./notification');
const userActions = require('./user');
const newsSlideActions = require('./newsSlide');
const userAppActions = require('./userApp');
const badLoansActions = require('./badLoans');
const promotionActions = require('./promotion');
const tabbarActions = require('./tabbar');
const contestActions = require('./contest');
const sipActions = require('./sip');
const userAppLightActions = require('./userAppLight');
const helpActions = require('./help');
const shopActions = require('./shop');
const delModActions = require('./delMod');
const financialServiceActions = require('./financialService');
const customerForm = require('./customerForm');
const mobileCardPayment = require('./mobileCardPayment');
const feedback = require('./feedback');
const otpActions = require('./otp');
const globalCare = require('./globalCare');
const conversatiionContactActions = require('./conversationContact');
const tools = require('./tools');
const posts = require('./postList');
const dpd = require('./DPD');

module.exports = {
  ...appActions,
  ...contactActions,
  ...generalActions,
  ...giftActions,
  ...knowledgeActions,
  ...loginActivityActions,
  ...subscriptionActions,
  ...moneyActions,
  ...navigationActions,
  ...newsActions,
  ...notificationActions,
  ...userActions,
  ...bankActions,
  ...newsSlideActions,
  ...userAppActions,
  ...badLoansActions,
  ...promotionActions,
  ...tabbarActions,
  ...contestActions,
  ...sipActions,
  ...userAppLightActions,
  ...helpActions,
  ...shopActions,
  ...delModActions,
  ...otpActions,
  ...financialServiceActions,
  ...customerForm,
  ...mobileCardPayment,
  ...feedback,
  ...globalCare,
  ...conversatiionContactActions,
  ...tools,
  ...posts,
  ...dpd,
};
