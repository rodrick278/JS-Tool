import React, { useEffect, useState, useMemo } from "react";

// https://developers.google.com/speed/webp/faq?hl=zh-cn#how_can_i_detect_browser_support_for_webp
// check_webp_feature:
//   'feature' can be one of 'lossy', 'lossless', 'alpha' or 'animation'.
//   'callback(feature, isSupported)' will be passed back the detection result (in an asynchronous way!)
function check_webp_feature(feature, callback) {
  var kTestImages = {
    lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
    lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
    alpha:
      "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
    animation:
      "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA",
  };
  var img = new Image();
  img.onload = function () {
    var result = img.width > 0 && img.height > 0;
    callback(feature, result);
  };
  img.onerror = function () {
    callback(feature, false);
  };
  img.src = "data:image/webp;base64," + kTestImages[feature];
}

function WebpImage({ style = {}, className, src = "", ...rest }) {
  const [supportPicEle, setSupportPicEle] = useState(-1); // -1 未知 0 不支持 1 支持

  useEffect(() => {
    if (!src) {
      return;
    }
    setSupportPicEle(!!window.HTMLPictureElement ? 1 : 0);
  }, [src]);

  return (
    <>
      {supportPicEle === 0 && (
        <img style={style} className={className} src={src} {...rest} />
      )}

      {supportPicEle === 1 && (
        <picture>
          <source srcSet={`${src}_.avif`} />
          <source srcSet={`${src}_.webp`} />
          <img style={style} className={className} src={src} {...rest} />
        </picture>
      )}
    </>
  );
}

const useWebpBg = () => {
  // const isSupportWebp = useMemo(() => {
  //   try {
  //     return (
  //       document &&
  //       document
  //         .createElement("canvas")
  //         .toDataURL("image/webp")
  //         .indexOf("data:image/webp") === 0
  //     );
  //   } catch (error) {
  //     return false;
  //   }
  // }, []);

  useEffect(() => {
    let className;
    check_webp_feature("lossy", function (feature, isSupported) {
      className = isSupported ? "webpSup" : "webpNotSup";
      document.body.classList.add(className);
    });

    return () => {
      document.body.classList.remove(className);
    };
  }, []);
};

export { WebpImage, useWebpBg };
