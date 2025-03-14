# LC Prompt

A simple Chrome Extension that creates context menu options for different LeetCode problem prompts.

## Features

1. Four context menu options:
   - Solved Correctly - Ask for Optimization  
   - Solved Wrong - Ask for Mistakes & Fixes  
   - Unsolved - Step-by-Step Hints  
   - Unsolved - Immediate Optimal Solution  
2. Automatically copies your selected LeetCode problem text with a tailored prompt into your clipboard.

## Installation

1. Clone or download this repository.  
2. Open Google Chrome, go to chrome://extensions, and enable “Developer Mode.”  
3. Click “Load unpacked,” then select the folder containing your manifest.json and background.js files.

## Files

1. **manifest.json**  
   The extension configuration file specifying permissions, extension name, and background script.
2. **background.js**  
   The service worker script responsible for creating the context menu and copying text using chrome.scripting.executeScript.

## Usage

1. Highlight any part of a LeetCode question in Chrome.  
2. Right-click the selection.  
3. Choose one of the four menu items, for example:  
   - “Solved Correctly - Ask for Optimization”  
   - “Solved Wrong - Ask for Mistakes & Fixes”  
   - “Unsolved - Step-by-Step Hints”  
   - “Unsolved - Immediate Optimal Solution”  
4. Your selected text plus the corresponding prompt will be copied to your clipboard.  
5. Paste the copied content wherever you want (e.g., in a new browser tab or your notes).

## Contributing

Feel free to open issues or pull requests if you’d like to improve this extension.

## License

This project is licensed under the MIT License.
