(function (n) {
  function o() {
      n("#MinR").on("click", function () {
          var t = n("#MinR").is(":checked");
          n("#MinRArchief, #MinROverig").prop("checked", t);
          // r();
      });
      n("#MinRArchief, #MinROverig").on("click", function () {
          var t = n("#MinRArchief").is(":checked") && n("#MinROverig").is(":checked");
          n("#MinR").prop("checked", t);
          // r();
      });
  }
  // function r() {
  //     var i = onl.dom.$('[data-set="which-types"]'),
  //         t = !1;
  //     i &&
  //         ((t = !0),
  //         i.forEach(function (n) {
  //             n.checked || (t = !1);
  //         }));
  //     n("#AlleSoorten").prop("checked", t);
  // }
  function s() {
      i("ZBO", "ZoekOp_EerstVerantwoordelijke_ZBO", "overheidbwb.eerstverantwoordelijkezbo");
      i("Bedrijf", "ZoekOp_EerstVerantwoordelijke_PBO", "overheidbwb.eerstverantwoordelijkepbo");
      i("Verdrag", "ZoekOp_Taxonomie", "overheidbwb.onderwerpVerdrag");
  }
  function i(t, i, r) {
      var f = n("#" + t).is(":checked"),
          u;
      n("#AlleSoorten").is(":checked") || f || (n("#" + i).val(""), (u = n("span[id='" + r + "']")), u.html(""));
  }
  function h() {
      var i = n(this),
          t = n("#ZoekOp_TitelAfkorting");
      i.is(":checked") == !1 ? (t.prop("checked", !1), t.prop("disabled", !0)) : t.prop("disabled", !1);
  }
  // function u() {
  //     n("#ZoekOp_Datumbereik").val() === "3" ? n("#divEinddatum").show() : n("#divEinddatum").hide();
  // }
  function f() {
      var i = !0;
      n("#soortCategorienLijst input:checkbox:checked").each(function () {
          var t = n(this);
          t.prop("id") != "Verdrag" && (i = !1);
      });
      i
          ? (n("#ZoekOp_DatumtypeOndertekening").is(":checked") === !0 && n("#ZoekOp_DatumtypeInwerkingtreding").prop("checked", !0), n("#ZoekOp_DatumtypeOndertekening").prop("disabled", !0))
          : n("#ZoekOp_DatumtypeOndertekening").prop("disabled", !1);
      t();
  }
  // t = done
  function t() {
      n("#Verdrag").is(":checked") && n("#ZoekOp_DatumscopeRegeling").is(":checked")
          ? n("#ZoekOp_DatumtypeTotstandkoming").prop("disabled", !1)
          : (n("#ZoekOp_DatumtypeTotstandkoming").prop("checked", !1),
            n("#ZoekOp_DatumtypeTotstandkoming").prop("disabled", !0),
            n("#ZoekOp_DatumtypeOndertekening").is(":checked") === !1 && n("#ZoekOp_DatumtypeInwerkingtreding").prop("checked", !0));
  }
  // unused;
  function c() {
      n("#ZoekOp_WTI").is(":checked") && (n("#ZoekOp_Onderdeeltype").val(""), n("span[id='overheidbwb.onderdeeltype']").html(""));
  }
  function l(t) {
      var i = [];
      return (
          t.find("input:checked").each(function () {
              i.push({ identifier: this.value, omschrijving: n(this).data("omschrijving") });
          }),
          t.find("input:eq(0)").click().click(),
          i
      );
  }
  function e(t) {
      var e = t.data("aantevinkencheckboxen"),
          u,
          f,
          r,
          i,
          h;
      if (e !== "" && !n("#AlleSoorten").is(":checked")) {
          for (u = !1, r = n("." + e), i = 0; i < r.length; i++)
              if (n(r[i]).is(":checked")) {
                  u = !0;
                  break;
              }
          if (!u) for (i = 0; i < r.length; i++) n(r[i]).prop("checked", !0);
      }
      if (((f = t.data("uittevinkencheckboxen")), f !== "")) for (r = n("." + f), i = 0; i < r.length; i++) n(r[i]).prop("checked", !1);
      var c = t.data("veldidgeselecteerdeitems"),
          o = l(t),
          s = [];
      for (i = 0; (h = o[i]) && i < o.length; i++) s.push(h.identifier);
      n("#" + c).val(s.join(","));
  }
  n(document).ready(function () {
      o();
      // u();
      t();
      f();
      // n("#ZoekOp_Datumbereik").bind("change", u);
      n("#ZoekOp_TitelExact").bind("change", h);
      n("#soortCategorienLijst input:checkbox").bind("change", f);
      n("#soortCategorienLijst input:checkbox").bind("change", s);
      n("#ZoekOp_DatumscopeArtikel").bind("change", t);
      n("#ZoekOp_DatumscopeRegeling").bind("change", t);
      n("#ZoekOp_WTI").bind("change", c);
      // n("input[type=checkbox]", ".modal__content").bind("change", function () {
      //     e(n(this).closest(".modal__content"));
      // });
      // n(".selection_popup", ".subselection").bind("click", function () {
      //     e(n(this).prev("div").find(".modal__content"));
      // });
  });
})(jQuery);

