import Portal from '../lib/portal';
import { mount } from 'enzyme';
import assert from 'assert';
import * as tt from 'typescript-definition-tester';
import * as ts from 'typescript';
import * as fs from 'fs';

const TYPESCRIPT_FILE_PATH = './test/typescript/exercise-all-props.ts';

function getPortalInstance(callback) {
  const jsFilePath = TYPESCRIPT_FILE_PATH.replace('.ts', '.js');
  const program = ts.createProgram([TYPESCRIPT_FILE_PATH], {
    noEmitOnError: true, noImplicitAny: true,
    target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS,
  });

  program.emit();
  program.emit(undefined, () => {
    const portal = require('./typescript/exercise-all-props.js').portal; //eslint-disable-line global-require, import/no-unresolved, max-len, spaced-comment

    fs.unlink(jsFilePath, () => {
      callback(portal);
    });
  });
}

describe('TypeScript', () => {
  it('should compile correctly against the TypeScript type definitions', done => {
    tt.compileDirectory(
      `${__dirname}/typescript`,
      fileName => fileName.match(/\.ts$/),
      () => done()
    );
  });

  describe('Creating a Portal instance with TypeScript', () => {
    let portal;

    before(done => {
      getPortalInstance((portalFromTypeScript) => {
        portal = portalFromTypeScript;
        done();
      });
    });

    it('should successfully mount', () => {
      mount(portal);
      assert.equal(document.body.childElementCount, 1);
    });

    it('should contain exactly the props that are allowed in Portal.propTypes', () => {
      const supportedProps = Object.keys(Portal.propTypes);
      const actualProps = Object.keys(portal.props);

      actualProps.forEach(propName => {
        assert.notEqual(supportedProps.indexOf(propName), -1);
      });

      supportedProps.forEach(propName => {
        assert.notEqual(actualProps.indexOf(propName), -1);
      });
    });
  });
});
