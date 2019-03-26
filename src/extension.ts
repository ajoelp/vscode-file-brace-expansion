// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as braces from 'braces';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "multifile" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'extension.createFile',
    async file => {
      let rootPath = vscode.workspace.rootPath;
      if (file) {
        rootPath = file.fsPath;
      }

      if (!rootPath) {
        throw new Error('No root path');
      }

      try {
        const answer = await vscode.window.showInputBox({
          prompt: 'Filename:',
          placeHolder: 'test.js'
        });
        if (!answer) {
          throw new Error('Cannot be empty');
        }

        const newPath = path.resolve(rootPath, answer);

        await fs.mkdirp(path.dirname(newPath));

        const files = braces.expand(newPath);

        for (const fileIndex in files) {
          const file = files[fileIndex];
          if (fs.existsSync(file)) {
            throw new Error('File already exists');
          }
          await fs.writeFile(file, '');
        }
      } catch (e) {
        vscode.window.showWarningMessage(e.message);
      }

      // Display a message box to the user
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
