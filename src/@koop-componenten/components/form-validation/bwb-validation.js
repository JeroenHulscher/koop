var Page_ValidationVer = "125";
var Page_IsValid = true;
var Page_BlockSubmit = false;
var Page_InvalidControlToBeFocused = null;
var Page_TextTypes = /^(text|password|file|search|tel|url|email|number|range|color|datetime|date|month|week|time|datetime-local)$/i;
function ValidatorUpdateDisplay(val) {
    if (typeof(val.display) == "string") {
        if (val.display == "None") {
            return;
        }
        if (val.display == "Dynamic") {
            val.style.display = val.isvalid ? "none" : "inline";
            return;
        }
    }
    if ((navigator.userAgent.indexOf("Mac") > -1) &&
        (navigator.userAgent.indexOf("MSIE") > -1)) {
        val.style.display = "inline";
    }
    val.style.visibility = val.isvalid ? "hidden" : "visible";
}
function ValidatorUpdateIsValid() {
    Page_IsValid = AllValidatorsValid(Page_Validators);
}
function AllValidatorsValid(validators) {
    if ((typeof(validators) != "undefined") && (validators != null)) {
        var i;
        for (i = 0; i < validators.length; i++) {
            if (!validators[i].isvalid) {
                return false;
            }
        }
    }
    return true;
}
function ValidatorHookupControlID(controlID, val) {
    if (typeof(controlID) != "string") {
        return;
    }
    var ctrl = document.getElementById(controlID);
    if ((typeof(ctrl) != "undefined") && (ctrl != null)) {
        ValidatorHookupControl(ctrl, val);
    }
    else {
        val.isvalid = true;
        val.enabled = false;
    }
}
function ValidatorHookupControl(control, val) {
    if (typeof(control.tagName) != "string") {
        return;
    }
    if (control.tagName != "INPUT" && control.tagName != "TEXTAREA" && control.tagName != "SELECT") {
        var i;
        for (i = 0; i < control.childNodes.length; i++) {
            ValidatorHookupControl(control.childNodes[i], val);
        }
        return;
    }
    else {
        if (typeof(control.Validators) == "undefined") {
            control.Validators = new Array;
            var eventType;
            if (control.type == "radio") {
                eventType = "onclick";
            } else {
                eventType = "onchange";
                if (typeof(val.focusOnError) == "string" && val.focusOnError == "t") {
                    ValidatorHookupEvent(control, "onblur", "ValidatedControlOnBlur(event); ");
                }
            }
            ValidatorHookupEvent(control, eventType, "ValidatorOnChange(event); ");
            if (Page_TextTypes.test(control.type)) {
                ValidatorHookupEvent(control, "onkeypress",
                    "event = event || window.event; if (!ValidatedTextBoxOnKeyPress(event)) { event.cancelBubble = true; if (event.stopPropagation) event.stopPropagation(); return false; } ");
            }
        }
        control.Validators[control.Validators.length] = val;
    }
}
function ValidatorHookupEvent(control, eventType, functionPrefix) {
    var ev = control[eventType];
    if (typeof(ev) == "function") {
        ev = ev.toString();
        ev = ev.substring(ev.indexOf("{") + 1, ev.lastIndexOf("}"));
    }
    else {
        ev = "";
    }
    control[eventType] = new Function("event", functionPrefix + " " + ev);
}
function ValidatorGetValue(id) {
    var control;
    control = document.getElementById(id);
    if (typeof(control.value) == "string") {
        return control.value;
    }
    return ValidatorGetValueRecursive(control);
}
function ValidatorGetValueRecursive(control)
{
    if (typeof(control.value) == "string" && (control.type != "radio" || control.checked == true)) {
        return control.value;
    }
    var i, val;
    for (i = 0; i<control.childNodes.length; i++) {
        val = ValidatorGetValueRecursive(control.childNodes[i]);
        if (val != "") return val;
    }
    return "";
}
function Page_ClientValidate(validationGroup) {
    Page_InvalidControlToBeFocused = null;
    if (typeof(Page_Validators) == "undefined") {
        return true;
    }
    var i;
    for (i = 0; i < Page_Validators.length; i++) {
        ValidatorValidate(Page_Validators[i], validationGroup, null);
    }
    ValidatorUpdateIsValid();
    ValidationSummaryOnSubmit(validationGroup);
    Page_BlockSubmit = !Page_IsValid;
    return Page_IsValid;
}
function ValidatorCommonOnSubmit() {
    Page_InvalidControlToBeFocused = null;
    var result = !Page_BlockSubmit;
    if ((typeof(window.event) != "undefined") && (window.event != null)) {
        window.event.returnValue = result;
    }
    Page_BlockSubmit = false;
    return result;
}
function ValidatorEnable(val, enable) {
    val.enabled = (enable != false);
    ValidatorValidate(val);
    ValidatorUpdateIsValid();
}
function ValidatorOnChange(event) {
    event = event || window.event;
    Page_InvalidControlToBeFocused = null;
    var targetedControl;
    if ((typeof(event.srcElement) != "undefined") && (event.srcElement != null)) {
        targetedControl = event.srcElement;
    }
    else {
        targetedControl = event.target;
    }
    var vals;
    if (typeof(targetedControl.Validators) != "undefined") {
        vals = targetedControl.Validators;
    }
    else {
        if (targetedControl.tagName.toLowerCase() == "label") {
            targetedControl = document.getElementById(targetedControl.htmlFor);
            vals = targetedControl.Validators;
        }
    }
    if (vals) {
        for (var i = 0; i < vals.length; i++) {
            ValidatorValidate(vals[i], null, event);
        }
    }
    ValidatorUpdateIsValid();
}
function ValidatedTextBoxOnKeyPress(event) {
    event = event || window.event;
    if (event.keyCode == 13) {
        ValidatorOnChange(event);
        var vals;
        if ((typeof(event.srcElement) != "undefined") && (event.srcElement != null)) {
            vals = event.srcElement.Validators;
        }
        else {
            vals = event.target.Validators;
        }
        return AllValidatorsValid(vals);
    }
    return true;
}
function ValidatedControlOnBlur(event) {
    event = event || window.event;
    var control;
    if ((typeof(event.srcElement) != "undefined") && (event.srcElement != null)) {
        control = event.srcElement;
    }
    else {
        control = event.target;
    }
    if ((typeof(control) != "undefined") && (control != null) && (Page_InvalidControlToBeFocused == control)) {
        control.focus();
        Page_InvalidControlToBeFocused = null;
    }
}
function ValidatorValidate(val, validationGroup, event) {
    val.isvalid = true;
    if ((typeof(val.enabled) == "undefined" || val.enabled != false) && IsValidationGroupMatch(val, validationGroup)) {
        if (typeof(val.evaluationfunction) == "function") {
            val.isvalid = val.evaluationfunction(val);
            if (!val.isvalid && Page_InvalidControlToBeFocused == null &&
                typeof(val.focusOnError) == "string" && val.focusOnError == "t") {
                ValidatorSetFocus(val, event);
            }
        }
    }
    ValidatorUpdateDisplay(val);
}
function ValidatorSetFocus(val, event) {
    var ctrl;
    if (typeof(val.controlhookup) == "string") {
        var eventCtrl;
        if ((typeof(event) != "undefined") && (event != null)) {
            if ((typeof(event.srcElement) != "undefined") && (event.srcElement != null)) {
                eventCtrl = event.srcElement;
            }
            else {
                eventCtrl = event.target;
            }
        }
        if ((typeof(eventCtrl) != "undefined") && (eventCtrl != null) &&
            (typeof(eventCtrl.id) == "string") &&
            (eventCtrl.id == val.controlhookup)) {
            ctrl = eventCtrl;
        }
    }
    if ((typeof(ctrl) == "undefined") || (ctrl == null)) {
        ctrl = document.getElementById(val.controltovalidate);
    }
    if ((typeof(ctrl) != "undefined") && (ctrl != null) &&
        (ctrl.tagName.toLowerCase() != "table" || (typeof(event) == "undefined") || (event == null)) &&
        ((ctrl.tagName.toLowerCase() != "input") || (ctrl.type.toLowerCase() != "hidden")) &&
        (typeof(ctrl.disabled) == "undefined" || ctrl.disabled == null || ctrl.disabled == false) &&
        (typeof(ctrl.visible) == "undefined" || ctrl.visible == null || ctrl.visible != false) &&
        (IsInVisibleContainer(ctrl))) {
        if ((ctrl.tagName.toLowerCase() == "table" && (typeof(__nonMSDOMBrowser) == "undefined" || __nonMSDOMBrowser)) ||
            (ctrl.tagName.toLowerCase() == "span")) {
            var inputElements = ctrl.getElementsByTagName("input");
            var lastInputElement  = inputElements[inputElements.length -1];
            if (lastInputElement != null) {
                ctrl = lastInputElement;
            }
        }
        if (typeof(ctrl.focus) != "undefined" && ctrl.focus != null) {
            ctrl.focus();
            Page_InvalidControlToBeFocused = ctrl;
        }
    }
}
function IsInVisibleContainer(ctrl) {
    if (typeof(ctrl.style) != "undefined" &&
        ( ( typeof(ctrl.style.display) != "undefined" &&
            ctrl.style.display == "none") ||
          ( typeof(ctrl.style.visibility) != "undefined" &&
            ctrl.style.visibility == "hidden") ) ) {
        return false;
    }
    else if (typeof(ctrl.parentNode) != "undefined" &&
             ctrl.parentNode != null &&
             ctrl.parentNode != ctrl) {
        return IsInVisibleContainer(ctrl.parentNode);
    }
    return true;
}
function IsValidationGroupMatch(control, validationGroup) {
    if ((typeof(validationGroup) == "undefined") || (validationGroup == null)) {
        return true;
    }
    var controlGroup = "";
    if (typeof(control.validationGroup) == "string") {
        controlGroup = control.validationGroup;
    }
    return (controlGroup == validationGroup);
}
function ValidatorOnLoad() {
    if (typeof(Page_Validators) == "undefined")
        return;
    var i, val;
    for (i = 0; i < Page_Validators.length; i++) {
        val = Page_Validators[i];
        if (typeof(val.evaluationfunction) == "string") {
            eval("val.evaluationfunction = " + val.evaluationfunction + ";");
        }
        if (typeof(val.isvalid) == "string") {
            if (val.isvalid == "False") {
                val.isvalid = false;
                Page_IsValid = false;
            }
            else {
                val.isvalid = true;
            }
        } else {
            val.isvalid = true;
        }
        if (typeof(val.enabled) == "string") {
            val.enabled = (val.enabled != "False");
        }
        if (typeof(val.controltovalidate) == "string") {
            ValidatorHookupControlID(val.controltovalidate, val);
        }
        if (typeof(val.controlhookup) == "string") {
            ValidatorHookupControlID(val.controlhookup, val);
        }
    }
    Page_ValidationActive = true;
}
function ValidatorConvert(op, dataType, val) {
    function GetFullYear(year) {
        var twoDigitCutoffYear = val.cutoffyear % 100;
        var cutoffYearCentury = val.cutoffyear - twoDigitCutoffYear;
        return ((year > twoDigitCutoffYear) ? (cutoffYearCentury - 100 + year) : (cutoffYearCentury + year));
    }
    var num, cleanInput, m, exp;
    if (dataType == "Integer") {
        exp = /^\s*[-\+]?\d+\s*$/;
        if (op.match(exp) == null)
            return null;
        num = parseInt(op, 10);
        return (isNaN(num) ? null : num);
    }
    else if(dataType == "Double") {
        exp = new RegExp("^\\s*([-\\+])?(\\d*)\\" + val.decimalchar + "?(\\d*)\\s*$");
        m = op.match(exp);
        if (m == null)
            return null;
        if (m[2].length == 0 && m[3].length == 0)
            return null;
        cleanInput = (m[1] != null ? m[1] : "") + (m[2].length>0 ? m[2] : "0") + (m[3].length>0 ? "." + m[3] : "");
        num = parseFloat(cleanInput);
        return (isNaN(num) ? null : num);
    }
    else if (dataType == "Currency") {
        var hasDigits = (val.digits > 0);
        var beginGroupSize, subsequentGroupSize;
        var groupSizeNum = parseInt(val.groupsize, 10);
        if (!isNaN(groupSizeNum) && groupSizeNum > 0) {
            beginGroupSize = "{1," + groupSizeNum + "}";
            subsequentGroupSize = "{" + groupSizeNum + "}";
        }
        else {
            beginGroupSize = subsequentGroupSize = "+";
        }
        exp = new RegExp("^\\s*([-\\+])?((\\d" + beginGroupSize + "(\\" + val.groupchar + "\\d" + subsequentGroupSize + ")+)|\\d*)"
                        + (hasDigits ? "\\" + val.decimalchar + "?(\\d{0," + val.digits + "})" : "")
                        + "\\s*$");
        m = op.match(exp);
        if (m == null)
            return null;
        if (m[2].length == 0 && hasDigits && m[5].length == 0)
            return null;
        cleanInput = (m[1] != null ? m[1] : "") + m[2].replace(new RegExp("(\\" + val.groupchar + ")", "g"), "") + ((hasDigits && m[5].length > 0) ? "." + m[5] : "");
        num = parseFloat(cleanInput);
        return (isNaN(num) ? null : num);
    }
    else if (dataType == "Date") {
        var yearFirstExp = new RegExp("^\\s*((\\d{4})|(\\d{2}))([-/]|\\. ?)(\\d{1,2})\\4(\\d{1,2})\\.?\\s*$");
        m = op.match(yearFirstExp);
        var day, month, year;
        if (m != null && (((typeof(m[2]) != "undefined") && (m[2].length == 4)) || val.dateorder == "ymd")) {
            day = m[6];
            month = m[5];
            year = (m[2].length == 4) ? m[2] : GetFullYear(parseInt(m[3], 10));
        }
        else {
            if (val.dateorder == "ymd"){
                return null;
            }
            var yearLastExp = new RegExp("^\\s*(\\d{1,2})([-/]|\\. ?)(\\d{1,2})(?:\\s|\\2)((\\d{4})|(\\d{2}))(?:\\s\u0433\\.|\\.)?\\s*$");
            m = op.match(yearLastExp);
            if (m == null) {
                return null;
            }
            if (val.dateorder == "mdy") {
                day = m[3];
                month = m[1];
            }
            else {
                day = m[1];
                month = m[3];
            }
            year = ((typeof(m[5]) != "undefined") && (m[5].length == 4)) ? m[5] : GetFullYear(parseInt(m[6], 10));
        }
        month -= 1;
        var date = new Date(year, month, day);
        if (year < 100) {
            date.setFullYear(year);
        }
        return (typeof(date) == "object" && year == date.getFullYear() && month == date.getMonth() && day == date.getDate()) ? date.valueOf() : null;
    }
    else {
        return op.toString();
    }
}
function ValidatorCompare(operand1, operand2, operator, val) {
    var dataType = val.type;
    var op1, op2;
    if ((op1 = ValidatorConvert(operand1, dataType, val)) == null)
        return false;
    if (operator == "DataTypeCheck")
        return true;
    if ((op2 = ValidatorConvert(operand2, dataType, val)) == null)
        return true;
    switch (operator) {
        case "NotEqual":
            return (op1 != op2);
        case "GreaterThan":
            return (op1 > op2);
        case "GreaterThanEqual":
            return (op1 >= op2);
        case "LessThan":
            return (op1 < op2);
        case "LessThanEqual":
            return (op1 <= op2);
        default:
            return (op1 == op2);
    }
}
function CompareValidatorEvaluateIsValid(val) {
    var value = ValidatorGetValue(val.controltovalidate);
    if (ValidatorTrim(value).length == 0)
        return true;
    var compareTo = "";
    if ((typeof(val.controltocompare) != "string") ||
        (typeof(document.getElementById(val.controltocompare)) == "undefined") ||
        (null == document.getElementById(val.controltocompare))) {
        if (typeof(val.valuetocompare) == "string") {
            compareTo = val.valuetocompare;
        }
    }
    else {
        compareTo = ValidatorGetValue(val.controltocompare);
    }
    var operator = "Equal";
    if (typeof(val.operator) == "string") {
        operator = val.operator;
    }
    return ValidatorCompare(value, compareTo, operator, val);
}
function CustomValidatorEvaluateIsValid(val) {
    var value = "";
    if (typeof(val.controltovalidate) == "string") {
        value = ValidatorGetValue(val.controltovalidate);
        if ((ValidatorTrim(value).length == 0) &&
            ((typeof(val.validateemptytext) != "string") || (val.validateemptytext != "true"))) {
            return true;
        }
    }
    var args = { Value:value, IsValid:true };
    if (typeof(val.clientvalidationfunction) == "string") {
        eval(val.clientvalidationfunction + "(val, args) ;");
    }
    return args.IsValid;
}
function RegularExpressionValidatorEvaluateIsValid(val) {
    var value = ValidatorGetValue(val.controltovalidate);
    if (ValidatorTrim(value).length == 0)
        return true;
    var rx = new RegExp(val.validationexpression);
    var matches = rx.exec(value);
    return (matches != null && value == matches[0]);
}
function ValidatorTrim(s) {
    var m = s.match(/^\s*(\S+(\s+\S+)*)\s*$/);
    return (m == null) ? "" : m[1];
}
function RequiredFieldValidatorEvaluateIsValid(val) {
    return (ValidatorTrim(ValidatorGetValue(val.controltovalidate)) != ValidatorTrim(val.initialvalue))
}
function RangeValidatorEvaluateIsValid(val) {
    var value = ValidatorGetValue(val.controltovalidate);
    if (ValidatorTrim(value).length == 0)
        return true;
    return (ValidatorCompare(value, val.minimumvalue, "GreaterThanEqual", val) &&
            ValidatorCompare(value, val.maximumvalue, "LessThanEqual", val));
}
function ValidationSummaryOnSubmit(validationGroup) {
    if (typeof(Page_ValidationSummaries) == "undefined")
        return;
    var summary, sums, s;
    var headerSep, first, pre, post, end;
    for (sums = 0; sums < Page_ValidationSummaries.length; sums++) {
        summary = Page_ValidationSummaries[sums];
        if (!summary) continue;
        summary.style.display = "none";
        if (!Page_IsValid && IsValidationGroupMatch(summary, validationGroup)) {
            var i;
            if (summary.showsummary != "False") {
                summary.style.display = "";
                if (typeof(summary.displaymode) != "string") {
                    summary.displaymode = "BulletList";
                }
                switch (summary.displaymode) {
                    case "List":
                        headerSep = "<br>";
                        first = "";
                        pre = "";
                        post = "<br>";
                        end = "";
                        break;
                    case "BulletList":
                    default:
                        headerSep = "";
                        first = "<ul>";
                        pre = "<li>";
                        post = "</li>";
                        end = "</ul>";
                        break;
                    case "SingleParagraph":
                        headerSep = " ";
                        first = "";
                        pre = "";
                        post = " ";
                        end = "<br>";
                        break;
                }
                s = "";
                if (typeof(summary.headertext) == "string") {
                    s += summary.headertext + headerSep;
                }
                s += first;
                for (i=0; i<Page_Validators.length; i++) {
                    if (!Page_Validators[i].isvalid && typeof(Page_Validators[i].errormessage) == "string") {
                        s += pre + Page_Validators[i].errormessage + post;
                    }
                }
                s += end;
                summary.innerHTML = s;
                window.scrollTo(0,0);
            }
            if (summary.showmessagebox == "True") {
                s = "";
                if (typeof(summary.headertext) == "string") {
                    s += summary.headertext + "\r\n";
                }
                var lastValIndex = Page_Validators.length - 1;
                for (i=0; i<=lastValIndex; i++) {
                    if (!Page_Validators[i].isvalid && typeof(Page_Validators[i].errormessage) == "string") {
                        switch (summary.displaymode) {
                            case "List":
                                s += Page_Validators[i].errormessage;
                                if (i < lastValIndex) {
                                    s += "\r\n";
                                }
                                break;
                            case "BulletList":
                            default:
                                s += "- " + Page_Validators[i].errormessage;
                                if (i < lastValIndex) {
                                    s += "\r\n";
                                }
                                break;
                            case "SingleParagraph":
                                s += Page_Validators[i].errormessage + " ";
                                break;
                        }
                    }
                }
                alert(s);
            }
        }
    }
}
if (window.jQuery) {
    (function ($) {
        var dataValidationAttribute = "data-val",
            dataValidationSummaryAttribute = "data-valsummary",
            normalizedAttributes = { validationgroup: "validationGroup", focusonerror: "focusOnError" };
        function getAttributesWithPrefix(element, prefix) {
            var i,
                attribute,
                list = {},
                attributes = element.attributes,
                length = attributes.length,
                prefixLength = prefix.length;
            prefix = prefix.toLowerCase();
            for (i = 0; i < length; i++) {
                attribute = attributes[i];
                if (attribute.specified && attribute.name.substr(0, prefixLength).toLowerCase() === prefix) {
                    list[attribute.name.substr(prefixLength)] = attribute.value;
                }
            }
            return list;
        }
        function normalizeKey(key) {
            key = key.toLowerCase();
            return normalizedAttributes[key] === undefined ? key : normalizedAttributes[key];
        }
        function addValidationExpando(element) {
            var attributes = getAttributesWithPrefix(element, dataValidationAttribute + "-");
            $.each(attributes, function (key, value) {
                element[normalizeKey(key)] = value;
            });
        }
        function dispose(element) {
            var index = $.inArray(element, Page_Validators);
            if (index >= 0) {
                Page_Validators.splice(index, 1);
            }
        }
        function addNormalizedAttribute(name, normalizedName) {
            normalizedAttributes[name.toLowerCase()] = normalizedName;
        }
        function parseSpecificAttribute(selector, attribute, validatorsArray) {
            return $(selector).find("[" + attribute + "='true']").each(function (index, element) {
                addValidationExpando(element);
                element.dispose = function () { dispose(element); element.dispose = null; };
                if ($.inArray(element, validatorsArray) === -1) {
                    validatorsArray.push(element);
                }
            }).length;
        }
        function parse(selector) {
            var length = parseSpecificAttribute(selector, dataValidationAttribute, Page_Validators);
            length += parseSpecificAttribute(selector, dataValidationSummaryAttribute, Page_ValidationSummaries);
            return length;
        }
        function loadValidators() {
            if (typeof (ValidatorOnLoad) === "function") {
                ValidatorOnLoad();
            }
            if (typeof (ValidatorOnSubmit) === "undefined") {
                window.ValidatorOnSubmit = function () {
                    return Page_ValidationActive ? ValidatorCommonOnSubmit() : true;
                };
            }
        }
        function registerUpdatePanel() {
            if (window.Sys && Sys.WebForms && Sys.WebForms.PageRequestManager) {
                var prm = Sys.WebForms.PageRequestManager.getInstance(),
                    postBackElement, endRequestHandler;
                if (prm.get_isInAsyncPostBack()) {
                    endRequestHandler = function (sender, args) {
                        if (parse(document)) {
                            loadValidators();
                        }
                        prm.remove_endRequest(endRequestHandler);
                        endRequestHandler = null;
                    };
                    prm.add_endRequest(endRequestHandler);
                }
                prm.add_beginRequest(function (sender, args) {
                    postBackElement = args.get_postBackElement();
                });
                prm.add_pageLoaded(function (sender, args) {
                    var i, panels, valFound = 0;
                    if (typeof (postBackElement) === "undefined") {
                        return;
                    }
                    panels = args.get_panelsUpdated();
                    for (i = 0; i < panels.length; i++) {
                        valFound += parse(panels[i]);
                    }
                    panels = args.get_panelsCreated();
                    for (i = 0; i < panels.length; i++) {
                        valFound += parse(panels[i]);
                    }
                    if (valFound) {
                        loadValidators();
                    }
                });
            }
        }
        $(function () {
            if (typeof (Page_Validators) === "undefined") {
                window.Page_Validators = [];
            }
            if (typeof (Page_ValidationSummaries) === "undefined") {
                window.Page_ValidationSummaries = [];
            }
            if (typeof (Page_ValidationActive) === "undefined") {
                window.Page_ValidationActive = false;
            }
            $.WebFormValidator = {
                addNormalizedAttribute: addNormalizedAttribute,
                parse: parse
            };
            if (parse(document)) {
                loadValidators();
            }
            registerUpdatePanel();
        });
    } (jQuery));
}

