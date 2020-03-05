# Submission for Spidergap Coding Challenge

This project was done in about 2 hours and contains the following modules:

## deepClone.js

The task at hand was to provide object cloning without any changes to the original object propagating over
It was solved by providing three functions

- deepClone.simple
  Simple cloning of object containing only primitives. Returns false upon receiving complex objects.

- deepClone.shallow
  Cloning using the spread operator for objects that do contain references, but still want first-level primitives cloned without references.

- deepClone.full
  Complete cloning of any complex objects where circular references are caught and set to "[Circular]" instead of looping through each self-reference forever

## partnerFinder.js

This task involved fetching a JSON document from an external server and using Great Circle calculations to reduce the original JSON to only those partners that had offices in a 100km radius around the specified origin location

Additionally, I expanded it to cache the JSON for faster execution on subsequent requests as well as handle errors such as incorrect coordinates on both origin location and any office location as well as bad JSON url and bad JSON parse.