(function ($) {
  $(document).ready(function () {
      toggleMinisteriëleRegelingen();
      toggleEindatumZichtbaarheid();
      toggleDatumVanTotstandkoming();
      toggleDatumVanOndertekening();
      $('#ZoekOp_Datumbereik').bind('change', toggleEindatumZichtbaarheid);
      $('#ZoekOp_TitelExact').bind('change', toggleCiteertitelAfkorting);
      $('#soortCategorienLijst input:checkbox').bind('change', toggleDatumVanOndertekening);
      $('#soortCategorienLijst input:checkbox').bind('change', toggleWaardelijstselecties);
      $("#soortCategorienLijst .regelingsoort").bind("change", bijlageConditional);
      $('#ZoekOp_DatumscopeArtikel').bind('change', toggleDatumVanTotstandkoming);
      $('#ZoekOp_DatumscopeRegeling').bind('change', toggleDatumVanTotstandkoming);
      $('#ZoekOp_WTI').bind('change', toggleOnderdeeltype);
      $('input[type=checkbox]', '.modal__content').bind('change', function () { selecteerModalitem($(this).closest('.modal__content')); });
      $('.subselection__trigger', '.subselection').bind('click', function () { selecteerModalitem($(this).prev('div').find('.modal__content')); });
      $("#ZoekOp_DatumtypeInwerkingtreding").bind("change", scopeArtikelReset1);
      $("#ZoekOp_DatumtypeOndertekening").bind("change", scopeArtikelReset2);
      $("#ZoekOp_DatumtypeTotstandkoming").bind("change", scopeArtikel);
  });

  function toggleMinisteriëleRegelingen() {

      /* Overnemen naar beneden */
      $("#MinR").on('click', function () {
          var minRGeselecteerd = $("#MinR").is(':checked');
          $("#MinRArchief, #MinROverig").prop('checked', minRGeselecteerd);

          alleRegelingsoortenAan();
      });

      /* Overnemen naar boven */
      $("#MinRArchief, #MinROverig").on('click', function () {
          var subItemsGeselecteerd = $("#MinRArchief").is(':checked') && $("#MinROverig").is(':checked');
          $("#MinR").prop('checked', subItemsGeselecteerd);

          alleRegelingsoortenAan();
      });
  }

  function alleRegelingsoortenAan() {
      var elements = onl.dom.$('[data-set="which-types"]');
      var checkedAll = false;
      if (elements) {
          checkedAll = true;
          elements.forEach(function (input) {
              if (!input.checked) {
                  checkedAll = false;
              }
          });
      }

      $("#AlleSoorten").prop('checked', checkedAll);
  }


  function toggleWaardelijstselecties() {
      /* De waardeselectie verwijderen als de bijbehorende soort regeling is niet meer aangevinkt */
      toggleWaardelijstselectie("ZBO", "ZoekOp_EerstVerantwoordelijke_ZBO", "", "ss21");
      toggleWaardelijstselectie("Bedrijf", "ZoekOp_EerstVerantwoordelijke_PBO", "", "ss31");
      // toggleWaardelijstselectie("Verdrag", "ZoekOp_Taxonomie", "", "ss11");
  }

  function toggleWaardelijstselectie(inputId, hiddenInputId, spanId, subselectionId) {
      var isGeselecteerd = $("#" + inputId).is(':checked');
      
      if (!$('#AlleSoorten').is(':checked') && !isGeselecteerd) {
          $("#" + hiddenInputId).val('');
          // var span = $("span[id='" + spanId + "']");
          // span.html('');
          var onderdelen = document.querySelector('#'+subselectionId);
          if(onderdelen){
            var onderdelenItems = onderdelen.querySelectorAll('.subselection__summaryitem__remove');
            for(var i = 0; i < onderdelenItems.length; i++){
              onderdelenItems[i].click();
            }
          }
      }
  }

  function toggleCiteertitelAfkorting() {
      var $CiteertitelExactCheckbox = $(this);
      var $citeertitelAfkortingCheckbox = $('#ZoekOp_TitelAfkorting');
      if ($CiteertitelExactCheckbox.is(':checked') == false) {
          $citeertitelAfkortingCheckbox.prop('checked', false);
          $citeertitelAfkortingCheckbox.prop('disabled', true);
      } else {
          $citeertitelAfkortingCheckbox.prop('disabled', false);
      }
  }

  function toggleEindatumZichtbaarheid() {
      if ($('#ZoekOp_Datumbereik').val() === '3') {
          $('#divEinddatum').show();
      } else {
          $('#divEinddatum').hide();
      }
  }

  function toggleDatumVanOndertekening() {
      var alleenVerdragenGeselecteerd = true;
      $('#soortCategorienLijst input:checkbox:checked').each(function () {
          var $soortCatChkbx = $(this);
          if ($soortCatChkbx.prop('id') != 'Verdrag') {
              alleenVerdragenGeselecteerd = false;
          }
      });

      if (alleenVerdragenGeselecteerd) {
          if ($('#ZoekOp_DatumtypeOndertekening').is(':checked') === true) {
              $('#ZoekOp_DatumtypeInwerkingtreding').prop('checked', true);
          }
          $('#ZoekOp_DatumtypeOndertekening').prop('disabled', true);
      } else {
          $('#ZoekOp_DatumtypeOndertekening').prop('disabled', false);
      }

      toggleDatumVanTotstandkoming();
  }

  function toggleDatumVanTotstandkoming() {
      if ($('#Verdrag').is(':checked') && $('#ZoekOp_DatumscopeRegeling').is(':checked')) {
          $('#ZoekOp_DatumtypeTotstandkoming').prop('disabled', false);
      } else {
          $('#ZoekOp_DatumtypeTotstandkoming').prop('checked', false);
          $('#ZoekOp_DatumtypeTotstandkoming').prop('disabled', true);
          if ($('#ZoekOp_DatumtypeOndertekening').is(':checked') === false) {
              $('#ZoekOp_DatumtypeInwerkingtreding').prop('checked', true);
          }
      }
  }

  function toggleOnderdeeltype() {
      if ($('#ZoekOp_WTI').is(':checked')) {
          // Na het selecteren van Wettechnische informatie moeten de onderdeeltypes weer verdwijnen
          // $('#ZoekOp_Onderdeeltype').val('');
          // $("span[id='overheidbwb.onderdeeltype']").html('');
          var onderdelen = document.querySelector('#ss41');
          if(onderdelen){
            var onderdelenItems = onderdelen.querySelectorAll('.subselection__summaryitem__remove');
            for(var i = 0; i < onderdelenItems.length; i++){
              onderdelenItems[i].click();
            }
          }
      }
  }

  /*
      Retourneert een array met alle geselecteerde items uit een waardelijst-modal
  */
  function LeesModalitems($modal) {
      var selection = [];
      $modal.find("input:checked").each(function () {
          selection.push({ identifier: this.value, omschrijving: $(this).data('omschrijving') });
      });

      // Dirty fix, om te zorgen dat aangevinkte checkboxen, zonder dat er iets wordt gewijzigd, in het zoekformulier worden overgenomen
      $modal.find("input:eq(0)").click().click();
      return selection;
  }

  /*
      Wordt aangeroepen na het aan-/uitvinken van een item in een waardelijst-modal
  */
  function selecteerModalitem( $modalcontent) {

      // Als er items zijn geselecteerd en er moeten minimaal een aantal checkboxen aangevinkt zijn
      var aantevinkencheckboxen = $modalcontent.data('aantevinkencheckboxen');
      if (aantevinkencheckboxen !== '' && !$('#AlleSoorten').is(':checked')) {
          var erIsErEenAangevinkt = false;
          var checkboxen = $('.' + aantevinkencheckboxen);
          for (var i = 0; i < checkboxen.length; i++) {
              if ($(checkboxen[i]).is(':checked')) {
                  erIsErEenAangevinkt = true;
                  break;
              }
          }
          if (!erIsErEenAangevinkt) {
              for (var i = 0; i < checkboxen.length; i++) {
                  $(checkboxen[i]).prop('checked', true);
              }
          }
      }

      // Als er items zijn geselecteerd en er moeten een aantal checkboxen uitgevinkt zijn
      var uittevinkencheckboxen = $modalcontent.data('uittevinkencheckboxen');
      if (uittevinkencheckboxen !== "") {
          var checkboxen = $('.' + uittevinkencheckboxen);
          for (var i = 0; i < checkboxen.length; i++) {
              $(checkboxen[i]).prop('checked', false);
          }
      }

      // Plaats de geselecteerde items in het hidden veld
      var veldidgeselecteerdeitems = $modalcontent.data('veldidgeselecteerdeitems');

      var selection = LeesModalitems($modalcontent);

      var geselecteerdeItems = [];
      for (var i = 0, item; (item = selection[i]) && i < selection.length; i++) {
          geselecteerdeItems.push(item.identifier);
      }

      $('#' + veldidgeselecteerdeitems).val(geselecteerdeItems.join(','));

  }

  function scopeArtikel() {
    console.log('scopeArtikel');
    if($("#ZoekOp_DatumtypeTotstandkoming").is(":checked")){
      $("#ZoekOp_DatumscopeArtikel").prop("disabled", true);
      $("#ZoekOp_DatumscopeRegeling").prop("checked", true);
    } else {
      $("#ZoekOp_DatumscopeArtikel").prop("disabled", false);
    }
  }
  function scopeArtikelReset1() {
    if($("#ZoekOp_DatumtypeInwerkingtreding").is(":checked")){
      $("#ZoekOp_DatumscopeArtikel").prop("disabled", false);
    }
  }
  function scopeArtikelReset2() {
    if($("#ZoekOp_DatumtypeOndertekening").is(":checked")){
      $("#ZoekOp_DatumscopeArtikel").prop("disabled", false);
    }
  }
  function bijlageConditional() {
    var amountChecked = 0;
    $('.regelingsoort').each(function(){
      if($(this).is(':checked')){
        amountChecked++;
      }
    });
    if(amountChecked === 1 && $("#Verdrag").is(":checked")){
      $("#ZoekOp_ArtikelnummerBijlage").prop('disabled', true);
      $("#ZoekOp_ArtikelnummerArtikel").prop('checked', true);
    } else {
      $("#ZoekOp_ArtikelnummerBijlage").prop('disabled', false);
    }
  }

})(jQuery);

