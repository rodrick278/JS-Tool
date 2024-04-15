import {parse} from 'twemoji-parser'
/*
 * Split Text
 * ex) 
 *  '君👼の味方🤝だよ'
 *  > ['君', TwemojiObj(👼), 'の味方', TwemojiObj(🤝), 'だよ']
 */
export default function splitEntitiesFromText (text) {
  const twemojiEntities = parse(text, {
    assetType: 'svg',
    buildUrl: (codepoints, assetType) =>
      assetType === 'png'
        ? `https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/${ codepoints }.png`
        : `https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/${ codepoints }.svg`,
  });

  let unparsedText = text;
  let lastTwemojiIndice = 0;
  const textEntities = [];
  
  twemojiEntities.forEach((twemoji) => {
    textEntities.push(
      unparsedText.slice(0, twemoji.indices[0] - lastTwemojiIndice)
    );

    if (twemoji.url) {
      textEntities.push(twemoji);
    }

    unparsedText = unparsedText.slice(twemoji.indices[1] - lastTwemojiIndice);
    lastTwemojiIndice = twemoji.indices[1];
  });

  textEntities.push(unparsedText);
  return textEntities;
}