(function (n) {
  "use strict";
  function i() {
      var i = n("#popupvergelijken .btn-vergelijk"),
          t = n("#popupvergelijken .dlDatum");
      i.prop("disabled", t.length === 0 || t.val() === "");
  }
  function u() {
      var o = n("#popupvergelijken .dlDatum option:checked").text(),
          u = n("#popupvergelijken .dlDatum option:checked").val().split("_"),
          s = u[0],
          h = u[1],
          i,
          e;
      r("", o);
      i = f(n("#hfVergelijkRedirect").val());
      i === "" && t !== "" && (i = t);
      e = MaakVergelijkUrl(s, h, i);
      n(".btn-vergelijk", "#popupvergelijken").hide();
      window.location.href = e;
  }
  function f(n) {
      var t = n.indexOf("#");
      return t > 0 ? n.substring(t + 1) : "";
  }
  function e() {
      n(".wti-compare").click(function () {
          var t = n("input:checked[name=compare]").length;
          t > 2 ? n("#compareLinkValidationMessage").show() : n("#compareLinkValidationMessage").hide();
      });
      n("#compareLinkValidationMessage").hide();
      n("#compareLink").click(function (t) {
          var i, u;
          if ((t.preventDefault(), (i = n("input:checked[name=compare]")), (u = i.length), u !== 2)) return n("#compareLinkValidationMessage").show(), !1;
          var f = i[0].value,
              e = i[1].value,
              h = n("#hiddenBWBId").val(),
              c = "/" + h + "/" + o(f, "0", "/") + "?VergelijkMet=" + h + "%3fg%3d" + s(e);
          r(f, e);
          location.href = c;
      });
  }
  function r(t, i) {
      n("#spVergelekenMet").html(i);
      t != "" && n("#spVergelekenVan").html(t);
      n("#pGeenVergelijkingMogelijk, #pKiesVergelijking, #fKiesVergelijking").hide();
      n("#pKiesVergelijkingWachten, #LoadMessageCompare, #pKiesVergelijkingWachtenMinuten").show();
  }
  function o(n, t, i) {
      var r = n.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1");
      return r + i + t;
  }
  function s(n) {
      return n.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1");
  }
  var t = "";
  n(function () {
      n("#popupvergelijken .dlDatum").on("change", i);
      n("#pKiesVergelijkingWachten, #LoadMessageCompare, #pKiesVergelijkingWachtenMinuten").hide();
      n(".popupvergelijken").click(function (i) {
          var r = n(this).data("inwerking");
          t = n(this).data("hashfragmentid");
          r === "" ? n("#iwtHuidige, #iwtHuidige3").hide() : (n("#lblIWTHuidige").html(r), n("#lblIWTHuidige2").html(r), n("#lblIWTHuidige3").html(r), n("#iwtHuidige, #iwtHuidige3").show());
          var u = n(this).data("bwb-id"),
              f = n(this).data("toestand-id"),
              e = n(this).data("volgnummer"),
              o = n(this).data("label-id");
          n("#pGeenVergelijkingMogelijk").hide();
          n(".dlDatum option").attr("disabled", !1);
          n("#pKiesVergelijking, #divVersies, .btn-vergelijk").show();
          i.preventDefault();
      });
      n("#popupvergelijken .btn-vergelijk").click(function () {
          return u(), !1;
      });
      i();
      e();
      n(".sluitPopup", "#popupvergelijken").click(function (t) {
          t.preventDefault();
          typeof stop == "function" ? window.stop() : document.execCommand("Stop");
          n("#pKiesVergelijkingWachten, #LoadMessageCompare, #pKiesVergelijkingWachtenMinuten").hide();
          n(".btn-vergelijk", "#popupvergelijken").show();
          n("#pKiesVergelijking, #fKiesVergelijking").show();
          sluitPopup();
      });
  });
})(jQuery);

