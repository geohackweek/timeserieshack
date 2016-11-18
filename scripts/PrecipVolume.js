
// HELP:
//http://slides.com/miguelangelmenarguez/google-earth-engine-for-dummies--2#/1

/***
 *  Example of...
 *  Image.reduceRegions -> get a value for each region
 *  regions.Map(<function>) -> result of applying <f> to regions
 *
 */

// Load an image of daily precipitation in mm/day.
var precip = ee.Image(ee.ImageCollection('NASA/ORNL/DAYMET').first());

// Load watersheds from a Fusion Table and filter to the continental US.
var sheds = ee.FeatureCollection('ft:1IXfrLpTHX4dtdj1LcNXjJADBB-d93rkdJ9acSEWK')
  .filterBounds(ee.Geometry.Rectangle(-127.18, 19.39, -62.75, 51.29));

// Add the mean of each image as new properties of each feature.
var shedMeanPrecips = precip.reduceRegions(sheds, ee.Reducer.mean());
// var palette = ['FF0000', '00FF00', '0000FF'];
Map.addLayer(shedMeanPrecips, {palette: ['green', 'yellow']}, "withprecip");

/**/
// This function computes total rainfall in cubic meters.
var prcpVolume = function(feature) {
  // Precipitation in mm/day -> meters -> sq. meters.
  var volume = ee.Number(feature.get('prcp'))
    .divide(1000).multiply(feature.geometry().area());
  return feature.set('volume', volume);
};

var highVolumes = shedMeanPrecips
  // Map the function over the collection.
  .map(prcpVolume)
  // Sort descending.
  .sort('volume', false)
  // Get only the 5 highest volume watersheds.
  .limit(5);

// Print the resulting FeatureCollection
print(highVolumes.first().get('volume'));
Map.addLayer(highVolumes, {palette:['red', 'blue']}, "highVolume");

print('highVolumes', highVolumes);

// Print the number of watersheds.
print('Count: ', highVolumes.size());

// Print stats for an area property.
print('Area aggregate stats:', highVolumes.aggregate_stats('AreaSqKm'));
//print('Area mean:', highVolume.get('mean')); //this doesn't work

// prints names & volume of highVolume watersheds
var sum_vol = 0;
var features = highVolumes.getInfo().features;
for (var i = 0; i < features.length; ++i) {
  var thisFeature = features[i].properties;
  print(thisFeature);
  print(thisFeature.name + ': ' + thisFeature.volume);
  sum_vol += thisFeature.volume;
}
sum_vol /= features.length;
print("Area mean:", sum_vol);
//print(highVolumes.getInfo());
//print(highVolumes.values.mean);


// Export
// Export highVolume to csv
Export.table.toDrive({
  collection: highVolumes,
  description: 'exportVolumes',
  fileFormat: 'CSV'
});



/*
//
// CHARTS!!!
//
// Define a DataTable using a JavaScript literal.
// HOW DO I DO THIS WITH INPUT DATA OBJECTS?
var dataTable = {
  cols: [{id: 'name', label: 'Airport Code', type: 'string'},
         {id: 'year', label: 'Elevation (m)', type: 'number'}],
  rows: [{c: [{v: 'SFO'}, {v: 4}]},
         {c: [{v: 'JFK'}, {v: 4}]},
         {c: [{v: 'DEN'}, {v: 1655}]},
         {c: [{v: 'LHR'}, {v: 25}]},
         {c: [{v: 'ZRH'}, {v: 432}]}]
};
// Define a dictionary of customization options.
var options = {
  title: 'Airport elevations',
  vAxis: {title: 'Airport Code'},
  legend: {position: 'none'},
  hAxis: {
    title: 'Elevation (m)',
    logScale: true
  }
};
// Make a BarChart from the table and the options.
var chart = new ui.Chart(dataTable, 'BarChart', options);

// Print the chart to display it in the console.
print(chart);
*/
