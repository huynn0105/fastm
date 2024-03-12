// @flow

import moment from 'moment';
import DigitelClient from 'app/network/DigitelClient';

import { UserLogin, UserSetup } from '../__data__/UserInfo.data';
import { APP_VERSION_DATA, APP_LINK_DATA } from '../__data__/AppVersion.data';

beforeEach(() => {
  DigitelClient.setup(UserSetup.uid, UserSetup.accessToken);
});

const APP_INFO = 'APP INFO';
describe(APP_INFO, () => {
  test('request appinfo', () => {
    expect.assertions(8);
    return DigitelClient.getAppInfo().then(appInfo => {
      expect(appInfo.contactEmail).toBeDefined();
      expect(appInfo.contactPhoneNumber).toBeDefined();
      expect(appInfo.contactPhoneNumberPretty).toBeDefined();
      expect(appInfo.introduceUrl).toBeDefined();
      expect(appInfo.termsOfUsageUrl).toBeDefined();
      expect(appInfo.privacyPolicyUrl).toBeDefined();
      expect(appInfo.zaloFanpageURL).toBeDefined();
      expect(appInfo.faqUrl).toBeDefined();
    }).catch({
    });
  });
});

const LOGIN = 'LOGIN';
describe(LOGIN, () => {
  test('login success', () => {
    expect.assertions(2);
    return DigitelClient.loginViaFirebase(
      UserLogin.success.username,
      UserLogin.success.password,
      'deviceUID',
    )
      .then(user => {
        expect(user.uid).toBeDefined();
        expect(user.accessToken).toBeDefined();
      }).catch({

      });
  });

  test('fail username', () => {
    expect.assertions(2);
    return DigitelClient.loginViaFirebase(
      UserLogin.failUsername.username,
      UserLogin.failUsername.password,
      'deviceUID',
    ).then({
    }).catch(error => {
      expect(error.status).toBe(false);
      expect(error.message).toBeDefined();
    });
  });

  test('fail password', () => {
    expect.assertions(2);
    return DigitelClient.loginViaFirebase(
      UserLogin.failPassword.username,
      UserLogin.failPassword.password,
      'deviceUID',
    )
      .then({
      }).catch(error => {
        expect(error.status).toBe(false);
        expect(error.message).toBeDefined();
      });
  });
});

const LOGIN_TOKEN = 'LOGIN with token';
describe(LOGIN_TOKEN, () => {
  test('login success', () => {
    expect.assertions(2);
    return DigitelClient.loginWithToken(UserSetup.accessToken).then(user => {
      expect(user.uid).toEqual(UserSetup.uid);
      expect(user.accessToken).toEqual(UserSetup.accessToken);
    });
  });

  test('login fail', () => {
    expect.assertions(2);
    return DigitelClient.loginWithToken('fail').then({
    }).catch(error => {
      expect(error.status).toBe(false);
      expect(error.message).toBeDefined();
    });
  });
});

const LOGIN_ACTIVITIES = 'LOGIN ACTIVITES';
describe(LOGIN_ACTIVITIES, () => {
  test('get login activities success', () => {
    expect.assertions(1);
    return DigitelClient.getLoginActitivies(UserSetup.uid).then(activities => {
      expect(activities.length).toBeGreaterThan(0);
    });
  });

  test('get login activities fail token', () => {
    DigitelClient.setup('fail', 'fail');
    expect.assertions(1);
    return DigitelClient.getLoginActitivies(UserSetup.uid).then({
    }).catch(error => {
      expect(error.status).toBe(false);
    });
  });
});

const BANK_LIST = 'BANK LIST';
describe(BANK_LIST, () => {
  test('getBanksList', () => {
    expect.assertions(1);
    return DigitelClient.getBanksList()
      .then(response => {
        expect(response.data.length).toBeGreaterThan(0);
      })
      .catch();
  });
});

const OWNER = 'OWNER';
describe(OWNER, () => {
  test('getOwners', () => {
    expect.assertions(1);
    return DigitelClient.getOwners('')
      .then(response => {
        expect(response.data.length).toBeGreaterThanOrEqual(1);
      })
      .catch();
  });

  test('getUsers general', () => {
    expect.assertions(1);
    return DigitelClient.getOwners('30')
      .then(response => {
        expect(response.data.length).toBeGreaterThanOrEqual(1);
      })
      .catch();
  });

  test('getUsers ttu', () => {
    expect.assertions(1);
    return DigitelClient.getOwners('99587')
      .then(response => {
        expect(response.data.length).toEqual(1);
      })
      .catch();
  });
});


