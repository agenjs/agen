@agen/json
==========

This package contains the following functions:
* `jsonFromArrays`: transforms arrays to JSON objects; the first array is used
   as a definition of field names; It can be used to transform CSV files to
   objects.
* `jsonFromStrings`: deserializes sequence of strings to JSON objects;
  it peforms the inverse operation for the `jsonToStrings` method.
* `jsonToArrays`:  transforms JSON objects to arrays
* `jsonToGeojson`: transforms simple JSON objects to GeoJSON format; uses
  defined latitude/longitude fields to define geographical position
* `jsonToStrings`: serializes JSON objects as strings;
  it peforms the inverse operation for the `jsonFromStrings` method