// LIDO Relaties modaal;
(function(n){"use strict";n(function(){n(".popuplidorelaties").click(function(t){var r=n(this).data("juriconnectverwijzing"),u=n(this).parent("li").data("aantal-relaties"),i;n("#popuplidorelaties h2").html("Externe relaties ("+escape(u)+")");i='<div class="alert alert--warning">Er is een fout opgetreden bij het ophalen van de relaties in LiDO.<\/div>';n.get(endpointLidoRelaties + "?juriconnect-id="+escape(r)+"&_="+(new Date).getTime(),function(t){t!==""?n("#popuplidorelaties #divLidorelaties").html(t):n("#popuplidorelaties #divLidorelaties").html(i)},"html").fail(function(){n("#popuplidorelaties #divLidorelaties").html(i)});t.preventDefault()})})})(jQuery);

// LIDO Relaties aantal;
(function(n){"use strict";function t(){var t=n(window).scrollTop(),r=n(window).height(),i=300;setTimeout(function(){n("li.action--relations[data-juriconnectid]").each(function(){ var u=n(this);setTimeout(function(){var f=u.data("top");if(f===0||f||(f=u.closest("ul").offset().top,u.data("top",f)),!u.data("laden")&&!(f<t-i)){if(t+r+i<f)return!1;u.data("laden",!0);n.get(endpointLidoAantallen + "?bwbngid="+escape(u.data("bwbngid")),function(n){parseInt(n,10)>0&&(u.prepend(n),u.data("aantal-relaties",n),u.removeClass("visually-hidden"));u.removeClass("aantallen-lido-onbekend");u.addClass("aantallen-lido")})}},1)})},10)}n(window).on("load scroll resize",function(){typeof t=="function"&&t()})})(jQuery);
// Permanente link;
(function (n) {
  "use strict";
  function r(n) {
      var t, i, r;
      typeof getSelection != "undefined" && typeof document.createRange != "undefined"
          ? ((t = document.createRange()), t.selectNodeContents(n), (i = window.getSelection()), i.removeAllRanges(), i.addRange(t))
          : typeof document.selection != "undefined" && typeof document.body.createTextRange != "undefined" && ((r = document.body.createTextRange()), r.moveToElementText(n), r.select());
  }
  var i = n("#hfApplicatieURL").val(),
      t = n("h1", "#regeling").text();
  n(function () {
      n("div.well--linkContainer").on("click", function () {
          event.preventDefault();
          r(this);
      });
      n(".popuppermanentelink").click(function (r) {
          var u = n(this).data("juriconnectverwijzing"),
              l = n(this).closest(".article__header--law"),
              f = l.children("h3,h4").first().text(),
              c = f.indexOf(". "),
              e,
              o,
              s,
              h;
          e = c != -1 ? f.slice(0, c) : n.trim(f);
          o = e;
          n("#geselecteerdeonderdelen").length == 1 &&
              (t = n(this).closest(".fragment-header").length == 1 ? n(this).closest(".fragment-header").find("h1").text() : n(this).closest(".wetgeving").parent("div").prev(".fragment-header").find("h1").text());
          e != t && (o += " " + t);
          s = n("#divCiteertitel");
          s.text("");
          h = n(document.createElement("a"));
          s.append(h);
          h.attr("href", i + "/" + u).html(o);
          n("#divUrl").text(i + "/" + u);
          n("#divJuriconnectverwijzing").text(u);
          n("#aLinktoolurl").attr("href", n(this).data("linktoolurl"));
          r.preventDefault();
      });
  });
})(jQuery);