const REF_LIST = 'REF_LIST';
describe(REF_LIST, () => {
  test('getUsers', () => {
    expect.assertions(1);
    return DigitelClient.getUsers()
      .then(response => {
        expect(response.data.length).toBeGreaterThanOrEqual(0);
      })
      .catch();
  });
});

const USER_INFO = 'USER_INFO';
describe(USER_INFO, () => {
  test('getUser', () => {
    expect.assertions(4);
    return DigitelClient.getUser(UserSetup.uid)
      .then(user => {
        expect(user.uid).toEqual(UserSetup.uid);
        expect(user.accessToken).toBeUndefined();
        expect(user.fullName).toBeDefined();
        expect(user.phoneNumber).toBeUndefined();
      })
      .catch();
  });
});

const MY_USER_INFO = 'MY_USER_INFO';
describe(MY_USER_INFO, () => {
  test('getMyUser', () => {
    expect.assertions(10);
    return DigitelClient.getMyUser()
      .then(user => {
        expect(user.uid).toEqual(UserSetup.uid);
        expect(user.accessToken).toEqual(UserSetup.accessToken);
        expect(user.fullName).toBeDefined();
        expect(user.phoneNumber).toBeDefined();
        expect(user.cmnd).toBeDefined();
        expect(user.cmndIssuedDate).toBeDefined();
        expect(user.email).toBeDefined();
        expect(user.dateOfBirth).toBeDefined();
        expect(user.totalMoney).toBeDefined();
        expect(user.totalPoint).toBeDefined();
      })
      .catch();
  });
});

const SUBSCRIPTIONS = 'SUBSCRIPTIONS';
describe(SUBSCRIPTIONS, () => {
  test('getSubscriptions_normal', () => {
    expect.assertions(2);
    return DigitelClient.getSubscriptions()
      .then(data => {
        expect(data.items.length).toBeGreaterThan(1);
        expect(data.kiNo).toEqual(0);
      })
      .catch();
  });

  test('getSubscriptions_dsa', () => {
    expect.assertions(2);
    return DigitelClient.loginViaFirebase(
      UserLogin.dsaSuccess.username,
      UserLogin.dsaSuccess.password,
      'deviceUID',
    )
      .then(user => {
        DigitelClient.setup(user.uid, user.accessToken);
        return DigitelClient.getSubscriptions()
          .then(data => {
            expect(data.items.length).toBeGreaterThan(1);
            expect(data.kiNo).toBeGreaterThan(0);
          })
          .catch();
      }).catch();
  });

  test('getSubscriptions_leader', () => {
    expect.assertions(2);
    return DigitelClient.loginViaFirebase(
      UserLogin.teamLeaderSuccess.username,
      UserLogin.teamLeaderSuccess.password,
      'deviceUID',
    )
      .then(user => {
        DigitelClient.setup(user.uid, user.accessToken);
        return DigitelClient.getSubscriptions()
          .then(data => {
            expect(data.items.length).toBeGreaterThan(1);
            expect(data.kiNo).toBeGreaterThan(0);
          })
          .catch();
      }).catch();
  });
});


