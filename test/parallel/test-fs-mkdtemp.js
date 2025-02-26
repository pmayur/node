'use strict';

const common = require('../common');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const tmpdir = require('../common/tmpdir');
tmpdir.refresh();

function handler(err, folder) {
  assert.ifError(err);
  assert(fs.existsSync(folder));
  assert.strictEqual(this, undefined);
}

// Test with plain string
{
  const tmpFolder = fs.mkdtempSync(path.join(tmpdir.path, 'foo.'));

  assert.strictEqual(path.basename(tmpFolder).length, 'foo.XXXXXX'.length);
  assert(fs.existsSync(tmpFolder));

  const utf8 = fs.mkdtempSync(path.join(tmpdir.path, '\u0222abc.'));
  assert.strictEqual(Buffer.byteLength(path.basename(utf8)),
                     Buffer.byteLength('\u0222abc.XXXXXX'));
  assert(fs.existsSync(utf8));

  fs.mkdtemp(path.join(tmpdir.path, 'bar.'), common.mustCall(handler));

  // Same test as above, but making sure that passing an options object doesn't
  // affect the way the callback function is handled.
  fs.mkdtemp(path.join(tmpdir.path, 'bar.'), {}, common.mustCall(handler));

  const warningMsg = 'mkdtemp() templates ending with X are not portable. ' +
                     'For details see: https://nodejs.org/api/fs.html';
  common.expectWarning('Warning', warningMsg);
  fs.mkdtemp(path.join(tmpdir.path, 'bar.X'), common.mustCall(handler));
}

// Test with URL object
{
  tmpdir.url = pathToFileURL(tmpdir.path);
  const urljoin = (base, path) => new URL(path, base);

  const tmpFolder = fs.mkdtempSync(urljoin(tmpdir.url, 'foo.'));

  assert.strictEqual(path.basename(tmpFolder).length, 'foo.XXXXXX'.length);
  assert(fs.existsSync(tmpFolder));

  const utf8 = fs.mkdtempSync(urljoin(tmpdir.url, '\u0222abc.'));
  assert.strictEqual(Buffer.byteLength(path.basename(utf8)),
                     Buffer.byteLength('\u0222abc.XXXXXX'));
  assert(fs.existsSync(utf8));

  fs.mkdtemp(urljoin(tmpdir.url, 'bar.'), common.mustCall(handler));

  // Same test as above, but making sure that passing an options object doesn't
  // affect the way the callback function is handled.
  fs.mkdtemp(urljoin(tmpdir.url, 'bar.'), {}, common.mustCall(handler));

  // Warning fires only once
  fs.mkdtemp(urljoin(tmpdir.url, 'bar.X'), common.mustCall(handler));
}

// Test with Buffer
{
  const tmpFolder = fs.mkdtempSync(Buffer.from(path.join(tmpdir.path, 'foo.')));

  assert.strictEqual(path.basename(tmpFolder).length, 'foo.XXXXXX'.length);
  assert(fs.existsSync(tmpFolder));

  const utf8 = fs.mkdtempSync(Buffer.from(path.join(tmpdir.path, '\u0222abc.')));
  assert.strictEqual(Buffer.byteLength(path.basename(utf8)),
                     Buffer.byteLength('\u0222abc.XXXXXX'));
  assert(fs.existsSync(utf8));

  fs.mkdtemp(Buffer.from(path.join(tmpdir.path, 'bar.')), common.mustCall(handler));

  // Same test as above, but making sure that passing an options object doesn't
  // affect the way the callback function is handled.
  fs.mkdtemp(Buffer.from(path.join(tmpdir.path, 'bar.')), {}, common.mustCall(handler));

  // Warning fires only once
  fs.mkdtemp(Buffer.from(path.join(tmpdir.path, 'bar.X')), common.mustCall(handler));
}

// Test with Uint8Array
{
  const encoder = new TextEncoder();

  const tmpFolder = fs.mkdtempSync(encoder.encode(path.join(tmpdir.path, 'foo.')));

  assert.strictEqual(path.basename(tmpFolder).length, 'foo.XXXXXX'.length);
  assert(fs.existsSync(tmpFolder));

  const utf8 = fs.mkdtempSync(encoder.encode(path.join(tmpdir.path, '\u0222abc.')));
  assert.strictEqual(Buffer.byteLength(path.basename(utf8)),
                     Buffer.byteLength('\u0222abc.XXXXXX'));
  assert(fs.existsSync(utf8));

  fs.mkdtemp(encoder.encode(path.join(tmpdir.path, 'bar.')), common.mustCall(handler));

  // Same test as above, but making sure that passing an options object doesn't
  // affect the way the callback function is handled.
  fs.mkdtemp(encoder.encode(path.join(tmpdir.path, 'bar.')), {}, common.mustCall(handler));

  // Warning fires only once
  fs.mkdtemp(encoder.encode(path.join(tmpdir.path, 'bar.X')), common.mustCall(handler));
}