function WebForm_PostBackOptions(eventTarget, eventArgument, validation, validationGroup, actionUrl, trackFocus, clientSubmit) {
  this.eventTarget = eventTarget;
  this.eventArgument = eventArgument;
  this.validation = validation;
  this.validationGroup = validationGroup;
  this.actionUrl = actionUrl;
  this.trackFocus = trackFocus;
  this.clientSubmit = clientSubmit;
}
function WebForm_DoPostBackWithOptions(options) {
  var validationResult = true;
  if (options.validation) {
      if (typeof(Page_ClientValidate) == 'function') {
          validationResult = Page_ClientValidate(options.validationGroup);
      }
  }
  if (validationResult) {
      if ((typeof(options.actionUrl) != "undefined") && (options.actionUrl != null) && (options.actionUrl.length > 0)) {
          theForm.action = options.actionUrl;
      }
      if (options.trackFocus) {
          var lastFocus = theForm.elements["__LASTFOCUS"];
          if ((typeof(lastFocus) != "undefined") && (lastFocus != null)) {
              if (typeof(document.activeElement) == "undefined") {
                  lastFocus.value = options.eventTarget;
              }
              else {
                  var active = document.activeElement;
                  if ((typeof(active) != "undefined") && (active != null)) {
                      if ((typeof(active.id) != "undefined") && (active.id != null) && (active.id.length > 0)) {
                          lastFocus.value = active.id;
                      }
                      else if (typeof(active.name) != "undefined") {
                          lastFocus.value = active.name;
                      }
                  }
              }
          }
      }
  }
  if (options.clientSubmit) {
      __doPostBack(options.eventTarget, options.eventArgument);
  }
}
var __pendingCallbacks = new Array();
var __synchronousCallBackIndex = -1;
function WebForm_DoCallback(eventTarget, eventArgument, eventCallback, context, errorCallback, useAsync) {
  var postData = __theFormPostData +
              "__CALLBACKID=" + WebForm_EncodeCallback(eventTarget) +
              "&__CALLBACKPARAM=" + WebForm_EncodeCallback(eventArgument);
  if (theForm["__EVENTVALIDATION"]) {
      postData += "&__EVENTVALIDATION=" + WebForm_EncodeCallback(theForm["__EVENTVALIDATION"].value);
  }
  var xmlRequest,e;
  try {
      xmlRequest = new XMLHttpRequest();
  }
  catch(e) {
      try {
          xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
      }
      catch(e) {
      }
  }
  var setRequestHeaderMethodExists = true;
  try {
      setRequestHeaderMethodExists = (xmlRequest && xmlRequest.setRequestHeader);
  }
  catch(e) {}
  var callback = new Object();
  callback.eventCallback = eventCallback;
  callback.context = context;
  callback.errorCallback = errorCallback;
  callback.async = useAsync;
  var callbackIndex = WebForm_FillFirstAvailableSlot(__pendingCallbacks, callback);
  if (!useAsync) {
      if (__synchronousCallBackIndex != -1) {
          __pendingCallbacks[__synchronousCallBackIndex] = null;
      }
      __synchronousCallBackIndex = callbackIndex;
  }
  if (setRequestHeaderMethodExists) {
      xmlRequest.onreadystatechange = WebForm_CallbackComplete;
      callback.xmlRequest = xmlRequest;
      // e.g. http:
      var action = theForm.action || document.location.pathname, fragmentIndex = action.indexOf('#');
      if (fragmentIndex !== -1) {
          action = action.substr(0, fragmentIndex);
      }
      if (!__nonMSDOMBrowser) {
          var domain = "";
          var path = action;
          var query = "";
          var queryIndex = action.indexOf('?');
          if (queryIndex !== -1) {
              query = action.substr(queryIndex);
              path = action.substr(0, queryIndex);
          }
          if (path.indexOf("%") === -1) {
              // domain may or may not be present (e.g. action of "foo.aspx" vs "http:
              if (/^https?\:\/\/.*$/gi.test(path)) {
                  var domainPartIndex = path.indexOf("\/\/") + 2;
                  var slashAfterDomain = path.indexOf("/", domainPartIndex);
                  if (slashAfterDomain === -1) {
                      // entire url is the domain (e.g. "http:
                      domain = path;
                      path = "";
                  }
                  else {
                      domain = path.substr(0, slashAfterDomain);
                      path = path.substr(slashAfterDomain);
                  }
              }
              action = domain + encodeURI(path) + query;
          }
      }
      xmlRequest.open("POST", action, true);
      xmlRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
      xmlRequest.send(postData);
      return;
  }
  callback.xmlRequest = new Object();
  var callbackFrameID = "__CALLBACKFRAME" + callbackIndex;
  var xmlRequestFrame = document.frames[callbackFrameID];
  if (!xmlRequestFrame) {
      xmlRequestFrame = document.createElement("IFRAME");
      xmlRequestFrame.width = "1";
      xmlRequestFrame.height = "1";
      xmlRequestFrame.frameBorder = "0";
      xmlRequestFrame.id = callbackFrameID;
      xmlRequestFrame.name = callbackFrameID;
      xmlRequestFrame.style.position = "absolute";
      xmlRequestFrame.style.top = "-100px"
      xmlRequestFrame.style.left = "-100px";
      try {
          if (callBackFrameUrl) {
              xmlRequestFrame.src = callBackFrameUrl;
          }
      }
      catch(e) {}
      document.body.appendChild(xmlRequestFrame);
  }
  var interval = window.setInterval(function() {
      xmlRequestFrame = document.frames[callbackFrameID];
      if (xmlRequestFrame && xmlRequestFrame.document) {
          window.clearInterval(interval);
          xmlRequestFrame.document.write("");
          xmlRequestFrame.document.close();
          xmlRequestFrame.document.write('<html><body><form method="post"><input type="hidden" name="__CALLBACKLOADSCRIPT" value="t"></form></body></html>');
          xmlRequestFrame.document.close();
          xmlRequestFrame.document.forms[0].action = theForm.action;
          var count = __theFormPostCollection.length;
          var element;
          for (var i = 0; i < count; i++) {
              element = __theFormPostCollection[i];
              if (element) {
                  var fieldElement = xmlRequestFrame.document.createElement("INPUT");
                  fieldElement.type = "hidden";
                  fieldElement.name = element.name;
                  fieldElement.value = element.value;
                  xmlRequestFrame.document.forms[0].appendChild(fieldElement);
              }
          }
          var callbackIdFieldElement = xmlRequestFrame.document.createElement("INPUT");
          callbackIdFieldElement.type = "hidden";
          callbackIdFieldElement.name = "__CALLBACKID";
          callbackIdFieldElement.value = eventTarget;
          xmlRequestFrame.document.forms[0].appendChild(callbackIdFieldElement);
          var callbackParamFieldElement = xmlRequestFrame.document.createElement("INPUT");
          callbackParamFieldElement.type = "hidden";
          callbackParamFieldElement.name = "__CALLBACKPARAM";
          callbackParamFieldElement.value = eventArgument;
          xmlRequestFrame.document.forms[0].appendChild(callbackParamFieldElement);
          if (theForm["__EVENTVALIDATION"]) {
              var callbackValidationFieldElement = xmlRequestFrame.document.createElement("INPUT");
              callbackValidationFieldElement.type = "hidden";
              callbackValidationFieldElement.name = "__EVENTVALIDATION";
              callbackValidationFieldElement.value = theForm["__EVENTVALIDATION"].value;
              xmlRequestFrame.document.forms[0].appendChild(callbackValidationFieldElement);
          }
          var callbackIndexFieldElement = xmlRequestFrame.document.createElement("INPUT");
          callbackIndexFieldElement.type = "hidden";
          callbackIndexFieldElement.name = "__CALLBACKINDEX";
          callbackIndexFieldElement.value = callbackIndex;
          xmlRequestFrame.document.forms[0].appendChild(callbackIndexFieldElement);
          xmlRequestFrame.document.forms[0].submit();
      }
  }, 10);
}
function WebForm_CallbackComplete() {
  for (var i = 0; i < __pendingCallbacks.length; i++) {
      callbackObject = __pendingCallbacks[i];
      if (callbackObject && callbackObject.xmlRequest && (callbackObject.xmlRequest.readyState == 4)) {
          if (!__pendingCallbacks[i].async) {
              __synchronousCallBackIndex = -1;
          }
          __pendingCallbacks[i] = null;
          var callbackFrameID = "__CALLBACKFRAME" + i;
          var xmlRequestFrame = document.getElementById(callbackFrameID);
          if (xmlRequestFrame) {
              xmlRequestFrame.parentNode.removeChild(xmlRequestFrame);
          }
          WebForm_ExecuteCallback(callbackObject);
      }
  }
}
function WebForm_ExecuteCallback(callbackObject) {
  var response = callbackObject.xmlRequest.responseText;
  if (response.charAt(0) == "s") {
      if ((typeof(callbackObject.eventCallback) != "undefined") && (callbackObject.eventCallback != null)) {
          callbackObject.eventCallback(response.substring(1), callbackObject.context);
      }
  }
  else if (response.charAt(0) == "e") {
      if ((typeof(callbackObject.errorCallback) != "undefined") && (callbackObject.errorCallback != null)) {
          callbackObject.errorCallback(response.substring(1), callbackObject.context);
      }
  }
  else {
      var separatorIndex = response.indexOf("|");
      if (separatorIndex != -1) {
          var validationFieldLength = parseInt(response.substring(0, separatorIndex));
          if (!isNaN(validationFieldLength)) {
              var validationField = response.substring(separatorIndex + 1, separatorIndex + validationFieldLength + 1);
              if (validationField != "") {
                  var validationFieldElement = theForm["__EVENTVALIDATION"];
                  if (!validationFieldElement) {
                      validationFieldElement = document.createElement("INPUT");
                      validationFieldElement.type = "hidden";
                      validationFieldElement.name = "__EVENTVALIDATION";
                      theForm.appendChild(validationFieldElement);
                  }
                  validationFieldElement.value = validationField;
              }
              if ((typeof(callbackObject.eventCallback) != "undefined") && (callbackObject.eventCallback != null)) {
                  callbackObject.eventCallback(response.substring(separatorIndex + validationFieldLength + 1), callbackObject.context);
              }
          }
      }
  }
}
function WebForm_FillFirstAvailableSlot(array, element) {
  var i;
  for (i = 0; i < array.length; i++) {
      if (!array[i]) break;
  }
  array[i] = element;
  return i;
}
var __nonMSDOMBrowser = (window.navigator.appName.toLowerCase().indexOf('explorer') == -1);
var __theFormPostData = "";
var __theFormPostCollection = new Array();
var __callbackTextTypes = /^(text|password|hidden|search|tel|url|email|number|range|color|datetime|date|month|week|time|datetime-local)$/i;
function WebForm_InitCallback() {
  var formElements = theForm.elements,
      count = formElements.length,
      element;
  for (var i = 0; i < count; i++) {
      element = formElements[i];
      var tagName = element.tagName.toLowerCase();
      if (tagName == "input") {
          var type = element.type;
          if ((__callbackTextTypes.test(type) || ((type == "checkbox" || type == "radio") && element.checked))
              && (element.id != "__EVENTVALIDATION")) {
              WebForm_InitCallbackAddField(element.name, element.value);
          }
      }
      else if (tagName == "select") {
          var selectCount = element.options.length;
          for (var j = 0; j < selectCount; j++) {
              var selectChild = element.options[j];
              if (selectChild.selected == true) {
                  WebForm_InitCallbackAddField(element.name, element.value);
              }
          }
      }
      else if (tagName == "textarea") {
          WebForm_InitCallbackAddField(element.name, element.value);
      }
  }
}
function WebForm_InitCallbackAddField(name, value) {
  var nameValue = new Object();
  nameValue.name = name;
  nameValue.value = value;
  __theFormPostCollection[__theFormPostCollection.length] = nameValue;
  __theFormPostData += WebForm_EncodeCallback(name) + "=" + WebForm_EncodeCallback(value) + "&";
}
function WebForm_EncodeCallback(parameter) {
  if (encodeURIComponent) {
      return encodeURIComponent(parameter);
  }
  else {
      return escape(parameter);
  }
}
var __disabledControlArray = new Array();
function WebForm_ReEnableControls() {
  if (typeof(__enabledControlArray) == 'undefined') {
      return false;
  }
  var disabledIndex = 0;
  for (var i = 0; i < __enabledControlArray.length; i++) {
      var c;
      if (__nonMSDOMBrowser) {
          c = document.getElementById(__enabledControlArray[i]);
      }
      else {
          c = document.all[__enabledControlArray[i]];
      }
      if ((typeof(c) != "undefined") && (c != null) && (c.disabled == true)) {
          c.disabled = false;
          __disabledControlArray[disabledIndex++] = c;
      }
  }
  setTimeout("WebForm_ReDisableControls()", 0);
  return true;
}
function WebForm_ReDisableControls() {
  for (var i = 0; i < __disabledControlArray.length; i++) {
      __disabledControlArray[i].disabled = true;
  }
}
function WebForm_SimulateClick(element, event) {
  var clickEvent;
  if (element) {
      if (element.click) {
          element.click();
      } else {
          clickEvent = document.createEvent("MouseEvents");
          clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
          if (!element.dispatchEvent(clickEvent)) {
              return true;
          }
      }
      event.cancelBubble = true;
      if (event.stopPropagation) {
          event.stopPropagation();
      }
      return false;
  }
  return true;
}
function WebForm_FireDefaultButton(event, target) {
  if (event.keyCode == 13) {
      var src = event.srcElement || event.target;
      if (src &&
          ((src.tagName.toLowerCase() == "input") &&
           (src.type.toLowerCase() == "submit" || src.type.toLowerCase() == "button")) ||
          ((src.tagName.toLowerCase() == "a") &&
           (src.href != null) && (src.href != "")) ||
          (src.tagName.toLowerCase() == "textarea")) {
          return true;
      }
      var defaultButton;
      if (__nonMSDOMBrowser) {
          defaultButton = document.getElementById(target);
      }
      else {
          defaultButton = document.all[target];
      }
      if (defaultButton) {
          return WebForm_SimulateClick(defaultButton, event);
      }
  }
  return true;
}
function WebForm_GetScrollX() {
  if (__nonMSDOMBrowser) {
      return window.pageXOffset;
  }
  else {
      if (document.documentElement && document.documentElement.scrollLeft) {
          return document.documentElement.scrollLeft;
      }
      else if (document.body) {
          return document.body.scrollLeft;
      }
  }
  return 0;
}
function WebForm_GetScrollY() {
  if (__nonMSDOMBrowser) {
      return window.pageYOffset;
  }
  else {
      if (document.documentElement && document.documentElement.scrollTop) {
          return document.documentElement.scrollTop;
      }
      else if (document.body) {
          return document.body.scrollTop;
      }
  }
  return 0;
}
function WebForm_SaveScrollPositionSubmit() {
  if (__nonMSDOMBrowser) {
      theForm.elements['__SCROLLPOSITIONY'].value = window.pageYOffset;
      theForm.elements['__SCROLLPOSITIONX'].value = window.pageXOffset;
  }
  else {
      theForm.__SCROLLPOSITIONX.value = WebForm_GetScrollX();
      theForm.__SCROLLPOSITIONY.value = WebForm_GetScrollY();
  }
  if ((typeof(this.oldSubmit) != "undefined") && (this.oldSubmit != null)) {
      return this.oldSubmit();
  }
  return true;
}
function WebForm_SaveScrollPositionOnSubmit() {
  theForm.__SCROLLPOSITIONX.value = WebForm_GetScrollX();
  theForm.__SCROLLPOSITIONY.value = WebForm_GetScrollY();
  if ((typeof(this.oldOnSubmit) != "undefined") && (this.oldOnSubmit != null)) {
      return this.oldOnSubmit();
  }
  return true;
}
function WebForm_RestoreScrollPosition() {
  if (__nonMSDOMBrowser) {
      window.scrollTo(theForm.elements['__SCROLLPOSITIONX'].value, theForm.elements['__SCROLLPOSITIONY'].value);
  }
  else {
      window.scrollTo(theForm.__SCROLLPOSITIONX.value, theForm.__SCROLLPOSITIONY.value);
  }
  if ((typeof(theForm.oldOnLoad) != "undefined") && (theForm.oldOnLoad != null)) {
      return theForm.oldOnLoad();
  }
  return true;
}
function WebForm_TextBoxKeyHandler(event) {
  if (event.keyCode == 13) {
      var target;
      if (__nonMSDOMBrowser) {
          target = event.target;
      }
      else {
          target = event.srcElement;
      }
      if ((typeof(target) != "undefined") && (target != null)) {
          if (typeof(target.onchange) != "undefined") {
              target.onchange();
              event.cancelBubble = true;
              if (event.stopPropagation) event.stopPropagation();
              return false;
          }
      }
  }
  return true;
}
function WebForm_TrimString(value) {
  return value.replace(/^\s+|\s+$/g, '')
}
function WebForm_AppendToClassName(element, className) {
  var currentClassName = ' ' + WebForm_TrimString(element.className) + ' ';
  className = WebForm_TrimString(className);
  var index = currentClassName.indexOf(' ' + className + ' ');
  if (index === -1) {
      element.className = (element.className === '') ? className : element.className + ' ' + className;
  }
}
function WebForm_RemoveClassName(element, className) {
  var currentClassName = ' ' + WebForm_TrimString(element.className) + ' ';
  className = WebForm_TrimString(className);
  var index = currentClassName.indexOf(' ' + className + ' ');
  if (index >= 0) {
      element.className = WebForm_TrimString(currentClassName.substring(0, index) + ' ' +
          currentClassName.substring(index + className.length + 1, currentClassName.length));
  }
}
function WebForm_GetElementById(elementId) {
  if (document.getElementById) {
      return document.getElementById(elementId);
  }
  else if (document.all) {
      return document.all[elementId];
  }
  else return null;
}
function WebForm_GetElementByTagName(element, tagName) {
  var elements = WebForm_GetElementsByTagName(element, tagName);
  if (elements && elements.length > 0) {
      return elements[0];
  }
  else return null;
}
function WebForm_GetElementsByTagName(element, tagName) {
  if (element && tagName) {
      if (element.getElementsByTagName) {
          return element.getElementsByTagName(tagName);
      }
      if (element.all && element.all.tags) {
          return element.all.tags(tagName);
      }
  }
  return null;
}
function WebForm_GetElementDir(element) {
  if (element) {
      if (element.dir) {
          return element.dir;
      }
      return WebForm_GetElementDir(element.parentNode);
  }
  return "ltr";
}
function WebForm_GetElementPosition(element) {
  var result = new Object();
  result.x = 0;
  result.y = 0;
  result.width = 0;
  result.height = 0;
  if (element.offsetParent) {
      result.x = element.offsetLeft;
      result.y = element.offsetTop;
      var parent = element.offsetParent;
      while (parent) {
          result.x += parent.offsetLeft;
          result.y += parent.offsetTop;
          var parentTagName = parent.tagName.toLowerCase();
          if (parentTagName != "table" &&
              parentTagName != "body" &&
              parentTagName != "html" &&
              parentTagName != "div" &&
              parent.clientTop &&
              parent.clientLeft) {
              result.x += parent.clientLeft;
              result.y += parent.clientTop;
          }
          parent = parent.offsetParent;
      }
  }
  else if (element.left && element.top) {
      result.x = element.left;
      result.y = element.top;
  }
  else {
      if (element.x) {
          result.x = element.x;
      }
      if (element.y) {
          result.y = element.y;
      }
  }
  if (element.offsetWidth && element.offsetHeight) {
      result.width = element.offsetWidth;
      result.height = element.offsetHeight;
  }
  else if (element.style && element.style.pixelWidth && element.style.pixelHeight) {
      result.width = element.style.pixelWidth;
      result.height = element.style.pixelHeight;
  }
  return result;
}
function WebForm_GetParentByTagName(element, tagName) {
  var parent = element.parentNode;
  var upperTagName = tagName.toUpperCase();
  while (parent && (parent.tagName.toUpperCase() != upperTagName)) {
      parent = parent.parentNode ? parent.parentNode : parent.parentElement;
  }
  return parent;
}
function WebForm_SetElementHeight(element, height) {
  if (element && element.style) {
      element.style.height = height + "px";
  }
}
function WebForm_SetElementWidth(element, width) {
  if (element && element.style) {
      element.style.width = width + "px";
  }
}
function WebForm_SetElementX(element, x) {
  if (element && element.style) {
      element.style.left = x + "px";
  }
}
function WebForm_SetElementY(element, y) {
  if (element && element.style) {
      element.style.top = y + "px";
  }
}

