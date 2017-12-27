'use strict'

const events = require('events')
const util = require('util')
const pckg = require('../package.json')
const jsonfile = require('jsonfile')
const transformData = require('./transform-data')
/**
 * Forked from a template storage connectors
 * for [deepstream](http://deepstream.io)
 *
 */
class Connector extends events.EventEmitter {

  
  /* @param {Object} options Any options the connector needs to connect to the cache/db and to configure it.
   *
   * @constructor
   */
   
  constructor(options) {
    super();
    const defaultFileName = 'default_data.json';
    const dataFolder = './data/';
    this.saveData = process.env.FILE_MOCK_SAVE_DATA_ON_CLOSE && process.env.FILE_MOCK_SAVE_DATA_ON_CLOSE.match(/^true$/i) != null || false;
    this.isReady = false;
    this.name = pckg.name;
    this.version = pckg.version;
    this.data = {};
    
    // set data file
    this.dataFile = dataFolder + ((options && options.dataFile) ? options.dataFile : defaultFileName);
    
    jsonfile.readFile( this.dataFile, function(err, obj) {
      if (err) {
        this.emit('error', err);
        return;
      }
      this.data = obj;
      this.isReady = true;
      this.emit('ready');


    }.bind(this));
  }

  /**
   * Writes a value to the connector.
   *
   * @param {String}   key
   * @param {Object}   value
   * @param {Function} callback Should be called with null for successful set operations or with an error message string
   *
   * @private
   * @returns {void}
   */
  set(key, value, callback) {
    if (!key) {
      callback(`set data: invalid key: '{key}'`);
      return;
    }
    this.data[key] = transformData.transformValueForStorage(value);
    callback(null);
  }

  /**
   * Retrieves a value from the connector.
   *
   * @param {String}   key
   * @param {Function} callback Will be called with null and the stored object
   *                            for successful operations or with an error message string
   *
   * @returns {void}
   */
  get(key, callback) {
    if (!key) {
      callback(`Get data: invalid key: '{key}'`);
    }
    if (this.data[key]) {
      callback(null, Object.assign({}, transformData.transformValueFromStorage(this.data[key])));
      return;
    }
    callback(null, null)


  }

  /**
   * Deletes an entry from the connector.
   *
   * @param   {String}   key
   * @param   {Function} callback Will be called with null for successful deletions or with
   *                     an error message string
   *
   * @returns {void}
   */
  delete(key, callback) {
    if (!key) {
      callback(`Delete data: invalid key: '{key}'`);
      return;
    }
    if (this.data[key]) {
      delete this.data[key];
    }
    callback(null);


  }

  /**
   * Gracefully close the connector and any dependencies.
   *
   * Called when deepstream.close() is invoked.
   * If this method is defined, it must emit 'close' event to notify deepstream of clean closure.
   *
   * (optional)
   *
   * @public
   * @returns {void}
   */
  close() {
    if (this.saveData) {
      jsonfile.writeFile( this.dataFile, this.data, function(err) {
        if (err) {
          this.emit('error', err);
          return;
        }
        this.emit('close');
        return;

      }.bind(this));

    }
    else {
      // without timeout the test is failing (race condition)
      setTimeout(function(argument) {
        this.emit('close');
        
      }.bind(this), 100);

    }
    return;
  }

}

module.exports = Connector;
