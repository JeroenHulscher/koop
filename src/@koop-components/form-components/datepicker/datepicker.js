(function() {
  'use strict';

  onl.decorate({
    'init-datepicker': function(element) {
      new datepicker(element);
    }
  });

  var datepicker = function(element) {
    this.element = element;
    this.config = [];
    // todo: make config extendable on component level.
    this.config.isTouch = onl.ui.isTouch();
    this.config.months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

    if ( !this.config.isTouch ) {
      this.initDatepicker( element );
    }
  };

  datepicker.prototype.initDatepicker = function(element) {
    // datepicker config
    // todo: make customizable.
    $(element).attr('type', 'text').datepicker({
      showOn: 'button',
      changeYear: true,
      buttonImage: '../../images/icon-calendar-white.svg', // File (and file path) for the calendar image
      buttonImageOnly: false,
      buttonText: 'Calendar View',
      monthNames: this.config.months,
      dayNamesMin: ['M', 'D', 'W', 'D', 'V', 'Z', 'Z'],
      dayNamesShort: ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'],
      showButtonPanel: true,
      closeText: 'Sluiten',
      dateFormat: 'dd-mm-yy',
      onClose: this.removeAria,
      beforeShow: function(input, inst) {
        inst.dpDiv.css({ marginTop: input.offsetHeight / 2 + 'px' });
      }
    });

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

    this.currentDate = $(this.element).datepicker( 'getDate' );

    if (!container || !this.element) {
      return;
    }

    if ( this.currentDate ) {
      this.createHeaderSummary();
    }

    container.setAttribute( 'role', 'application' );
    container.setAttribute( 'aria-label', 'Calendar view date-picker' );

    // the top controls;
    var prev = $( '.ui-datepicker-prev', container )[0],
        next = $( '.ui-datepicker-next', container )[0],
        year = $( '.ui-datepicker-year', container )[0];

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
    next.addEventListener( 'click', function( e ) { _this.handleNextClicks(e); }.bind( _this ), false );
    prev.addEventListener( 'click', function( e ) { _this.handlePrevClicks(e); }.bind( _this ), false );
    year.addEventListener( 'change', function( e ) { _this.handleYearChange(e); }.bind( _this ), false );

    // rewrite the text label from a 'day'.
    this.monthDayYearText();

    $( container ).on( 'keydown', function calendarKeyboardListener( keyVent ) {
      var which = keyVent.which;
      var target = keyVent.target;
      var dateCurrent = _this.getCurrentDate( container );

      if ( !dateCurrent ) {
        dateCurrent = $( 'a.ui-state-default' )[0];
        _this.setHighlightState( dateCurrent, container );
      }

      if ( 27 === which ) {
        keyVent.stopPropagation();
        return _this.closeCalendar();
      } else if (which === 9 && keyVent.shiftKey) { // SHIFT + TAB
        keyVent.preventDefault();
        if ( $(target).hasClass( 'ui-datepicker-close' )) { // close button
          $('.ui-datepicker-prev')[0].focus();
        } else if ($(target).hasClass('ui-state-default')) { // a date link
          $('.ui-datepicker-close')[0].focus();
        } else if ($(target).hasClass('ui-datepicker-prev')) {
          $('.ui-datepicker-year')[0].focus();
        } else if ($(target).hasClass('ui-datepicker-year')) { // the prev link
          $('.ui-datepicker-next')[0].focus();
        } else if ($(target).hasClass('ui-datepicker-next')) { // the next link
          activeDate = $('.ui-state-highlight') ||
            $('.ui-state-active')[0];
          if ( activeDate ) {
            activeDate.focus();
          }
        }
      } else if ( which === 9 ) { // TAB
        keyVent.preventDefault();

        if ( $( target ).hasClass( 'ui-datepicker-close' ) ) { // close button
          activeDate = $('.ui-state-highlight') || $('.ui-state-active')[0];
          if ( activeDate ) {
            activeDate.focus();
          }
        } else if ( $( target ).hasClass( 'ui-state-default' ) ) {
          $( '.ui-datepicker-next' )[0].focus();
          // lastSelectedIsPrev = false;
        } else if ( $( target ).hasClass( 'ui-datepicker-next' ) ) {
          $( '.ui-datepicker-year' )[0].focus();
          // lastSelectedIsPrev = false;
        } else if ( $( target ).hasClass( 'ui-datepicker-year' ) ) {
          $( '.ui-datepicker-prev' )[0].focus();
          // lastSelectedIsPrev = false;
        } else if ( $( target ).hasClass( 'ui-datepicker-prev' ) ) {
          // lastSelectedIsPrev = $(target).attr('class');
          $( '.ui-datepicker-close' )[0].focus();
        }
      } else if ( which === 37 ) { // LEFT arrow key
        // if we're on a date link...
        if ( !$( target ).hasClass( 'ui-datepicker-close' ) && $( target ).hasClass( 'ui-state-default' ) ) {
          keyVent.preventDefault();
          _this.previousDay( target );
        }
      } else if ( which === 39 ) { // RIGHT arrow key
        // if we're on a date link...
        if ( !$( target ).hasClass( 'ui-datepicker-close' ) && $( target ).hasClass( 'ui-state-default' ) ) {
          keyVent.preventDefault();
          _this.nextDay( target );
        }
      } else if ( which === 38 ) { // UP arrow key
        if ( !$( target ).hasClass( 'ui-datepicker-close' ) && $( target ).hasClass( 'ui-state-default' ) ) {
          keyVent.preventDefault();
          _this.upHandler( target, container, prev );
        }
      } else if ( which === 40 ) { // DOWN arrow key
        if ( !$( target ).hasClass( 'ui-datepicker-close' ) && $( target ).hasClass( 'ui-state-default' ) ) {
          keyVent.preventDefault();
          _this.downHandler( target, container, next );
        }
      } else if ( which === 13 ) { // ENTER
        if ( $( target ).hasClass( 'ui-state-default' ) ) {
          setTimeout( function() {
            _this.closeCalendar();
          }, 100 );
        } else if ( $( target ).hasClass( 'ui-datepicker-year' ) ) {
          _this.handleYearChange( target );
        } else if ( $( target ).hasClass( 'ui-datepicker-prev' ) ) {
          _this.handlePrevClicks();
        } else if ( $( target ).hasClass( 'ui-datepicker-next' ) ) {
          _this.handleNextClicks();
        }
      } else if ( 32 === which ) {
        if ( $( target ).hasClass( 'ui-datepicker-prev' ) || $( target ).hasClass( 'ui-datepicker-next' ) ) {
          target.click();
        }
      } else if ( 33 === which ) { // PAGE UP
        _this.moveOneMonth( target, 'prev' );
      } else if ( 34 === which ) { // PAGE DOWN
        _this.moveOneMonth( target, 'next' );
      } else if ( 36 === which ) { // HOME
        var firstOfMonth = $( target ).closest( 'tbody' ).find( '.ui-state-default' )[0];
        if (firstOfMonth) {
          firstOfMonth.focus();
          _this.setHighlightState(firstOfMonth, $('#ui-datepicker-div')[0]);
        }
      } else if (35 === which) { // END
        var $daysOfMonth = $(target).closest('tbody').find('.ui-state-default');
        var lastDay = $daysOfMonth[$daysOfMonth.length - 1];
        if (lastDay) {
          lastDay.focus();
          _this.setHighlightState(lastDay, $('#ui-datepicker-div')[0]);
        }
      }
      $(".ui-datepicker-current").hide();
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
    setTimeout(function () {
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
    setTimeout(function () {
      _this.updateHeaderElements();
      _this.prepHighlightState();
      $('.ui-datepicker-next').focus();
      $(".ui-datepicker-current").hide();
    }, 0);
  },
  datepicker.prototype.handleNextClicks = function() {
    var _this = this;
    setTimeout(function () {
      _this.updateHeaderElements();
      _this.prepHighlightState();
      $('.ui-datepicker-next').focus();
      $(".ui-datepicker-current").hide();
    }, 0);
  },
  datepicker.prototype.handlePrevClicks = function() {
    var _this = this;
    setTimeout(function () {
      _this.updateHeaderElements();
      _this.prepHighlightState();
      $('.ui-datepicker-prev').focus();
      $(".ui-datepicker-current").hide();
    }, 0);
  },
  datepicker.prototype.previousDay = function(dateLink) {
    var container = document.getElementById('ui-datepicker-div');
    if (!dateLink) {
      return;
    }
    var td = $(dateLink).closest('td');
    if (!td) {
      return;
    }

    var prevTd = $(td).prev(),
      prevDateLink = $('a.ui-state-default', prevTd)[0];

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

    if (!previousRow || previousRow.length === 0) {
      // there is not previous row, so we go to previous month...
      this.previousMonth();
    } else {
      var prevRowDates = $('td a.ui-state-default', previousRow);
      var prevRowDate = prevRowDates[prevRowDates.length - 1];

      if (prevRowDate) {
        var _this = this;
        setTimeout(function () {
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
    // focus last day of new month
    setTimeout(function () {
      var trs = $('tr', container),
        lastRowTdLinks = $('td a.ui-state-default', trs[trs.length - 1]),
        lastDate = lastRowTdLinks[lastRowTdLinks.length - 1];

      // updating the cached header elements
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
    var container = document.getElementById('ui-datepicker-div');
    if (!target) {
      return;
    }
    var currentRow = $(target).closest('tr'),
      nextRow = $(currentRow).next();

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
    nextMon = $('.ui-datepicker-next')[0];
    var container = document.getElementById('ui-datepicker-div');
    nextMon.click();
    var _this = this;
    // focus the first day of the new month
    setTimeout(function () {
      // updating the cached header elements
      _this.updateHeaderElements();

      var firstDate = $('a.ui-state-default', container)[0];
      _this.setHighlightState(firstDate, container);
      firstDate.focus();
    }, 0);
  },
  datepicker.prototype.upHandler = function(target, cont, prevLink) {
    prevLink = $('.ui-datepicker-prev')[0];
    var rowContext = $(target).closest('tr');
    if (!rowContext) {
      return;
    }
    var rowTds = $('td', rowContext),
      rowLinks = $('a.ui-state-default', rowContext),
      targetIndex = $.inArray(target, rowLinks),
      prevRow = $(rowContext).prev(),
      prevRowTds = $('td', prevRow),
      parallel = prevRowTds[targetIndex],
      linkCheck = $('a.ui-state-default', parallel)[0];

    if (prevRow && parallel && linkCheck) {
      // there is a previous row, a td at the same index
      // of the target AND theres a link in that td
      this.setHighlightState(linkCheck, cont);
      linkCheck.focus();
    } else {
      // we're either on the first row of a month, or we're on the
      // second and there is not a date link directly above the target
      prevLink.click();
      var _this = this;
      setTimeout(function () {
        // updating the cached header elements
        _this.updateHeaderElements();
        var newRows = $('tr', cont),
          lastRow = newRows[newRows.length - 1],
          lastRowTds = $('td', lastRow),
          tdParallelIndex = $.inArray(target.parentNode, rowTds),
          newParallel = lastRowTds[tdParallelIndex],
          newCheck = $('a.ui-state-default', newParallel)[0];

        if (lastRow && newParallel && newCheck) {
          _this.setHighlightState(newCheck, cont);
          newCheck.focus();
        } else {
          // theres no date link on the last week (row) of the new month
          // meaning its an empty cell, so we'll try the 2nd to last week
          var secondLastRow = newRows[newRows.length - 2],
            secondTds = $('td', secondLastRow),
            targetTd = secondTds[tdParallelIndex],
            linkCheck = $('a.ui-state-default', targetTd)[0];

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
    var targetCells = $('td', targetRow),
      cellIndex = $.inArray(target.parentNode, targetCells), // the td (parent of target) index
      nextRow = $(targetRow).next(),
      nextRowCells = $('td', nextRow),
      nextWeekTd = nextRowCells[cellIndex],
      nextWeekCheck = $('a.ui-state-default', nextWeekTd)[0];

    if (nextRow && nextWeekTd && nextWeekCheck) {
      // theres a next row, a TD at the same index of `target`,
      // and theres an anchor within that td
      this.setHighlightState(nextWeekCheck, cont);
      nextWeekCheck.focus();
    } else {
      nextLink.click();

      setTimeout(function () {
        // updating the cached header elements
        this.updateHeaderElements();

        var nextMonthTrs = $('tbody tr', cont),
          firstTds = $('td', nextMonthTrs[0]),
          firstParallel = firstTds[cellIndex],
          firstCheck = $('a.ui-state-default', firstParallel)[0];

        if (firstParallel && firstCheck) {
          this.setHighlightState(firstCheck, cont);
          firstCheck.focus();
        } else {
          // lets try the second row b/c we didnt find a
          // date link in the first row at the target's index
          var secondRow = nextMonthTrs[1],
            secondTds = $('td', secondRow),
            secondRowTd = secondTds[cellIndex],
            secondCheck = $('a.ui-state-default', secondRowTd)[0];

          if (secondRow && secondCheck) {
            this.setHighlightState(secondCheck, cont);
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
    var cleanUps = $('.amaze-date');

    $(cleanUps).each(function (clean) {
      // each(cleanUps, function (clean) {
      clean.parentNode.removeChild(clean);
    });

    var datePickDiv = document.getElementById('ui-datepicker-div');
    // in case we find no datepick div
    if (!datePickDiv) {
      return;
    }

    var dates = $('a.ui-state-default', datePickDiv);
    $(dates).attr('role', 'button').on('keydown', function (e) {
      if (e.which === 32) {
        e.preventDefault();
        e.target.click();
        setTimeout(function () {
          this.closeCalendar();
        }, 100);
      }
    });
    $(dates).each(function (index, date) {
      var datePickDiv = document.getElementById('ui-datepicker-div');
      var currentRow = $(date).closest('tr'),
        currentTds = $('td', currentRow),
        currentIndex = $.inArray(date.parentNode, currentTds),
        headThs = $('thead tr th', datePickDiv),
        dayIndex = headThs[currentIndex],
        daySpan = $('span', dayIndex)[0],
        monthName = $('.ui-datepicker-month', datePickDiv)[0].innerHTML,
        year = $('.ui-datepicker-year', datePickDiv).val(),
        number = date.innerHTML;

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

    var currentDate = $(this.element).datepicker("getDate");
    if (currentDate) {
      this.createHeaderSummary();
    }

    var prev = $('.ui-datepicker-prev', context)[0];
    var next = $('.ui-datepicker-next', context)[0];
    var year = $('.ui-datepicker-year', context)[0];

    //make them click/focus - able
    next.href = 'javascript:void(0)';
    prev.href = 'javascript:void(0)';

    next.setAttribute('role', 'button');
    prev.setAttribute('role', 'button');
    this.appendOffscreenMonthText(next);
    this.appendOffscreenMonthText(prev);

    next.addEventListener( 'click', function(e) { this.handleNextClicks(e); }.bind( this ), false );
    prev.addEventListener( 'click', function(e) { this.handlePrevClicks(e); }.bind( this ), false );
    year.addEventListener( 'change', function (e) { this.handleYearChange(e); }.bind( this ), false );

    // add month day year text
    this.monthDayYearText();
  },
  datepicker.prototype.prepHighlightState = function() {
    var highlight;
    var cage = document.getElementById('ui-datepicker-div');
    highlight = $('.ui-state-highlight', cage)[0] ||
      $('.ui-state-default', cage)[0];
    if (highlight && cage) {
      this.setHighlightState(highlight, cage);
    }
  },
  datepicker.prototype.setHighlightState = function(newHighlight, container) {
    var prevHighlight = this.getCurrentDate(container);
    // remove the highlight state from previously
    // highlighted date and add it to our newly active date
    $(prevHighlight).removeClass('ui-state-highlight');
    $(newHighlight).addClass('ui-state-highlight');
  },
  datepicker.prototype.getCurrentDate = function(container) {
    var currentDate = $('.ui-state-highlight', container)[0];
    return currentDate;
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
    // make the rest of the page accessible again:
    $("#dp-container").removeAttr('aria-hidden');
    $("#skipnav").removeAttr('aria-hidden');
  }

})();
