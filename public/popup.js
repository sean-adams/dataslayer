if (/Firefox/.test(navigator.userAgent)) {
  document.querySelector('#platformName').innerText = 'Firefox';
  document.querySelector('#menuTree').innerText =
    'Web Developer > Toggle Tools';
  document.querySelector('#chromeMenuIcon').setAttribute('style', 'display: none;');
} else {
  document.querySelector('#platformName').innerText = 'Chrome';
  document.querySelector('#firefoxMenuIcon').setAttribute('style', 'display: none;');
}
