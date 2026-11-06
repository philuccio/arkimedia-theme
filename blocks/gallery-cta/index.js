import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck, RichText } from '@wordpress/block-editor'
import { PanelBody, TextControl, Button, ColorPicker, TabPanel } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { useState, useEffect, useCallback } from '@wordpress/element'
import metadata from './block.json'

// ── Hook locale per TextControl ───────────────────────────
function useLocalText( value, onChange ) {
    const [ local, setLocal ] = useState( value ?? '' )
    useEffect( () => { setLocal( value ?? '' ) }, [ value ] )
    return {
        value:    local,
        onChange: setLocal,
        onBlur:   useCallback( () => onChange( local ), [ local, onChange ] ),
    }
}

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const {
            eyebrow, title,
            ctaEyebrow, ctaTitle, ctaText, ctaLabel, ctaUrl,
            bgColor, textColor, accentColor, dividerColor,
            images
        } = attributes

        const blockProps = useBlockProps({
            className: 'ark-gallery-cta',
            style: {
                background:  bgColor,
                color:       textColor,
                width:       '100vw',
                maxWidth:    '100vw',
                marginLeft:  'calc(50% - 50vw)',
                marginRight: 'calc(50% - 50vw)',
            }
        })

        const ctaUrlText = useLocalText( ctaUrl, v => setAttributes({ ctaUrl: v }) )

        // Selezione multipla — fino a 9 immagini
        const onSelectImages = ( media ) => {
            const selected = media.slice( 0, 9 ).map( m => ({
                mediaId:  m.id,
                mediaUrl: m.url,
                mediaAlt: m.alt || '',
            }))
            // Riempie fino a 9 slot
            while ( selected.length < 9 ) {
                selected.push({ mediaId: 0, mediaUrl: '', mediaAlt: '' })
            }
            setAttributes({ images: selected })
        }

        const updateImage = ( index, data ) => {
            const updated = images.map( ( img, i ) => i === index ? { ...img, ...data } : img )
            setAttributes({ images: [ ...updated ] })
        }

        const removeImage = ( index ) => updateImage( index, { mediaId: 0, mediaUrl: '', mediaAlt: '' } )

        const openMediaFrame = ( index ) => {
            const frame = wp.media({ title: 'Seleziona immagine', button: { text: 'Seleziona' }, multiple: false })
            frame.on( 'select', function() {
                const att = frame.state().get('selection').first().toJSON()
                updateImage( index, { mediaId: att.id, mediaUrl: att.url, mediaAlt: att.alt || '' } )
            })
            frame.open()
        }

        const contentTab = (
            <>
                <PanelBody title={ __( 'Gestione immagini', 'arkimedia' ) } initialOpen={true}>
                    <p style={{ fontSize:'12px', color:'#757575', marginBottom:'12px' }}>
                        { __( 'Seleziona fino a 9 immagini insieme, o clicca un riquadro per cambiare solo quello.', 'arkimedia' ) }
                    </p>
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={ onSelectImages }
                            allowedTypes={['image']}
                            multiple
                            gallery
                            value={ images.map( i => i.mediaId ).filter( Boolean ) }
                            render={ ({ open }) => (
                                <Button onClick={open} variant="primary"
                                    style={{ width:'100%', justifyContent:'center' }}>
                                    { __('Seleziona immagini (multi)','arkimedia') }
                                </Button>
                            )}
                        />
                    </MediaUploadCheck>

                    {/* Griglia con cambio e rimozione singola */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'6px', marginTop:'12px' }}>
                        { images.map( ( img, i ) => (
                            <div key={i} style={{ position:'relative', aspectRatio:'1', background:'#f0f0f0', borderRadius:'4px', overflow:'hidden' }}>
                                <button
                                    type="button"
                                    onClick={ () => openMediaFrame( i ) }
                                    aria-label={ `${ __( 'Cambia immagine', 'arkimedia' ) } ${ i + 1 }` }
                                    style={{ width:'100%', height:'100%', padding:0, border:'none', background:'none', cursor:'pointer', color:'#999', fontSize:'0.75rem' }}>
                                    { img.mediaUrl
                                        ? <img src={img.mediaUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                                        : i + 1
                                    }
                                </button>
                                { img.mediaUrl &&
                                    <button
                                        type="button"
                                        onClick={ () => removeImage( i ) }
                                        aria-label={ `${ __( 'Rimuovi immagine', 'arkimedia' ) } ${ i + 1 }` }
                                        style={{ position:'absolute', top:'2px', right:'2px', background:'rgba(0,0,0,0.7)', color:'#fff', border:'none', borderRadius:'50%', width:'20px', height:'20px', cursor:'pointer', fontSize:'12px', lineHeight:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                        ×
                                    </button>
                                }
                            </div>
                        ))}
                    </div>
                </PanelBody>

                <PanelBody title={ __( 'Link pulsante', 'arkimedia' ) } initialOpen={false}>
                    <TextControl
                        label={ __( 'URL pulsante CTA', 'arkimedia' ) }
                        type="url"
                        { ...ctaUrlText }
                    />
                </PanelBody>
            </>
        )

        const layoutTab = (
            <PanelBody title={ __( 'Colori', 'arkimedia' ) } initialOpen={true}>
                <p style={{fontSize:'11px',fontWeight:600,textTransform:'uppercase',marginBottom:'8px'}}>{ __('Sfondo','arkimedia') }</p>
                <ColorPicker color={bgColor} onChange={ val => setAttributes({ bgColor: val }) } enableAlpha />
                <p style={{fontSize:'11px',fontWeight:600,textTransform:'uppercase',margin:'16px 0 8px'}}>{ __('Testo','arkimedia') }</p>
                <ColorPicker color={textColor} onChange={ val => setAttributes({ textColor: val }) } />
                <p style={{fontSize:'11px',fontWeight:600,textTransform:'uppercase',margin:'16px 0 8px'}}>{ __('Accent','arkimedia') }</p>
                <ColorPicker color={accentColor} onChange={ val => setAttributes({ accentColor: val }) } />
                <p style={{fontSize:'11px',fontWeight:600,textTransform:'uppercase',margin:'16px 0 8px'}}>{ __('Divisore','arkimedia') }</p>
                <ColorPicker color={dividerColor} onChange={ val => setAttributes({ dividerColor: val }) } />
            </PanelBody>
        )

        return (
            <>
                <InspectorControls>
                    <TabPanel
                        tabs={[
                            { name: 'contenuto', title: __( 'Contenuto', 'arkimedia' ) },
                            { name: 'layout',    title: __( 'Layout', 'arkimedia' ) },
                        ]}>
                        { tab => tab.name === 'contenuto' ? contentTab : layoutTab }
                    </TabPanel>
                </InspectorControls>

                {/* Stesso markup di render.php: l'anteprima deve coincidere con il sito */}
                <section { ...blockProps }>

                    {/* Header — testi editabili inline */}
                    <div className="ark-gallery-cta__header container">
                        <RichText
                            identifier="eyebrow"
                            tagName="p"
                            className="ark-gallery-cta__eyebrow"
                            value={eyebrow}
                            onChange={ val => setAttributes({ eyebrow: val }) }
                            placeholder={ __('VISUAL ARCHIVE','arkimedia') }
                            allowedFormats={[]}
                            style={{ color:accentColor }}
                        />
                        <RichText
                            identifier="title"
                            tagName="h2"
                            className="ark-gallery-cta__title"
                            value={title}
                            onChange={ val => setAttributes({ title: val }) }
                            placeholder={ __('Gallery','arkimedia') }
                            allowedFormats={['core/bold','core/italic']}
                        />
                    </div>

                    {/* Body */}
                    <div className="ark-gallery-cta__body container" style={{ maxWidth:'1200px', margin:'0 auto' }}>

                        {/* Griglia 3x3 */}
                        <div className="ark-gallery-cta__grid">
                            { images.map( ( img, i ) => (
                                <div className="ark-gallery-cta__cell" key={i}>
                                    { img.mediaUrl
                                        ? <img src={img.mediaUrl} alt="" />
                                        : <div className="ark-gallery-cta__cell--empty" style={{ display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.2)', fontSize:'0.75rem' }}>
                                            {i+1}
                                          </div>
                                    }
                                </div>
                            ))}
                        </div>

                        {/* Divisore */}
                        <div className="ark-gallery-cta__divider" style={{ background:dividerColor }}></div>

                        {/* CTA — testi editabili inline */}
                        <div className="ark-gallery-cta__cta">
                            <RichText
                                identifier="ctaEyebrow"
                                tagName="p"
                                className="ark-gallery-cta__cta-eyebrow"
                                value={ctaEyebrow}
                                onChange={ val => setAttributes({ ctaEyebrow: val }) }
                                placeholder={ __('STAY IN TOUCH','arkimedia') }
                                allowedFormats={[]}
                                style={{ color:accentColor }}
                            />
                            <RichText
                                identifier="ctaTitle"
                                tagName="h3"
                                className="ark-gallery-cta__cta-title"
                                value={ctaTitle}
                                onChange={ val => setAttributes({ ctaTitle: val }) }
                                placeholder={ __("Let's create something extraordinary together",'arkimedia') }
                                allowedFormats={['core/bold','core/italic']}
                            />
                            <RichText
                                identifier="ctaText"
                                tagName="p"
                                className="ark-gallery-cta__cta-text"
                                value={ctaText}
                                onChange={ val => setAttributes({ ctaText: val }) }
                                placeholder={ __('Descrizione...','arkimedia') }
                                allowedFormats={['core/bold','core/italic']}
                            />
                            <RichText
                                identifier="ctaLabel"
                                tagName="span"
                                className="ark-gallery-cta__cta-btn"
                                value={ctaLabel}
                                onChange={ val => setAttributes({ ctaLabel: val }) }
                                placeholder={ __('GET IN TOUCH','arkimedia') }
                                allowedFormats={[]}
                                style={{ background:accentColor }}
                            />
                        </div>

                    </div>

                </section>
            </>
        )
    },

    save: () => null,
})
