"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const CONF = vscode.workspace.getConfiguration("git-changes");
const FLAG = CONF.get("enabled");
const OWNER = CONF.get("owner");
const REPO = CONF.get("repo");
const CHANGE_FILE_NAMES = ["CHANGES.md", "CHANGELOG.md"];
var CHANGE_BLOCK = new RegExp(/^[#]+ \[\S+\] \- \S+$/);
var VERSION = new RegExp(/\[(?<version>\S+)\](?:[^:])/);
var LDECOMPOSE = new RegExp(/\[(?<repoMatch>\S+) (?<v1>\S+) +\-\> +(?<v2>\S+)\](?:[^:])/);
function is_changes(fileName) {
    var name;
    for (let i = 0; i < CHANGE_FILE_NAMES.length; i++) {
        name = CHANGE_FILE_NAMES[i];
        if (fileName.includes(name))
            return true;
    }
    return false;
}
function getLatestBlock(text) {
    var inBlock = false;
    var lines = text.split("\n");
    var block = [];
    var rest = [];
    var before = [];
    var line;
    for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        rest = lines.slice(i + 1);
        if (CHANGE_BLOCK.exec(line) != null && !inBlock) {
            block.push(line);
            inBlock = true;
        }
        else if (CHANGE_BLOCK.exec(line) != null) {
            rest = [line].concat(rest);
            return [before.join("\n"), block.join("\n"), rest.join("\n")];
        }
        else if (inBlock) {
            block.push(line);
        }
        else {
            before.push(line);
        }
    }
    return [before.join("\n"), block.join("\n"), rest.join("\n")];
}
function buildVersion(match) {
    return `https://github.com/${OWNER}/${REPO}/releases/tag/${match}`;
}
function buildLink(match) {
    if (!match.groups) {
        console.error("Unable to parse version");
        return "";
    }
    var repoMatch = match.groups["repoMatch"];
    var v1 = match.groups["v1"];
    var v2 = match.groups["v2"];
    return `https://github.com/${OWNER}/${repoMatch}/compare/${v1}...${v2}`;
}
function parseLink(block) {
    var lines = block.split("\n");
    var match = null;
    var links = [];
    for (let i = 0; i < lines.length; i++) {
        match = VERSION.exec(lines[i]);
        if (match != null) {
            console.log(match);
            if (match.groups) {
                console.log(match.groups["version"]);
                links.push(match[0].trimEnd() + ":" + buildVersion(match.groups["version"]));
            }
        }
        match = LDECOMPOSE.exec(lines[i]);
        if (match != null && match.groups) {
            console.log(match);
            links.push(match[0].trimEnd() + ":" + buildLink(match));
        }
    }
    return links.join("\n");
}
function redefineBlock(block, links) {
    block = block.trimEnd();
    var lines = block.split("\n");
    var newBlock = [];
    for (let i = 0; i < lines.length; i++) {
        if (/^\[.+\]:\S+$/.exec(lines[i]) === null) {
            newBlock.push(lines[i]);
        }
    }
    return newBlock.join("\n").trimEnd() + "\n\n" + links + "\n\n";
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "git-changes" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand("git-changes.helloWorld", () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage("Hello World from git-changes!");
    });
    if (FLAG) {
        context.subscriptions.push(vscode.workspace.onDidSaveTextDocument((document) => {
            if (document.languageId === "markdown" &&
                document.uri.scheme === "file" &&
                is_changes(document.fileName) &&
                OWNER !== undefined &&
                REPO !== undefined) {
                var [before, block, after] = getLatestBlock(document.getText());
                var links = parseLink(block);
                block = redefineBlock(block, links);
                console.log(before);
                console.log(after);
                vscode.workspace.fs.writeFile(document.uri, Buffer.from([before, block, after].join("\n")));
            }
        }));
    }
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map