const BAD_LOANS = 'BAD_LOANS';
describe(BAD_LOANS, () => {
  test('getBadLoans_normal', () => {
    expect.assertions(1);
    return DigitelClient.getSubscriptions()
      .then(data => {
        const today = moment().format('YYYY-MM-DD');
        return DigitelClient.getBadLoans(today, data.kiNo)
          .then({
          })
          .catch(error => {
            expect(error.status).toBe(false);
          });
      })
      .catch();
  });

  test('getBadLoans_dsa', () => {
    expect.assertions(4);
    return DigitelClient.loginViaFirebase(
      UserLogin.dsaSuccess.username,
      UserLogin.dsaSuccess.password,
      'deviceUID',
    )
      .then(user => {
        DigitelClient.setup(user.uid, user.accessToken);
        return DigitelClient.getSubscriptions()
          .then(data => {
            const today = moment().format('YYYY-MM-DD');
            return DigitelClient.getBadLoans(today, data.kiNo)
              .then(badLoan => {
                expect(badLoan.role).toBe('dsa');
                expect(badLoan.date).toContain('2018');
                expect(badLoan.del30).toBeDefined();
                expect(badLoan.url).toBeDefined();
              })
              .catch();
          })
          .catch();
      }).catch();
  });

  test('getBadLoans_leader', () => {
    expect.assertions(4);
    return DigitelClient.loginViaFirebase(
      UserLogin.teamLeaderSuccess.username,
      UserLogin.teamLeaderSuccess.password,
      'deviceUID',
    )
      .then(user => {
        DigitelClient.setup(user.uid, user.accessToken);
        return DigitelClient.getSubscriptions()
          .then(data => {
            const today = moment().format('YYYY-MM-DD');
            return DigitelClient.getBadLoans(today, data.kiNo)
              .then(badLoan => {
                expect(badLoan.role).toBe('team_leader');
                expect(badLoan.date).toContain('2018');
                expect(badLoan.del30).toBeDefined();
                expect(badLoan.url).toBeDefined();
              })
              .catch();
          })
          .catch();
      }).catch();
  });
});

const NEWS_LIST = 'NEWS_LIST';
describe(NEWS_LIST, () => {
  test('getNews', () => {
    expect.assertions(1);
    return DigitelClient.getNews(1)
      .then(news => {
        expect(news.length).toBeGreaterThan(0);
      })
      .catch();
  });
});

const KNOWLEDGES_LIST = 'KNOWLEDGES_LIST';
describe(KNOWLEDGES_LIST, () => {
  test('getKnowledges', () => {
    expect.assertions(1);
    return DigitelClient.getKnowledges(1)
      .then(items => {
        expect(items.length).toBeGreaterThan(0);
      })
      .catch();
  });
});

const NOTIFICATION_LIST = 'NOTIFICATION_LIST';
describe(NOTIFICATION_LIST, () => {
  test('getNotifications_admin', () => {
    expect.assertions(1);
    return DigitelClient.getNotifications('admin')
      .then(items => {
        expect(items.length).toBeGreaterThanOrEqual(0);
      })
      .catch();
  });

  test('getNotifications_system', () => {
    expect.assertions(1);
    return DigitelClient.getNotifications('system')
      .then(items => {
        expect(items.length).toBeGreaterThanOrEqual(0);
      })
      .catch();
  });
});

const GIFTS_LIST = 'GIFTS_LIST';
describe(GIFTS_LIST, () => {
  test('getGifts', () => {
    expect.assertions(1);
    return DigitelClient.getGifts()
      .then(items => {
        expect(items.length).toBeGreaterThanOrEqual(0);
      })
      .catch();
  });
});

const MONEY_HISTORY = 'MONEY_HISTORY';
describe(MONEY_HISTORY, () => {
  test('getMoneyHistory', () => {
    expect.assertions(1);
    return DigitelClient.getMoneyHistory(null, null)
      .then(items => {
        expect(items.length).toBeGreaterThanOrEqual(0);
      })
      .catch();
  });
});

const POINTS_HISTORY = 'POINTS_HISTORY';
describe(POINTS_HISTORY, () => {
  test('getPointsHistory', () => {
    expect.assertions(1);
    return DigitelClient.getPointsHistory(null, null)
      .then(items => {
        expect(items.length).toBeGreaterThanOrEqual(0);
      })
      .catch();
  });
});

const NEWS_SLIDE = 'NEWS_SLIDE';
describe(NEWS_SLIDE, () => {
  test('getNewsSlideList', () => {
    expect.assertions(1);
    return DigitelClient.getNewsSlideList()
      .then(items => {
        expect(items.length).toBeGreaterThanOrEqual(0);
      })
      .catch();
  });
});

const USER_BANK = 'USER_BANK';
describe(USER_BANK, () => {
  test('getUserBankList', () => {
    expect.assertions(1);
    return DigitelClient.getUserBankList()
      .then(items => {
        expect(items.length).toBeGreaterThanOrEqual(1);
      })
      .catch();
  });
});

