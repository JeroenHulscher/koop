# KOOP componentenbibliotheek

De componentenbibliotheek voor KOOP.

## E2E testing

Make sure you webdriver-manager is up to date (terminal: webdriver-manager update)

Run three terminals:
- 'webdriver-manager start'
- 'gulp dev'
- 'npm run e2e'

## Visual regression testing

Run two terminals:
- 'gulp dev'
- 'npm run vrtest'

'npm run vrtest' automaticly updates your reference screenshots before creating new screenshots of your local. If you want to only create and diff new local screenshots, you can simply run 'backstop test'.
