function populate() {
  while (true) {
    let windowRelativeBottom = document.documentElement.getBoundingClientRect()
      .bottom;
    // 当文档距离视窗底部小于100的时候，给他加内容
    if (windowRelativeBottom > document.documentElement.clientHeight + 100)
      break;
    document.body.insertAdjacentHTML("beforeend", `<p>Date: ${new Date()}</p>`);
  }
}

window.addEventListener("scroll", populate);

populate(); // init document
