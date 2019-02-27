(function() {
  'use strict';

  onl.decorate({
    'init-datepicker': function(element) {
      new datepicker(element);
    }
  });

  var datepicker = function(element) {
    this.element = element;
    this.config = JSON.parse( this.element.getAttribute( 'data-config' ) ) || [];
    // todo: make config extendable on component level.
    this.config.isTouch = onl.ui.isTouch();
    this.config.months = [ 'januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december' ];

    if ( !this.config.isTouch ) {
      this.initDatepicker( element );
    } else {
      $(element).on('change', function () {
        this.setAttribute('data-date', moment(this.value, 'YYYY-MM-DD').format(this.getAttribute('data-date-format')));
      }).trigger('change');
    }
  };

  datepicker.prototype.initDatepicker = function(element) {
    // datepicker config
    $(element).attr('type', 'text').datepicker({
      dateFormat: this.config.dateFormat || 'dd-mm-yy',
      showOn: 'button',
      changeYear: true,
      buttonImageOnly: false,
      buttonText: 'Toon kalender',
      monthNames: this.config.months,
      dayNamesMin: ['M', 'D', 'W', 'D', 'V', 'Z', 'Z'],
      dayNamesShort: ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'],
      showButtonPanel: true,
      closeText: 'Sluiten',
      onClose: this.removeAria.bind(this),
      beforeShow: function(input, inst) {
        inst.dpDiv.css({ marginTop: input.offsetHeight / 2 + 'px' });
      }
    });
    $(element).val($(element).data('date'));

    $('.ui-datepicker-trigger').attr('aria-describedby', 'datepickerLabel');

    // let's go.
    this.activateTrigger();
  },
  datepicker.prototype.activateTrigger = function() {
    var _this = this;

    // Unbinding the keyup event is required to work around the issue where the
    // datepicker automatically opens after the last number has been entered. Eg. when
    // entering 10-10-1965, as soon as the '5' is inserted, the datepicker opens without
    // appropriate styling. This change does not prevent the datepicker from updating
    // when typing inside the input box and thus remains accessible.
    $('.datepicker__input').unbind('keyup');

    $('.ui-datepicker-trigger').click(function() {
      setTimeout(function() {
        var today = $( '.ui-datepicker-today a' )[0];

        if ( !today ) {
          today = $( '.ui-state-active' )[0] ||
            $( '.ui-state-default' )[0];
        }

        today.focus();

        // Hide the entire page (except the date picker)
        // from screen readers to prevent document navigation
        // (by headings, etc.) while the popup is open
        $( 'main' ).attr( 'id', 'dp-container' );
        $( '#dp-container' ).attr( 'aria-hidden', 'true' );
        $( '#skipnav' ).attr( 'aria-hidden', 'true' );

        // Hide the "today" button because it doesn't do what
        // you think it supposed to do
        $( '.ui-datepicker-current' ).hide();

        _this.initiatePicker();

        $(document).on( 'click', '#ui-datepicker-div .ui-datepicker-close', function() {
          _this.closeCalendar();
        });

      }, 100 );
    });
  },
  datepicker.prototype.createHeaderSummary = function() {
    // Fallback to ensure only one datepicker summary is created.
    var headerSummary = $('.ui-datepicker-summary');
    if(headerSummary.length > 0) {
      return;
    }

    var container = document.getElementById('ui-datepicker-div');
    $(container).prepend('<div class="ui-datepicker-summary"><div class="ui-datepicker-summary__year"></div><div class="ui-datepicker-summary__date"></div></div>');

    this.containerSummaryYear = $('.ui-datepicker-summary__year');
    this.containerSummaryYear.text(this.currentDate.getFullYear());
    this.containerSummaryDate = $('.ui-datepicker-summary__date');

    var formattedDate = this.currentDate.getDate() + ' ' + this.config.months[this.currentDate.getMonth()];
    this.containerSummaryDate.text(formattedDate );
  },
  datepicker.prototype.initiatePicker = function() {
    var _this = this;
    var activeDate;
    var container = document.getElementById('ui-datepicker-div');

    if (!container || !this.element) {
      return;
    }

    this.currentDate = $(this.element).datepicker( 'getDate' );

    if (this.currentDate) {
      this.createHeaderSummary();
    }

    container.setAttribute( 'role', 'application' );
    container.setAttribute( 'aria-label', 'Calendar view date-picker' );

    // The top controls
    var prev = $( '.ui-datepicker-prev', container )[0];
    var next = $( '.ui-datepicker-next', container )[0];
    var year = $( '.ui-datepicker-year', container )[0];

    // This is the line that needs to be fixed for use on pages with base URL set in head
    next.href = 'javascript:void(0)';
    prev.href = 'javascript:void(0)';
    year.href = 'javascript:void(0)';

    next.setAttribute( 'role', 'button' );
    next.removeAttribute( 'title' );
    prev.setAttribute( 'role', 'button' );
    prev.removeAttribute( 'title' );

    this.appendOffscreenMonthText( next );
    this.appendOffscreenMonthText( prev );

    // delegation won't work here for whatever reason, so we are
    // forced to attach individual click listeners to the prev /
    // next month buttons each time they are added to the DOM
    next.addEventListener( 'click', function( e ) {
      _this.handleNextClicks(e);
    }.bind( _this ), false );
    prev.addEventListener( 'click', function( e ) {
      _this.handlePrevClicks(e);
    }.bind( _this ), false );
    year.addEventListener( 'change', function( e ) {
      _this.handleYearChange(e);
    }.bind( _this ), false );

    // rewrite the text label from a 'day'.
    this.monthDayYearText();

    // Prevent keydown event listeners from being applied multiple times
    // on initialization.
    $(container).off('keydown');
    $(container).on('keydown', function(keyVent) {
      var which = keyVent.which;
      var target = keyVent.target;
      var dateCurrent = _this.getCurrentDate( container );

      if (!dateCurrent) {
        dateCurrent = $('a.ui-state-default')[0];
        _this.setHighlightState(dateCurrent, container);
      }

      switch(which) {
        // TAB
        case 9:
          keyVent.preventDefault();

          // If the shift key is pressed follow a different flow.
          if (keyVent.shiftKey) {
            if ($(target).hasClass('ui-datepicker-close')) { // Close button
              $('.ui-datepicker-prev')[0].focus();
            } else if ($(target).hasClass('ui-state-default')) { // Date link
              $('.ui-datepicker-close')[0].focus();
            } else if ($(target).hasClass('ui-datepicker-prev')) { // Previous month button
              $('.ui-datepicker-year')[0].focus();
            } else if ($(target).hasClass('ui-datepicker-year')) { // Year button
              $('.ui-datepicker-next')[0].focus();
            } else if ($(target).hasClass('ui-datepicker-next')) { // Next month button
              activeDate = $('.ui-state-highlight') || $('.ui-state-active')[0];

              if ( activeDate ) {
                activeDate.focus();
              }
            }
          } else {
            if ($(target).hasClass('ui-datepicker-close')) { // close button
              activeDate = $('.ui-state-highlight') || $('.ui-state-active')[0];
              if ( activeDate ) {
                activeDate.focus();
              }
            } else if ($(target).hasClass('ui-state-default')) {
              $( '.ui-datepicker-next' )[0].focus();
            } else if ($( target).hasClass('ui-datepicker-next')) {
              $( '.ui-datepicker-year' )[0].focus();
            } else if ($(target).hasClass('ui-datepicker-year')) {
              $( '.ui-datepicker-prev' )[0].focus();
            } else if ($(target).hasClass( 'ui-datepicker-prev' ) ) {
              $( '.ui-datepicker-close' )[0].focus();
            }
          }
          break;

        // ENTER
        case 13:
          if ($(target).hasClass('ui-state-default')) {
            setTimeout(function() {
              _this.closeCalendar();
            }, 100 );
          } else if ($(target).hasClass('ui-datepicker-year')) {
            _this.handleYearChange(target);
          } else if ($(target).hasClass('ui-datepicker-prev')) {
            _this.handlePrevClicks();
          } else if ($(target).hasClass('ui-datepicker-next')) {
            _this.handleNextClicks();
          }
          break;

        // ESCAPE
        case 27:
          keyVent.stopPropagation();
          return _this.closeCalendar();

        // SPACEBAR
        case 32:
          if ($(target).hasClass( 'ui-datepicker-prev' )) {
            _this.handlePrevClicks();
          } else if ($(target).hasClass( 'ui-datepicker-next')) {
            _this.handleNextClicks();
          }
          break;

        // PAGE UP
        case 33:
          _this.moveOneMonth( target, 'prev' );
          break;

        // PAGE DOWN
        case 34:
          _this.moveOneMonth( target, 'next' );
          break;

        // END
        case 35:
          var $daysOfMonth = $(target).closest('tbody').find('.ui-state-default');
          var lastDay = $daysOfMonth[$daysOfMonth.length - 1];
          if (lastDay) {
            lastDay.focus();
            _this.setHighlightState(lastDay, $('#ui-datepicker-div')[0]);
          }
          break;

        // LEFT ARROW
        case 37:
          if ( !$(target).hasClass( 'ui-datepicker-close' ) && $(target).hasClass( 'ui-state-default' ) ) {
            keyVent.preventDefault();
            _this.previousDay(target);
          }
          break;

        // UP ARROW
        case 38:
          if ( !$(target).hasClass( 'ui-datepicker-close' ) && $(target).hasClass( 'ui-state-default' ) ) {
            keyVent.preventDefault();
            _this.upHandler( target, container, prev );
          }
          break;

        // RIGHT ARROW
        case 39:
          if ( !$(target).hasClass( 'ui-datepicker-close' ) && $(target).hasClass( 'ui-state-default' ) ) {
            keyVent.preventDefault();
            _this.nextDay(target);
          }
          break;

        // DOWN ARROW
        case 40:
          if ( !$(target).hasClass( 'ui-datepicker-close' ) && $(target).hasClass( 'ui-state-default' ) ) {
            keyVent.preventDefault();
            _this.downHandler( target, container, next );
          }
          break;

        default:
          return;
      }

      $('.ui-datepicker-current').hide();
    });
  },
  datepicker.prototype.closeCalendar = function() {
    var container = $('#ui-datepicker-div');
    var input = this.element;

    $(container).off('keydown');
    $(input).datepicker('hide');

    input.focus();
  },
  datepicker.prototype.isOdd = function( num ) {
    return num % 2;
  },
  datepicker.prototype.moveOneMonth = function( currentDate, dir ) {
    var button = (dir === 'next')
      ? $('.ui-datepicker-next')[0]
      : $('.ui-datepicker-prev')[0];

    if (!button) {
      return;
    }

    var ENABLED_SELECTOR = '#ui-datepicker-div tbody td:not(.ui-state-disabled)';
    var $currentCells = $(ENABLED_SELECTOR);
    var currentIdx = $.inArray(currentDate.parentNode, $currentCells);

    button.click();
    var _this = this;
    setTimeout(function() {
      _this.updateHeaderElements();

      var $newCells = $(ENABLED_SELECTOR);
      var newTd = $newCells[currentIdx];
      var newAnchor = newTd && $(newTd).find('a')[0];

      while (!newAnchor) {
        currentIdx--;
        newTd = $newCells[currentIdx];
        newAnchor = newTd && $(newTd).find('a')[0];
      }

      _this.setHighlightState(newAnchor, $('#ui-datepicker-div')[0]);
      newAnchor.focus();

    }, 0);
  },
  datepicker.prototype.handleYearChange = function() {
    var _this = this;

    setTimeout(function() {
      _this.updateHeaderElements();
      _this.prepHighlightState();
      $('.ui-datepicker-next').focus();
      $(".ui-datepicker-current").hide();
    }, 0);
  },
  datepicker.prototype.handleNextClicks = function() {
    var _this = this;

    setTimeout(function() {
      _this.updateHeaderElements();
      _this.prepHighlightState();
      $('.ui-datepicker-next').focus();
      $(".ui-datepicker-current").hide();
    }, 0);
  },
  datepicker.prototype.handlePrevClicks = function() {
    var _this = this;

    setTimeout(function() {
      _this.updateHeaderElements();
      _this.prepHighlightState();
      $('.ui-datepicker-prev').focus();
      $(".ui-datepicker-current").hide();
    }, 0);
  },
  datepicker.prototype.previousDay = function(dateLink) {
    if (!dateLink) {
      return;
    }

    var td = $(dateLink).closest('td');
    if (!td) {
      return;
    }

    var prevTd = $(td).prev(),
      prevDateLink = $('a.ui-state-default', prevTd)[0];

    var container = document.getElementById('ui-datepicker-div');

    if (prevTd && prevDateLink) {
      this.setHighlightState(prevDateLink, container);
      prevDateLink.focus();
    } else {
      this.handlePrevious(dateLink);
    }
  },
  datepicker.prototype.handlePrevious = function(target) {
    if (!target) {
      return;
    }

    var currentRow = $(target).closest('tr');
    if (!currentRow) {
      return;
    }

    var container = document.getElementById('ui-datepicker-div');
    var previousRow = $(currentRow).prev();

    // There are no previous rows, so we go to the previous month.
    if (!previousRow || previousRow.length === 0) {
      this.previousMonth();
    } else {
      var prevRowDates = $('td a.ui-state-default', previousRow);
      var prevRowDate = prevRowDates[prevRowDates.length - 1];

      if (prevRowDate) {
        var _this = this;
        setTimeout(function() {
          _this.setHighlightState(prevRowDate, container);
          prevRowDate.focus();
        }, 0);
      }
    }
  },
  datepicker.prototype.previousMonth = function() {
    var _this = this;
    var prevLink = $('.ui-datepicker-prev')[0];
    var container = document.getElementById('ui-datepicker-div');

    prevLink.click();
    // Focus last day of new month.
    setTimeout(function() {
      var trs = $('tr', container);
      var lastRowTdLinks = $('td a.ui-state-default', trs[trs.length - 1]);
      var lastDate = lastRowTdLinks[lastRowTdLinks.length - 1];

      // Update the cached header elements.
      _this.updateHeaderElements();

      _this.setHighlightState(lastDate, container);
      lastDate.focus();
    }, 0);
  },
  datepicker.prototype.nextDay = function(dateLink) {
    var container = document.getElementById('ui-datepicker-div');
    if (!dateLink) {
      return;
    }

    var td = $(dateLink).closest('td');
    if (!td) {
      return;
    }

    var nextTd = $(td).next(),
      nextDateLink = $('a.ui-state-default', nextTd)[0];

    if (nextTd && nextDateLink) {
      this.setHighlightState(nextDateLink, container);
      nextDateLink.focus(); // the next day (same row)
    } else {
      this.handleNext(dateLink);
    }
  },
  datepicker.prototype.handleNext = function(target) {
    if (!target) {
      return;
    }

    var container = document.getElementById('ui-datepicker-div');
    var currentRow = $(target).closest('tr');
    var nextRow = $(currentRow).next();

    if (!nextRow || nextRow.length === 0) {
      this.nextMonth();
    } else {
      var nextRowFirstDate = $('a.ui-state-default', nextRow)[0];

      if (nextRowFirstDate) {
        this.setHighlightState(nextRowFirstDate, container);
        nextRowFirstDate.focus();
      }
    }
  },
  datepicker.prototype.nextMonth = function() {
    var _this = this;
    var container = document.getElementById('ui-datepicker-div');
    var nextMon = $('.ui-datepicker-next')[0];
    nextMon.click();
    // Focus the first day of the new month.
    setTimeout(function() {
      // Update the cached header elements
      _this.updateHeaderElements();

      var firstDate = $('a.ui-state-default', container)[0];
      _this.setHighlightState(firstDate, container);
      firstDate.focus();
    }, 0);
  },
  datepicker.prototype.upHandler = function(target, cont, prevLink) {
    console.log('UP HANDLER EXECUTED');
    prevLink = $('.ui-datepicker-prev')[0];
    var rowContext = $(target).closest('tr');
    if (!rowContext) {
      return;
    }

    var _this = this;
    var rowTds = $('td', rowContext);
    var rowLinks = $('a.ui-state-default', rowContext);
    var targetIndex = $.inArray(target, rowLinks);
    var prevRow = $(rowContext).prev();
    var prevRowTds = $('td', prevRow);
    var parallel = prevRowTds[targetIndex];
    var linkCheck = $('a.ui-state-default', parallel)[0];

    if (prevRow && parallel && linkCheck) {
      // There is a previous row, a td at the same index
      // of the target AND theres a link in that td
      _this.setHighlightState(linkCheck, cont);
      linkCheck.focus();
    } else {
      // We're either on the first row of a month, or we're on the
      // second and there is not a date link directly above the target
      prevLink.click();
      var _this = this;
      setTimeout(function() {
        // Update the cached header elements
        _this.updateHeaderElements();

        var newRows = $('tr', cont);
        var lastRow = newRows[newRows.length - 1];
        var lastRowTds = $('td', lastRow);
        var tdParallelIndex = $.inArray(target.parentNode, rowTds);
        var newParallel = lastRowTds[tdParallelIndex];
        var newCheck = $('a.ui-state-default', newParallel)[0];

        if (lastRow && newParallel && newCheck) {
          _this.setHighlightState(newCheck, cont);
          newCheck.focus();
        } else {
          // There's no date link on the last week (row) of the new month
          // meaning its an empty cell, so we'll try the 2nd to last week
          var secondLastRow = newRows[newRows.length - 2];
          var secondTds = $('td', secondLastRow);
          var targetTd = secondTds[tdParallelIndex];
          var linkCheck = $('a.ui-state-default', targetTd)[0];

          if (linkCheck) {
            _this.setHighlightState(linkCheck, cont);
            linkCheck.focus();
          }
        }
      }, 0);
    }
  },
  datepicker.prototype.downHandler = function(target, cont, nextLink) {
    nextLink = $('.ui-datepicker-next')[0];

    var targetRow = $(target).closest('tr');
    if (!targetRow) {
      return;
    }

    var _this = this;
    var targetCells = $('td', targetRow);
    var cellIndex = $.inArray(target.parentNode, targetCells); // the td (parent of target) index
    var nextRow = $(targetRow).next();
    var nextRowCells = $('td', nextRow);
    var nextWeekTd = nextRowCells[cellIndex];
    var nextWeekCheck = $('a.ui-state-default', nextWeekTd)[0];

    if (nextRow && nextWeekTd && nextWeekCheck) {
      // theres a next row, a TD at the same index of `target`,
      // and theres an anchor within that td
      _this.setHighlightState(nextWeekCheck, cont);
      nextWeekCheck.focus();
    } else {
      nextLink.click();

      setTimeout(function() {
        // Update the cached header elements.
        _this.updateHeaderElements();

        var nextMonthTrs = $('tbody tr', cont),
          firstTds = $('td', nextMonthTrs[0]),
          firstParallel = firstTds[cellIndex],
          firstCheck = $('a.ui-state-default', firstParallel)[0];

        if (firstParallel && firstCheck) {
          _this.setHighlightState(firstCheck, cont);
          firstCheck.focus();
        } else {
          // If no date link was found in the first row, retry in the second row.
          var secondRow = nextMonthTrs[1];
          var secondTds = $('td', secondRow);
          var secondRowTd = secondTds[cellIndex];
          var secondCheck = $('a.ui-state-default', secondRowTd)[0];

          if (secondRow && secondCheck) {
            _this.setHighlightState(secondCheck, cont);
            secondCheck.focus();
          }
        }
      }, 0);
    }
  },
  datepicker.prototype.onCalendarHide = function() {
    this.closeCalendar();
  },
  datepicker.prototype.monthDayYearText = function() {
    var _this = this;
    var cleanUps = $('.amaze-date');

    $(cleanUps).each(function(clean) {
      clean.parentNode.removeChild(clean);
    });

    var datePickDiv = document.getElementById('ui-datepicker-div');
    if (!datePickDiv) {
      return;
    }

    var dates = $('a.ui-state-default', datePickDiv);
    $(dates).attr('role', 'button').on('keydown', function(e) {
      if (e.which=== 32) {
        e.preventDefault();
        e.target.click();
        setTimeout(function() {
          _this.closeCalendar();
        }, 100);
      }
    });
    $(dates).each(function(index, date) {
      var datePickDiv = document.getElementById('ui-datepicker-div');
      var currentRow = $(date).closest('tr');
      var currentTds = $('td', currentRow);
      var currentIndex = $.inArray(date.parentNode, currentTds);
      var headThs = $('thead tr th', datePickDiv);
      var dayIndex = headThs[currentIndex];
      var daySpan = $('span', dayIndex)[0];
      var monthName = $('.ui-datepicker-month', datePickDiv)[0].innerHTML;
      var year = $('.ui-datepicker-year', datePickDiv).val();
      var number = date.innerHTML;

      if (!daySpan || !monthName || !number || !year) {
        return;
      }

      // AT Reads: {month} {date} {year} {day}
      // "December 18 2014 Thursday"
      var dateText = date.innerHTML + ' ' + monthName + ' ' + year; // + ' ' + daySpan.title;
      // AT Reads: {date(number)} {name of day} {name of month} {year(number)}
      // var dateText = date.innerHTML + ' ' + daySpan.title + ' ' + monthName + ' ' + year;
      // add an aria-label to the date link reading out the currently focused date
      date.setAttribute('aria-label', dateText);
    });
  },
  datepicker.prototype.updateHeaderElements = function() {
    var context = document.getElementById('ui-datepicker-div');
    if (!context) {
      return;
    }

    var currentDate = $(this.element).datepicker('getDate');
    if (currentDate) {
      this.createHeaderSummary();
    }

    var prev = $('.ui-datepicker-prev', context)[0];
    var next = $('.ui-datepicker-next', context)[0];
    var year = $('.ui-datepicker-year', context)[0];

    // Make them click/focus - able
    next.href = 'javascript:void(0)';
    prev.href = 'javascript:void(0)';

    next.setAttribute('role', 'button');
    prev.setAttribute('role', 'button');
    this.appendOffscreenMonthText(next);
    this.appendOffscreenMonthText(prev);

    next.addEventListener( 'click', function(e) { this.handleNextClicks(e); }.bind( this ), false );
    prev.addEventListener( 'click', function(e) { this.handlePrevClicks(e); }.bind( this ), false );
    year.addEventListener( 'change', function(e) { this.handleYearChange(e); }.bind( this ), false );

    // Add month day year text
    this.monthDayYearText();
  },
  datepicker.prototype.prepHighlightState = function() {
    var highlight;
    var cage = document.getElementById('ui-datepicker-div');

    highlight = $('.ui-state-highlight', cage)[0] || $('.ui-state-default', cage)[0];
    if (highlight && cage) {
      this.setHighlightState(highlight, cage);
    }
  },
  datepicker.prototype.setHighlightState = function(newHighlight, container) {
    var prevHighlight = this.getCurrentDate(container);
    // Remove the highlight state from previously
    // highlighted date and add it to our newly active date
    $(prevHighlight).removeClass('ui-state-highlight');
    $(newHighlight).addClass('ui-state-highlight');
  },
  datepicker.prototype.getCurrentDate = function(container) {
    return $('.ui-state-highlight', container)[0];
  },
  datepicker.prototype.appendOffscreenMonthText = function(button) {
    var buttonText;
    var isNext = $(button).hasClass('ui-datepicker-next');
    var months = this.config.months;

    var currentMonth = $('.ui-datepicker-title .ui-datepicker-month').text().toLowerCase();
    var monthIndex = $.inArray(currentMonth.toLowerCase(), months);
    var currentYear = $('.ui-datepicker-title .ui-datepicker-year').val().toLowerCase();
    var adjacentIndex = (isNext) ? monthIndex + 1 : monthIndex - 1;

    if (isNext && currentMonth === 'december') {
      currentYear = parseInt(currentYear, 10) + 1;
      adjacentIndex = 0;
    } else if (!isNext && currentMonth === 'januari') {
      currentYear = parseInt(currentYear, 10) - 1;
      adjacentIndex = months.length - 1;
    }

    buttonText = (isNext)
      ? 'Volgende maand, ' + this.firstToCap(months[adjacentIndex]) + ' ' + currentYear
      : 'Vorige maand, ' + this.firstToCap(months[adjacentIndex]) + ' ' + currentYear;

    $(button).find('.ui-icon').html(buttonText);
  },
  datepicker.prototype.firstToCap = function(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  },
  datepicker.prototype.removeAria = function() {
    var _this = this;

    _this.closeCalendar();
    // Make the rest of the page accessible again:
    $('#dp-container').removeAttr('aria-hidden');
    $('#skipnav').removeAttr('aria-hidden');
  };
})();
