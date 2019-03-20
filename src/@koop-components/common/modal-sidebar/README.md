Het modal component kan informatie tonen in een vlak dat over de rest van de pagina heenligt, en waarbij de rest van de pagina ontoegankelijk is gemaakt.

# Implementatie

## Voeg een modal toe aan de pagina

De code voor een model moet toegevoegd worden net voor voor de `<body>`-tag. Als je het toevoegt is het standaard niet-zichtbaar. Een voorbeeld van de broncode:

```markup
<div id="modal-1" class="modal modal--off-screen" hidden role="alert">
    <div class="modal__content">
        <h2>Voorbeeld</h2>
        <p>Dit is een voorbeeld van een modal.</p>
        <button type="button" data-handler="close-modal" class="modal__close">Sluit</button>
    </div>
</div>
```

Let op, het bevat altijd:

- een id, wat wordt gebruikt om het modal te kunnen aanroepen vanuit een knop
- een classname, die wordt gebruikt voor de opmaak van het modal en het verbergen van het modal.
- een hidden-attribuut, om het attribuut default te verbergen
- een role="alert" zodat screenreaders het netjes oplezen zodra het wordt getoond.
- `.modal` element als buitenste elementen, en `.model__content` element voor de inhoud
- Een 'close'-button, wat elke opmaak kan bevatten zolang het maar `data-handler="close-modal"` bevat.

## Openen/triggeren met een button

Dit kan iedere knop zijn met in ieder geval deze attributen:

```markup
<button type="button" data-handler="open-modal" data-modal="modal-1" class="button">Open modal</button>
```

**Let op**: het `data-modal` attribuut bevat het ID van het gekoppelde modal, en moet gelijk zijn aan het `id` attribute in het bijbehorende modal.