// Afdrukken
(function(n){"use strict";n(function(){n(".popupafdrukken").click(function(t){n("#hfPrintOnderdeelID").val(n(this).attr("href"));t.preventDefault()})})})(jQuery);

// Exporteren
(function (n) {
  "use strict";
  n(function () {
      n(".popupexporteren").click(function (t) {
          var i = n(this).attr("href");
          n("#hfRegelingOnderdelenActie").val("");
          n("#hfExportOnderdeelID").val(i);
          n("#popupexporterenafbeeldingen").hide();
          /^\/([a-z0-9]+)\/([0-9|_|-]*)\/([0-9]+)(\/?)$/i.test(i)
              ? (n("#popupexporterenafbeeldingen").show(), n(".exporteren-xml-optie").show())
              : (n("#rbZonderAfbeeldingen").prop("checked", !0),
                n(".exporteren-xml-optie input:checked").length && n('#popupexporteren input[id$="rbRtf"]').prop("checked", !0),
                n(".exporteren-xml-optie input:checked").prop("checked", !1),
                n(".exporteren-xml-optie").hide());
          t.preventDefault();
      });
  });
})(jQuery);

// afdrukken onderdelen;
(function (n) {
  "use strict";
  function t() {
      var t = n("#rbInclusief").is(":checked");
      n("#hfRegelingOnderdelenActie").val(t ? "afdrukken informatie" : "afdrukken");
  }
  n(function () {
      n(".popupafdrukken").click(function (i) {
          n("#hfRegelingOnderdelenAfdrukken").val(n(this).data("onderdeelids"));
          i.preventDefault();
          t();
      });
      n("#rbExclusief, #rbInclusief").on("click", function () {
          t();
      });
  });
})(jQuery);


// inhoudsopgave
(function(n){"use strict";n("#Unfoldall").on("click",function(t){t.preventDefault();n('ul.treeview button[data-handler="toggle-fold"][aria-expanded="false"]').click()});n("#Foldall").on("click",function(t){t.preventDefault();n('ul.treeview button[data-handler="toggle-fold"][aria-expanded="true"]').click()})})(jQuery);

// zoekresultaten
(function(n){"use strict";n('.result--list div.collapsible__header a[data-handler="toggle-collapsible"]').on("click",function(){

  var t=n("#"+n(this).attr("aria-controls")),
    i=n(this).closest(".collapsible").parent();
    var url = i.find("> input.locationurl").val() || location.href;
    setTimeout(function(){
      t.is(":visible")&&!t.html().trim()&&n(t).load(endpointResultaatOnderdelen,{regelingID:i.find("> input.data-id").val(),ref:url})}
      ,0)
      }
      );
      n("#unmarkallAnchor").on("click",function(t){t.preventDefault();n("div.collapsible__content input:checkbox").each(function(){n(this).prop("checked",!1)})})})(jQuery);

// eurlexpopup.js
(function ($) {
    'use strict';

    $(function () {
        $('#cbNietMeerTonen').click(function () {
            setTimeout(function () {
                createCookie('eurlex-popup-niet-tonen', $('#cbNietMeerTonen').is(':checked'));
            }, 100);
        });
    });
})(jQuery);
