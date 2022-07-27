/*
 * Copyright 2021 Google LLC
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
export const STORY_FIELDS = [
  'id',
  'title',
  'status',
  'date',
  'date_gmt',
  'modified',
  'modified_gmt',
  'link',
  'meta.web_stories_poster',
  'preview_link',
  'edit_link',
  // _web_stories_envelope will add these fields, we need them too.
  'body',
  'status',
  'headers',
].join(',');

export const SEARCH_PAGES_FIELDS = ['id', 'title'];
export const GET_PAGE_FIELDS = ['title', 'link'];

export const STORY_EMBED = 'wp:lock,wp:lockuser,author,wp:featuredmedia';

export const REST_LINKS = {
  EDIT: 'wp:action-edit',
  DELETE: 'wp:action-delete',
};
