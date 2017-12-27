# deepstream.io-deepstream.io-storage-connector-file-mock

Read (and store) your data from a file. Its simplify offline development.

To store the data in the file you have to set the environment variable FILE_MOCK_SAVE_DATA_ON_CLOSE to TRUE.

FILE_MOCK_SAVE_DATA_ON_CLOSE=true deepstream  start

The Data is stored in the data directory, wenn stopping the deepstream server.

```yaml
plugins:
  storage:
    name: <name>
    options:
      dataFile:  <fileName>?
      
```
dataFile ist optional. If the dataFile option missing default_data.json will be used from the data directory.
dataFile has to exist (eg copy empty_datda.json)
