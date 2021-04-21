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
  if (!document.addEventListener && !document.querySelector('body')) {
    return false;
  }
  return true;
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
    this.config.classErrorField = this.config.classErrorField || 'has-error';
    this.config.classValidField = this.config.classValidField || 'is-valid';
    this.config.classErrorContainer = this.config.classErrorContainer || 'form__error';
    this.config.classValidContainer = this.config.classValidContainer || 'form__success';
    this.config.classErrorsContainer = this.config.classErrorsContainer || 'form__errors';

    this.errors = [];

    this.config.txtIntroErrorsContainer = this.config.txtIntroErrorsContainer || 'Er zijn één of meerdere velden niet of niet juist ingevuld. Controleer uw gegevens en verstuur het formulier opnieuw.';
    this.config.messageLabelValid = this.config.messageLabelValid || "Correct ingevuld";

    // Messages
    this.config.messageValueMissing = this.config.messageValueMissing || "Het veld '{label}' mag niet leeg zijn.";
    this.config.messageValueMissingCheckbox = this.config.messageValueMissingCheckbox || "Het veld '{label}' is verplicht.";
    this.config.messageValueMissingRadio = this.config.messageValueMissingRadio || "Kies van veld '{label}' een waarde.";
    this.config.messageValueMissingSelect = this.config.messageValueMissingSelect || "Selecteer van veld '{label}' een waarde.";
    this.config.messageValueMissingSelectMulti = this.config.messageValueMissingSelectMulti || "Selecteer van veld '{label}' minstens één waarde.";
    this.config.messageTypeMismatchEmail = this.config.messageTypeMismatchEmail || "Vul in veld '{label}' een correct e-mailadres in.";
    this.config.messageTypeMismatchURL = this.config.messageTypeMismatchURL || "Vul in veld '{label}' een correct website-adres in.";
    this.config.messageTooShort = this.config.messageTooShort || "Gebruik in veld '{ label }' minimaal {minLength} karakters. Op dit moment gebruik je {length} karakter(s).";
    this.config.messageTooLong = this.config.messageTooLong || "Het is in veld '{label}' niet toegestaan meer dan {maxLength} karakters te gebruiken. Op dit moment gebruik je {length} karakter(s).";
    this.config.messagePatternMismatch = this.config.messagePatternMismatch || "Het veld '{label}' voldoet niet aan de eisen.";
    this.config.messageBadInput = this.config.messageBadInput || "Vul in veld '{label}' een nummer in.";
    this.config.messageStepMismatch = this.config.messageStepMismatch || "Vul in veld '{label}' een correcte waarde in.";
    this.config.messageRangeOverflow = this.config.messageRangeOverflow || "Vul in veld '{label}' een waarde in dat lager is dan {max}.";
    this.config.messageRangeUnderflow = this.config.messageRangeUnderflow || "Vul in veld '{label}' een waarde in dat hoger is dan {min}.";
    this.config.passwordMismatch = this.config.passwordMismatch || "Het veld '{label}' voldoet niet aan de beveiligingseisen.";
    this.config.passwordRepeatMismatch = this.config.passwordRepeatMismatch || "Het wachtwoord in veld '{label}' is niet gelijk aan het nieuwe wachtwoord.";
    this.config.messageGeneric = this.config.messageGeneric || "Het veld '{label}' is niet correct ingevuld.";

    this.init();
  };

  formvalidation.prototype.init = function() {
    // feature test
    if (!supports()) return;

    // Add the `novalidate` attribute to all forms
    this.addNoValidate();

    // Event listeners
    this.element.addEventListener('change', function (e) { this.blurHandler(e) }.bind(this), true); // for custom-select;
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

  formvalidation.prototype.hasErrorInSubselection = function (subselection, options) {
    var subselectionSummary = subselection.querySelector('.subselection__summary');

    // check if it's required;
    if (subselectionSummary.classList.contains('required')){

      // check if it has active filters;
      var subselectionSummaryItems = subselectionSummary.childNodes;
      if (subselectionSummaryItems.length > 0) {
        return false;
      } else {
        return this.config.messageValueMissing;
      }
    }
    return false;
  }

  formvalidation.prototype.hasError = function (field, options) {
    // Don't validate submits, buttons, file and reset inputs, and disabled fields
    if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button' || field.type === undefined || field.type === 'fieldset' || field.type === 'a' || field.type === '') return;

    // Get validity
    var validity = field.validity;
    
    var label = this.element.querySelector('[for="' + field.getAttribute('id') + '"]');
    if(label){
      label = label.innerHTML;
    } else {
      label = '';
    }

    // If field is invalid by extern validation (ie. password validator)
    if (field.classList.contains('pw-invalid')) return this.config.passwordMismatch.replace("{label}", label);
    if (field.classList.contains('pw-invalid-repeat')) return this.config.passwordRepeatMismatch.replace("{label}", label);

    // console.log('field', field);
    if (field.classList.contains('datepicker__input')) {
      if(this.validateDate(field)) {
        return;
      } else {
        if (field.value === '') {
          return this.config.messageValueMissing.replace('{label}', label);
        }
        if (field.hasAttribute('title')) return field.getAttribute('title');
        return this.config.messagePatternMismatch.replace('{label}', label);
      }
    }


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
          return this.config.messageValueMissing.replace('{label}', label);
        }
        if (field.hasAttribute('title')) return field.getAttribute('title');
        return this.config.messagePatternMismatch.replace('{label}', label);
      }
    }

    // If valid, return null
    if (validity.valid) return;

    // If field is required and empty
    if (validity.valueMissing) {
      if (field.type === 'checkbox') {
        if(!field.checked) {
          return this.config.messageValueMissingCheckbox.replace('{label}', label);
        } else {
          return;
        }
      }
      if (field.type === 'radio') return this.config.messageValueMissingRadio.replace('{label}', label);
      if (field.type === 'select-multiple') return this.config.messageValueMissingSelectMulti.replace('{label}', label);
      if (field.type === 'select-one') return this.config.messageValueMissingSelect.replace('{label}', label);

      return this.config.messageValueMissing.replace('{label}', label);
    }

    // If not the right type
    if (validity.typeMismatch) {
      if (field.type === 'email') return this.config.messageTypeMismatchEmail.replace('{label}', label);;
      if (field.type === 'url') return this.config.messageTypeMismatchURL.replace('{label}', label);;
    }

    // If too short
    if (validity.tooShort) return this.config.messageTooShort.replace('{minLength}', field.getAttribute('minLength')).replace('{length}', field.value.length).replace('{label}', label);;

    // If too long
    if (validity.tooLong) return this.config.messageTooLong.replace('{minLength}', field.getAttribute('maxLength')).replace('{length}', field.value.length).replace('{label}', label);;

    // If number input isn't a number
    if (validity.badInput) return this.config.messageBadInput.replace('{label}', label);;

    // If a number value doesn't match the step interval
    if (validity.stepMismatch) return this.config.messageStepMismatch.replace('{label}', label);;

    // If a number field is over the max
    if (validity.rangeOverflow) return this.config.messageRangeOverflow.replace('{max}', field.getAttribute('max')).replace('{label}', label);;

    // If a number field is below the min
    if (validity.rangeUnderflow) return this.config.messageRangeUnderflow.replace('{min}', field.getAttribute('min')).replace('{label}', label);;

    // If pattern doesn't match
    if (validity.patternMismatch) {

      // If pattern info is included, return custom error
      if (field.hasAttribute('title')) return field.getAttribute('title').replace('{label}', label);;

      // Otherwise, generic error
      return this.config.messagePatternMismatch.replace('{label}', label);;

    }

    // If all else fails, return a generic catchall error
    return this.config.messageGeneric.replace('{label}', label);;

  };

  formvalidation.prototype.validateDate = function (field) {
    var dateString = field.value;

    // First check for the pattern
    if(!/^\d{1,2}\-\d{1,2}\-\d{4}$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("-");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
  }

  formvalidation.prototype.showErrorSubselection = function (subselection) {
    var subselectionTrigger = subselection.querySelector('.subselection__trigger');
    var label = subselection.parentNode.querySelector('.form__sublegend');
    if(label){
      label = label.innerHTML;
    } else {
      label = '';
    }
    this.showMessage("error", subselectionTrigger, this.config.messageValueMissingCheckbox.replace('{label}', label), 'subselection');
  }
  formvalidation.prototype.showSuccessSubselection = function (subselection) {
    var subselectionTrigger = subselection.querySelector('.subselection__trigger');
    var label = subselection.parentNode.querySelector('.form__sublegend');
    if(label){
      label = label.innerHTML;
    } else {
      label = '';
    }
    this.showMessage("success", subselectionTrigger, this.config.messageLabelValid, 'subselection');
  }

  formvalidation.prototype.showMessage = function (messageType, field, error, options) {
    /*
      Available values:
      messageType: "error", "success".
    */
    var firstOptionId = false;
    var labelText;
    var motherLabel;
    var message;
    var label;

    var subselection = this.getClosest(field, '.subselection');
    if (subselection) {
      this.removeMessage(field, subselection);
    } else {
      this.removeMessage(field);
    }

    var classStateOldField = this.config.classValidField;
    var classStateNewField = this.config.classErrorField;
    var classMessageContainer = this.config.classErrorContainer;
    var prefixId = 'message';
    var ariavaliditystate = true;
    if(messageType === "success") {
      classStateOldField = this.config.classErrorField;
      classStateNewField = this.config.classValidField;
      classMessageContainer = this.config.classValidContainer;
      prefixId = 'message';
      ariavaliditystate = false;
      // return;
    }

    
    // Add/remove state class to field
    if (field.type === 'select-one'){
      field.parentNode.classList.add(classStateNewField);
      field.parentNode.classList.remove(classStateOldField);
      field.parentNode.setAttribute('aria-invalid', ariavaliditystate);
      // console.log('if ariavaliditystate',ariavaliditystate);
    } else {
      field.classList.add(classStateNewField);
      field.classList.remove(classStateOldField);
      field.setAttribute('aria-invalid', ariavaliditystate);
    }

    // If the field is a radio button and part of a group, error all and get the last item in the group
    if (field.type === 'radio' && field.name) {
      var group = document.getElementsByName(field.name);
      if (group.length > 0) {
        for (var i = 0; i < group.length; i++) {
          if (group[i].form !== field.form) continue; // Only check fields in current form

          if (messageType !== "success") {
            group[i].classList.add(this.config.classErrorField);
            group[i].classList.remove(this.config.classValidField);
          }

          // if type = radio, get id of first radio
          if(i === 0){
            firstOptionId = group[i].getAttribute('id');
          }
        }
        field = group[group.length - 1];
      }
    }

    // Get field id or name
    var id;
    if (subselection) {
      var trigger = subselection.querySelector('.subselection__trigger');
      trigger.setAttribute('aria-invalid', ariavaliditystate);
      id = trigger.getAttribute('id');
    } else {
      id = field.id || field.name;
    }

    if (!id) return;

    // create message container;
    message = document.createElement('div');
    message.classList.add('form__message');
    message.classList.add(classMessageContainer);
    message.id = prefixId + '-for-' + id;

    // If the field is a radio button or checkbox, insert error after the label
    if (field.type === 'radio' || field.type === 'checkbox') {
      if (subselection) {
        label = subselection.querySelector('.subselection__trigger');
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

    // if custom-select; insert one level higher.
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

      // options = given in function;
      if(options === 'subselection'){
        labelText = field.textContent;
      } else {
        var parent = field.parentNode;
        if(field.parentNode.classList.contains('datepicker')){
          parent = parent.parentNode;
        }
        labelText = parent.querySelector('label').textContent;
        }
    }

    // if subselection, use different ID;
    if (firstOptionId){
      this.errors.push({ "id": firstOptionId, "label": labelText });
    } else {
      // all others;
      this.errors.push({ "id": field.getAttribute('id'), "label": labelText });
    }

    // console.log('this.errors',this.errors);

    // Add ARIA role to the field
    field.setAttribute('aria-describedby', prefixId + '-for-' + id);

    // Fill state container
    message.innerHTML = error;

  };

  formvalidation.prototype.markFieldValidInSummary = function (field, options) {
    var fieldId;

    var sub = this.getClosest(field, '.subselection');
    if(sub){
      // is subselection
      var subTrigger = sub.querySelector('.subselection__trigger');
      fieldId = subTrigger.getAttribute('id');
    } else {
      if (field.type === 'radio' && field.name) {
        var group = document.getElementsByName(field.name);
        if (group.length > 0) {
          for (var i = 0; i < group.length; i++) {
            if (group[i].form !== field.form) continue; // Only check fields in current form
            group[i].classList.remove(this.config.classErrorField);
          }
          field = group[0];
        }
      }
      fieldId = field.getAttribute('id')
    }
    var errorsContainerListItems = this.element.querySelectorAll('.' + this.config.classErrorsContainer + '> ul li');
    for (var i = 0; i < errorsContainerListItems.length; i++){
      if (errorsContainerListItems[i].getAttribute('data-id') === fieldId) {
        errorsContainerListItems[i].childNodes[0].classList.add('line-through');
      }
    }
  }

  // formvalidation.prototype.markFieldValid = function (field, options) {
    // field.classList.add('is-valid');
  // }


  formvalidation.prototype.removeFieldValid = function(field) {
    var id = field.getAttribute('id');
    var message = this.element.querySelector("#message-for-" + id);
    message.parentNode.removeChild(message);
  }

  formvalidation.prototype.removeMessage = function (field, subselection, options) {

    // Remove ARIA role from the field
    field.removeAttribute('aria-describedby');

    // Remove error class to field
    if (field.type === 'select-one') {
      field.parentNode.classList.remove(this.config.classErrorField);
      field.parentNode.classList.remove(this.config.classValidField);
    } else {
      field.classList.remove(this.config.classErrorField);
      field.classList.remove(this.config.classValidField);
    }


    // If the field is a radio button and part of a group, remove error from all and get the last item in the group
    if (field.type === 'radio' && field.name) {
      var group = document.getElementsByName(field.name);
      if (group.length > 0) {
        for (var i = 0; i < group.length; i++) {
          if (group[i].form !== field.form) continue; // Only check fields in current form
          group[i].classList.remove(this.config.classErrorField);
        }
        field = group[group.length - 1];
      }
    }

    // Get field id or name
    // var id = field.id || field.name;
    // if (!id) return;

    // Check if an error message is in the DOM
    var message;
    if (subselection) {
      message = subselection.querySelector('.form__message');
    } else {
      message = this.element.querySelector('#message-for-' + field.id);
    }

    if (!message) return;

    // remove error div from DOM;
    message.parentNode.removeChild(message);
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
    var errorsContainer = this.element.querySelector('.' + this.config.classErrorsContainer);

    if (!errorsContainer) {
      errorsContainer = document.createElement('div');
      errorsContainer.setAttribute('tabindex', '0')
      errorsContainer.classList.add(this.config.classErrorsContainer);
      this.element.insertBefore(errorsContainer, this.element.childNodes[0]);

      var errorsContainerIntro = document.createElement('p');
      errorsContainerIntro.classList.add('form__errors__heading');
      errorsContainerIntro.innerHTML = this.config.txtIntroErrorsContainer;
      errorsContainer.appendChild(errorsContainerIntro);

      var errorsContainerList = document.createElement('ul');
      errorsContainer.appendChild(errorsContainerList);
    } else {
      var errorsContainerList = this.element.querySelector('.' + this.config.classErrorsContainer + '> ul');
    }

    errorsContainerList.innerHTML = '';

    // clean up errors; remove duplicates.
    this.errors = onl.ui.uniqBy(this.errors, JSON.stringify);
    for (var i = 0; i < this.errors.length; i++) {
      this.appendErrorToErrorsList(this.errors[i]);
    }
  }

  formvalidation.prototype.isRequired = function (field) {
    // regular fields;
    if (field.hasAttribute('required')) {
      return true;
    }

    // subselection;
    var subselection = self.getClosest(field, '.subselection');
    if (subselection) {
      var subselectionRequiredState = subselection.querySelector('.subselection__summary.required');
      if (subselectionRequiredState) {
        return true;
      }
    }

    return false;
  }

  formvalidation.prototype.blurHandler = function (event) {
    var type = event.target.nodeName;

    if (event.target.type === 'submit' || type === 'DIV') return;

    if (type === 'BUTTON') {

    } else  if (type === 'A'){
    } else {
      // Validate the field
      var error = this.hasError(event.target);

      // If there's an error, show it
      if (error) {
        this.showMessage("error", event.target, error);
        return;
      } else {
        if(event.target.hasAttribute('data-pattern-type') || event.target.hasAttribute('pattern')){
          this.showMessage("success", event.target, this.config.messageLabelValid);
          return;
        }
      }

      if (this.isRequired(event.target)) {
        this.showMessage("success", event.target, this.config.messageLabelValid);
        this.markFieldValidInSummary(event.target);
      }

    }
  };

  formvalidation.prototype.clickHandler = function (event) {
    if ("createEvent" in document) {
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("keyup", false, true);
      event.target.dispatchEvent(evt);
    } else {
      event.target.fireEvent("keyup");
    }
    // Only run if the field is a checkbox or radio
    var self = this;
    var type = event.target.getAttribute('type');
    if (type == null) {
      type = event.target.tagName;
    }

    
    // if (type === 'button') {
    if (this.isRequired(event.target)) {
      
      // check if subselection;
      var subselection = this.getClosest(event.target, '.subselection');
      if(subselection) {
        if(!event.target.classList.contains('subselection__trigger')) {
          if ((type === 'checkbox' || type === 'radio')) {
            setTimeout(function(){
              var error = self.hasErrorInSubselection(subselection);
              if (error != false) {
                self.showErrorSubselection(subselection);
              } else {
                self.showSuccessSubselection(subselection);
              }
            },100);
          } else {
            var error = self.hasErrorInSubselection(subselection);
            if (error != false) {
              self.showErrorSubselection(subselection);
            } else {
              self.showSuccessSubselection(subselection);
            }
          }
          return;
        }
      }
      
      
      if(event.target.getAttribute('data-handler') === 'close-modal'){
        
        var subselection = this.getClosest(event.target, '.subselection');
        var error = self.hasErrorInSubselection(subselection);
        if (error) {
          self.showErrorSubselection(subselection);
        } else {
          self.showSuccessSubselection(subselection);
        }
      }
    }
      // }

      if (type === 'A') {
        // if event.target is the remove-trigger for the subselection component (removes selected filter)
        if (event.target.classList.contains('subselection__summaryitem__remove')) {
          
          var subselectionId = event.target.getAttribute('data-subselection-id');
          var subselection = this.element.querySelector('[data-id="'+subselectionId+'"');
          // var summary = subselection.querySelector('.subselection__summary');
          var error = self.hasErrorInSubselection(subselection);

          if (error) {
            self.showErrorSubselection(subselection);
          } else {
            self.showMessage("success", event.target, subselection);
          }
          return;
        }
        
        
        // if (event.target.classList.contains('formreset-resetlink')) {
        //   var subselection = this.getClosest(event.target, '.subselection');
        //   var error = self.hasErrorInSubselection(subselection);

        //   if (error) {
        //     self.showErrorSubselection(subselection);
        //   } else {
        //     self.showMessage("success", event.target, subselection);
        //   }
        // }
        // console.log('hier return?');
        
      }
    
    if (!(type === 'checkbox' || type === 'radio')) return;
    

    // Validate the field
    var error = this.hasError(event.target);

    // If there's an error, show it
    if (error) {
      this.showMessage("error", event.target, error);
      return;
    }

    // Otherwise, remove any errors that exist
    if(this.isRequired(event.target)){
      this.showMessage("success", event.target, this.config.messageLabelValid);
      this.markFieldValidInSummary(event.target);
    }

  };



  formvalidation.prototype.appendErrorToErrorsList = function (error) {
    var errorsContainerList = this.element.querySelector('.' + this.config.classErrorsContainer + '> ul');
    var errorMsg = error.label;

    errorMsg = errorMsg.replace("Verplicht", '');

    if (errorsContainerList){
      var item = document.createElement('li');
      var id = error.id || error.getAttribute('id');
      item.setAttribute('data-id', id);

      var link = document.createElement('a');
      link.setAttribute('href', '#'+id);
      link.innerHTML = '<span class="visually-hidden">Spring naar veld: </span>' + errorMsg;

      item.appendChild(link);
      errorsContainerList.appendChild(item);
    }

    //todo: check if empty; <- why?
  }


  formvalidation.prototype.submitHandler = function (event) {
    //reset form;
    this.errors = [];

    // Get all of the form elements
    var fields = event.target.elements;
    var subselections = this.element.querySelectorAll('.subselection__summary.required');

    // Validate each subselection field
    var hasErrors;
    for (var y = 0; y < subselections.length; y++) {
      if (subselections[y].innerHTML === ''){
        this.showErrorSubselection(subselections[y].parentNode);
        if (!hasErrors) {
          hasErrors = subselections[y];
        }
      }
    }

    // Validate each field
    // Store the first field with an error to a variable so we can bring it into focus later
    for (var i = 0; i < fields.length; i++) {

      var error = this.hasError(fields[i]);
      if (error) {
        // console.log('in submitHandler');
        this.showMessage("error", fields[i], error);
        if (!hasErrors) {
          hasErrors = fields[i];
        }
      }
    }
    if(hasErrors){
      // this.showErrorSummary(this.errors);
    }

    // Prevent form from submitting if there are errors or submission is disabled
    if (hasErrors) {
      event.preventDefault();
    }

    // If there are errrors, focus on first element with error
    if (hasErrors) {
      // var errorsContainer = this.element.querySelector('.' + this.config.classErrorsContainer);
      // errorsContainer.focus();
      var firstError = this.element.querySelectorAll('.form__error')[0];
      var firstErrorId = firstError.getAttribute('id');
      this.element.querySelector('[aria-describedby="'+firstErrorId+'"]').focus();
      return;
    }

    // Otherwise, submit the form
    if (this.config.debug){
      // event.preventDefault();
      console.log('debug: Form submit');
    } else {
      // event.preventDefault();
      // console.log('prod: Form submit');
      this.element.submit();
    }

  };

})();
/*
Inspired by Go Make Things, LLC's project "validate", MIT, https://github.com/cferdinandi/validate
# The MIT License (MIT)

Copyright (c) Go Make Things, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
