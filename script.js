document.addEventListener('DOMContentLoaded', () => {
    // --- Selectors ---
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const copyButtons = document.querySelectorAll('.copy-btn');
    const cryptoSelect = document.getElementById('crypto-select');
    const cryptoNetworkEl = document.getElementById('crypto-network');
    const cryptoWalletEl = document.getElementById('crypto-wallet');
    const cryptoQrEl = document.getElementById('crypto-qr');
    const cryptoCopyBtn = document.getElementById('crypto-copy-btn'); // Specific crypto copy button

    // --- Cryptocurrency Data (REPLACE PLACEHOLDERS!) ---
    const cryptoData = {
        'usdt': {
            network: 'TRC-20',
            address: 'TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // Replace with your USDT TRC-20 address
            qrCodeUrl: 'https://placehold.co/180x180/ffffff/000000?text=USDT+TRC20+QR' // Replace with path to your USDT QR code image
        },
        'ton': {
            network: 'TON',
            address: 'UXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // Replace with your TON address
            qrCodeUrl: 'https://placehold.co/180x180/ffffff/000000?text=TON+QR' // Replace with path to your TON QR code image
        },
        'eth': {
            network: 'ERC-20',
            address: '0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // Replace with your Ethereum address
            qrCodeUrl: 'https://placehold.co/180x180/ffffff/000000?text=ETH+ERC20+QR' // Replace with path to your ETH QR code image
        },
        'btc': {
            network: 'Bitcoin',
            address: 'bc1XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // Replace with your Bitcoin address
            qrCodeUrl: 'https://placehold.co/180x180/ffffff/000000?text=BTC+QR' // Replace with path to your BTC QR code image
        }
    };

    // --- Function to Update Crypto Display ---
    function updateCryptoDisplay(selectedCryptoKey) {
        const data = cryptoData[selectedCryptoKey];
        // Ensure all required elements exist before trying to update
        if (data && cryptoNetworkEl && cryptoWalletEl && cryptoQrEl && cryptoCopyBtn) {
            cryptoNetworkEl.innerText = data.network;
            cryptoWalletEl.innerText = data.address;
            cryptoQrEl.src = data.qrCodeUrl;
            cryptoQrEl.alt = `QR Code for ${data.network} Wallet`; // Update alt text
            cryptoQrEl.style.display = 'block'; // Ensure QR is visible

            // Update the copy button's target (though it's static #crypto-wallet in this HTML)
            cryptoCopyBtn.setAttribute('data-clipboard-target', '#crypto-wallet');
        } else {
            console.error("Could not update crypto display. Element missing or data not found for key:", selectedCryptoKey);
            // Provide user feedback in the UI
            if (cryptoNetworkEl) cryptoNetworkEl.innerText = 'Помилка';
            if (cryptoWalletEl) cryptoWalletEl.innerText = 'Не вдалося завантажити дані';
            if (cryptoQrEl) cryptoQrEl.style.display = 'none'; // Hide QR on error
        }
    }

    // --- Event Listener for Crypto Selection ---
    if (cryptoSelect) {
        cryptoSelect.addEventListener('change', (event) => {
            updateCryptoDisplay(event.target.value);
        });

        // --- Initial Crypto Display Setup ---
        // Set the initial display based on the default selected option in the dropdown
        updateCryptoDisplay(cryptoSelect.value);
    } else {
        console.warn("Crypto select dropdown not found.");
    }

    // --- Navigation Logic ---
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetPageId = item.getAttribute('data-page');

            // Hide all pages
            pages.forEach(page => page.classList.remove('active'));

            // Show the target page
            const targetPage = document.getElementById(targetPageId);
            if (targetPage) {
                targetPage.classList.add('active');
            } else {
                console.error(`Target page with ID '${targetPageId}' not found.`);
            }

            // Update active state for nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Scroll to top of the page
            window.scrollTo(0, 0);
        });
    });

    // --- Copy to Clipboard Logic ---
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSelector = button.getAttribute('data-clipboard-target');
            const targetElement = document.querySelector(targetSelector);

            if (targetElement) {
                // Handle both span and span inside 'a' tag
                const textToCopy = targetElement.innerText;

                navigator.clipboard.writeText(textToCopy).then(() => {
                    // Visual feedback: Change icon to checkmark and color to green
                    const originalIconHTML = button.innerHTML; // Store original icon HTML
                    const originalColor = button.style.color; // Store original color (if set inline)

                    button.innerHTML = '<i class="fa-solid fa-check"></i>'; // Checkmark icon
                    button.style.color = '#28a745'; // Green color for success
                    button.disabled = true; // Briefly disable button to prevent spamming

                    console.log(`Copied: ${textToCopy}`);

                    // Revert button state after a short delay
                    setTimeout(() => {
                        button.innerHTML = originalIconHTML;
                        // Revert color only if it was originally set inline, otherwise rely on CSS
                        if (originalColor) {
                             button.style.color = originalColor;
                        } else {
                             button.style.color = ''; // Remove inline style to use CSS default
                        }
                        button.disabled = false; // Re-enable button
                    }, 1500); // 1.5 seconds delay

                }).catch(err => {
                    console.error('Failed to copy: ', err);
                    // Provide user feedback for copy failure (consider a less intrusive method than alert)
                    // For example, temporarily change button color to red
                     const originalIconHTML = button.innerHTML;
                     button.innerHTML = '<i class="fa-solid fa-times"></i>'; // X icon
                     button.style.color = '#dc3545'; // Red color for error
                     button.disabled = true;
                     setTimeout(() => {
                         button.innerHTML = originalIconHTML;
                         button.style.color = ''; // Revert color
                         button.disabled = false;
                     }, 2000);
                     // alert('Помилка копіювання. Будь ласка, скопіюйте вручну.'); // Avoid using alert if possible
                });
            } else {
                console.error('Target element not found for selector:', targetSelector);
            }
        });
    });
});
