const assert = require('assert');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');
// const myExtension = require('../extension');
const myExtension = require('../../extension');

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Target: createTagsObject', () => {
    assert.deepEqual(
      myExtension.createTagsObject(["vscode","test:0.0.1"]),
      [{"name": "vscode"},{"name": "test","versions": ["0.0.1"]}]
    );
    assert.deepEqual(myExtension.createTagsObject("".trim().split(" ")),undefined);
  });

  test('Target: setToken', () => {
    myExtension.setToken("write_qiita_token");
    const settings = require(process.env.APPDATA + "\\Code\\User\\settings.json");
    assert.equal(settings["send-to-qiita.token"], "write_qiita_token");
  });
});
