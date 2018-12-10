The question explanation component can be used to give extra information about a specific word, sentence or question by opening a small popup on request.

## Implementation notes

There are two parts to a question explanation:

* its trigger
* the actual explanation

On page load, both are in the page, but only the trigger is visible.

The trigger is a link to the explanation. The ID in the trigger's `href'` to needs to be a unique ID that is the same as the `id` attribute of the actual explanation.
