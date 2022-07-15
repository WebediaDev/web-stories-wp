/*
 * Copyright 2020 Google LLC
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
 * Takes all elements and all tags and combines
 * the elements with their associated tag
 * while retaining existing properties on the elements.
 *
 * @param {Array<Object>} textElements - story element.
 * @param {Map} tagNamesMap - Map of all tags
 * @return {Object} Updated element object with tagName property
 */
export function combineElementsWithTags(textElements, tagNamesMap) {
  return textElements.map((element) => {
    // we only want to do this on elements that are text
    return element?.type === 'text'
      ? {
          ...element,
          tagName: tagNamesMap.get(element.id),
        }
      : element;
  });
}

export default combineElementsWithTags;
