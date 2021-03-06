/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global window */

import ClassicTestEditor from '@ckeditor/ckeditor5-core/tests/_utils/classictesteditor';
import ImageCaption from '../src/imagecaption';
import ImageCaptionEditing from '../src/imagecaption/imagecaptionediting';

describe( 'ImageCaption', () => {
	let editor;

	beforeEach( () => {
		const editorElement = window.document.createElement( 'div' );
		window.document.body.appendChild( editorElement );

		return ClassicTestEditor
			.create( editorElement, {
				plugins: [ ImageCaption ]
			} )
			.then( newEditor => {
				editor = newEditor;
			} );
	} );

	it( 'should be loaded', () => {
		expect( editor.plugins.get( ImageCaption ) ).to.instanceOf( ImageCaption );
	} );

	it( 'should load ImageCaptionEditing plugin', () => {
		expect( editor.plugins.get( ImageCaptionEditing ) ).to.instanceOf( ImageCaptionEditing );
	} );
} );
