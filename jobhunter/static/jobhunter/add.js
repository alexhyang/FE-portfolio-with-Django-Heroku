$(function () {
  $("#formatter").on("click", () => {
    document.querySelectorAll("textarea").forEach((textarea) => {
      textarea.value = "- " + textarea.value.replaceAll("\n", " <br>\n- ");
    });
  });

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
});
