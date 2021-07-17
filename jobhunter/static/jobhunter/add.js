$(function () {
  if ($(".alert").length == 0) {
    $("#save").prop("disabled", true);
  }
  $("#formatter").on("click", () => {
    document.querySelectorAll("textarea").forEach((textarea) => {
      textarea.value =
        "- " +
        textarea.value
          .replaceAll(/[-·][\s]+/g, "")
          .replaceAll(/[\n]+/g, " <br>\n- ");
    });
    $("#save").prop("disabled", false);
  });
  autoFillDate();
});

function autoFillDate() {
  let today = new Date();
  let dueMonth = correctMonthDateFormat(today.getMonth() + 2);
  let dueDate = correctMonthDateFormat(today.getDate());
  document.querySelector("#id_due_date").value =
    today.getFullYear() + "-" + dueMonth + "-" + dueDate;
}

function correctMonthDateFormat(dateOrMonth) {
  if (dateOrMonth < 10) {
    dateOrMonth = "0" + dateOrMonth;
  }
  return dateOrMonth;
}

// add autocomplete service
let autocomplete;
let positionCity;
function initAutocomplete() {
  positionCity = document.querySelector("#id_place");
  // create the autocomplete object
  // restricting the search predictions to cities in Canada
  autocomplete = new google.maps.places.Autocomplete(positionCity, {
    componentRestrictions: { country: "ca" },
    fields: ["address_components"],
    types: ["(cities)", "administrative_level_1"],
  });
  // when the user selects a city from the drop-down, populate
  // the field with city and province
  autocomplete.addListener("place_changed", fillInAddress);
}

// fill in address
function fillInAddress() {
  // get place details from the autocomplete object
  const place = autocomplete.getPlace();
  // get each component of the position city from the
  // place details, and fill-in the corresponding field on the form
  for (const component of place.address_components) {
    const componentType = component.types[0];
    let cityProvince = "";

    switch (componentType) {
      case "locality": {
        cityProvince = `${component.long_name}`;
        break;
      }
      case "administrative_area_level_3": {
        cityProvince = `${component.long_name}`;
        break;
      }
      case "administrative_area_level_1": {
        cityProvince += `, ${component.short_name}`;
        break;
      }
    }
    positionCity.value = cityProvince;
  }
}
