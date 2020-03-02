/**
 * Element.matches() polyfill (simple version)
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
 */
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

/**
 * Feature test
 * @return {Boolean} Returns true if required methods and APIs are supported by the browser
 */
var supports = function () {
  return 'querySelector' in document && 'addEventListener' in root;
};

(function () {
  'use strict';

  onl.decorate({
    'init-form-validation': function (element) {
      new formvalidation(element);
    }
  });

  var formvalidation = function (element) {
    this.element = element;
    this.config = JSON.parse(this.element.getAttribute('data-config')) || [];

    // Classes and Selectors
    this.config.classField = this.config.classField || 'has-error';
    this.config.errorContainer = this.config.errorContainer || 'form__error';
    this.config.errorsContainer = this.config.errorsContainer || 'form__errors';

    this.errors = [];

    // Messages
    this.config.messageValueMissing = this.config.messageValueMissing || 'Dit mag niet leeg zijn.';
    this.config.messageValueMissingCheckbox = this.config.messageValueMissingCheckbox || 'Dit veld is verplicht.';
    this.config.messageValueMissingRadio = this.config.messageValueMissingRadio || 'Kies een waarde.';
    this.config.messageValueMissingSelect = this.config.messageValueMissingSelect || 'Selecteer een waarde.';
    this.config.messageValueMissingSelectMulti = this.config.messageValueMissingSelectMulti || 'Selecteer minstens één waarde.';
    this.config.messageTypeMismatchEmail = this.config.messageTypeMismatchEmail || 'Vul een correct e-mailadres in.';
    this.config.messageTypeMismatchURL = this.config.messageTypeMismatchURL || 'Vul een website in.';
    this.config.messageTooShort = this.config.messageTooShort || 'Gebruik minimaal {minLength} karakters. Op dit moment gebruik je {length} karakter(s).';
    this.config.messageTooLong = this.config.messageTooLong || 'Het is niet toegestaan meer dan {maxLength} karakters te gebruiken. Op dit moment gebruik je {length} karakter(s).';
    this.config.messagePatternMismatch = this.config.messagePatternMismatch || 'Dit veld voldoet niet aan de eisen.';
    this.config.messageBadInput = this.config.messageBadInput || 'Vul een nummer in.';
    this.config.messageStepMismatch = this.config.messageStepMismatch || 'Vul een correcte waarde in.';
    this.config.messageRangeOverflow = this.config.messageRangeOverflow || 'Vul een waarde in dat lager is dan {max}.';
    this.config.messageRangeUnderflow = this.config.messageRangeUnderflow || 'Vul een waarde in dat hoger is dan {min}.';
    this.config.messageGeneric = this.config.messageGeneric || 'Dit veld is niet correct ingevuld.';

    this.init();
  };

  formvalidation.prototype.init = function() {
    // feature test
    // if (!supports()) return;

    // Add the `novalidate` attribute to all forms
    this.addNoValidate();

    // Event listeners
    this.element.addEventListener('blur', function (e) { this.blurHandler(e) }.bind(this), true);
    this.element.addEventListener('click', function (e) { this.clickHandler(e) }.bind(this), false);
    this.element.addEventListener('submit', function (e) { this.submitHandler(e) }.bind(this), false);

  };

  formvalidation.prototype.addNoValidate = function () {
    this.element.setAttribute('novalidate', true);
  };

  formvalidation.prototype.getClosest = function (elem, selector) {
    for (; elem && elem !== document; elem = elem.parentNode) {
      if (elem.matches(selector)) return elem;
    }
    return null;
  };

  formvalidation.prototype.hasError = function (field, options) {
    // Don't validate submits, buttons, file and reset inputs, and disabled fields
    if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button' || field.type === undefined || field.type === 'fieldset' || field.type === 'a' || field.type === '') return;

    // Get validity
    var validity = field.validity;

    // in case of use of default patterns (number, email, dutch zipcode)
    if (field.getAttribute('data-pattern-type')) {
      if (field.getAttribute('data-pattern-type') === 'number') {
        var pattern = /^\d+$/;
      }
      if (field.getAttribute('data-pattern-type') === 'email') {
        var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      }
      if (field.getAttribute('data-pattern-type') === 'zipcode') {
        var pattern = /^\d{4} ?[a-z]{2}$/i;
      }
      if (pattern.test(field.value)) {
        return;
      } else {
        if (field.value === '') {
          return this.config.messageValueMissing;
        }
        if (field.hasAttribute('title')) return field.getAttribute('title');
        return this.config.messagePatternMismatch;
      }
    }

    // If valid, return null
    if (validity.valid) return;

    // If field is required and empty
    if (validity.valueMissing) {
      if (field.type === 'checkbox') return this.config.messageValueMissingCheckbox;
      if (field.type === 'radio') return this.config.messageValueMissingRadio;
      if (field.type === 'select-multiple') return this.config.messageValueMissingSelectMulti;
      if (field.type === 'select-one') return this.config.messageValueMissingSelect;

      return this.config.messageValueMissing;
    }

    // If not the right type
    if (validity.typeMismatch) {
      if (field.type === 'email') return this.config.messageTypeMismatchEmail;
      if (field.type === 'url') return this.config.messageTypeMismatchURL;
    }

    // If too short
    if (validity.tooShort) return this.config.messageTooShort.replace('{minLength}', field.getAttribute('minLength')).replace('{length}', field.value.length);

    // If too long
    if (validity.tooLong) return this.config.messageTooLong.replace('{minLength}', field.getAttribute('maxLength')).replace('{length}', field.value.length);

    // If number input isn't a number
    if (validity.badInput) return this.config.messageBadInput;

    // If a number value doesn't match the step interval
    if (validity.stepMismatch) return this.config.messageStepMismatch;

    // If a number field is over the max
    if (validity.rangeOverflow) return this.config.messageRangeOverflow.replace('{max}', field.getAttribute('max'));

    // If a number field is below the min
    if (validity.rangeUnderflow) return this.config.messageRangeUnderflow.replace('{min}', field.getAttribute('min'));

    // If pattern doesn't match
    if (validity.patternMismatch) {

      // If pattern info is included, return custom error
      if (field.hasAttribute('title')) return field.getAttribute('title');

      // Otherwise, generic error
      return this.config.messagePatternMismatch;

    }

    // If all else fails, return a generic catchall error
    return this.config.messageGeneric;

  };

  formvalidation.prototype.showError = function (field, error, options) {
    var firstOptionId;

    // Add error class to field
    if (field.type === 'select-one'){
      field.parentNode.classList.add(this.config.classField);
    } else {
      field.classList.add(this.config.classField);
    }

    console.log('showError field type', field.type);

    // If the field is a radio button and part of a group, error all and get the last item in the group
    if (field.type === 'radio' && field.name) {
      var group = document.getElementsByName(field.name);
      if (group.length > 0) {
        for (var i = 0; i < group.length; i++) {
          if (group[i].form !== field.form) continue; // Only check fields in current form
          group[i].classList.add(this.config.classField);

          // if type = radio, get id of first radio
          if(i === 0){
            firstOptionId = group[i].getAttribute('id');
          }
        }
        field = group[group.length - 1];
      }
    }

    if (this.getClosest(field, '.subselection')) {

    }


    // Get field id or name
    var id = field.id || field.name;
    if (!id) return;

    // Check if error message field already exists
    // If not, create one
    var message = field.form.querySelector('.' + this.config.errorContainer + '#error-for-' + id);
    var labelText;
    var motherLabel;

    if (!message) {
      message = document.createElement('div');
      message.classList.add(this.config.errorContainer);
      message.id = 'error-for-' + id;

      // If the field is a radio button or checkbox, insert error after the label
      var label;
      if (field.type === 'radio' || field.type === 'checkbox') {
        if (this.getClosest(field, '.subselection')) {
          var sub = this.getClosest(field, '.subselection');
          label = sub.querySelector('.subselection__trigger');
          firstOptionId = label.getAttribute('id');
        } else {
          label = field.form.querySelector('label[for="' + id + '"]') || this.getClosest(field, 'label');
        }

        if (label) {
          label.parentNode.insertBefore(message, label.nextSibling);
          motherLabel = this.getClosest(field, '[data-radiogroup-title]');
          if (motherLabel) {
            labelText = motherLabel.getAttribute('data-radiogroup-title');
          } else {
            labelText = label.textContent;
          }
        }
      }

      if (field.type === 'select-one') {
        label = field.form.querySelector('label[for="' + id + '"]') || this.getClosest(field, 'label');
        if (label) {
          var parent = field.parentNode;
          parent.parentNode.insertBefore(message, parent.nextSibling);
          labelText = label.textContent;
        }
      }

      // Otherwise, insert it after the field
      if (!label) {
        field.parentNode.insertBefore(message, field.nextSibling);
        labelText = field.parentNode.querySelector('label').textContent;
      }
    } else {
      if (field.type === 'radio' || field.type === 'checkbox') {
        if (this.getClosest(field, '.subselection')) {
          var sub = this.getClosest(field, '.subselection');
          label = sub.querySelector('.subselection__trigger');
          firstOptionId = label.getAttribute('id');
        } else {
          label = field.form.querySelector('label[for="' + id + '"]') || this.getClosest(field, 'label');
        }
        motherLabel = this.getClosest(field, '[data-radiogroup-title]');
        if (motherLabel) {
          labelText = motherLabel.getAttribute('data-radiogroup-title');
        } else {
          labelText = label.textContent;
        }
      } else if (field.type === 'select-one') {
        label = field.form.querySelector('label[for="' + id + '"]') || this.getClosest(field, 'label');
        if (label) {
          var parent = field.parentNode;
          parent.parentNode.insertBefore(message, parent.nextSibling);
          labelText = label.textContent;
        }
      } else {
        labelText = field.parentNode.querySelector('label').textContent;
      }
    }

    if (firstOptionId){
      this.errors.push({ "id": firstOptionId, "label": labelText, "error": error });
    } else {
      this.errors.push({ "id": field.getAttribute('id'), "label": labelText, "error": error });
    }

    // Add ARIA role to the field
    field.setAttribute('aria-describedby', 'error-for-' + id);

    // Update error message
    message.innerHTML = error;

    // Remove any existing styles hiding the error message
    message.style.display = '';
    message.style.visibility = '';

    // After show error callback
    // this.config.afterShowError(field, error);

  };

  formvalidation.prototype.markFieldValidInSummary = function (field, options) {
    var fieldId;

    if(field.type === "button" && this.getClosest(field, '.subselection')){
      // is subselection
      var sub = this.getClosest(field, '.subselection');
      var subTrigger = sub.querySelector('.subselection__trigger');
      fieldId = subTrigger.getAttribute('id');
    } else {
      if (field.type === 'radio' && field.name) {
        var group = document.getElementsByName(field.name);
        if (group.length > 0) {
          for (var i = 0; i < group.length; i++) {
            if (group[i].form !== field.form) continue; // Only check fields in current form
            group[i].classList.remove(this.config.classField);
          }
          field = group[0];
        }
      }
      fieldId = field.getAttribute('id')
    }
    var errorsContainerListItems = this.element.querySelectorAll('.' + this.config.errorsContainer + '> ul li');
    for (var i = 0; i < errorsContainerListItems.length; i++){
      if (errorsContainerListItems[i].getAttribute('data-id') === fieldId) {
        errorsContainerListItems[i].classList.add('line-through');
      }
    }
  }
  formvalidation.prototype.markFieldValid = function (field, options) {
    field.classList.add('is-valid');
  }

  formvalidation.prototype.removeError = function (field, options) {

    // Remove ARIA role from the field
    field.removeAttribute('aria-describedby');

    // Remove error class to field
    if (field.type === 'select-one') {
      field.parentNode.classList.remove(this.config.classField);
    } else {
      field.classList.remove(this.config.classField);
    }


    // If the field is a radio button and part of a group, remove error from all and get the last item in the group
    if (field.type === 'radio' && field.name) {
      var group = document.getElementsByName(field.name);
      if (group.length > 0) {
        for (var i = 0; i < group.length; i++) {
          if (group[i].form !== field.form) continue; // Only check fields in current form
          group[i].classList.remove(this.config.classField);
        }
        field = group[group.length - 1];
      }
    }

    // Get field id or name
    var id = field.id || field.name;
    if (!id) return;

    // Check if an error message is in the DOM
    var message = field.form.querySelector('.' + this.config.errorContainer + '#error-for-' + id + '');
    if (!message) return;

    // If so, hide it
    message.innerHTML = '';

    message.style.display = 'none';
    message.style.visibility = 'hidden';

    // After remove error callback
    // this.config.afterRemoveError(field);

  };

  formvalidation.prototype.blurHandler = function (event) {
    var type = event.target.nodeName;
    if ((type === 'DIV' || type === 'A')) return;

    // Validate the field
    var error = this.hasError(event.target);

    // If there's an error, show it
    if (error) {
      this.showError(event.target, error);
      return;
    }

    // Otherwise, remove any errors that exist
    this.removeError(event.target);
    this.markFieldValid(event.target);
    this.markFieldValidInSummary(event.target);
  };

  formvalidation.prototype.clickHandler = function (event) {

    // Only run if the field is a checkbox or radio
    var type = event.target.getAttribute('type');
    if (!(type === 'checkbox' || type === 'radio')) return;

    // Validate the field
    var error = this.hasError(event.target);

    // If there's an error, show it
    if (error) {
      this.showError(event.target, error);
      return;
    }

    // Otherwise, remove any errors that exist
    this.removeError(event.target);
    this.markFieldValidInSummary(event.target);

  };

  formvalidation.prototype.removeErrorFromErrors = function (id) {
    var id = id;

    this.errors = this.errors.filter(function (obj) {
      return obj.id !== id;
    });
  }
  formvalidation.prototype.pushErrorToErrors = function (el, error) {
    var id = el.getAttribute('id');
    this.errors = this.errors.filter(function (obj) {
      return obj.id !== id;
    });

    var label = el.parentNode.querySelector('label').innerHTML || 'label';
    this.errors.push({ "id": el.getAttribute('id'), "label": label, "error": error });
  }

  formvalidation.prototype.addErrorToErrors = function (el, error) {
    var id = id;

    this.pushErrorToErrors(el, error);
    this.showErrorSummary();
  }

  formvalidation.prototype.showErrorSummary = function () {
    var errorsContainer = this.element.querySelector('.' + this.config.errorsContainer);

    if (!errorsContainer) {
      errorsContainer = document.createElement('div');
      errorsContainer.setAttribute('tabindex', '0')
      errorsContainer.classList.add(this.config.errorsContainer, 'well');
      this.element.insertBefore(errorsContainer, this.element.childNodes[0]);

      var errorsContainerIntro = document.createElement('p');
      errorsContainerIntro.innerHTML = this.config.errorsContainerIntro || 'Er zijn één of meerdere velden niet of niet juist ingevuld. Controleer uw gegevens en verstuur het formulier opnieuw.';
      errorsContainer.appendChild(errorsContainerIntro);

      var errorsContainerList = document.createElement('ul');
      errorsContainer.appendChild(errorsContainerList);
    } else {
      var errorsContainerList = this.element.querySelector('.' + this.config.errorsContainer + '> ul');
    }

    errorsContainerList.innerHTML = '';

    // clean up errors; remove duplicates.
    this.errors = onl.ui.uniqBy(this.errors, JSON.stringify);
    for(var i = 0; i < this.errors.length; i++){
      this.appendErrorToErrorsList(this.errors[i]);
    }
  }

  formvalidation.prototype.appendErrorToErrorsList = function (error) {
    var errorsContainerList = this.element.querySelector('.' + this.config.errorsContainer + '> ul');
    if (errorsContainerList){
      var item = document.createElement('li');
      var id = error.id || error.getAttribute('id');
      item.setAttribute('data-id', id);

      var link = document.createElement('a');
      link.setAttribute('href', '#'+id);
      link.innerHTML = '<span class="visually-hidden">Spring naar veld: </span>' + error.label;

      item.appendChild(link);
      errorsContainerList.appendChild(item);
    }

    //todo: check if empty;
  }


  formvalidation.prototype.submitHandler = function (event) {
    this.errors = [];

    // Get all of the form elements
    var fields = event.target.elements;

    // Validate each field
    // Store the first field with an error to a variable so we can bring it into focus later
    var hasErrors;
    for (var i = 0; i < fields.length; i++) {

      var error = this.hasError(fields[i]);
      if (error) {
        this.showError(fields[i], error);
        if (!hasErrors) {
          hasErrors = fields[i];
        }
      }
    }
    if(hasErrors){
      this.showErrorSummary(this.errors);
    }

    // Prevent form from submitting if there are errors or submission is disabled
    if (hasErrors) {
      event.preventDefault();
    }

    // If there are errrors, focus on first element with error
    if (hasErrors) {
      var errorsContainer = this.element.querySelector('.' + this.config.errorsContainer);
      errorsContainer.focus();
      return;
    }

    // Otherwise, submit the form
    if (this.config.doSubmit){
      console.log('SUBMIT!');
    } else {
      event.preventDefault();
      console.log('SUBMIT! (not)');
    }

  };

})();
