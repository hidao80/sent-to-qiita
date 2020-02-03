const vscode = require('vscode');
const request = require('request');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Congratulations, your extension "send-to-qiita" is now active!');

  let disposable = vscode.commands.registerCommand('extension.sendToQiita', function () {
    const settings = require(process.env.APPDATA + "\\Code\\User\\settings.json");
    const token = settings["send-to-qiita.token"];
    if (token === undefined) return;

    const text = vscode.window.activeTextEditor.document.getText();
    const matches = text.match(/((?:(?!--+)[^-])+)/g);

    const options = {
      url: "https://qiita.com/api/v2/items",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      json: {}
    };
    options.json["body"] = matches[1].trim();

    let item = "";
    let label = ""
    for (const match of matches[0].split('\n')) {
      if (match.trim().length > 0) {
        item = match.split(":");
        label = item[0].trim();
        switch (label) {
          case "coediting":
          case "private":
          case "tweet":
            options.json[label] = (item[1].trim() === 'true');
            break;
          case "group_url_name":
          case "title":
            options.json[label] = item[1].trim();
            break;
          case "tags":
            options.json[label] = createTagsObject(match.slice(match.indexOf(":")+1).trim().split(" "));
            //console.log(array);
            break;
        }
      }
    }
    //console.log(options);
    
    if (!options.json["title"]) {
      vscode.window.showInformationMessage("Undefined title.");
      return;
    }
    if (options.json["tags"] === undefined) {
      vscode.window.showInformationMessage("Undefined tags.");
      return;
    }

    request(options, (error, response) => {
      let result = 'This article sent to Qiita.';
      if (response.statusCode != 201) {
        result = 'Failed to send.';
        console.log(response);
      }
      vscode.window.showInformationMessage(result);
    });
  });
  context.subscriptions.push(disposable);

  disposable = vscode.commands.registerCommand('extension.registToken', function () {
    vscode.window.showInputBox({
      prompt: 'Regist Qiita token: ',
      validateInput: param => {
        return /[\dA-z]/.test(param) ? '' : 'input: token string';
      }
    }).then((token) => {
      if (token === undefined) {
        vscode.window.showInformationMessage("Cancel token registration.");
      } else {
        setToken(token);
        vscode.window.showInformationMessage("Token registed.");
      }
    });
  });
  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

function createTagsObject(tags) {
  if (JSON.stringify(tags) == JSON.stringify([""])) return undefined;

  let array = [];
  let tag =  "";
  for (const obj of tags) {
    tag = obj.split(":");
    if (tag.length >= 2) {
      array.push({
        "name": tag[0],
        "versions": [ tag[1] ]
      });
    } else {
      array.push({
        "name": tag[0]
      });
    }
  }
  return array;
}

function setToken(token) {
  const fs = require("fs");
  const path = process.env.APPDATA + "\\Code\\User\\settings.json";
  const settings = require(path);
  settings["send-to-qiita.token"] = token;

  fs.writeFile(path, JSON.stringify(settings), (err) => {
    if (err) {
      throw err;
    }
  });
}

module.exports = {
  activate,
  deactivate,
  createTagsObject,
  setToken
}
