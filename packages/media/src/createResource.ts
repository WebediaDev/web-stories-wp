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
 * Internal dependencies
 */
import getTypeFromMime from './getTypeFromMime';
import type {
  GifResource,
  Resource,
  VideoResource,
  ResourceInput,
} from './types';

/**
 * Creates a resource object.
 *
 * @param data Resource data.
 * @return Resource object.
 */
function createResource({
  baseColor,
  blurHash,
  type,
  mimeType,
  creationDate,
  src,
  width,
  height,
  poster,
  posterId,
  id,
  length,
  lengthFormatted,
  alt,
  sizes,
  attribution,
  output,
  isPlaceholder = false,
  isOptimized = false,
  isMuted = false,
  isExternal = false,
  trimData,
  needsProxy = false,
}: ResourceInput): Resource | VideoResource | GifResource {
  return {
    baseColor,
    blurHash,
    type: type || getTypeFromMime(mimeType),
    mimeType,
    creationDate,
    src,
    width: Number(width || 0),
    height: Number(height || 0),
    poster,
    posterId,
    id,
    length,
    lengthFormatted,
    alt,
    sizes,
    attribution,
    output,
    isPlaceholder,
    isOptimized,
    isMuted,
    isExternal,
    trimData,
    needsProxy,
  };
}

export default createResource;
