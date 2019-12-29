export async function* jsonToGeojson(provider, options = {}) {
  const latField = options.latField || 'latitude';
  const lonField = options.lonField || 'longitude';
  for await (let item of provider) {
    const properties = Object.assign({}, item);
    const latitude = parseFloat(properties[latField]);
    const longitude = parseFloat(properties[lonField]);
    delete properties[latField];
    delete properties[lonField];
    const geometry = !isNaN(latitude) && !isNaN(longitude)
      ? { type: 'Point', coordinates: [longitude, latitude] }
      : undefined;
    yield {
      type: 'Feature',
      properties,
      geometry
    }
  }
}
