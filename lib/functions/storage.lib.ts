import { setCookie } from "cookies-next";
import { checkWindow, isInServer } from "./_helpers.lib";

export function saveInLocalStorage(key: string, value: string) {
  if (checkWindow()) {
    localStorage.setItem(key, value);
  }
}

export function getFromLocalStorage(key: string) {
  if (checkWindow()) {
    const getItem = localStorage.getItem(key);

    if (getItem?.length) {
      return getItem;
    }

    return null;
  }

  return null;
}

/**
 * It checks if the browser allows cookies
 */
export function isCookieAllowed() {
  if (typeof navigator !== "undefined" && !isInServer()) {
    let { cookieEnabled } = navigator;
    if (!cookieEnabled) {
      //check again if we can write cookie still
      document.cookie = "testcookie";
      cookieEnabled = document.cookie.indexOf("testcookie") !== -1;
    }
    return cookieEnabled;
  }
  //on server return always true
  return true;
}

export function getCookie(cname: string) {
  if (!isInServer()) {
    const name = `${cname}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  //if it runs in server return null, by default next-cookie-wrapper wraps in redux
  //or get cookies in methods getInitialProps etc
  return null;
}

export function setCookieClient(key: string, value: string) {
  setCookie(key, value, {
    path: "/"
  });
}

export { checkWindow };
