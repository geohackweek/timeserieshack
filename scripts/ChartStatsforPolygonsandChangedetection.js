//--------import geometry-----------///
var geometry = /* color: d63000 */ee.Geometry.Polygon(
        [[[-119.29452896118164, 48.002534649171245],
          [-119.29779052734375, 48.001615775085625],
          [-119.29864883422852, 47.99977797781164],
          [-119.29384231567383, 47.99989284205933]]]),
    roi = /* color: 98ff00 */ee.Geometry.MultiPoint(
        [[-119.366455078125, 47.826433352857094],
         [-119.50584411621094, 47.764460796790274],
         [-119.48936462402344, 47.76457618400039]]),
    crops = ee.ImageCollection("USDA/NASS/CDL");
//-------------------///

var threeWetlands = ee.FeatureCollection('ft:1GjL3wn9dXNH0yNwxCTVMSmufI8xTgMrWWJtYfNhq');
Map.addLayer(threeWetlands, {'color': 'FF0000'},'threeWetlands');
Map.centerObject(threeWetlands, 12)



var PDSI = ee.ImageCollection('IDAHO_EPSCOR/PDSI')
        .filterDate('1983-01-01', '2011-12-31')
        .filterBounds(roi)
        .filter(ee.Filter.calendarRange(100, 200, 'day_of_year'));


//print (PDSI, "PDSI")
// calculate ndwi from landsat 5 & 7
function L5Ndwi(image) {
  var ndwi = image.normalizedDifference(['B2', 'B5']).rename('NDWI');
  return image.addBands(ndwi);
}

// This function adds a time band to the image.
var createTimeBand = function(image) {
  // Scale milliseconds by a large constant to avoid very small slopes
  // in the linear regression output.
  return image.addBands(image.metadata('system:time_start').divide(1e18));
};


var L5 = ee.ImageCollection('LANDSAT/LT5_SR')
        .filterDate('1983-01-01', '2011-12-31')
        .filterBounds(threeWetlands)
        .filter(ee.Filter.calendarRange(100, 200, 'day_of_year')); // select days of the year for analysis


//print(L5, "L5")
//This function mask shadows and clouds
var applyShadowMask = function(image) {
var mask = ee.Image(image).select('croplandk').eq(2).eq(4);
  return image.updateMask(mask);
 };

//This function masks crops
var applyCropMask = function(image) {
var mask = ee.Image(image).select('cfmask').eq(2).eq(4);
  return image.updateMask(mask);
 };


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
  // NDWI
  .addBands(image.normalizedDifference(['B2','B5']).rename('NDWI'))
  // Greeness index (NIR/green)
  .addBands(image.select('B4').divide(image.select('B2')).rename('GI'));
};


// apply functions over the image collection
var image_ndvi = L5
  .map(maskClouds)
  .map(createTimeBand)
  .map(addindex);

var ndvi_aug = ee.Image(image_ndvi.first())
//.filter(ee.Filter.eq(,'LT50450272011188'))

print (image_ndvi, "image ndvi")
//Map.addLayer(ndvi_aug,{},"image_ndvi");

Map.addLayer(ndvi_aug, {bands: 'NDVI', min: 0, max: .5})
//Map.addLayer(image_ndvi, {min:0, max:1}, 'NDVI');

// Get scale from the projected mean precipitation band.
var scale = ee.Image(image_ndvi.first())
  .select(['NDWI']).projection().nominalScale();
 // Fit a linear trend to the nighttime lights collection.

// Independent variable are followed by dependent variables.
var linearFit = image_ndvi.select(['system:time_start','NDWI']).reduce(ee.Reducer.linearFit());

Map.addLayer(linearFit,
  {min:[-8e-8], max:-302375,  bands: ['scale', 'offset', 'scale']}, 'fit');
//[-0.9, 8e-5, 1]
//var fit = image_ndvi.reduce(ee.Reducer.linearFit());

print (linearFit)

var wetlandTimeSeries = ui.Chart.image.seriesByRegion(image_ndvi, threeWetlands,
    ee.Reducer.mean(), 'NDWI', 10 , 'system:time_start'); /// don't understand the scale option
wetlandTimeSeries = wetlandTimeSeries.setChartType('ScatterChart');
wetlandTimeSeries = wetlandTimeSeries.setOptions({
  title: 'NDWI for example wetland',
  vAxis: {
    title: 'NDWI (index)'
  },
  lineWidth: 1,
  pointSize: 4,
  }

);

print(wetlandTimeSeries)
