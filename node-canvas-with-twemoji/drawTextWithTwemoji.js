import splitEntitiesFromText from './utils/splitEntitiesFromText'
import loadTwemojiImageByUrl from './utils/loadTwemojiImageByUrl'
import getFontSizeByCssFont from './utils/getFontSizeByCssFont'

import measureText from './measureText'
import {Canvas} from 'canvas'

export default async function drawTextWithEmoji (
  context,
  fillType,
  text,
  x,
  y,
  {
    maxWidth = Infinity,
    emojiSideMarginPercent = 0.1,
    emojiTopMarginPercent = 0.1
  } = {}
) {
  const textEntities = splitEntitiesFromText(text);
  const fontSize = getFontSizeByCssFont(context.font);
  const baseLine = context.measureText('').alphabeticBaseline;
  const textAlign = context.textAlign;
  const transform = context.currentTransform;

  const emojiSideMargin = fontSize * emojiSideMarginPercent;
  const emojiTopMargin = fontSize * emojiTopMarginPercent;

  const textWidth = measureText(context, text, { emojiSideMarginPercent }).width;

  // for Text align
  let textLeftMargin = 0;

  if (!['', 'left', 'start'].includes(textAlign)) {
    context.textAlign = 'left';

    switch (textAlign) {
      case 'center':
        textLeftMargin = -textWidth / 2;
        break;

      case 'right':
      case 'end':
        textLeftMargin = -textWidth;
        break;
    }
  }

  // Drawing
  let currentWidth = 0;

  if (textWidth > maxWidth) {
    let scale = maxWidth / textWidth;
    context.setTransform(scale, 0, 0, 1, 0, 0);
    x = x / scale;
  }

  for (let i = 0; i < textEntities.length; i++) {
    const entity = textEntities[i];
    if (typeof entity === 'string') {
      // Common text case
      if (fillType === 'fill') {
        context.fillText(entity, textLeftMargin + x + currentWidth, y);
      } else {
        context.strokeText(entity, textLeftMargin + x + currentWidth, y);
      }

      currentWidth += context.measureText(entity).width;
    } else {
      // Emoji case
      try {
        const emoji = await loadTwemojiImageByUrl(entity.url);

        // If you do not resize Image in advance, the image will be rough.
        emoji.width = fontSize;
        emoji.height = fontSize;
  
        context.drawImage(
          emoji,
          textLeftMargin + x + currentWidth + emojiSideMargin,
          y + emojiTopMargin - fontSize - baseLine,
          fontSize,
          fontSize
        );
  
        currentWidth += fontSize + (emojiSideMargin * 2);
      } catch (error) {
        // emoji图片走代理加载偶尔可能会失败,失败就不再加载了
        console.log("emoji fail",error);
      }
     
    }
  }

  // Restore
  if (textAlign) {
    context.textAlign = textAlign;
  }
  context.setTransform(transform);
}