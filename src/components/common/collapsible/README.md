Collapsibles can be used to hide some sections of information initially, making it available by expanding the section.

## Implementation notes

### General

* Collapsibles consist of a header, always visible, and content, only visible in the expanded state.

### ARIA

* We use `aria-expanded` to tell AT if the collapsible is expanded. It goes on the `a` in the header, because that is the element users interact with to expand.
* We use `aria-controls` to tell AT (and our JS) which content is being toggled.
