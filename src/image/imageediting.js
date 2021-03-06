/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module image/image/imageediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ImageLoadObserver from './imageloadobserver';

import {
	viewFigureToModel,
	modelToViewAttributeConverter,
	srcsetAttributeConverter
} from './converters';

import { toImageWidget } from './utils';

import { downcastElementToElement } from '@ckeditor/ckeditor5-engine/src/conversion/downcast-converters';
import { upcastElementToElement, upcastAttributeToAttribute } from '@ckeditor/ckeditor5-engine/src/conversion/upcast-converters';

/**
 * The image engine plugin.
 * It registers `<image>` as a block element in the document schema, and allows `alt`, `src` and `srcset` attributes.
 * It also registers converters for editing and data pipelines.
 *
 * @extends module:core/plugin~Plugin
 */
export default class ImageEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const schema = editor.model.schema;
		const t = editor.t;
		const conversion = editor.conversion;

		// See https://github.com/ckeditor/ckeditor5-image/issues/142.
		editor.editing.view.addObserver( ImageLoadObserver );

		// Configure schema.
		schema.register( 'image', {
			isObject: true,
			isBlock: true,
			allowWhere: '$block',
			allowAttributes: [ 'alt', 'src', 'srcset' ]
		} );

		conversion.for( 'dataDowncast' ).add( downcastElementToElement( {
			model: 'image',
			view: ( modelElement, viewWriter ) => createImageViewElement( viewWriter )
		} ) );

		conversion.for( 'editingDowncast' ).add( downcastElementToElement( {
			model: 'image',
			view: ( modelElement, viewWriter ) => toImageWidget( createImageViewElement( viewWriter ), viewWriter, t( 'image widget' ) )
		} ) );

		conversion.for( 'downcast' )
			.add( modelToViewAttributeConverter( 'src' ) )
			.add( modelToViewAttributeConverter( 'alt' ) )
			.add( srcsetAttributeConverter() );

		conversion.for( 'upcast' )
			.add( upcastElementToElement( {
				view: {
					name: 'img',
					attributes: {
						src: true
					}
				},
				model: ( viewImage, modelWriter ) => modelWriter.createElement( 'image', { src: viewImage.getAttribute( 'src' ) } )
			} ) )
			.add( upcastAttributeToAttribute( {
				view: {
					name: 'img',
					key: 'alt'
				},
				model: 'alt'
			} ) )
			.add( upcastAttributeToAttribute( {
				view: {
					name: 'img',
					key: 'srcset'
				},
				model: {
					key: 'srcset',
					value: viewImage => {
						const value = {
							data: viewImage.getAttribute( 'srcset' )
						};

						if ( viewImage.hasAttribute( 'width' ) ) {
							value.width = viewImage.getAttribute( 'width' );
						}

						return value;
					}
				}
			} ) )
			.add( viewFigureToModel() );
	}
}

// Creates a view element representing the image.
//
//		<figure class="image"><img></img></figure>
//
// Note that `alt` and `src` attributes are converted separately, so they are not included.
//
// @private
// @param {module:engine/view/downcastwriter~DowncastWriter} writer
// @returns {module:engine/view/containerelement~ContainerElement}
export function createImageViewElement( writer ) {
	const emptyElement = writer.createEmptyElement( 'img' );
	const figure = writer.createContainerElement( 'figure', { class: 'image' } );

	writer.insert( writer.createPositionAt( figure, 0 ), emptyElement );

	return figure;
}
