// KALEO Add function to store cookies in localstorage, which Electron does persist.
(function() {
  (function(document) {
    localStorage.cookies || (localStorage.cookies = '{}');
    document.__defineGetter__('cookie', function() {
      var cookieName, cookies, output, res, val, validName;
      cookies = JSON.parse(localStorage.cookies);
      output = [];
      for (cookieName in cookies) {
        val = cookies[cookieName];
        validName = cookieName && cookieName.length > 0;
        res = validName ? cookieName + "=" + val : val;
        output.push(res);
      }
      return output.join('; ');
    });
    document.__defineSetter__('cookie', function(s) {
      var cookies, key, parts, value;
      parts = s.split('=');
      if (parts.length === 2) {
        key = parts[0], value = parts[1];
      } else {
        value = parts[0];
        key = '';
      }
      cookies = JSON.parse(localStorage.cookies || '{}');
      cookies[key] = value;
      localStorage.cookies = JSON.stringify(cookies);
      return key + '=' + value;
    });
    document.clearCookies = function() {
      return delete localStorage.cookies;
    };
    document.__defineGetter__('location', function() {
      var url;
      url = 'electron-renderer.com';
      return {
        href: 'http://' + url,
        protocol: 'http:',
        host: url,
        hostname: url,
        port: '',
        pathname: '/',
        search: '',
        hash: '',
        username: '',
        password: '',
        origin: 'http://' + url
      };
    });
    return document.__defineSetter__('location', function() {});
  })(document);

}).call(this);

/**
 * Created by JiaHao on 5/7/15.
 */

var ipc = require('ipc');

ipc.on('params', function(message) {
  
    var appArgs = JSON.parse(message);
    console.log(appArgs);
    document.title = appArgs.name;

    var webView = document.createElement('webview');

    webView.setAttribute('id', 'webView');
    webView.setAttribute('src', appArgs.targetUrl);
    webView.setAttribute('autosize', 'on');
    webView.setAttribute('minwidth', '100');
    webView.setAttribute('minheight', '100');

    webView.addEventListener('new-window', function(e) {
        require('shell').openExternal(e.url);
    });

    // We check for desktop notifications by listening to a title change in the webview
    // Not elegant, but it will have to do
    if (appArgs.badge) {
        webView.addEventListener('did-finish-load', function(e) {
            webView.addEventListener('page-title-set', function(event) {
                ipc.send('notification-message', 'TITLE_CHANGED');
            });
        });
    }

    var webViewDiv = document.getElementById('webViewDiv');
    webViewDiv.appendChild(webView);

    Mousetrap.bind('mod+c', function(e) {
        var webView = document.getElementById('webView');
        webView.copy();
    });

    Mousetrap.bind('mod+x', function(e) {
        var webView = document.getElementById('webView');
        webView.cut();
    });

    Mousetrap.bind('mod+v', function(e) {
        var webView = document.getElementById('webView');
        webView.paste();
    });

    Mousetrap.bind('mod+a', function(e) {
        var webView = document.getElementById('webView');
        webView.selectAll();
    });

    Mousetrap.bind('mod+z', function(e) {
        var webView = document.getElementById('webView');
        webView.undo();
    });
});
