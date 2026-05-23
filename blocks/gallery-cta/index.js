import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck, RichText } from '@wordpress/block-editor'
import { PanelBody, TextControl, Button, ColorPicker } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import metadata from './block.json'

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const {
            eyebrow, title,
            ctaEyebrow, ctaTitle, ctaText, ctaLabel, ctaUrl,
            bgColor, textColor, accentColor, dividerColor,
            images
        } = attributes

        const blockProps = useBlockProps({
            style: {
                background:  bgColor,
                color:       textColor,
                padding:     '5rem 0',
                width:       '100vw',
                maxWidth:    '100vw',
                marginLeft:  'calc(50% - 50vw)',
                marginRight: 'calc(50% - 50vw)',
            }
        })

        // Selezione multipla — fino a 9 immagini
        const onSelectImages = ( media ) => {
            const selected = media.slice( 0, 9 ).map( m => ({
                mediaUrl: m.url,
                mediaAlt: m.alt || '',
            }))
            // Riempie fino a 9 slot
            while ( selected.length < 9 ) {
                selected.push({ mediaUrl: '', mediaAlt: '' })
            }
            setAttributes({ images: selected })
        }

        const removeImage = ( index ) => {
            const updated = images.map( ( img, i ) =>
                i === index ? { mediaUrl: '', mediaAlt: '' } : img
            )
            setAttributes({ images: updated })
        }

        return (
            <>
                <InspectorControls>

                    <PanelBody title={ __( 'Colori', 'arkimedia' ) } initialOpen={false}>
                        <p style={{fontSize:'11px',fontWeight:600,textTransform:'uppercase',marginBottom:'8px'}}>{ __('Sfondo','arkimedia') }</p>
                        <ColorPicker color={bgColor} onChange={ val => setAttributes({ bgColor: val }) } enableAlpha />
                        <p style={{fontSize:'11px',fontWeight:600,textTransform:'uppercase',margin:'16px 0 8px'}}>{ __('Testo','arkimedia') }</p>
                        <ColorPicker color={textColor} onChange={ val => setAttributes({ textColor: val }) } />
                        <p style={{fontSize:'11px',fontWeight:600,textTransform:'uppercase',margin:'16px 0 8px'}}>{ __('Accent','arkimedia') }</p>
                        <ColorPicker color={accentColor} onChange={ val => setAttributes({ accentColor: val }) } />
                        <p style={{fontSize:'11px',fontWeight:600,textTransform:'uppercase',margin:'16px 0 8px'}}>{ __('Divisore','arkimedia') }</p>
                        <ColorPicker color={dividerColor} onChange={ val => setAttributes({ dividerColor: val }) } />
                    </PanelBody>

                    <PanelBody title={ __( 'Link pulsante', 'arkimedia' ) } initialOpen={false}>
                        <TextControl
                            label={ __( 'URL pulsante CTA', 'arkimedia' ) }
                            value={ctaUrl}
                            onChange={ val => setAttributes({ ctaUrl: val }) }
                            type="url"
                        />
                    </PanelBody>

                    <PanelBody title={ __( 'Gestione immagini', 'arkimedia' ) } initialOpen={true}>
                        <p style={{ fontSize:'12px', color:'#757575', marginBottom:'12px' }}>
                            { __( 'Seleziona fino a 9 immagini contemporaneamente dalla libreria media.', 'arkimedia' ) }
                        </p>
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={ onSelectImages }
                                allowedTypes={['image']}
                                multiple
                                gallery
                                value={ images.filter( i => i.mediaUrl ).map( ( _, idx ) => idx ) }
                                render={ ({ open }) => (
                                    <Button onClick={open} variant="primary"
                                        style={{ width:'100%', justifyContent:'center' }}>
                                        { __('Seleziona immagini (multi)','arkimedia') }
                                    </Button>
                                )}
                            />
                        </MediaUploadCheck>

                        {/* Anteprima griglia con rimozione singola */}
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'6px', marginTop:'12px' }}>
                            { images.map( ( img, i ) => (
                                <div key={i} style={{ position:'relative', aspectRatio:'1', background:'#f0f0f0', borderRadius:'4px', overflow:'hidden' }}>
                                    { img.mediaUrl
                                        ? <>
                                            <img src={img.mediaUrl}
                                                style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                                            <button
                                                onClick={ () => removeImage( i ) }
                                                style={{ position:'absolute', top:'2px', right:'2px', background:'rgba(0,0,0,0.7)', color:'#fff', border:'none', borderRadius:'50%', width:'20px', height:'20px', cursor:'pointer', fontSize:'12px', lineHeight:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                                ×
                                            </button>
                                          </>
                                        : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#999', fontSize:'0.75rem' }}>
                                            {i+1}
                                          </div>
                                    }
                                </div>
                            ))}
                        </div>
                    </PanelBody>

                </InspectorControls>

                <section { ...blockProps }>

                    {/* Header — testi editabili inline */}
                    <div style={{ textAlign:'center', marginBottom:'3rem', padding:'0 1.5rem' }}>
                        <RichText
                            tagName="p"
                            value={eyebrow}
                            onChange={ val => setAttributes({ eyebrow: val }) }
                            placeholder={ __('VISUAL ARCHIVE','arkimedia') }
                            allowedFormats={[]}
                            style={{ fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:accentColor, marginBottom:'0.75rem', display:'block' }}
                        />
                        <RichText
                            tagName="h2"
                            value={title}
                            onChange={ val => setAttributes({ title: val }) }
                            placeholder={ __('Gallery','arkimedia') }
                            allowedFormats={['core/bold','core/italic']}
                            style={{ fontSize:'clamp(2.5rem,5vw,4rem)', fontWeight:700, margin:0 }}
                        />
                    </div>

                    {/* Body */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 2px 1fr', gap:'0 2.5rem', alignItems:'center', maxWidth:'1200px', margin:'0 auto', padding:'0 1.5rem' }}>

                        {/* Griglia 3x3 */}
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'6px' }}>
                            { images.map( ( img, i ) => (
                                <div key={i} style={{ aspectRatio:'1', overflow:'hidden', borderRadius:'4px', background:'rgba(255,255,255,0.05)' }}>
                                    { img.mediaUrl
                                        ? <img src={img.mediaUrl} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                                        : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.2)', fontSize:'0.75rem' }}>
                                            {i+1}
                                          </div>
                                    }
                                </div>
                            ))}
                        </div>

                        {/* Divisore */}
                        <div style={{ background:dividerColor, width:'2px', alignSelf:'stretch', minHeight:'400px' }}></div>

                        {/* CTA — testi editabili inline */}
                        <div style={{ padding:'2rem' }}>
                            <RichText
                                tagName="p"
                                value={ctaEyebrow}
                                onChange={ val => setAttributes({ ctaEyebrow: val }) }
                                placeholder={ __('STAY IN TOUCH','arkimedia') }
                                allowedFormats={[]}
                                style={{ fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:accentColor, marginBottom:'1.25rem', display:'block' }}
                            />
                            <RichText
                                tagName="h3"
                                value={ctaTitle}
                                onChange={ val => setAttributes({ ctaTitle: val }) }
                                placeholder={ __("Let's create something extraordinary together",'arkimedia') }
                                allowedFormats={['core/bold','core/italic']}
                                style={{ fontSize:'clamp(1.75rem,3vw,2.75rem)', fontWeight:700, lineHeight:1.15, marginBottom:'1.25rem' }}
                            />
                            <RichText
                                tagName="p"
                                value={ctaText}
                                onChange={ val => setAttributes({ ctaText: val }) }
                                placeholder={ __('Descrizione...','arkimedia') }
                                allowedFormats={['core/bold','core/italic']}
                                style={{ fontSize:'1rem', lineHeight:1.7, opacity:0.7, marginBottom:'2rem', display:'block' }}
                            />
                            <RichText
                                tagName="span"
                                value={ctaLabel}
                                onChange={ val => setAttributes({ ctaLabel: val }) }
                                placeholder={ __('GET IN TOUCH','arkimedia') }
                                allowedFormats={[]}
                                style={{ display:'inline-flex', padding:'1rem 2.5rem', background:accentColor, color:'#fff', fontSize:'0.8125rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', borderRadius:'4px' }}
                            />
                        </div>

                    </div>

                </section>
            </>
        )
    },

    save: () => null,
})
