const { JSDOM } = require("jsdom");

const dom = new JSDOM(`<!DOCTYPE html><html><body>
  <button id="login-ptn"></button>
  <button id="logout"></button>
  <div id="profile-nav"></div>
  <div id="edit-profile"></div>
  <div id="color"></div>
  <button id="close"></button>
  <div id="loading"></div>
  <button id="profileItem"></button>
  <button id="colorItem"></button>
  <input id="file" type="file">
  <img class="uplaodImage image img">
</body></html>`, { url: "http://localhost" });

global.document = dom.window.document;
global.window = dom.window;
global.sessionStorage = dom.window.sessionStorage;


require("../index.js");

describe("Testing Methods...", () => {

  test("showLoading", () => {
    const loadingDiv = document.getElementById("loading");
    showLoading();
    expect(loadingDiv.style.display).toBe("block");
  });

  test("hideLoading", () => {
    const loadingDiv = document.getElementById("loading");
    hideLoading();
    expect(loadingDiv.style.display).toBe("none");
  });
});
