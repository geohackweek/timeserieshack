// this script contains fusion table references which can be used for testing eature collection reducers
// authors: #timeserieshack hackers

// 1. create variable to hold feature collection
// 2. add feature collection to map
// 3. center map on feature
// 4. mouse over, 'convert' to imports up top.
// 5. click blue button, copy+paste to revert to raw:

// EE methods used
//------------------------------//
// Map.addLayer(eeObject, visParams, name, shown, opacity)
// Map.setCenter(lon, lat, zoom)
// Map.centerObject(object, zoom)
// ee.FeatureCollection(args, column)

// // Fusion Table 1. MIKE Sites, Africa + Asia -- DOES NOT WORK
// var mike = ee.FeatureCollection('ft:160S8zm2itSODe6RGDNl9o5nDD2hMK6kH6fqCa2MO');
// // Map.addLayer(mike_sites,{'color': 'orange'},'mike');
// Map.addLayer(mike, {color: 'FF0000'}, 'colored');
// Map.centerObject('mike', 8)

// // Fusion Table 2. King County -- DOES NOT WORK - PERMISSIONS
// var king_county = ee.FeatureCollection("ft:1MfARx-5HplPetG5xWawnR-tgIrcwLX2vmPWdR7qS");
// Map.addLayer(king_county, {'color': 'FF0000'}, 'King County');
// Map.centerObject('king_county', 12);

// Fusion Table 3: Lewa Wildlife Conservancy, Kenya
var lewa = ee.FeatureCollection('ft:1yrKHIrC4bnbgAP3l_ZCSm_0B_BCrI_hCm6p-RXnc');
Map.addLayer(lewa, {'color':'green'}, 'Lewa');
Map.centerObject(lewa, 12)

// // Fusion Table 4: Countries
var countries = ee.FeatureCollection('ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw');
Map.addLayer(countries, {'color': 'FF0000'},'countries');
Map.centerObject(countries, 8)

// Fusion Table 5: Three Wetlands (provided by Meg Halabinsky)
var threeWetlands = ee.FeatureCollection('ft:1GjL3wn9dXNH0yNwxCTVMSmufI8xTgMrWWJtYfNhq');
Map.addLayer(threeWetlands, {'color': 'FF0000'},'threeWetlands');
Map.centerObject(threeWetlands, 12)
// Map.setCenter(-119.8, 47.8, 9)

// Mouse over, 'convert' to imports up top.
// Click blue button, copy+paste to revert to raw:
// var mike_sites = ee.FeatureCollection("ft:1pxtbZOgnFmyVr0OG47lOt_qa5AlArr4nO8usQliY");
// var lewa = ee.FeatureCollection("ft:1yrKHIrC4bnbgAP3l_ZCSm_0B_BCrI_hCm6p-RXnc");
// var wetland = ee.FeatureCollection("ft:1clRyEvoAVAOuv5jmAXVx93AJxdTseUeZfkxTmBjw");
