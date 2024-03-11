class VietnamesePriceReader {
  VietnamesePriceReader._();

  static String _readGroup(String group) {
    var readDigit = [
      ' không',
      ' một',
      ' hai',
      ' ba',
      ' bốn',
      ' năm',
      ' sáu',
      ' bảy',
      ' tám',
      ' chín'
    ];
    var temp = '';
    if (group == '000') return '';
    //read number hundreds
    temp = '${readDigit[int.parse(group.substring(0, 1))]} trăm';
    //read number tens
    if (group.substring(1, 2) == '0') {
      if (group.substring(2, 3) == '0') {
        return temp;
      } else {
        temp += ' Lẻ${readDigit[int.parse(group.substring(2, 3))]}';
        return temp;
      }
    } else {
      temp += '${readDigit[int.parse(group.substring(1, 2))]} mươi';
    }
    //read number
    if (group.substring(2, 3) == '5') {
      temp += ' lăm';
    } else if (group.substring(2, 3) != '0') {
      temp += readDigit[int.parse(group.substring(2, 3))];
    }
    return temp;
  }

  static String readMoney(String num) {
    if (num.isEmpty) return '';
    if (num == '0') return '0 đồng';
    var temp = '';
    //length <= 18
    while (num.length < 18) {
      num = '0$num';
    }
    var g1 = num.substring(0, 3);
    var g2 = num.substring(3, 6);
    var g3 = num.substring(6, 9);
    var g4 = num.substring(9, 12);
    var g5 = num.substring(12, 15);
    var g6 = num.substring(15, 18);
    //read group1 ---------------------
    if (g1 != '000') {
      temp = _readGroup(g1);
      temp += ' triệu';
    }
    //read group2-----------------------
    if (g2 != '000') {
      temp += _readGroup(g2);
      temp += ' nghìn';
    }
    //read group3 ---------------------
    if (g3 != '000') {
      temp += _readGroup(g3);
      temp += ' tỷ';
    } else if (temp.isNotEmpty) {
      temp += ' tỷ';
    }

    //read group2-----------------------
    if (g4 != '000') {
      temp += _readGroup(g4);
      temp += ' triệu';
    }
    //---------------------------------
    if (g5 != '000') {
      temp += _readGroup(g5);
      temp += ' nghìn';
    }
    //-----------------------------------
    temp = temp + _readGroup(g6);
    //---------------------------------
    // Refine
    temp = temp.replaceAll('một mươi', 'mười');
    temp = temp.trim();
    temp = temp.replaceAll(' không trăm', '').replaceAll('không trăm', '');
    temp = temp.trim();
    temp = temp.replaceAll('mười không', 'mười');
    temp = temp.trim();
    temp = temp.replaceAll('mươi không', 'mươi');
    temp = temp.trim();
    if (temp.indexOf('Lẻ') == 0) temp = temp.substring(2);
    temp = temp.trim();
    temp = temp.replaceAll('mươi một', 'mươi mốt');
    temp = temp.trim();

    //Change Case
    return '${temp.substring(0, 1).toLowerCase()}${temp.substring(1).toLowerCase()}';// đồng';
  }
}
