import { fonts, fontSize } from '../constants/configs';

// default regular
const parseFontFamily = (props) => {
  const {
    bold,
    light,
    lightItalic,
    italic,
    boldItalic,
    medium,
    mediumItalic,
    semiBold,
    semiBoldItalic,
  } = props;
  return bold
    ? 'bold'
    : light
    ? 'light'
    : lightItalic
    ? 'lightItalic'
    : italic
    ? 'italic'
    : boldItalic
    ? 'boldItalic'
    : medium
    ? 'medium'
    : mediumItalic
    ? 'mediumItalic'
    : semiBold
    ? 'semiBold'
    : semiBoldItalic
    ? 'semiBoldItalic'
    : 'regular';
};

// default small
const parseFontSize = (props) => {
  const { xxSmall, xSmall, small, medium, large, xLarge, xxLarge } = props;
  return xxSmall
    ? 'xxSmall'
    : xSmall
    ? 'xSmall'
    : small
    ? 'small'
    : medium
    ? 'medium'
    : large
    ? 'large'
    : xLarge
    ? 'xLarge'
    : xxLarge
    ? 'xxLarge'
    : 'medium';
};

/*
  map props to Fontstyles
*/
export function mapPropsToFontStyle(props) {
  const newProps = {
    fontFamily: fonts[parseFontFamily(props)],
    fontSize: fontSize[parseFontSize(props)],
  };
  return newProps;
}
