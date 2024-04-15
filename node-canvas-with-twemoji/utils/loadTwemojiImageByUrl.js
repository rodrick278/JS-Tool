import { loadImage }  from 'canvas';
import { load_emoji } from '../../node_canvas_util'

const cachedTwemojiImages = new Map();

export default  function loadTwemojiImageByUrl (url) {
  return new Promise(async (res, rej) => {
    if (cachedTwemojiImages.has(url)) {
      return res(cachedTwemojiImages.get(url));
    }

    try {
      const image = await load_emoji(url);
      cachedTwemojiImages.set(url, image);

      res(image);
    } catch (e) {
      rej(e)
    }
  });
}
