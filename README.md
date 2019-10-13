# Nodebase - a simple file-based JSON data management and persistence library.

This is very much a WIP. Below is an outline of how I imagine this library being used.

## Instantiating a Base
```
  const path = require('path'),
  /*
   * Figure out where NodeBase's data directory
   * will be created
   */
    projectDir = path.resolve(__dirname),
    // Require the library
    nodeBase = require('nodebase'),
    // Construct a base
    base = new nodeBase(projectDir);
```

That's it! Now we have a base in which we can create many stores. The contents of this base will live at the `data` directory within `projectDir`.

If there's already content in that directory, we will try to instantiate NodeBase on top of that data.

## Schema and Stores
```
  // Define the properties your data will contain
    formSchema = [
      {
        label: "first",
        type: String,
        length: 16,
        required: true
      },
      {
        label: "last",
        type: String,
        length: 24,
        required: true
      }
      {
        label: "email",
        type: String,
        length: 32,
        required: true
      }
    ],
    // Instantiate a new data store
    Form = new base.store('forms', formSchema);
```

Now we've instantiated a `store` called `forms` that contains values for `first`, `last`, and `email`. 

## Adding and Getting Rows
```
  // Add rows either as a single Object or an Array of Objects
  // Returns an Array of fields and identifiers
  const initialData = await Form.add([
    {
      first: 'Test',
      last: 'Jackson',
      email: 'tjackson@example.com'
    },
    {
      first: 'Bort',
      last: 'Simpson',
      email: 'bsimpson@example.com'
    }
  ]);

  console.log(initialData); // Output: Array [{ identifier, fields }, { identifier, fields }];

  const retrieveData = await Form.getOne({ first: "Test" });
  console.log(retrieveData); // Output: Object { identifier, fields }
```
