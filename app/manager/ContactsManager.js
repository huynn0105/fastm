/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

/**
 * Handle Contacts
 * - manage phone contacts (which read from device)
 * - manage appay contacts (which phone contact has phone number in appay system)
 * - manage appay contact presence: online/offline by using firebase realtime db
 * - for contact info, meta data update, using api (cloud functions), not using realtime db
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// import ReactNativeContacts from 'react-native-contacts';

import FirebaseDatabase from '../submodules/firebase/network/FirebaseDatabase';
import FirebaseFunctions from '../submodules/firebase/network/FirebaseFunctions';
import { User } from '../submodules/firebase/model';

import { checkContact, requestContact } from '../utils/Permission';

export const CONTACTS_EVENTS = {
  CONTACT_PRESENCE_CHANGE: 'CONTACT_PRESENCE_CHANGE',
};

const _ = require('lodash');

// --------------------------------------------------

/* eslint-disable */
import Utils, { getDeviceUDID } from 'app/utils/Utils';
const LOG_TAG = 'ContactsManager.js';
/* eslint-enable */

// --------------------------------------------------

const CONVERT_NEW_PHONENUMBER = {
  162: '32',
  163: '33',
  164: '34',
  165: '35',
  166: '36',
  167: '37',
  168: '38',
  169: '39',

  120: '70',
  121: '79',
  122: '77',
  126: '76',
  128: '78',
  123: '83',
  124: '84',
  125: '85',
  127: '81',
  129: '82',

  186: '56',
  188: '58',
  199: '59',
};

