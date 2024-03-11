import omitBy from 'lodash/omitBy';

export const ENUM_COUNTRY_ID_STATUS = {
  PENDING: 'PENDING',
  IN_REVIEW: 'IN_REVIEW',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
};
export default class UserMeta {
  // basic infor
  fullName = null;
  mobilePhone = null;
  gender = null;
  email = null;
  address = null;
  district = null;

  countryIdNumber = null;
  countryIdName = null;
  countryIdDateOfBirth = null;
  countryIdIssuedDate = null;
  countryIdIssuedBy = null;
  countryIdPhotoFront = null;
  countryIdPhotoBack = null;

  countryIdNumberHousehold = null;

  placeOfBirth = null;
  selfiePhotoWithIdNumber = null;
  selfiePhoto = null;
  householdRegistryPhoto = null;

  // tax
  tax_number = null;

  // term and verified
  isVerifiedEmail = false;
  isTermConfirmed = false;
  isCTVConfirmed = false;
  isTaxConfirmed = false;

  //survey feedback

  potential_skills = null;

  //chat time

  last_time_login = null;
  is_online = null;
  momo_wallet = null;

  //review tax number

  is_review_tax_number = null;
  videoSelfie = null;
  isLockedKyc = false;
  livenessWithIdNumberStatus = '';
  livenessWithIdNumberPending = '';
  livenessWithIdNumberNote = '';
  livenessDocFrontUrl = '';
  livenessDocBackUrl = '';
  liveness_country_id_number = '';
  liveness_country_id_name = '';
  liveness_gender = '';
  liveness_country_id_date_of_birth = '';
  liveness_country_id_issued_date = '';
  liveness_country_id_issued_by = '';
  liveness_country_id_address = '';
  countryIdHomeAddress = '';
  livenessCountryIdHomeAddress = '';
  liveness_with_id_number_log = '';

  static objectFromJSON(json) {
    const object = new UserMeta();
    object.fullName = json.full_name;
    object.mobilePhone = json.mobile_phone;
    object.gender = json.gender;
    object.email = json.email_address;
    object.address = json.address_current;
    object.dateOfBirth = json.date_of_birth;
    object.placeOfBirth = json.place_of_birth;
    object.district = json.address_current_district;
    object.countryIdNumber = json.country_id_number;
    object.countryIdName = json.country_id_name;
    object.countryIdDateOfBirth = json.country_id_date_of_birth;
    object.countryIdIssuedDate = json.country_id_issued_date;
    object.countryIdIssuedBy = json.country_id_issued_by;
    object.countryIdPhotoFront = json.country_id_photo_front;
    object.countryIdPhotoBack = json.country_id_photo_back;
    object.countryIdNumberHousehold = json.country_id_number_household;
    object.countryIdNote = json.country_id_note;
    object.countryIdAddress = json.country_id_address;
    object.countryIdStatus = json.country_id_status;
    object.householdRegistryPhoto = json.household_registry_photo;
    object.selfiePhoto = json.selfie_photo;
    object.selfiePhotoWithIdNumber = json.selfie_photo_with_id_number;
    object.tax_number = json.tax_number;
    object.isVerifiedEmail = json.is_verified_email;
    object.isTermConfirmed = json.term_of_use_mfats_agreement;
    object.isCTVConfirmed = json.ctv_agreement;
    object.isTaxConfirmed = json.tax_agreement;
    object.taxCommittedPhoto = json.tax_committed_photo;
    object.taxCommittedPhotoStatus = json.tax_committed_photo_status;
    object.countryIdCertificateOfChange = json.country_id_certificate_of_change;
    object.taxRegisterMessage = json.tax_register_message;
    object.taxRegisterStatus = json.tax_register_status;
    object.taxCommittedPhotoMessage = json.tax_committed_photo_message;
    object.countryIdRequestMessage = json.country_id_request_message;
    object.potential_skills = json.potential_skills;
    object.last_time_login = json.last_time_login;
    object.is_online = json.is_online;
    object.is_review_tax_number = json.is_review_tax_number;
    object.momo_wallet = json.momo_wallet;
    object.videoSelfie = json.video_selfie;
    object.isLockedKyc = json.is_locked_kyc;
    object.livenessWithIdNumberStatus = json.liveness_with_id_number_status;
    object.livenessWithIdNumberPending = json.liveness_with_id_number_pending;
    object.livenessWithIdNumberNote = json.liveness_with_id_number_note;
    object.livenessDocFrontUrl = json.liveness_doc_front_url;
    object.livenessDocBackUrl = json.liveness_doc_back_url;
    object.liveness_country_id_number = json.liveness_country_id_number;
    object.liveness_country_id_name = json.liveness_country_id_name;
    object.liveness_gender = json.liveness_gender;
    object.liveness_country_id_date_of_birth = json.liveness_country_id_date_of_birth;
    object.liveness_country_id_issued_date = json.liveness_country_id_issued_date;
    object.liveness_country_id_issued_by = json.liveness_country_id_issued_by;
    object.liveness_country_id_address = json.liveness_country_id_address;
    object.countryIdHomeAddress = json.country_id_home_address;
    object.livenessCountryIdHomeAddress = json.liveness_country_id_home_address;
    object.liveness_with_id_number_log = json.liveness_with_id_number_log;
    object.kbank = json?.kbank;
    object.disabledPressCTV = json?.disabled_press_ctv;
    object.isBanking = json?.is_banking;
    object.countryOldIdNumber = json?.country_old_id_number;

    const parseObject = this.cleanEmpty(object);
    return parseObject;
  }