function validatorIsValide(n, t, i) {
  var r = { IsValid: !0, Value: i.Value };
  return t(n, r), r.IsValid;
}
function leesDatum(n) {
  var e = /([0-9]{1,2})-([0-9]{1,2})-([0-9]{4,4})/,
      o = /([0-9]{4,4})-([0-9]{1,2})-([0-9]{1,2})/;
  if (e.test(n)) {
      var i = e.exec(n),
          r = parseInt(i[1], 10),
          u = parseInt(i[2], 10) - 1,
          f = parseInt(i[3], 10),
          t = new Date(f, u, r);
      if (t.getDate() == r && t.getMonth() == u && t.getFullYear() == f) return t;
  } else if (o.test(n)) {
      var i = o.exec(n),
          r = parseInt(i[3], 10),
          u = parseInt(i[2], 10) - 1,
          f = parseInt(i[1], 10),
          t = new Date(f, u, r);
      if (t.getDate() == r && t.getMonth() == u && t.getFullYear() == f) return t;
  }
  return null;
}
function valideerSoortRegeling(n, t) {
  var i = jQuery("input.regelingsoort:checked");
  t.IsValid = i.length || document.getElementById("AlleSoorten").checked;
}
function valideerBES(n, t) {
  t.IsValid = !document.getElementById("OokBES").checked || !document.getElementById("AlleenBES").checked;
}
function valideerDatum(n, t) {
  if (!t.Value) {
      t.IsValid = !0;
      return;
  }
  var i = leesDatum(t.Value);
  t.IsValid = i !== null && i.getTime() <= new Date().getTime();
}
function valideerJaar(n, t) {
  var i = new Date(),
      r = i.getFullYear();
  t.IsValid = /([1-2][0-9]{3,3})/.test(t.Value);
}
function valideerDatumOptioneel(n, t) {
  t.IsValid = t.Value == "" ? !0 : validatorIsValide(n, valideerDatum, t);
}
// function valideerDatum01052002(n, t) {
//   if (
//       validatorIsValide(n, valideerDatum, t) &&
//       validatorIsValide(n, valideerDatum01052003, t) &&
//       validatorIsValide(n, valideerDatum01012005, t) &&
//       validatorIsValide(n, valideerDatum01052005, t) &&
//       validatorIsValide(n, valideerDatum10102010, t) &&
//       (document.getElementById("AlleSoorten").checked || document.getElementById("Wetten").checked || document.getElementById("AMvB").checked || document.getElementById("Reglementen").checked)
//   ) {
//       var i = leesDatum(t.Value);
//       t.IsValid = i.getTime() >= new Date(2002, 4, 1).getTime();
//   }
// }
// function valideerDatum01052003(n, t) {
//   if (
//       validatorIsValide(n, valideerDatum, t) &&
//       validatorIsValide(n, valideerDatum01012005, t) &&
//       validatorIsValide(n, valideerDatum01052005, t) &&
//       validatorIsValide(n, valideerDatum10102010, t) &&
//       (document.getElementById("AlleSoorten").checked || document.getElementById("MinR").checked)
//   ) {
//       var i = leesDatum(t.Value);
//       t.IsValid = i.getTime() >= new Date(2003, 4, 1).getTime();
//   }
// }
// function valideerDatum01012005(n, t) {
//   if (
//       validatorIsValide(n, valideerDatum, t) &&
//       validatorIsValide(n, valideerDatum01052005, t) &&
//       validatorIsValide(n, valideerDatum10102010, t) &&
//       (document.getElementById("AlleSoorten").checked || document.getElementById("Verdrag").checked)
//   ) {
//       var i = leesDatum(t.Value);
//       t.IsValid = i.getTime() >= new Date(2005, 0, 1).getTime();
//   }
// }
// function valideerDatum01052005(n, t) {
//   if (
//       validatorIsValide(n, valideerDatum, t) &&
//       validatorIsValide(n, valideerDatum10102010, t) &&
//       (document.getElementById("AlleSoorten").checked || document.getElementById("Beleid").checked || document.getElementById("Circulaires").checked || document.getElementById("ZBO").checked || document.getElementById("Bedrijf").checked)
//   ) {
//       var i = leesDatum(t.Value);
//       t.IsValid = i.getTime() >= new Date(2005, 4, 1).getTime();
//   }
// }
// function valideerDatum10102010(n, t) {
//   if (validatorIsValide(n, valideerDatum, t) && (document.getElementById("OokBES").checked || document.getElementById("AlleenBES").checked)) {
//       var i = leesDatum(t.Value);
//       t.IsValid = i.getTime() >= new Date(2010, 9, 10).getTime();
//   }
// }

