// ==UserScript==
// @name         VS Code Marketplace VSIX Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds download buttons for VSIX files in the VS Code Marketplace version history tab
// @match        https://marketplace.visualstudio.com/items?*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const PLATFORMS = {
        'Universal': '',
        'Alpine Linux 64 bit': 'alpine-x64',
        'Alpine Linux ARM64': 'alpine-arm64',
        'Linux ARM32': 'linux-armhf',
        'Linux ARM64': 'linux-arm64',
        'Linux x64': 'linux-x64',
        'Windows ARM': 'win32-arm64',
        'Windows x64': 'win32-x64',
        'macOS Apple Silicon': 'darwin-arm64',
        'macOS Intel': 'darwin-x64'
    };

    function getIdentifier() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('itemName');
    }

    function createDownloadUrl(publisher, extension, version, platform) {
        let url = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${extension}/${version}/vspackage`;
        if (platform) {
            url += `?targetPlatform=${platform}`;
        }
        return url;
    }

    function injectDownloadButtons() {
        // Only run if we are in the version history tab
        if (!window.location.href.includes('#version-history')) {
            return;
        }

        const itemName = getIdentifier();
        if (!itemName) return;

        const parts = itemName.split('.');
        if (parts.length !== 2) return;
        const publisher = parts[0];
        const extension = parts[1];

        // The version history is dynamically loaded, so we look for table rows
        const tableRows = document.querySelectorAll('table tbody tr');

        tableRows.forEach(row => {
            // Check if we already added buttons
            if (row.dataset.vsixInjected) return;

            // Find the version cell (usually the first cell)
            const firstCell = row.querySelector('td');
            if (!firstCell) return;

            const versionText = firstCell.textContent.trim();
            // Match typical version numbers: 1.2.3 or 2024.17.2024100401
            const versionMatch = versionText.match(/^v?(\d+\.\d+\.\d+.*)$/i);

            if (versionMatch) {
                const version = versionMatch[1];

                // Add an actions container to the row. We can append it to the last cell.
                let targetCell = row.querySelector('td:last-child');
                if (!targetCell) targetCell = firstCell; // Fallback

                const selectContainer = document.createElement('div');
                selectContainer.className = 'vsix-download-container';
                selectContainer.style.display = 'flex';
                selectContainer.style.alignItems = 'center';
                selectContainer.style.gap = '8px';
                selectContainer.style.marginTop = '8px';

                const platformSelect = document.createElement('select');
                platformSelect.style.padding = '2px 4px';
                platformSelect.style.border = '1px solid #ccc';
                platformSelect.style.borderRadius = '3px';
                platformSelect.style.backgroundColor = 'transparent';
                platformSelect.style.color = 'inherit';

                Object.entries(PLATFORMS).forEach(([name, val]) => {
                    const option = document.createElement('option');
                    option.value = val;
                    option.textContent = name;
                    platformSelect.appendChild(option);
                });

                const downloadBtn = document.createElement('a');
                downloadBtn.textContent = 'Download VSIX';
                downloadBtn.style.padding = '4px 8px';
                downloadBtn.style.backgroundColor = '#007acc';
                downloadBtn.style.color = '#ffffff';
                downloadBtn.style.textDecoration = 'none';
                downloadBtn.style.borderRadius = '3px';
                downloadBtn.style.fontSize = '12px';
                downloadBtn.style.fontWeight = 'bold';

                const updateLink = () => {
                    downloadBtn.href = createDownloadUrl(publisher, extension, version, platformSelect.value);
                };

                platformSelect.addEventListener('change', updateLink);
                updateLink();

                selectContainer.appendChild(platformSelect);
                selectContainer.appendChild(downloadBtn);

                targetCell.appendChild(selectContainer);

                row.dataset.vsixInjected = 'true';
            }
        });
    }

    // Use MutationObserver to handle SPA navigation and dynamic loading
    const observer = new MutationObserver((mutations) => {
        injectDownloadButtons();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Also listen for hash changes
    window.addEventListener('hashchange', () => {
        injectDownloadButtons();
    });

    // Initial check
    setTimeout(injectDownloadButtons, 1000);
})();