/*(function (n) {
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
  function ss() {
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
  function u() {
      n("#ZoekOp_Datumbereik").val() === "3" ? n("#divEinddatum").show() : n("#divEinddatum").hide();
  }
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
  function z() {
    var amountChecked = 0;
    n('.regelingsoort').each(function(){
      if(n(this).is(':checked')){
        amountChecked++;
      }
    });
    if(amountChecked === 1 && n("#Verdrag").is(":checked")){
      n("#ZoekOp_ArtikelnummerBijlage").prop('disabled', true);
      n("#ZoekOp_ArtikelnummerArtikel").prop('checked', true);
    } else {
      n("#ZoekOp_ArtikelnummerBijlage").prop('disabled', false);
    }
  }
  function y(){
    if(n("#ZoekOp_DatumtypeTotstandkoming").is(":checked")){
      n("#ZoekOp_DatumscopeArtikel").prop("disabled", true);
      n("#ZoekOp_DatumscopeRegeling").prop("checked", true);
    } else {
      n("#ZoekOp_DatumscopeArtikel").prop("disabled", false);
    }
  }
  function v(){
    if(n("#ZoekOp_DatumtypeInwerkingtreding").is(":checked")){
      n("#ZoekOp_DatumscopeArtikel").prop("disabled", false);
    }
  }
  function w(){
    if(n("#ZoekOp_DatumtypeOndertekening").is(":checked")){
      n("#ZoekOp_DatumscopeArtikel").prop("disabled", false);
    }
  }
  // t = done
  function t() {
      n("#Verdrag").is(":checked") && n("#ZoekOp_DatumscopeRegeling").is(":checked")
          ? n("#ZoekOp_DatumtypeTotstandkoming").prop("disabled", !1)
          : (n("#ZoekOp_DatumtypeTotstandkoming").prop("checked", !1),
            n("#ZoekOp_DatumtypeTotstandkoming").prop("disabled", !0),
            n("#ZoekOp_DatumtypeOndertekening").is(":checked") === !1 && n("#ZoekOp_DatumtypeInwerkingtreding").prop("checked", !0));
  }
  function c() {
    if(n("#ZoekOp_WTI").is(":checked")){
      var onderdelen = document.querySelector('#ss41');
      if(onderdelen){
        var onderdelenItems = onderdelen.querySelectorAll('.subselection__summaryitem__remove');
        for(var i = 0; i < onderdelenItems.length; i++){
          onderdelenItems[i].click();
        }
      }
    }
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
      u();
      t();
      f();
      n("#ZoekOp_Datumbereik").bind("change", u);
      n("#ZoekOp_TitelExact").bind("change", h);
      n("#soortCategorienLijst input:checkbox").bind("change", f);
      n("#soortCategorienLijst input:checkbox").bind("change", ss);
      n("#soortCategorienLijst .regelingsoort").bind("change", z);
      n("#ZoekOp_DatumscopeArtikel").bind("change", t);
      n("#ZoekOp_DatumscopeRegeling").bind("change", t);
      n("#ZoekOp_WTI").bind("change", c);

      n("#ZoekOp_DatumtypeInwerkingtreding").bind("change", v);
      n("#ZoekOp_DatumtypeOndertekening").bind("change", w);
      n("#ZoekOp_DatumtypeTotstandkoming").bind("change", y);
      n("input[type=checkbox]", ".modal__content").bind("change", function () {
          e(n(this).closest(".modal__content"));
      });
      n(".subselection__trigger", ".subselection").bind("click", function () {
          e(n(this).prev("div").find(".modal__content"));
      });
  });
})(jQuery);
*/

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