function valideerDatum01052002(src, args) {
  if (!validatorIsValide(src, valideerDatum, args) || !validatorIsValide(src, valideerDatum01052003, args) || !validatorIsValide(src, valideerDatum01012005, args) || !validatorIsValide(src, valideerDatum01052005, args) || !validatorIsValide(src, valideerDatum10102010, args))
      return;

  if (document.getElementById('AlleSoorten').checked  || document.getElementById('Wetten').checked || document.getElementById('AMvB').checked || document.getElementById('Reglementen').checked)
  {
      var datum = leesDatum(args.Value);
      args.IsValid = datum.getTime() >= new Date(2002, 4, 1).getTime();
  }
}

function valideerDatum01052003(src, args) {
  if (!validatorIsValide(src, valideerDatum, args) || !validatorIsValide(src, valideerDatum01012005, args) || !validatorIsValide(src, valideerDatum01052005, args) || !validatorIsValide(src, valideerDatum10102010, args))
      return;

  if (document.getElementById('AlleSoorten').checked || document.getElementById('MinR').checked)
  {
      var datum = leesDatum(args.Value);
      args.IsValid = datum.getTime() >= new Date(2003, 4, 1).getTime();
  }
}
function valideerDatum01012005(src, args) {
  if (!validatorIsValide(src, valideerDatum, args) || !validatorIsValide(src, valideerDatum01052005, args) || !validatorIsValide(src, valideerDatum10102010, args))
      return;

  if (document.getElementById('AlleSoorten').checked || document.getElementById('Verdrag').checked)
  {
      var datum = leesDatum(args.Value);
      args.IsValid = datum.getTime() >= new Date(2005, 0, 1).getTime();
  }
}

