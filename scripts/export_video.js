// Load daily precipitation in mm/day.
var precip = ee.ImageCollection('NASA/ORNL/DAYMET')
  // Get 20 years of imagery.
  .filterDate('2015-01-01','2015-12-31')
  // Select prcp band.
  .select(["prcp"])
  // Need to make the data 8-bit.
    .map(function(image) {
    return image.multiply(512).uint8();
  });

Map.addLayer(precip)

var precipviz = precip.visualize({'forceRgbOutput':true, 'min': 0, 'max': 100, 'palette': '000000, 00FF00'})

// Define an area to export.
var polygon = ee.Geometry.Rectangle([-122.7286, 37.6325, -122.0241, 37.9592]);

// Export (change dimensions or scale for higher quality).
Export.video.toDrive({
  collection: precipviz,
  description: 'sfVideoPrecip1',
  dimensions: 720,
  framesPerSecond: 12,
  region: polygon
});
