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
  // function c() {
  //     n("#ZoekOp_WTI").is(":checked") && (n("#ZoekOp_Onderdeeltype").val(""), n("span[id='overheidbwb.onderdeeltype']").html(""));
  // }
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
