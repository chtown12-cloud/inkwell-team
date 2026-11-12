/* Every suite launches its browser through here, so that no test can reach
   anything but the dev server.

   The game loads the Firebase SDK from gstatic and, when it arrives, keeps
   its shared session in the real database. On a machine with a network that
   meant every test run opened real sessions there — and ran the suites on a
   different transport from the one they were written against. A proxy that
   is not listening fails every outside request at once; localhost is let
   past it by name, so the dev server is unaffected. The one suite that needs
   the live transport brings its own stand-in (fake-firebase.js). */
const { chromium, devices } = require('playwright');

const NOWHERE = { server: 'http://127.0.0.1:9', bypass: 'localhost,127.0.0.1' };
const launch = (options = {}) => chromium.launch({ proxy: NOWHERE, ...options });

module.exports = { launch, devices };
