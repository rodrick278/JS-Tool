function isVisible(elem) {
  let coords = elem.getBoundingClientRect();

  let windowHeight = document.documentElement.clientHeight;

  // 顶部元素边缘可见或底部元素边缘可见
  let topVisible = coords.top > 0 && coords.top < windowHeight;
  let bottomVisible = coords.bottom < windowHeight && coords.bottom > 0;

  return topVisible || bottomVisible;
}
function showVisible() {
  for (let img of document.querySelectorAll("img")) {
    // src 占位图片，data-src是实际地址，在判断图片头或尾显示出的时候，把src替换为data-src
    let realSrc = img.dataset.src;
    if (!realSrc) continue;

    if (isVisible(img)) {
      img.src = realSrc;

      img.dataset.src = "";
    }
  }
}

window.addEventListener("scroll", showVisible);
showVisible();