const USER_APP_LIST = 'USER_APP_LIST';
describe(USER_APP_LIST, () => {
  test('getUserAppList', () => {
    expect.assertions(1);
    return DigitelClient.getUserAppList()
      .then(items => {
        expect(items.length).toBeGreaterThanOrEqual(0);
      })
      .catch();
  });
});

const EVENT_PROMOTIONS = 'EVENT_PROMOTIONS';
describe(EVENT_PROMOTIONS, () => {
  test('getPromotionEvent', () => {
    expect.assertions(1);
    return DigitelClient.getPromotionEvent()
      .then(item => {
        expect(item.name).toBeDefined();
      })
      .catch();
  });
  test('getPromotionEvent over', () => {
    expect.assertions(1);
    return DigitelClient.getPromotionEvent()
      .then(item => {
        expect(item.name).toBeUndefined();
      })
      .catch();
  });
});

const APP_VERSION = 'APP_VERSION';
describe.only(APP_VERSION, () => {
  test('getAppUpdate do nothing', () => {
    expect.assertions(10);
    return DigitelClient.getAppUpdate(APP_VERSION_DATA.no_thing)
      .then(action => {
        expect(action.getInfo('ios').message).toBeDefined();
        expect(action.getInfo('ios').appstore).toEqual(APP_LINK_DATA.ios);
        expect(action.getInfo('ios').forceToUpdate).toEqual(false);
        expect(action.getInfo('ios').isShowUpdate).toEqual(false);
        expect(action.getInfo('ios').version).toEqual(APP_LINK_DATA.version);

        expect(action.getInfo('android').version).toEqual(APP_LINK_DATA.version);
        expect(action.getInfo('android').message).toBeDefined();
        expect(action.getInfo('android').appstore).toEqual(APP_LINK_DATA.android);
        expect(action.getInfo('android').forceToUpdate).toEqual(false);
        expect(action.getInfo('android').isShowUpdate).toEqual(false);
      })
      .catch();
  });
  test('getAppUpdate alert', () => {
    expect.assertions(10);
    return DigitelClient.getAppUpdate(APP_VERSION_DATA.alert)
      .then(action => {
        expect(action.getInfo('ios').message).toBeDefined();
        expect(action.getInfo('ios').appstore).toEqual(APP_LINK_DATA.ios);
        expect(action.getInfo('ios').forceToUpdate).toEqual(false);
        expect(action.getInfo('ios').isShowUpdate).toEqual(true);
        expect(action.getInfo('ios').version).toEqual(APP_LINK_DATA.version);

        expect(action.getInfo('android').version).toEqual(APP_LINK_DATA.version);
        expect(action.getInfo('android').message).toBeDefined();
        expect(action.getInfo('android').appstore).toEqual(APP_LINK_DATA.android);
        expect(action.getInfo('android').forceToUpdate).toEqual(false);
        expect(action.getInfo('android').isShowUpdate).toEqual(true);
      })
      .catch();
  });
  test('getAppUpdate forceupdate', () => {
    expect.assertions(10);
    return DigitelClient.getAppUpdate(APP_VERSION_DATA.force_update)
      .then(action => {
        expect(action.getInfo('ios').message).toBeDefined();
        expect(action.getInfo('ios').appstore).toEqual(APP_LINK_DATA.ios);
        expect(action.getInfo('ios').forceToUpdate).toEqual(true);
        expect(action.getInfo('ios').isShowUpdate).toEqual(true);
        expect(action.getInfo('ios').version).toEqual(APP_LINK_DATA.version);

        expect(action.getInfo('android').version).toEqual(APP_LINK_DATA.version);
        expect(action.getInfo('android').message).toBeDefined();
        expect(action.getInfo('android').appstore).toEqual(APP_LINK_DATA.android);
        expect(action.getInfo('android').forceToUpdate).toEqual(true);
        expect(action.getInfo('android').isShowUpdate).toEqual(true);
      })
      .catch();
  });
  test('getAppUpdate unknow', () => {
    expect.assertions(2);
    return DigitelClient.getAppUpdate(APP_VERSION_DATA.unknow)
      .then(action => {
        expect(action.getInfo('ios').appstore).toBeUndefined();
        expect(action.getInfo('android').appstore).toBeUndefined();
      })
      .catch();
  });
});
