<?php
/**
 * Class Utils
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2022 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
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

namespace Google\Web_Stories\Media\Video;

/**
 * Class Utils
 */
class Utils {
	/**
	 * Do stuff.
	 *
	 * @since 1.26.0
	 *
	 * @param int    $object_id Attachment id.
	 * @param string $meta_key Meta key.
	 */
	public function remove_link( int $object_id, string $meta_key ): void {
		$args = [
			'post_type'              => 'attachment',
			'fields'                 => 'ids',
			'post_status'            => 'any',
			'ignore_sticky_posts'    => true,
			'no_found_rows'          => true,
			'update_post_term_cache' => false,
			'update_post_meta_cache' => false,
			'suppress_filters'       => false,
			'meta_query'             => [ // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
				[
					'key'     => $meta_key,
					'value'   => $object_id,
					'compare' => '=',
				],
			],
		];

		// phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.get_posts_get_posts -- False positive.
		$post_ids = get_posts( $args );
		foreach ( $post_ids as $post_id ) {
			delete_post_meta( $post_id, $meta_key, $object_id );
		}
	}
}
