import drawTextWithTwemoji from './drawTextWithTwemoji'
// const measureText = require('./measureText');

export async function fillTextWithTwemoji (context, text, x, y, options = {}) {
  return await drawTextWithTwemoji(context, 'fill', text, x, y, options);
}

// export const strokeTextWithTwemoji = async function (context, text, x, y, options = {}) {
//   return await drawTextWithTwemoji(context, 'stroke', text, x, y, options);
// }

// export const measureText = function (context, text, options = {}) {
//   return measureText(context, text, options);
// }