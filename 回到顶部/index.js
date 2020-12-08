/*
 * @Descripttion: 
 * @version: 
 * @Author: rodrick
 * @Date: 2020-12-08 23:25:05
 * @LastEditors: rodrick
 * @LastEditTime: 2020-12-08 23:25:44
 */
window.addEventListener("scroll", (e) => {
  arrowTop.hidden =window.pageYOffset < document.documentElement.clientHeight;
});

arrowTop.onclick = function () {
  window.scrollTo({
    left: window.pageXOffset,
    top: 0,
    behavior: "smooth"
  });
};
