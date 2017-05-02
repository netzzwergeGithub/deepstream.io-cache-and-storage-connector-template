# deepstream.io-cache-and-storage-connector-template

[![Greenkeeper badge](https://badges.greenkeeper.io/deepstreamIO/deepstream.io-cache-and-storage-connector-template.svg)](https://greenkeeper.io/)
A template that can be forked to create new cache and storage connectors

```yaml
plugins:
  <storage|cache>:
    name: <name>
    options:
      <KEY>: "${ENVIRONMENT_VARIABLE}"
```