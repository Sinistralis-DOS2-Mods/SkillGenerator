const util = require('util');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const { StringDecoder } = require('string_decoder');
const glob = require( 'glob' );

const { IS_TYPE: isSkillType } = require('./definitions/skillFields');
const { IS_TYPE: isStatusType } = require('./definitions/statusFields');
const { IS_TYPE: isStatType } = require('./definitions/statFields');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

function getStatFile(dataType, basePath) {
  let directory = 'noDataType';

  if (isSkillType(dataType))
    directory = 'SkillData';
  if (isStatusType(dataType))
    directory = 'StatusData';
  if (isStatType(dataType))
    directory = 'Stats';

  return path.resolve(basePath, directory, `${dataType}.stats`);
}

function formatEnumValue(value) {
  // Anything for my OCD
  return value.split(' ').join('').replace(/(AIF)/g, 'AiF').replace(/(AoE)/g, 'Aoe').replace(/(FX)/g, 'Fx').replace(/([A-Z]+)/g, ' $1').trim().split(' ').join('_').toUpperCase();
}

function requireDirectory(directory) {
  const requiredFiles = {};

  glob.sync(`${directory}/*.js`).forEach( function( file ) {
    requiredFiles[path.basename(file, '.js')] = require(file);
  });

  return requiredFiles;
}

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

async function fileToXml(filePath) {
  const stringDecoder = new StringDecoder();
  let data = await readFile(filePath);

  return stringDecoder.write(data);
}

async function parseXml(xml) {
  const parser = new xml2js.Parser();

  const parseString = util.promisify(parser.parseString);

  return await parseString(xml);
}

module.exports = {
  getStatFile,
  fileToXml,
  parseXml,
  readFile,
  writeFile,
  formatEnumValue,
  requireDirectory,
  ensureDirectoryExistence,
};
