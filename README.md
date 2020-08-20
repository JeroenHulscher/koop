# KOOP componentenbibliotheek
De componentenbibliotheek voor KOOP.

## Requirements
- Node.js
- NPM
- webdriver-manager: ```npm install webdriver-manager -g```, see [webdriver-manager on npm](https://www.npmjs.com/package/webdriver-manager).

## Intergratie - Gebruik de KOOP componentenbibliotheek
De bestanden die nodig zijn om de KOOP componentenbibliotheek te gebruiken kan je vinden in de ```/dist/``` map. Hier staan alle assets (geminified).

## Ontwikkeling
- ```npm run start``` start de ontwikkel-omgeving, erna te bekijken via ```localhost:3000```

## Exporteren
Voor het exporteren/bouwen van de gehele (fractal) componentenbibliotheek:
- ```gulp fractal-build```

## E2E test
Controleer, geautomatiseerd, de werking van de componenten na het aanbrengen van een wijziging.

Volg de onderstaande stappen om een E2E uit te voeren:
- ```webdriver-manager update```
- ```webdriver-manager start```
- ```npm run start```
- ```npm run e2e```

## Visuale regressie test
Controleer, geautomatiseerd, de visuele verschillen na het aanbrengen van een wijziging.

Volg de onderstaande stappen om een Visuale regressie test uit te voeren:
- ```npm run start```
- ```npm run vrtest```

Een extra browser-scherm zal automatisch worden geopend met de resultaten van de test.
