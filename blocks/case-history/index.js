import { registerBlockType } from '@wordpress/blocks'
import {
    useBlockProps, useInnerBlocksProps, InnerBlocks,
    InspectorControls, MediaUpload, MediaUploadCheck,
} from '@wordpress/block-editor'
import {
    PanelBody, ToggleControl, RangeControl, SelectControl, Button, ColorPicker, TabPanel,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { useState, useEffect, useCallback, useRef } from '@wordpress/element'
import metadata from './block.json'

const ALLOWED_BLOCKS = [
    'core/paragraph', 'core/heading', 'core/image', 'core/list', 'core/spacer', 'core/separator',
    'arkimedia/text', 'arkimedia/image',
]
const TEMPLATE = [ [ 'core/paragraph', { placeholder: __( 'Scrivi il testo della case history…', 'arkimedia' ) } ] ]

function LocalRange( { label, value, onChange, min = 0, max = 200, step = 1 } ) {
    const [ local, setLocal ] = useState( value ?? 0 )
    const committed = useRef( value ?? 0 )
    useEffect( () => { setLocal( value ?? 0 ); committed.current = value ?? 0 }, [ value ] )
    const commit = useCallback( () => {
        if ( committed.current !== local ) { committed.current = local; onChange( local ) }
    }, [ local, onChange ] )
    return (
        <div onPointerUp={ commit } onKeyUp={ commit }>
            <RangeControl label={label} value={local} onChange={ setLocal } min={min} max={max} step={step} />
        </div>
    )
}

function ColorField( { label, value, onChange } ) {
    return (
        <div style={{ marginBottom:'16px' }}>
            <p style={{ fontSize:'11px', fontWeight:600, marginBottom:'8px' }}>{ label }</p>
            <ColorPicker color={value} onChange={ onChange } enableAlpha />
            { value && <Button onClick={ () => onChange( '' ) } variant="tertiary" isDestructive>{ __( 'Rimuovi', 'arkimedia' ) }</Button> }
        </div>
    )
}

const arrowStyle = {
    background:'rgba(0,0,0,0.7)', color:'#fff', border:'none', borderRadius:'3px',
    width:'22px', height:'22px', cursor:'pointer', fontSize:'12px', lineHeight:1, padding:0,
}

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const {
            images, imagesSide, imagesWidth, columnsGap, imagesGap, imagesRadius,
            imagesBgColor, imagesPadding,
            lightbox, bgColor, textColor, paddingTop, paddingBottom,
            mobilePairRatio, mobilePairGap,
        } = attributes

        const blockProps = useBlockProps({
            className: `ark-case-history ark-case-history--images-${ imagesSide }${ images.length ? '' : ' ark-case-history--no-images' }`,
            style: {
                width:         '100vw',
                maxWidth:      '100vw',
                marginLeft:    'calc(50% - 50vw)',
                marginRight:   'calc(50% - 50vw)',
                paddingTop:    `${ paddingTop }px`,
                paddingBottom: `${ paddingBottom }px`,
                ...( bgColor   ? { background: bgColor } : {} ),
                ...( textColor ? { color: textColor } : {} ),
            },
        })

        const innerBlocksProps = useInnerBlocksProps(
            { className: 'ark-case-history__content' },
            { allowedBlocks: ALLOWED_BLOCKS, template: TEMPLATE, renderAppender: InnerBlocks.ButtonBlockAppender }
        )

        const onSelectImages = ( media ) => {
            setAttributes({ images: media.map( m => ({
                id:    m.id,
                src:   m.url,
                thumb: m.sizes?.large?.url || m.url,
                alt:   m.alt || '',
            })) })
        }

        const moveImage = ( index, dir ) => {
            const target = index + dir
            if ( target < 0 || target >= images.length ) return
            const updated = [ ...images ]
            ;[ updated[ index ], updated[ target ] ] = [ updated[ target ], updated[ index ] ]
            setAttributes({ images: updated })
        }

        const removeImage = ( index ) => {
            setAttributes({ images: images.filter( ( _, i ) => i !== index ) })
        }

        const innerStyle = {
            '--ark-ch-images-w':   `${ imagesWidth }%`,
            '--ark-ch-gap':        `${ columnsGap }px`,
            '--ark-ch-images-gap': `${ imagesGap }px`,
            '--ark-ch-radius':     `${ imagesRadius }px`,
            '--ark-ch-images-pad': `${ imagesPadding }px`,
            ...( imagesBgColor ? { '--ark-ch-images-bg': imagesBgColor } : {} ),
        }

        return (
            <>
                <InspectorControls>
                    <TabPanel
                        tabs={[
                            { name: 'immagini', title: __( 'Immagini', 'arkimedia' ) },
                            { name: 'layout',   title: __( 'Layout', 'arkimedia' ) },
                            { name: 'mobile',   title: __( 'Mobile', 'arkimedia' ) },
                            { name: 'stile',    title: __( 'Stile', 'arkimedia' ) },
                        ]}>
                        { tab => (
                            <>
                                { tab.name === 'immagini' && (
                                    <PanelBody title={ __( 'Colonna immagini', 'arkimedia' ) } initialOpen={true}>
                                        <MediaUploadCheck>
                                            <MediaUpload
                                                onSelect={ onSelectImages }
                                                allowedTypes={['image']}
                                                multiple
                                                gallery
                                                value={ images.map( i => i.id ).filter( Boolean ) }
                                                render={ ({ open }) => (
                                                    <Button onClick={open} variant="primary"
                                                        style={{ width:'100%', justifyContent:'center', marginBottom:'12px' }}>
                                                        { images.length
                                                            ? __( 'Modifica selezione', 'arkimedia' ) + ` (${ images.length })`
                                                            : __( 'Seleziona immagini', 'arkimedia' )
                                                        }
                                                    </Button>
                                                )}
                                            />
                                        </MediaUploadCheck>

                                        { images.map( ( img, i ) => (
                                            <div key={ img.id || i } style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
                                                <img src={ img.thumb || img.src } alt=""
                                                    style={{ width:'48px', height:'48px', objectFit:'cover', borderRadius:'3px', flexShrink:0 }} />
                                                <span style={{ fontSize:'11px', opacity:0.7, flex:1 }}>{ __( 'Foto', 'arkimedia' ) } { i + 1 }</span>
                                                <button type="button" style={arrowStyle} disabled={ i === 0 } onClick={ () => moveImage( i, -1 ) } aria-label={ __( 'Sposta su', 'arkimedia' ) }>↑</button>
                                                <button type="button" style={arrowStyle} disabled={ i === images.length - 1 } onClick={ () => moveImage( i, 1 ) } aria-label={ __( 'Sposta giù', 'arkimedia' ) }>↓</button>
                                                <button type="button" style={{ ...arrowStyle, borderRadius:'50%' }} onClick={ () => removeImage( i ) } aria-label={ __( 'Rimuovi', 'arkimedia' ) }>×</button>
                                            </div>
                                        ))}

                                        <ToggleControl
                                            label={ __( 'Lightbox al click', 'arkimedia' ) }
                                            checked={lightbox}
                                            onChange={ v => setAttributes({ lightbox: v }) }
                                            help={ __( 'Sotto i 1024px la colonna immagini è nascosta.', 'arkimedia' ) }
                                        />
                                    </PanelBody>
                                )}

                                { tab.name === 'immagini' && (
                                    <PanelBody title={ __( 'Cornice', 'arkimedia' ) } initialOpen={true}>
                                        <p style={{ fontSize:'12px', color:'#757575', margin:'0 0 12px' }}>
                                            { __( 'Il colore di sfondo si vede nel padding e nello spazio tra le immagini (Layout → Spazio tra le immagini).', 'arkimedia' ) }
                                        </p>
                                        <ColorField label={ __( 'Colore cornice', 'arkimedia' ) } value={imagesBgColor} onChange={ v => setAttributes({ imagesBgColor: v }) } />
                                        <LocalRange label={ __( 'Padding cornice (px)', 'arkimedia' ) } value={imagesPadding} onChange={ v => setAttributes({ imagesPadding: v }) } min={0} max={100} />
                                    </PanelBody>
                                )}

                                { tab.name === 'layout' && (
                                    <PanelBody title={ __( 'Colonne', 'arkimedia' ) } initialOpen={true}>
                                        <ToggleGroupControl
                                            label={ __( 'Posizione colonna immagini', 'arkimedia' ) }
                                            value={imagesSide}
                                            onChange={ v => setAttributes({ imagesSide: v }) }
                                            isBlock>
                                            <ToggleGroupControlOption value="left"  label={ __( 'Sinistra', 'arkimedia' ) } />
                                            <ToggleGroupControlOption value="right" label={ __( 'Destra', 'arkimedia' ) } />
                                        </ToggleGroupControl>
                                        <LocalRange label={ __( 'Larghezza colonna immagini (%)', 'arkimedia' ) } value={imagesWidth} onChange={ v => setAttributes({ imagesWidth: v }) } min={10} max={60} />
                                        <LocalRange label={ __( 'Spazio tra le colonne (px)', 'arkimedia' ) } value={columnsGap} onChange={ v => setAttributes({ columnsGap: v }) } min={0} max={120} />
                                        <LocalRange label={ __( 'Spazio tra le immagini (px)', 'arkimedia' ) } value={imagesGap} onChange={ v => setAttributes({ imagesGap: v }) } min={0} max={80} />
                                        <LocalRange label={ __( 'Angoli immagini (px)', 'arkimedia' ) } value={imagesRadius} onChange={ v => setAttributes({ imagesRadius: v }) } min={0} max={40} />
                                    </PanelBody>
                                )}

                                { tab.name === 'mobile' && (
                                    <PanelBody title={ __( 'Mobile (fino a 768px)', 'arkimedia' ) } initialOpen={true}>
                                        <p style={{ fontSize:'12px', color:'#757575', margin:'0 0 12px' }}>
                                            { __( 'Su mobile la colonna immagini è nascosta e il contenuto comincia sempre con un testo. Due immagini consecutive vengono affiancate.', 'arkimedia' ) }
                                        </p>
                                        <SelectControl
                                            label={ __( 'Proporzione immagini affiancate', 'arkimedia' ) }
                                            value={mobilePairRatio}
                                            options={[
                                                { label: '4:3',  value: '4/3' },
                                                { label: '1:1',  value: '1/1' },
                                                { label: '3:4',  value: '3/4' },
                                                { label: '16:9', value: '16/9' },
                                            ]}
                                            onChange={ v => setAttributes({ mobilePairRatio: v }) }
                                            help={ __( 'Le due immagini riempiono il riquadro (cover).', 'arkimedia' ) }
                                        />
                                        <LocalRange label={ __( 'Spazio tra le immagini affiancate (px)', 'arkimedia' ) } value={mobilePairGap} onChange={ v => setAttributes({ mobilePairGap: v }) } min={0} max={40} />
                                    </PanelBody>
                                )}

                                { tab.name === 'stile' && (
                                    <PanelBody title={ __( 'Stile sezione', 'arkimedia' ) } initialOpen={true}>
                                        <ColorField label={ __( 'Colore sfondo', 'arkimedia' ) } value={bgColor} onChange={ v => setAttributes({ bgColor: v }) } />
                                        <ColorField label={ __( 'Colore testo', 'arkimedia' ) } value={textColor} onChange={ v => setAttributes({ textColor: v }) } />
                                        <LocalRange label={ __( 'Padding top (px)', 'arkimedia' ) } value={paddingTop} onChange={ v => setAttributes({ paddingTop: v }) } max={300} />
                                        <LocalRange label={ __( 'Padding bottom (px)', 'arkimedia' ) } value={paddingBottom} onChange={ v => setAttributes({ paddingBottom: v }) } max={300} />
                                    </PanelBody>
                                )}
                            </>
                        )}
                    </TabPanel>
                </InspectorControls>

                <section { ...blockProps }>
                    <div className="container ark-case-history__inner" style={ innerStyle }>
                        <div { ...innerBlocksProps } />
                        { images.length > 0 && (
                            <aside className="ark-case-history__images">
                                { images.map( ( img, i ) => (
                                    <figure key={ img.id || i } className="ark-case-history__image">
                                        <img src={ img.thumb || img.src } alt={ img.alt } />
                                    </figure>
                                ))}
                            </aside>
                        )}
                    </div>
                </section>
            </>
        )
    },

    save() {
        return <InnerBlocks.Content />
    },
})
