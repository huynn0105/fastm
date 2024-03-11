// @flow
import { Configs } from '../constants/configs';

const axios = require('axios');

function axiosClient() {
  let instance;
  return {
    shared() {
      if (!instance) {
        instance = axios.create({
          baseURL: Configs.apiBaseURL,
          auth: Configs.apiBasicAuthorization,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'mobile-app': 'mfast',
          },
        });
      }
      return instance;
    },
  };
}

// --------------------------------------------------

const AxiosClient = axiosClient();
export default AxiosClient;

function axiosMFastClient() {
  let instance;
  return {
    shared() {
      if (!instance) {
        instance = axios.create({
          baseURL: Configs.apiMFastBaseURL,
          auth: Configs.apiMFastBasicAuthorization,
          headers: {
            'Content-Type': 'application/json',
            'mobile-app': 'mfast',
          },
        });
      }
      return instance;
    },
  };
}

const AxiosMfastClient = axiosMFastClient();
export { AxiosMfastClient };

function axiosOSTicketClient() {
  let instance;
  return {
    shared() {
      if (!instance) {
        instance = axios.create({
          baseURL: Configs.apiOSTicketBaseURL,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
      }
      return instance;
    },
  };
}

const AxiosOSTicketClient = axiosOSTicketClient();
export { AxiosOSTicketClient };
