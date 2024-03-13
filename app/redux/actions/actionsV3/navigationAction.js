import FlutterService from '../../../screenV3/Home/FlutterService';

const OCRType = {
  blueinfo: 'blueinfo',
  fpt: 'fpt_ai',
};
export const openAccountIdentification = (navigate) => (_, getState) => {
  const ocrService = getState()?.appInfo?.ocrService;
  switch (ocrService) {
    case OCRType.blueinfo:
      FlutterService.openMFast({
        path: '/account_identification',
      });
      break;
    case OCRType.fpt:
      navigate?.('AccountIdentificationScreen');
      break;
  }
};

export const openAccountAdvancedUpdate = (navigate) => (_, getState) => {
  const ocrService = getState()?.appInfo?.ocrService;
  switch (ocrService) {
    case OCRType.blueinfo:
      FlutterService.openMFast({
        path: '/update_phone_number',
      });
      break;
    case OCRType.fpt:
      navigate?.('AccountAdvancedUpdateScreen');
      break;
  }
};