function initContactsManager() {

  // PRIVATE
  // --------------------------------------------------

  let mMyUser = {}; // my user
  let mObservers = {}; // key is event name
  let mPhoneContacts = {}; // contacts from device, keep phoneNumber only
  let mContacts = {}; // appay contacts, key is userID
  let mIsContactsPermissionsGranted = true; // contacts permissions

  /**
   * Setup user presence (aka online/offline)
   */
  function mSetupMyUserPresence() {
    if (!(mMyUser && mMyUser.uid)) {
      return;
    }
    FirebaseDatabase.getConnectedRef().on('value', (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }
      // online
      const deviceID = getDeviceUDID();
      const fbUserID = FirebaseDatabase.firebaseUserID(mMyUser.uid);
      const userStatusRef = FirebaseDatabase.getUsersPresenceRef().child(`${fbUserID}`);
      const updates = {};
      updates['/presenceStatus'] = 'online';
      updates[`/devices/${deviceID}/status`] = 'online';
      userStatusRef.update(updates);
      // offline
      userStatusRef.child(`devices/${deviceID}`)
        .onDisconnect().remove();
    });
  }

  /**
   * Get contacts from device
   */
  function mGetPhoneContactsFromDevice() {
    return new Promise((resolve) => {
      checkContact()
        .then(isAuthorized => {
          if (isAuthorized) {
            // ReactNativeContacts.getAll((err, contacts) => {
            //   // error
            //   Utils.log('contacts', err);
            //   if (err) {
            //     resolve([]);
            //     return;
            //   }
            //   Utils.log('contacts', contacts);
            //   resolve(contacts);
            // });
          }
          else {
            resolve([]);
          }
        });
    });
  }

  /**
   * Create a new contact in device
   */
  function mAddPhoneContact(familyName, givenName, phoneNumber) {
    return new Promise((resolve) => {
      const contact = {};
      contact.givenName = givenName;
      contact.familyName = familyName;
      contact.phoneNumbers = [{
        label: 'mobile',
        number: phoneNumber,
      }];
      // ReactNativeContacts.addContact(contact, (err) => {
      //   resolve(!err);
      // });
    });
  }

  // EVENT HANDLERs
  // --------------------

  const onContactPresenceChange = (snapshot) => {
    // Utils.log(`${LOG_TAG}: onContactPresenceChange: ${snapshot.key}`, snapshot.val());

    const fbContactID = snapshot.key;
    const contactID = FirebaseDatabase.normalUserID(fbContactID);
    const contactPresence = snapshot.val();

    // update
    const contact = mContacts[contactID];
    if (!contact) { return; }
    const updatedContact = Object.assign(contact, contactPresence);
    mContacts[contactID] = updatedContact;

    // notify
    const event = CONTACTS_EVENTS.CONTACT_PRESENCE_CHANGE;
    mNotifyObservers(event, updatedContact);
  };

  // EVENT SUBSCRIBEs
  // --------------------

  /**
   * Get list of user uid, filter out invalid & me
   */
  function mGetContactsUserIDs() {
    const userIDs = [];
    const keys = Object.keys(mContacts);
    for (let i = 0; i < keys.length; i += 1) {
      const contact = mContacts[keys[i]];
      if (contact.uid && contact.uid !== mMyUser.uid) {
        userIDs.push(contact.uid);
      }
    }
    return userIDs;
  }

  function mSubscribeContactsPresence() {
    const userIDs = mGetContactsUserIDs();
    for (let i = 0; i < userIDs.length; i += 1) {
      const userID = userIDs[i];
      const fbUserID = FirebaseDatabase.firebaseUserID(userID);
      const usersPresenceRef = FirebaseDatabase.getUsersPresenceRef();
      const contactStatusRef = usersPresenceRef.child(`${fbUserID}`);
      contactStatusRef.on('value', onContactPresenceChange);
    }
  }

  function mUnSubscribeContactsPresence() {
    const userIDs = mGetContactsUserIDs();
    for (let i = 0; i < userIDs.length; i += 1) {
      const userID = userIDs[i];
      const fbUserID = FirebaseDatabase.firebaseUserID(userID);
      const usersPresenceRef = FirebaseDatabase.getUsersPresenceRef();
      const contactStatusRef = usersPresenceRef.child(`${fbUserID}`);
      contactStatusRef.off();
    }
  }

  /**
   * notify observers
   * @param {string} name 
   * @param {array} args 
   */
  function mNotifyObservers(name, ...args) {
    const observers = mObservers[name];
    if (observers) {
      for (let j = 0; j < observers.length; j += 1) {
        const item = observers[j];
        if (item.callback) {
          item.callback.call(item.target, ...args);
        }
      }
    }
  }

  // HELPERs
  // --------------------

  function mConvertDictToArray(dict) {
    const array = [];
    const keys = Object.keys(dict);
    for (let i = 0; i < keys.length; i += 1) {
      array.push(dict[keys[i]]);
    }
    return array;
  }

  // PUBLIC
  // --------------------------------------------------

  return {
    setup(user) {

      mMyUser = user;
      mObservers = {};
      mPhoneContacts = [];
      mContacts = {};

      mSetupMyUserPresence();
    },
    getPhoneContacts() {
      return mPhoneContacts;
    },
    getPhoneContactsArray() {
      return mConvertDictToArray(mPhoneContacts);
    },
    getPhoneContactsStandardPhoneNumbers() {
      const phoneNumbers = [];
      const keys = Object.keys(mPhoneContacts);
      for (let i = 0; i < keys.length; i += 1) {
        const contact = mPhoneContacts[keys[i]];
        phoneNumbers.push(contact.standardPhoneNumber);
      }
      return phoneNumbers;
    },
    getContacts() {
      return mContacts;
    },
    getContactsArray() {
      return mConvertDictToArray(mContacts);
    },
    getContact(userID) {
      return mContacts[userID];
    },
    getContactPresenceStatus(userID) {
      if (mContacts[userID]) {
        return mContacts[userID].presenceStatus || null;
      }
      return null;
    },
    getContactLastTimeOnline(userID) {
      if (mContacts[userID]) {
        return mContacts[userID].lastTimeOnline || null;
      }
      return null;
    },
    addObserver(name, target, callback) {
      // Utils.log(`${LOG_TAG}: addObserver: ${name}, callback: ${callback}`);
      let list = mObservers[name];
      if (!list) {
        list = [];
      }
      list.push({ callback });
      mObservers[name] = list;
    },
    removeObserver(name, target) {
      // Utils.log(`${LOG_TAG}: removeObserver: ${name}, callback: ${callback}`);
      const list = mObservers[name];
      if (list) {
        let removeIndex = -1;
        for (let i = 0; i < list.length; i += 1) {
          const item = list[i];
          if (item.target === target) {
            removeIndex = i;
            break;
          }
        }
        if (removeIndex) {
          list.splice(removeIndex, 1);
        }
      }
      mObservers[name] = list;
    },
    // --------------------------------------------------
    isContactsPermissionsGranted() {
      return mIsContactsPermissionsGranted;
    },
    async checkContactsPermissions() {
      return new Promise((resolve) => {
        checkContact()
          .then(isAuthorized => {
            mIsContactsPermissionsGranted = isAuthorized;
            resolve(isAuthorized);
          });
      });
    },
    async requestContactsPermissions() {
      return new Promise((resolve) => {
        requestContact()
          .then(isAuthorized => {
            mIsContactsPermissionsGranted = isAuthorized;
            resolve(isAuthorized);
          });
      });
    },
    /**
     * Reload contacts from device (phone contacts)
     * @returns dictionary of Contact (not user)
     */
    async reloadPhoneContacts() {
      // get all contacts from device
      const contacts = await mGetPhoneContactsFromDevice();
      // filter out phone number
      mPhoneContacts = {};
      for (let i = 0; i < contacts.length; i += 1) {
        const contact = contacts[i];
        const givenName = contact.givenName;
        const familyName = contact.familyName;
        const phoneNumbers = contact.phoneNumbers;
        if (phoneNumbers && Array.isArray(phoneNumbers)) {
          for (let j = 0; j < phoneNumbers.length; j += 1) {
            const phoneNumber = phoneNumbers[j].number;

            // for current state: 8 digits, will be remove soon
            // let standardPhoneNumber = User.standardizePhoneNumber(phoneNumber, 8);
            // mPhoneContacts[standardPhoneNumber] = {
            //   familyName, givenName, phoneNumber, standardPhoneNumber,
            // };

            // for fix bug 2 users have same phone
            let standardPhoneNumber = User.standardizePhoneNumber(phoneNumber, 9);
            mPhoneContacts[standardPhoneNumber] = {
              familyName, givenName, phoneNumber, standardPhoneNumber,
            };

            // for convert 11 -> 10 digits phonenumber
            standardPhoneNumber = User.standardizePhoneNumber(phoneNumber, 10);
            if (standardPhoneNumber.length === 10) {
              const threeFirstNum = standardPhoneNumber.substr(0, 3);

              const newNum = CONVERT_NEW_PHONENUMBER[threeFirstNum];
              if (newNum) {
                const lastNum = standardPhoneNumber.substr(3, 7);

                standardPhoneNumber = newNum + lastNum;
                mPhoneContacts[standardPhoneNumber] = {
                  familyName, givenName, phoneNumber, standardPhoneNumber,
                };

                // for 8 digits, will be remove soon
                standardPhoneNumber = newNum.substr(1, 1) + lastNum;
                mPhoneContacts[standardPhoneNumber] = {
                  familyName, givenName, phoneNumber, standardPhoneNumber,
                };
              }
            }
          }
        }
      }
      return mPhoneContacts;
    },
    /**
     * reload appay contacts from firebase
     * @returns dictionary of User
     */
    async reloadContacts(forced = true) {
      // load phone contacts
      const oldPhoneNumbes = await AsyncStorage.getItem('contact_numbers');
      const contacts = ContactsManager.shared().getContactsArray();

      await this.reloadPhoneContacts();
      const standardPhoneNumbers = this.getPhoneContactsStandardPhoneNumbers();

      await FirebaseDatabase.updateUserContactList(standardPhoneNumbers);

      const isSameContacts = oldPhoneNumbes && _.isEqual(oldPhoneNumbes, JSON.stringify(standardPhoneNumbers));
      if (!forced && contacts.length > 0 && isSameContacts) {
        return null;
      }

      // get phoneNumbers from phoneContacts
      if (standardPhoneNumbers.length === 0) { return {}; }

      // get contacts from phoneNumbers list
      const phoneNumbersList = standardPhoneNumbers.join(',');
      const token = await FirebaseDatabase.firebaseToken();
      const contactsArray = await FirebaseFunctions.getContacts(
        phoneNumbersList,
        token,
      );

      mUnSubscribeContactsPresence();
      AsyncStorage.setItem('contact_numbers', JSON.stringify(standardPhoneNumbers));

      mContacts = {};
      for (let i = 0; i < contactsArray.length; i += 1) {
        const contact = contactsArray[i];
        // filter me out
        if (contact.uid && contact.uid !== mMyUser.uid) {
          const user = User.objectFromJSON(contact);
          mContacts[contact.uid] = user;
        }
      }

      // re-subscribe
      mSubscribeContactsPresence();

      // ---
      const newContacts = ContactsManager.shared().getContactsArray();
      return newContacts;
    },
    // --------------------------------------------------
    async addPhoneContact(familyName, givenName, phoneNumber) {
      return mAddPhoneContact(familyName, givenName, phoneNumber);
    },
    async deinitManager() {
      mUnSubscribeContactsPresence();
    },
  };
}

// --------------------------------------------------

function initSingletonContactsManager() {
  let instance;
  return {
    shared() {
      if (!instance) {
        instance = initContactsManager();
      }
      return instance;
    },
  };
}

// --------------------------------------------------

const ContactsManager = initSingletonContactsManager();
export default ContactsManager;
