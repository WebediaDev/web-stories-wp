<?php
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

namespace Google\Web_Stories\Tests\Integration\Media\Video;

use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Media\Video\Utils
 */
class Utils extends TestCase {

	/**
	 * @var \Google\Web_Stories\Media\Video\Utils
	 */
	private $instance;

	/**
	 * @var int
	 */
	private $video_attachment_id;

	/**
	 * @var int
	 */
	private $second_attachment_id;

	public const META_KEY = 'foo';

	public function set_up(): void {
		parent::set_up();

		$this->video_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/uploads/test-video.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'video/mp4',
				'post_title'     => 'Test Video',
			]
		);

		$this->second_attachment_id = self::factory()->attachment->create_object(
			[
				'file'           => DIR_TESTDATA . '/uploads/test-video.mp4',
				'post_parent'    => 0,
				'post_mime_type' => 'video/mp4',
				'post_title'     => 'Test Video',
			]
		);

		add_post_meta( $this->video_attachment_id, self::META_KEY, $this->second_attachment_id );

		$this->instance = new \Google\Web_Stories\Media\Video\Utils();
	}

	/**
	 * @covers ::remove_link
	 */
	public function test_remove_link(): void {
		$this->assertSame( $this->second_attachment_id, (int) get_post_meta( $this->video_attachment_id, self::META_KEY, true ) );
		$this->instance->remove_link( $this->second_attachment_id, self::META_KEY );
		$this->assertEmpty( get_post_meta( $this->video_attachment_id, self::META_KEY, true ) );
	}

	/**
	 * @covers ::remove_link
	 */
	public function test_remove_link_post_type(): void {
		$page_id = self::factory()->post->create( [ 'post_type' => 'page' ] );
		add_post_meta( $page_id, self::META_KEY, $this->second_attachment_id );

		$this->assertSame( $this->second_attachment_id, (int) get_post_meta( $this->video_attachment_id, self::META_KEY, true ) );
		$this->assertSame( $this->second_attachment_id, (int) get_post_meta( $page_id, self::META_KEY, true ) );
		$this->instance->remove_link( $this->second_attachment_id, self::META_KEY );
		$this->assertEmpty( get_post_meta( $this->video_attachment_id, self::META_KEY, true ) );
		$this->assertSame( $this->second_attachment_id, (int) get_post_meta( $page_id, self::META_KEY, true ) );
	}


	/**
	 * @covers ::remove_link
	 */
	public function test_remove_link_invalid_key(): void {
		$this->instance->remove_link( $this->second_attachment_id, 'invalid' );
		$this->assertEmpty( get_post_meta( $this->video_attachment_id, 'invalid', true ) );
	}
}
