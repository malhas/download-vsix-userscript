# VS Code Marketplace VSIX Downloader Userscript

A userscript to easily download `.vsix` files directly from the Visual Studio Marketplace's "Version History" tab. It automatically extracts the unique identifier, constructs the download link, and provides options to select specific platform binaries (e.g., Windows x64, macOS Apple Silicon, Linux).

## Features
- Detects the extension identifier from the URL (`itemName`).
- Parses versions directly from the Version History tab.
- Adds a convenient "Download VSIX" button next to each version.
- Includes a dropdown to choose the target platform (Universal, Windows, macOS, Linux).

## Installation Instructions

1. **Install a Userscript Manager**
   First, install a userscript manager extension for your browser if you haven't already:
   - [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Safari, Edge)
   - [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox, Edge)

2. **Install the Script**
   - Option A: If you have this repository locally, copy the contents of `download-vsix.user.js`. In your userscript manager dashboard, create a new script and paste the code.
   - Option B: If hosted online, click on the raw file link to trigger your userscript manager to install it.

## How to Use

1. Go to any extension page on the Visual Studio Marketplace.
2. Navigate to the **Version History** tab.
3. The URL should look something like:
   `https://marketplace.visualstudio.com/items?itemName=ms-python.python&ssr=false#version-history`
4. Next to each version in the table, you will see a dropdown menu to select the platform and a **Download VSIX** button.
5. Select the platform you need (skip selecting if the extension is "Universal").
6. Click **Download VSIX** to start the download.
