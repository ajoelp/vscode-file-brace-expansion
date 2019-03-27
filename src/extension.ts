import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as braces from 'braces';

export function activate(context: vscode.ExtensionContext) {
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
        const bracedPath = await vscode.window.showInputBox({
          prompt: 'Filename:',
          placeHolder: 'test.js'
        });
        if (!bracedPath) {
          throw new Error('Cannot be empty');
        }

        const generatedFileNames = braces.expand(bracedPath);

        for (const fileIndex in generatedFileNames) {
          const file = generatedFileNames[fileIndex];
          const fullPath = path.resolve(rootPath, file);

          await fs.mkdirp(path.dirname(fullPath));

          if (fs.existsSync(fullPath)) {
            throw new Error('File already exists');
          }

          await fs.writeFile(fullPath, '');
        }
      } catch (e) {
        vscode.window.showWarningMessage(e.message);
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