  static cleanEmpty(obj, isEmpty) {
    let payload = omitBy(
      obj,
      (item) => item === null || item === undefined || (isEmpty && item === ''),
    );
    return payload;
  }

  static parseDataBeforeUpdate(json, isCleanEmpty = true) {
    if (!json) return null;
    const object = {};
    object.full_name = json.fullName;
    object.mobile_phone = json.mobilePhone;
    object.gender = json.gender;
    object.date_of_birth = json.dateOfBirth;
    object.place_of_birth = json.placeOfBirth;
    object.email_address = json.email;
    object.address_current = json.address;
    object.address_current_district = json.district;
    object.country_id_number = json.countryIdNumber;
    object.country_id_name = json.countryIdName;
    object.country_id_date_of_birth = json.countryIdDateOfBirth;
    object.country_id_issued_date = json.countryIdIssuedDate;
    object.country_id_issued_by = json.countryIdIssuedBy;
    object.country_id_address = json.countryIdAddress;
    object.country_id_photo_front = json.countryIdPhotoFront;
    object.country_id_photo_back = json.countryIdPhotoBack;
    object.country_id_number_household = json.countryIdNumberHousehold;
    object.country_id_note = json.countryIdNote;
    object.country_id_status = json.countryIdStatus;
    object.household_registry_photo = json.householdRegistryPhoto;
    object.selfie_photo = json.selfiePhoto;
    object.selfie_photo_with_id_number = json.selfiePhotoWithIdNumber;
    object.tax_number = json.tax_number;
    object.term_of_use_mfats_agreement = json.isTermConfirmed;
    object.ctv_agreement = json.isCTVConfirmed;
    object.tax_agreement = json.isTaxConfirmed;
    object.country_id_certificate_of_change = json.countryIdCertificateOfChange;
    object.last_time_login = json.last_time_login;
    object.is_online = json.is_online;
    object.is_review_tax_number = json.is_review_tax_number;
    object.video_selfie = json.videoSelfie;
    object.is_verified_email = json.isVerifiedEmail;
    object.is_locked_kyc = json.isLockedKyc;
    object.liveness_with_id_number_status = json.livenessWithIdNumberStatus;
    object.liveness_with_id_number_pending = json.livenessWithIdNumberPending;
    object.liveness_with_id_number_note = json.livenessWithIdNumberNote;
    object.liveness_doc_front_url = json.livenessDocFrontUrl;
    object.liveness_doc_back_url = json.livenessDocBackUrl;
    object.liveness_country_id_number = json.liveness_country_id_number;
    object.liveness_country_id_name = json.liveness_country_id_name;
    object.liveness_gender = json.liveness_gender;
    object.liveness_country_id_date_of_birth = json.liveness_country_id_date_of_birth;
    object.liveness_country_id_issued_date = json.liveness_country_id_issued_date;
    object.liveness_country_id_issued_by = json.liveness_country_id_issued_by;
    object.liveness_country_id_address = json.liveness_country_id_address;
    object.country_id_home_address = json.countryIdHomeAddress;
    object.liveness_country_id_home_address = json.livenessCountryIdHomeAddress;
    object.liveness_with_id_number_log = json.liveness_with_id_number_log;
    object.kbank = json?.kbank;
    object.is_banking = json?.isBanking;
    object.country_old_id_number = json?.countryOldIdNumber;

    return this.cleanEmpty(object, isCleanEmpty);
  }
}
