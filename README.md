# GraphixLang Minimal Extension

This extension provides minimal syntax highlighting for GraphixLang (.pixil) files.

## Installation

### Method 1: Using VSIX Package (Recommended)

1. Run the packaging script:
   ```
   node package-extension.js
   ```

2. This will create a `.vsix` file in the current directory

3. In VS Code:
   - Go to Extensions (Ctrl+Shift+X)
   - Click on the "..." menu in the top-right
   - Select "Install from VSIX..."
   - Navigate to and select the `.vsix` file

### Method 2: Manual Installation (Less reliable)

1. Run the install script:
   ```
   node install.js
   ```

2. If the extension doesn't appear in VS Code:
   - Close all VS Code instances
   - Restart VS Code
   - Try Method 1 instead

### Setting up the Executable
Place all necessary GraphixLang files in the `executable` directory before packaging.

## Testing

1. Open a `.pixil` file in VS Code
2. If syntax highlighting doesn't appear, press Ctrl+K M and select GraphixLang

## Troubleshooting

If your extension doesn't appear in VS Code:
- Try the VSIX installation method
- Make sure you've restarted VS Code after installation
- Check extension directory permissions

If you see an error about missing DLLs or runtime issues:
1. Make sure you have the .NET 6.0 Runtime installed
2. Ensure all required DLLs are in the executable directory
3. Check that the runtimeconfig.json file specifies the correct .NET version

## For Further Development

When publishing the GraphixLang executable, use the following command to create a self-contained application:

```
dotnet publish -c Release -r win-x64 --self-contained true
```

This will include the necessary .NET runtime files, eliminating the dependency on the user's installed .NET version.