function valideerDatum01052005(src, args) {
  if (!validatorIsValide(src, valideerDatum, args) || !validatorIsValide(src, valideerDatum10102010, args))
      return;

  if (document.getElementById('AlleSoorten').checked || document.getElementById('Beleid').checked || document.getElementById('Circulaires').checked || document.getElementById('ZBO').checked || document.getElementById('Bedrijf').checked) {
      var datum = leesDatum(args.Value);
      args.IsValid = datum.getTime() >= new Date(2005, 4, 1).getTime();
  }
}

function valideerDatum10102010(src, args) {
  if (!validatorIsValide(src, valideerDatum, args))
      return;

  if (document.getElementById('OokBES').checked || document.getElementById('AlleenBES').checked)
  {
      var datum = leesDatum(args.Value);
      args.IsValid = datum.getTime() >= new Date(2010, 9, 10).getTime();
  }
}
function valideerDatumBeforeZichtdatum (src, args) {
  var zichtdatum = document.getElementById('ZoekOp_Zichtdatum');

  var datumZichtdatum = leesDatum(zichtdatum.value);
  var datumGeldig = leesDatum(args.Value);

  args.IsValid = datumGeldig.getTime() <= datumZichtdatum.getTime();
}

function valideerBronPublicatie(n,t){
    if(t.Value != "") {
        if(document.getElementById("ZoekOp_BronPublicatieJaar").value === "" || document.getElementById("ZoekOp_BronPublicatieNummer").value === ""){
            t.IsValid = false;
        } else {
            t.IsValid = true;
        }
    } else {
        t.IsValid = true;
    }
}
function valideerBronPublicatieJaar(n,t){
  // t.IsValid=document.getElementById("ZoekOp_BronPublicatie").value==""||document.getElementById("ZoekOp_BronPublicatieJaar").value=="jaar"?!0:validatorIsValide(n,valideerJaar,t)}
  // t.IsValid=document.getElementById("ZoekOp_BronPublicatieJaar").value=="jaar"?!0:validatorIsValide(n,valideerJaar,t)}
  if(validatorIsValide(n,valideerJaar,t)){
    var i = new Date(),
      r = i.getFullYear();
      if(t.Value >= "1815" && t.Value <= r) {
        t.IsValid = true;
      } else {
        t.IsValid = false;
      }
  } else {
    t.IsValid = false;
  }
}



