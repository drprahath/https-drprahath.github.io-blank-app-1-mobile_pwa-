# STI Self-Assessment Mobile PWA

This is a responsive, installable web-app version of the desktop self-assessment for Android and iOS. It does not use external libraries, services, analytics, or network APIs. Assessment answers exist only in the current page session and are never stored or transmitted. The service worker caches only the app shell.

## Run locally

From this directory, start a local web server:

```powershell
python -m http.server 8000
```

Open `http://localhost:8000` in a browser. Keep the server running while testing. Service workers are allowed on `localhost`; opening `index.html` directly as a file will not enable offline support.

## Install on a phone

For installation on a phone, host the contents of this folder on an HTTPS web host:

- **Android:** open the HTTPS address in Chrome and choose **Install app** or **Add to Home screen**.
- **iPhone/iPad:** open the HTTPS address in Safari, tap **Share**, then **Add to Home Screen**.

Open the app once while online so the browser can cache its pages and assets. After that, the assessment works offline. A publicly accessible HTTPS address requires a hosting provider; this project is not deployed publicly.

## Included behavior

- The desktop questionnaire, conditional questions, risk summary, and referral guidance are represented in the mobile interface.
- Inputs are single-select and support touch, keyboard, and screen readers.
- Hidden conditional answers are cleared when their parent response makes those questions inapplicable.
- Risk results are educational only and are not a medical diagnosis.
