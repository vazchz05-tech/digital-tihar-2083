# Digital Tihar — GitHub Pages

A responsive, interactive Tihar / Deusi-Bhailo celebration site built with plain HTML, CSS and JavaScript.

## Add your personal assets

1. Put your Tihar song in `assets/` and name it **`tihar-song.mp3`**.
2. Put your payment QR image in `assets/` and name it **`dakshina-qr.png`**.
3. Keep the filenames exactly as shown. The QR placeholder disappears automatically when the image is present.

Use audio and payment QR files that you own or are authorized to share. Test the QR with your payment app before publishing.

## Run locally

Open `index.html` in a browser. For best results, use a local server (for example, VS Code Live Server).

## Publish with GitHub Pages

1. Create a new GitHub repository (Public is simplest for GitHub Pages).
2. Upload `index.html`, `style.css`, `script.js`, and the `assets` folder.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select **main** and **/(root)**, then Save.
6. Wait for GitHub Pages to publish and copy the displayed website URL to share.

## Notes

- Music starts after the visitor clicks **Let's Celebrate** because browsers block unsolicited autoplay.
- The song ending reveals the Dakshina section. A 2-minute fallback also reveals it if the track is longer or does not fire its ended event.
- Visitors can move through the experience at their own pace. The wish is shown locally in that visitor's browser session; it is not sent or stored on a server.
- Fireworks are decorative screen animations, not real fireworks.
- The page uses a Google Fonts connection; system fallbacks are included.