/*function valideerBronPublicatieJaar(n, t) {
  document.getElementById("ZoekOp_BronPublicatieJaar").blur();
  document.getElementById("ZoekOp_BronPublicatieNummer").blur();
  if(document.getElementById("ZoekOp_BronPublicatieJaar").value == "") {
    t.IsValid = true;
  }
  t.IsValid = document.getElementById("ZoekOp_BronPublicatie").value == "" || document.getElementById("ZoekOp_BronPublicatieJaar").value == "jaar" ? !0 : validatorIsValide(n, valideerJaar, t);

}*/
function valideerBronPublicatieNummer(n, t) {
  // document.getElementById("ZoekOp_BronPublicatieJaar").blur();
  // document.getElementById("ZoekOp_BronPublicatieNummer").blur();
  // t.IsValid = document.getElementById("ZoekOp_BronPublicatieJaar").value != "jaar" && (!t.Value || t.Value === document.getElementById(n.controltovalidate).txt || /^[0-9]+$/gi.test(t.Value));

//   if(document.getElementById("ZoekOp_BronPublicatie").value != ""){
    if((!t.Value || t.Value === document.getElementById(n.controltovalidate).txt || /^[0-9]+$/gi.test(t.Value))) {
      t.IsValid = true;
    } else {
      t.IsValid = false;
    }
    // t.IsValid = false;
  // } else {
  //   t.IsValid = true;
//   } else {
    // t.IsValid = true;
//   }

}
function valideerBronPublicatieJaarEnNummer(n, t) {
  // t.IsValid = document.getElementById("ZoekOp_BronPublicatie").value == "" ? !0 : document.getElementById("ZoekOp_BronPublicatieJaar").value != "jaar" && document.getElementById("ZoekOp_BronPublicatieNummer").value != "nr";
  // t.IsValid = document.getElementById("ZoekOp_BronPublicatieNummer").value != "";
  // console.log('document.getElementById("ZoekOp_BronPublicatieNummer").value',document.getElementById("ZoekOp_BronPublicatieNummer").value);

  // document.getElementById("ZoekOp_BronPublicatieJaar").blur();
  // document.getElementById("ZoekOp_BronPublicatieNummer").blur();
  // console.log('document.getElementById("ZoekOp_BronPublicatieJaar").value',document.getElementById("ZoekOp_BronPublicatieJaar").value);
  // console.log('t.Value',t.Value);
  // if(!document.getElementById("ZoekOp_BronPublicatieJaar").value & !document.getElementById("ZoekOp_BronPublicatieNummer").value) {
  //   t.IsValid = true;
  // }

  // if(document.getElementById("ZoekOp_BronPublicatieJaar").value != "" & !document.getElementById("ZoekOp_BronPublicatieNummer").value) {
  //   t.IsValid = false;
  // } else {
  //   t.IsValid = true;
  // }
  // console.log('hey??',document.getElementById("ZoekOp_BronPublicatieJaar").value);
  if(document.getElementById("ZoekOp_BronPublicatieJaar").value != "" && document.getElementById("ZoekOp_BronPublicatieNummer").value === ""){
    t.IsValid = false;
  } else {
    t.IsValid = true;
  }



}
function valideerAangevinkteElementen(n, t) {
  t.IsValid = jQuery('input[name="regelingOnderdeel"]:checked').length > 0;
}
function valideerRichtlijnJaar(n, t) {
  t.IsValid = !t.Value || t.Value === document.getElementById(n.controltovalidate).txt || (parseInt(t.Value, 10) > 1e3 && parseInt(t.Value, 10) <= new Date().getFullYear() && t.Value >= "2007");
}
function valideerRichtlijnNummer(n, t) {
  t.IsValid = !t.Value || t.Value === document.getElementById(n.controltovalidate).txt || /^[0-9]+$/gi.test(t.Value);
}
function valideerRichtlijnJaarEnNummer(n, t) {
  if(document.getElementById("ZoekOp_BesluitnummerDeel1").value != "" && document.getElementById("ZoekOp_BesluitnummerDeel2").value === ""){
    t.IsValid = false;
  } else {
    t.IsValid = true;
  }
}
function valideerRichtlijnJaarEnNummer2(n, t) {
  if(document.getElementById("ZoekOp_BesluitnummerDeel1").value == "" && document.getElementById("ZoekOp_BesluitnummerDeel2").value != ""){
    t.IsValid = false;
  } else {
    t.IsValid = true;
  }
}
if (typeof ValidatorUpdateDisplay == "function") {
  var oudeValidatorUpdateDisplay = ValidatorUpdateDisplay;
  ValidatorUpdateDisplay = function (n) {

      var getSiblings = function (e) {
          // for collecting siblings
          let siblings = [];

          siblings.push(e);
          // if no parent, return no sibling
          if(!e.parentNode) {
              return siblings;
          }
          // first child of the parent node
          let sibling  = e.parentNode.firstChild;

          // collecting siblings
          while (sibling) {
              if (sibling.nodeType === 1 && sibling !== e) {
                  // if(sibling.classList.contains('form__error')){
                    siblings.push(sibling);
                  // }
              }
              sibling = sibling.nextSibling;
          }
          return siblings;
      };


      if (typeof n.display == "string") {
          if (n.display == "None") return;
          if (n.display == "Dynamic") {
              n.style.display = n.isvalid ? "none" : "block";

              if(document.getElementById(n.controltovalidate) !== null) {

                // set states on input;
                document.getElementById(n.controltovalidate).setAttribute("aria-invalid", false);
                document.getElementById(n.controltovalidate).classList.remove("input--error");
                document.getElementById(n.controltovalidate).removeAttribute("aria-describedby");


                var siblings = getSiblings(n);


                var errors = document.querySelectorAll('[data-validation-field]');
                for(var i = 0; i < errors.length; i++) {
                  if(errors[i].style.display === "block") {
                    document.getElementById(errors[i].getAttribute('data-validation-field')).setAttribute("aria-invalid", true);
                    document.getElementById(errors[i].getAttribute('data-validation-field')).classList.add("input--error");
                    document.getElementById(errors[i].getAttribute('data-validation-field')).setAttribute("aria-describedby", errors[i].getAttribute("id"));
                  }
                }

              }
              return;
          }
      }
      navigator.userAgent.indexOf("Mac") > -1 && navigator.userAgent.indexOf("MSIE") > -1 && (n.style.display = "block");
      n.style.visibility = n.isvalid ? "hidden" : "visible";


  };
}

