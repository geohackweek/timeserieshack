Map.setCenter(-119.5065, 47.763, 13)
// added from EE imports
var geometry = /* color: d63000 */ee.Geometry.MultiPoint(),
    roi = /* color: 98ff00 */ee.Geometry.MultiPoint(
        [[-119.366455078125, 47.826433352857094],
         [-119.50584411621094, 47.764460796790274],
         [-119.48936462402344, 47.76457618400039]]);
/// end EE imports

var cloudCoverMax = .5


var L5 = ee.ImageCollection('LANDSAT/LT5_SR')
        .filterDate('2009-01-01', '2011-12-31')
        .filterBounds(roi)
        .filter(ee.Filter.calendarRange(100, 200, 'day_of_year'));


print(L5, "L5")
//This function selects only pixels flagged as shadow and clouds
var applyShadowMask = function(image) {
var mask = ee.Image(image).select('cfmask').eq(2).eq(4);
  return image.updateMask(mask);
 };

// This function gets NDVI from a Landsat 8 image.
//var apply_ndvi = function(image) {
//  var ndvi = image.normalizedDifference(['B5', 'B4']);
//  return image.addBands(ndvi);
//}

// create function to mask clouds, cloud shadows, snow using the cfmask layer in SR products
var maskClouds = function(image){
  var cfmask = image.select('cfmask');
  return image.updateMask(cfmask.lt(2));   // keep clear (0) and water (1) pixels
};

// function to add greenness indices
var addindex = function(image) {
  return image
  // NDVI
  .addBands(image.normalizedDifference(['B4','B3']).rename('NDVI'))
  // Greeness index (NIR/green)
  .addBands(image.select('B4').divide(image.select('B2')).rename('GI'));
};


// apply functions over the image collection
var image_ndvi = L5
  .map(maskClouds)
  .map(addindex);

var ndvi_aug = ee.Image(image_ndvi.first())
//.filter(ee.Filter.eq(,'LT50450272011188'))

print (ndvi_aug, "ndvi_aug")
//Map.addLayer(ndvi_aug,{},"image_ndvi");

Map.addLayer(ndvi_aug, {bands: 'NDVI', min: 0, max: .5})
//Map.addLayer(image_ndvi, {min:0, max:1}, 'NDVI');


//Map.addLayer(image_ndvi)
