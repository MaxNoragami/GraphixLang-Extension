# GraphixLang Extension for VS Code

GraphixLang is a domain-specific language designed for batch image processing operations. 

This VS Code extension provides syntax highlighting and execution capabilities for GraphixLang files (`.pixil`).

## Features

- **Syntax Highlighting**: Colorizes keywords, variables, strings, and comments
- **Command Execution**: Run GraphixLang files directly from VS Code
- **Cross-Platform Support**: Works on Windows, macOS and Linux

## How It Works

### Language Structure

GraphixLang is designed around a simple syntax for image manipulation:

- **Variables**: Start with `$` (for regular variables) or `#` (for batch variables)
- **Keywords**: Control flow (IF, ELSE, ELIF, FOREACH), image operations (RESIZE, ROTATE, SET), etc.
- **File Processing**: Easily process individual images or batches of images

### Syntax Example

```graphixlang
{
    BATCH #myBatch = "TestImgs/Conditional/In";
    FOREACH IMG $image IN #myBatch EXPORT TO "TestImgs/Conditional/Out" {
        INT $width = 0;
        $width = METADATA $image FWIDTH;
        
        IF $width > 2000 {
            SET $image SEPIA;
        }
        ELIF $width >= 1000 {
            SET $image BW;
        }
        ELIF $width >= 500 {
            SET $image NEGATIVE;
        }
        ELSE {
            SET $image SHARPEN;
            SET $image PIXELATE 10;
        }
    }
}
```

## Getting Started

1. Install the extension
2. Create a new file with the `.pixil` extension
3. Write your GraphixLang code
4. Click the "Run GraphixLang File" button in the top-right corner of the editor

## Requirements

- Visual Studio Code 1.60.0 or newer