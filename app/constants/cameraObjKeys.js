import { SH, SW } from './styles';

const frontCitizenCard = {
  cameraTitle: 'MẶT TRƯỚC CMND/ CCCD',
  cameraDetail:
    '(Di chuyển MẶT TRƯỚC vào giữa khung chụp. Hình Bắt buộc phải hiển thị đầy đủ 4 góc, rõ nét và không bị nhoè)',
  galleryTitle: '',
  typeIdCard: 'FRONT',
  width: 200,
  height: 150,
};

const backCitizenCard = {
  cameraTitle: 'MẶT SAU CMND/ CCCD',
  cameraDetail:
    '(Di chuyển MẶT SAU vào giữa khung chụp. Hình Bắt buộc phải hiển thị đầy đủ 4 góc, rõ nét và không bị nhoè)',
  galleryTitle: '',
  typeIdCard: 'BACK',
  width: 200,
  height: 150,
};

const selfie = {
  cameraTitle: 'CHÂN DUNG CỦA BẠN',
  cameraDetail:
    '(Di chuyển CHÂN DUNG vào giữa khung chụp. Bắt buộc KHÔNG ĐƯỢC đeo kính, đội mũ khi chụp. Hình phải rõ nét và không bị nhoè)',
  galleryTitle: '',
  width: 200,
  height: 240,
  cameraType: 'FRONT',
};

const law = {
  cameraTitle: 'HÌNH CHỤP BẢN CAM KẾT THUẾ',
  cameraDetail: '(Di chuyển vào giữa khung chụp. Hình phải rõ nét và không bị nhoè)',
  galleryTitle: '',
  width: 200,
  height: 240,
};

const videoSelfie = {
  cameraTitle: 'Quay video chân dung',
  cameraDetail: 'Bấm quay và di chuyển gương mặt trong 6 giây theo yêu cầu dưới đây',
  galleryTitle: '',
  typeIdCard: 'VIDEO',
  width: SW(234),
  height: SW(234),
};
const insCert = {
  cameraTitle: 'HÌNH CHỤP CHỨNG CHỈ BẢO HIỂM',
  cameraDetail: '(Di chuyển vào giữa khung chụp. Hình phải rõ nét và không bị nhoè)',
  galleryTitle: '',
  width: 300,
  height: 200,
};

export default {
  law,
  frontCitizenCard,
  backCitizenCard,
  selfie,
  videoSelfie,
  insCert,
};