jQuery('.js-aangevinkteelementen').on('click', function(e){
  if(jQuery('input[name="regelingOnderdeel"]:checked').length <= 0) {
    var errorMessage = document.getElementById('ctl00_cphContent_ZoekresultaatStandaard_validatorAangevinkteElementen');
    errorMessage.removeAttribute('hidden');
    e.preventDefault();
  }
});

var formType = document.querySelector('[data-bwbvalidation-form]');
if(formType) {
  formType = formType.getAttribute('data-bwbvalidation-form');

  var formActive = false;

  /* EENVOUDIG ZOEKEN */
  if(formType === 'eenvoudig') {
    formActive = true;

    // var Page_ValidationSummaries =  new Array(document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_ValidationSummary"));
    var Page_Validators =  new Array(document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerRegelingen"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerBES"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerTitel"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerTekst"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_rfvGeldigheidsdatum"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum10102010"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052005"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01012005"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052003"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052002"));

    // var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_ValidationSummary = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_ValidationSummary"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_ValidationSummary");
    // ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_ValidationSummary.showsummary = "False";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerRegelingen = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerRegelingen"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerRegelingen");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerRegelingen.errormessage = "Geen regelingsoort geselecteerd.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerRegelingen.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerRegelingen.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerRegelingen.clientvalidationfunction = "valideerSoortRegeling";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerRegelingen.validateemptytext = "true";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerBES = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerBES"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerBES");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerBES.errormessage = "U moet één van de volgende keuzes selecteren: \'Ook zoeken in regelingen BES\' of \'Alleen zoeken in regelingen BES\'.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerBES.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerBES.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerBES.clientvalidationfunction = "valideerBES";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerBES.validateemptytext = "true";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerTitel = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerTitel"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerTitel");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerTitel.controltovalidate = "ZoekOp_Titel";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerTitel.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerTitel.evaluationfunction = "CustomValidatorEvaluateIsValid";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerTekst = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerTekst"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerTekst");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerTekst.controltovalidate = "ZoekOp_Tekst";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerTekst.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerTekst.evaluationfunction = "CustomValidatorEvaluateIsValid";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_rfvGeldigheidsdatum = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_rfvGeldigheidsdatum"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_rfvGeldigheidsdatum");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_rfvGeldigheidsdatum.controltovalidate = "ZoekOp_Geldigheidsdatum";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_rfvGeldigheidsdatum.errormessage = "Er is geen zoekdatum opgegeven.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_rfvGeldigheidsdatum.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_rfvGeldigheidsdatum.evaluationfunction = "RequiredFieldValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_rfvGeldigheidsdatum.initialvalue = "";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum.controltovalidate = "ZoekOp_Geldigheidsdatum";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum.errormessage = "Er is een ongeldige zoekdatum opgegeven.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum.clientvalidationfunction = "valideerDatum";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum10102010 = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum10102010"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum10102010");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum10102010.controltovalidate = "ZoekOp_Geldigheidsdatum";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum10102010.errormessage = "Er kan niet voor 10-10-2010 worden gezocht.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum10102010.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum10102010.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum10102010.clientvalidationfunction = "valideerDatum10102010";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052005 = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052005"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052005");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052005.controltovalidate = "ZoekOp_Geldigheidsdatum";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052005.errormessage = "Er kan niet voor 1-5-2005 worden gezocht.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052005.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052005.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052005.clientvalidationfunction = "valideerDatum01052005";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01012005 = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01012005"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01012005");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01012005.controltovalidate = "ZoekOp_Geldigheidsdatum";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01012005.errormessage = "Er kan niet voor 1-1-2005 worden gezocht.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01012005.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01012005.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01012005.clientvalidationfunction = "valideerDatum01012005";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052003 = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052003"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052003");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052003.controltovalidate = "ZoekOp_Geldigheidsdatum";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052003.errormessage = "Er kan niet voor 1-5-2003 worden gezocht.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052003.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052003.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052003.clientvalidationfunction = "valideerDatum01052003";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052002 = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052002"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052002");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052002.controltovalidate = "ZoekOp_Geldigheidsdatum";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052002.errormessage = "Er kan niet voor 1-5-2002 worden gezocht.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052002.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052002.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierStandaard_valideerDatum01052002.clientvalidationfunction = "valideerDatum01052002";

  }
  /* UITGEBREID ZOEKEN */
  if(formType === 'uitgebreid') {
    formActive = true;
    // var Page_ValidationSummaries =  new Array(document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_ValidationSummary1"));

    var Page_Validators =  new Array(document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerRegelingen"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBES"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerTitel"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerTekst"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_rfvGeldigheidsdatum"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum10102010"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052005"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01012005"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052003"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052002"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatumZichtdatum"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_rfvZichtdatum"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum10102010"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052005"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052003"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052002"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerStartdatum"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerEinddatum"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatieJaarEnNummer"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatie"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatieJaar"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBWBID"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerJuriconnectID"));
    // var Page_Validators =  new Array(document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBWBID"),document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerJuriconnectID"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatieJaar"));

    // var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_ValidationSummary1 = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_ValidationSummary1"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_ValidationSummary1");
    // ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_ValidationSummary1.showsummary = "False";

    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerRegelingen = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerRegelingen"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerRegelingen");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerRegelingen.errormessage = "Geen regelingsoort geselecteerd.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerRegelingen.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerRegelingen.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerRegelingen.clientvalidationfunction = "valideerSoortRegeling";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerRegelingen.validateemptytext = "true";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBES = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBES"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBES");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBES.errormessage = "U moet één van de volgende keuzes selecteren: \'Ook zoeken in regelingen BES\' of \'Alleen zoeken in regelingen BES\'.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBES.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBES.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBES.clientvalidationfunction = "valideerBES";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBES.validateemptytext = "true";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerTitel = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerTitel"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerTitel");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerTitel.controltovalidate = "ZoekOp_Titel";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerTitel.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerTitel.evaluationfunction = "CustomValidatorEvaluateIsValid";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerTekst = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerTekst"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerTekst");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerTekst.controltovalidate = "ZoekOp_Tekst";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerTekst.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerTekst.evaluationfunction = "CustomValidatorEvaluateIsValid";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_rfvGeldigheidsdatum = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_rfvGeldigheidsdatum"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_rfvGeldigheidsdatum");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_rfvGeldigheidsdatum.controltovalidate = "ZoekOp_Geldigheidsdatum";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_rfvGeldigheidsdatum.errormessage = "Er is geen zoekdatum opgegeven.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_rfvGeldigheidsdatum.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_rfvGeldigheidsdatum.evaluationfunction = "RequiredFieldValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_rfvGeldigheidsdatum.initialvalue = "";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum.controltovalidate = "ZoekOp_Geldigheidsdatum";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum.errormessage = "Er is een ongeldige zoekdatum opgegeven.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum.clientvalidationfunction = "valideerDatum";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum10102010 = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum10102010"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum10102010");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum10102010.controltovalidate = "ZoekOp_Geldigheidsdatum";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum10102010.errormessage = "Er kan niet voor 10-10-2010 worden gezocht.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum10102010.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum10102010.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum10102010.clientvalidationfunction = "valideerDatum10102010";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052005 = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052005"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052005");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052005.controltovalidate = "ZoekOp_Geldigheidsdatum";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052005.errormessage = "Er kan niet voor 1-5-2005 worden gezocht.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052005.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052005.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052005.clientvalidationfunction = "valideerDatum01052005";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01012005 = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01012005"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01012005");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01012005.controltovalidate = "ZoekOp_Geldigheidsdatum";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01012005.errormessage = "Er kan niet voor 1-1-2005 worden gezocht.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01012005.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01012005.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01012005.clientvalidationfunction = "valideerDatum01012005";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052003 = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052003"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052003");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052003.controltovalidate = "ZoekOp_Geldigheidsdatum";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052003.errormessage = "Er kan niet voor 1-5-2003 worden gezocht.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052003.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052003.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052003.clientvalidationfunction = "valideerDatum01052003";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052002 = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052002"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052002");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052002.controltovalidate = "ZoekOp_Geldigheidsdatum";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052002.errormessage = "Er kan niet voor 1-5-2002 worden gezocht.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052002.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052002.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatum01052002.clientvalidationfunction = "valideerDatum01052002";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatumZichtdatum = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatumZichtdatum"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatumZichtdatum");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatumZichtdatum.controltovalidate = "ZoekOp_Geldigheidsdatum";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatumZichtdatum.errormessage = "Er kan niet na de zichtdatum worden gezocht.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatumZichtdatum.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatumZichtdatum.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerDatumZichtdatum.clientvalidationfunction = "valideerDatumBeforeZichtdatum";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_rfvZichtdatum = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_rfvZichtdatum"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_rfvZichtdatum");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_rfvZichtdatum.controltovalidate = "ZoekOp_Zichtdatum";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_rfvZichtdatum.errormessage = "Er is geen zoekdatum opgegeven.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_rfvZichtdatum.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_rfvZichtdatum.evaluationfunction = "RequiredFieldValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_rfvZichtdatum.initialvalue = "";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum.controltovalidate = "ZoekOp_Zichtdatum";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum.errormessage = "Er is een ongeldige zoekdatum opgegeven.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum.clientvalidationfunction = "valideerDatum";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum10102010 = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum10102010"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum10102010");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum10102010.controltovalidate = "ZoekOp_Zichtdatum";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum10102010.errormessage = "Er kan niet voor 10-10-2010 worden gezocht.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum10102010.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum10102010.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum10102010.clientvalidationfunction = "valideerDatum10102010";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052005 = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052005"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052005");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052005.controltovalidate = "ZoekOp_Zichtdatum";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052005.errormessage = "Er kan niet voor 1-5-2005 worden gezocht.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052005.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052005.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052005.clientvalidationfunction = "valideerDatum01052005";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052003 = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052003"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052003");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052003.controltovalidate = "ZoekOp_Zichtdatum";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052003.errormessage = "Er kan niet voor 1-5-2003 worden gezocht.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052003.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052003.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052003.clientvalidationfunction = "valideerDatum01052003";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052002 = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052002"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052002");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052002.controltovalidate = "ZoekOp_Zichtdatum";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052002.errormessage = "Er kan niet voor 1-5-2002 worden gezocht.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052002.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052002.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerZichtdatum01052002.clientvalidationfunction = "valideerDatum01052002";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerStartdatum = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerStartdatum"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerStartdatum");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerStartdatum.controltovalidate = "ZoekOp_Startdatum";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerStartdatum.errormessage = "Er is een ongeldige zoekdatum opgegeven.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerStartdatum.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerStartdatum.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerStartdatum.clientvalidationfunction = "valideerDatumOptioneel";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerEinddatum = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerEinddatum"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerEinddatum");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerEinddatum.controltovalidate = "ZoekOp_Einddatum";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerEinddatum.errormessage = "Er is een ongeldige zoekdatum opgegeven.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerEinddatum.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerEinddatum.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerEinddatum.clientvalidationfunction = "valideerDatumOptioneel";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatieJaarEnNummer = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatieJaarEnNummer"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatieJaarEnNummer");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatieJaarEnNummer.controltovalidate = "ZoekOp_BronPublicatieNummer";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatieJaarEnNummer.errormessage = "Naast een publicatiejaar en soort is ook een publicatienummer vereist.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatieJaarEnNummer.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatieJaarEnNummer.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatieJaarEnNummer.clientvalidationfunction = "valideerBronPublicatieJaarEnNummer"
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatieJaarEnNummer.validateemptytext = "true";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatie = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatie"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatie");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatie.controltovalidate = "ZoekOp_BronPublicatie";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatie.errormessage = "Alle 3 nodig";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatie.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatie.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatie.clientvalidationfunction = "valideerBronPublicatie";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatie.validateemptytext = "true";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatieJaar = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatieJaar"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatieJaar");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatieJaar.controltovalidate = "ZoekOp_BronPublicatieJaar";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatieJaar.errormessage = "Ongeldig publicatiejaar opgegeven.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatieJaar.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatieJaar.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBronPublicatieJaar.clientvalidationfunction = "valideerBronPublicatieJaar";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBWBID = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBWBID"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBWBID");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBWBID.controltovalidate = "ZoekOp_BWBID";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBWBID.errormessage = "U heeft geen geldig BWB-ID ingevoerd.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBWBID.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBWBID.evaluationfunction = "RegularExpressionValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerBWBID.validationexpression = "BWB[R|V|W]\\d{4,7}";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerJuriconnectID = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerJuriconnectID"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerJuriconnectID");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerJuriconnectID.controltovalidate = "ZoekOp_JuriconnectID";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerJuriconnectID.errormessage = "U heeft geen geldig juriconnect-ID ingevoerd.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerJuriconnectID.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerJuriconnectID.evaluationfunction = "RegularExpressionValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_valideerJuriconnectID.validationexpression = "^jci1.3:c:BWB[R|V|W]\\d{4,7}.*";
    /* */
  }

  if(formType === 'eu') {

    formActive = true;

    /* EU */
    var Page_Validators =  new Array(document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaarEnNummer"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaarEnNummer2"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaar"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnNummer"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerDatum"), document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerPublicatiebladnummer"));

    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaarEnNummer = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaarEnNummer"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaarEnNummer");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaarEnNummer.controltovalidate = "ZoekOp_BesluitnummerDeel2";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaarEnNummer.errormessage = "Naast een jaar is ook een richtlijnnummer vereist.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaarEnNummer.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaarEnNummer.clientvalidationfunction = "valideerRichtlijnJaarEnNummer";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaarEnNummer.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaarEnNummer.validateemptytext = "true";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaarEnNummer2 = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaarEnNummer2"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaarEnNummer2");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaarEnNummer2.controltovalidate = "ZoekOp_BesluitnummerDeel1";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaarEnNummer2.errormessage = "Naast een richtlijnnummer is ook een jaar vereist.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaarEnNummer2.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaarEnNummer2.clientvalidationfunction = "valideerRichtlijnJaarEnNummer2";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaarEnNummer2.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaarEnNummer2.validateemptytext = "true";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaar = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaar"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaar");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaar.controltovalidate = "ZoekOp_BesluitnummerDeel1";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaar.errormessage = "Er is een ongeldig richtlijn jaar opgegeven.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaar.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaar.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnJaar.clientvalidationfunction = "valideerRichtlijnJaar";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnNummer = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnNummer"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnNummer");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnNummer.controltovalidate = "ZoekOp_BesluitnummerDeel2";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnNummer.errormessage = "Er is een ongeldig richtlijnnummer opgegeven.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnNummer.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnNummer.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerRichtlijnNummer.clientvalidationfunction = "valideerRichtlijnNummer";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerDatum = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerDatum"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerDatum");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerDatum.controltovalidate = "ZoekOp_PublicatiebladDatum";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerDatum.errormessage = "Er is een ongeldige zoekdatum opgegeven.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerDatum.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerDatum.evaluationfunction = "CustomValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerDatum.clientvalidationfunction = "valideerDatum";
    var ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerPublicatiebladnummer = document.all ? document.all["ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerPublicatiebladnummer"] : document.getElementById("ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerPublicatiebladnummer");
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerPublicatiebladnummer.controltovalidate = "input-text-1434";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerPublicatiebladnummer.errormessage = "U heeft geen geldig juriconnect-ID ingevoerd.";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerPublicatiebladnummer.display = "Dynamic";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerPublicatiebladnummer.evaluationfunction = "RegularExpressionValidatorEvaluateIsValid";
    ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierEURichtlijn_valideerPublicatiebladnummer.validationexpression = "^[l|L|c|C]\\s.*";

  }
}
if(formActive) {
  var Page_ValidationActive = false;
  if (typeof(ValidatorOnLoad) == "function") {
      ValidatorOnLoad();
  }

  function ValidatorOnSubmit() {
      if (Page_ValidationActive) {
          return ValidatorCommonOnSubmit();
      }
      else {
          return true;
      }
  }
}
