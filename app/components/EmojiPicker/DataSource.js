/**
 * Emoji DataSource
 * - read emoji-datasource and categorize
 * - convert emoji code to string
 * - emoji is sorted by order
 */

import EmojiDataSource from 'emoji-datasource';

require('string.fromcodepoint');

// --------------------------------------------------

const GetEmojiCharFromEmojiCode = (utf16) => {
  return String.fromCodePoint(...utf16.split('-').map((u) => `0x${u}`));
};

// --------------------------------------------------

/**
 * Group emojis by category
 */
const EmojisByCategory = EmojiDataSource.reduce((acc, item) => {
  // prepare category
  const { category } = item;
  if (!acc[category]) {
    acc[category] = [];
  }
  // filter invalid emoji
  if (parseFloat(item.added_in) < 7.0 && item.has_img_messenger) {
    const char = GetEmojiCharFromEmojiCode(item.unified);
    const sortOrder = item.sort_order;
    acc[category].push({ char, sortOrder });
  }
  // --
  return acc;
}, {});

/**
 * Sort emojis
 */
const SortedEmojisByCategory = Object.keys(EmojisByCategory).reduce((acc, category) => {
  const items = EmojisByCategory[category] || [];
  items.sort((item1, item2) => {
    return item1.sortOrder > item2.sortOrder ? 1 : -1;
  });
  acc[category] = items.slice(0, 50);
  return acc;
}, {});

export default SortedEmojisByCategory;

// --------------------------------------------------

/**
 * Standard emoji
 */
// const GetStandardEmojis = () => {
//   // People & Smileys
//   const SimleysAndPeople = [
//     '0x1F600', '0x1F601', '0x1F602', '0x1F603', '0x1F604',
//     '0x1F605', '0x1F606', '0x1F607', '0x1F608', '0x1F609',
//     '0x1F60A', '0x1F60B', '0x1F60C', '0x1F60D', '0x1F60E',
//     '0x1F60F', '0x1F610', '0x1F611', '0x1F612', '0x1F613',
//     '0x1F614', '0x1F615', '0x1F616', '0x1F617', '0x1F618',
//     '0x1F619', '0x1F61A', '0x1F61B', '0x1F61C', '0x1F61D',
//     '0x1F61E', '0x1F61F', '0x1F620', '0x1F621', '0x1F622',
//     '0x1F623', '0x1F624', '0x1F625', '0x1F626', '0x1F627',
//     '0x1F628', '0x1F629', '0x1F62A', '0x1F62B', '0x1F62C',
//     '0x1F62D', '0x1F62E', '0x1F62F', '0x1F630', '0x1F631',
//     '0x1F632', '0x1F633', '0x1F634', '0x1F635', '0x1F636',
//     '0x1F637', '0x1F923',
//   ];
//   // category
//   const emojisData = {};
//   emojisData['Smileys & People'] = SimleysAndPeople;
//   // map unicode to emoji code
//   const emojis = Object.keys(emojisData).reduce((acc, category) => {
//     const items = emojisData[category] || [];
//     const itemsChars = items.map(item => {
//       const char = String.fromCodePoint(item);
//       return { char };
//     });
//     acc[category] = itemsChars;
//     return acc;
//   }, {});
//   // ---
//   return emojis;
// };

// const StandardEmojis = GetStandardEmojis();
// export default StandardEmojis;

// --------------------------------------------------

// const charValue = item.unified.split('-').map(u => '0x' + u);
// const charValueOrder = charValue.reduce((acc, item) => {
//   const v = parseInt(item.replace('0x', ''), 16) || 0;
//   acc = acc + v;
//   return acc;
// }, 0);

// const GetEmojiOfCategory = (category) => {
//   const item = EmojiDataSource[0];
//   console.log(`9999: `, item);
//   return EmojiDataSource
//   .filter(item => {
//     return (item.category === category && item.has_img_apple && item.has_img_google);
//   })
//   .map(item => {
//     const char = GetEmojiCharFromEmojiCode(item.unified);
//     const charValue = parseInt(char, 16);
//     // console.log(`9999 | raw:${item.unified} | char:${char}`);
//     return {
//       sortOrder: item.sort_order,
//       char,
//       charValue,
//     };
//   })
//   .sort((item1, item2) => {
//     return (item1.charValue > item2.charValue) ? 1 : -1;
//   })
//   .map(item => item.char);
// }

// const emoji = GetEmojiOfCategory('Smileys & People');
// export default emoji;
