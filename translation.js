const { BrowserView } = require('electron');

module.exports.initTranslation = function() {
    let id = 0;
    return function(url, bounds, options) {
        const view = new BrowserView(options);
        view.setBounds(bounds);
        view.webContents.loadURL(url);
        return {id: id++, view}
    }
}