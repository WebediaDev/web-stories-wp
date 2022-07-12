/*
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { mkdir, writeFile } from 'fs/promises';
import util from 'node:util';
import OriginalEnvironment from 'jest-environment-puppeteer';

const ARTIFACTS_PATH =
  process.env.E2E_ARTIFACTS_PATH ||
  (process.env.GITHUB_WORKSPACE || process.cwd()) + '/build/e2e-artifacts';

async function inlineImage() {
  const data = await this.global.page.screenshot({
    type: 'jpeg',
    encoding: 'base64',
    quality: 1,
  });
  // note you can console log this for local debugging
  return `data:image/jpeg;base64,${data}`;
}

class PuppeteerEnvironment extends OriginalEnvironment {
  async setup() {
    await super.setup();

    try {
      await mkdir(ARTIFACTS_PATH, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    }
  }

  async handleTestEvent(event, state) {
    if (event.name === 'test_fn_failure') {
      const testName = `${state.currentlyRunningTest.parent.name}  ${state.currentlyRunningTest.name}`;
      const errors = state.currentlyRunningTest.errors;
      const eventError = util.inspect(event);
      let errorMessages = '';
      errorMessages += `========= ${testName} ==========\n\n`;
      errorMessages +=
        'started:' +
        new Date(event.test.startedAt).toLocaleString() +
        ' ended:' +
        new Date().toLocaleString();
      errorMessages += await inlineImage();
      errorMessages += '============end==========\n\n';
      errors.forEach((error) => {
        errorMessages += `${testName}:${error}\n\n`;
      });

      errorMessages += '=========================\n\n';
      errorMessages += eventError;

      await this.storeArtifacts(testName, errorMessages);

      if (eventError.includes('JestAssertionError')) {
        // return already handled
        return;
      }

      // eslint-disable-next-line no-console
      console.log(' Unhandled event(' + event.name + '): ' + eventError);
    }
  }

  async storeArtifacts(testName, errorMessages) {
    const datetime = new Date().toISOString().split('.')[0];
    const fileName = `${testName} ${datetime}`.replaceAll(/[ :"/\\|?*]+/g, '-');

    await writeFile(`${ARTIFACTS_PATH}/${fileName}-errors.txt`, errorMessages);

    await writeFile(
      `${ARTIFACTS_PATH}/${fileName}-snapshot.html`,
      await this.global.page.content()
    );

    await this.global.page.screenshot({
      path: `${ARTIFACTS_PATH}/${fileName}.jpg`,
    });
  }
}

export default PuppeteerEnvironment;
