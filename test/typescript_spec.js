import Portal from '../lib/portal';
import { mount } from 'enzyme';
import assert from 'assert';
import * as tt from 'typescript-definition-tester';
import * as ts from 'typescript';
import * as fs from 'fs';

const TYPESCRIPT_FILE_PATH = './test/typescript/exercise-all-props.ts';

function getPortalInstance(callback) {
  const compileOptions = {
    noEmitOnError: true, noImplicitAny: true,
    target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS,
  };

  fs.readFile(TYPESCRIPT_FILE_PATH, 'utf-8', (err, data) => {
    if (err) throw err;
    const code = data.replace('../../lib', '../lib');
    /* eslint-disable */
    const portal = eval(ts.transpileModule(code, compileOptions).outputText);
    /* eslint-enable */
    callback(portal);
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
