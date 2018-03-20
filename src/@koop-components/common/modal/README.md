The modal component can be used if information needs to be overlayed on top of the page, with the rest of the page inaccessible.

## Implementation notes

### Adding a modal to the page

To add a modal in the page, add it just before the `<body>`.  It is added in its invisible state. Example markup:

```markup
<div id="modal-1" class="modal modal--off-screen" hidden role="alert">
    <div class="modal__content">
        <h2>Voorbeeld</h2>
        <p>Dit is een voorbeeld van een modal.</p>
        <button type="button" data-handler="close-modal" class="modal__close">Sluit</button>
    </div>
</div>
```

Note that it has:

* an ID, this is used to identify this modal
* classnames, they are used for styling (the modal, and the modal's off screen state)
* the hidden attribute, this hides the modal
* a `role` of `alert`
* the `.modal` element for the outer modal and the `.model__content` element for its content
* a close button; this can be any button element with `data-handler="close-modal"`

### Triggering/opening modal with a button

This is a button that can open a modal:

```markup
<button type="button" data-handler="open-modal" data-modal="modal-1" class="button">Open modal</button>
```

Note that the `data-modal` attribute contains the ID of the modal, this corresponds to the `id` attribute on the actual modal.