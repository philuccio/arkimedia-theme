import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor'
import { PanelBody, TextControl, TextareaControl, Button, ColorPicker } from '@wordpress/components'
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

        const updateImage = ( index, data ) => {
            const updated = images.map( ( img, i ) =>
                i === index ? { ...img, ...data } : img
            )
            setAttributes({ images: updated })
        }

        return (
            <>
                <InspectorControls>

                    <PanelBody title={ __( 'Header', 'arkimedia' ) } initialOpen={true}>
                        <TextControl
                            label={ __( 'Eyebrow', 'arkimedia' ) }
                            value={eyebrow}
                            onChange={ val => setAttributes({ eyebrow: val }) }
                        />
                        <TextControl
                            label={ __( 'Titolo', 'arkimedia' ) }
                            value={title}
                            onChange={ val => setAttributes({ title: val }) }
                        />
                    </PanelBody>

                    <PanelBody title={ __( 'CTA Panel', 'arkimedia' ) } initialOpen={false}>
                        <TextControl
                            label={ __( 'Eyebrow CTA', 'arkimedia' ) }
                            value={ctaEyebrow}
                            onChange={ val => setAttributes({ ctaEyebrow: val }) }
                        />
                        <TextareaControl
                            label={ __( 'Titolo CTA (usa <em> per corsivo)', 'arkimedia' ) }
                            value={ctaTitle}
                            onChange={ val => setAttributes({ ctaTitle: val }) }
                        />
                        <TextareaControl
                            label={ __( 'Testo CTA', 'arkimedia' ) }
                            value={ctaText}
                            onChange={ val => setAttributes({ ctaText: val }) }
                        />
                        <TextControl
                            label={ __( 'Testo pulsante', 'arkimedia' ) }
                            value={ctaLabel}
                            onChange={ val => setAttributes({ ctaLabel: val }) }
                        />
                        <TextControl
                            label={ __( 'URL pulsante', 'arkimedia' ) }
                            value={ctaUrl}
                            onChange={ val => setAttributes({ ctaUrl: val }) }
                            type="url"
                        />
                    </PanelBody>

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

                    <PanelBody title={ __( 'Immagini griglia (9)', 'arkimedia' ) } initialOpen={false}>
                        { images.map( ( img, i ) => (
                            <div key={i} style={{ borderBottom:'1px solid #e0e0e0', paddingBottom:'12px', marginBottom:'12px' }}>
                                <p style={{ fontSize:'11px', fontWeight:600, textTransform:'uppercase', marginBottom:'8px' }}>
                                    { `Immagine ${ i + 1 }` }
                                </p>
                                <MediaUploadCheck>
                                    <MediaUpload
                                        onSelect={ media => updateImage( i, { mediaUrl: media.url, mediaAlt: media.alt || '' }) }
                                        allowedTypes={['image']}
                                        value={img.mediaUrl}
                                        render={ ({ open }) => (
                                            <div>
                                                { img.mediaUrl &&
                                                    <img src={img.mediaUrl}
                                                        style={{ width:'100%', height:'60px', objectFit:'cover', borderRadius:'4px', marginBottom:'8px' }}
                                                    />
                                                }
                                                <Button onClick={open}
                                                    variant={ img.mediaUrl ? 'secondary' : 'primary' }
                                                    style={{ width:'100%', justifyContent:'center' }}>
                                                    { img.mediaUrl ? __('Cambia','arkimedia') : __('Seleziona immagine','arkimedia') }
                                                </Button>
                                                { img.mediaUrl &&
                                                    <Button
                                                        onClick={ () => updateImage( i, { mediaUrl: '', mediaAlt: '' }) }
                                                        variant="tertiary" isDestructive
                                                        style={{ width:'100%', justifyContent:'center', marginTop:'4px' }}>
                                                        { __('Rimuovi','arkimedia') }
                                                    </Button>
                                                }
                                            </div>
                                        )}
                                    />
                                </MediaUploadCheck>
                            </div>
                        ))}
                    </PanelBody>

                </InspectorControls>

                <section { ...blockProps }>

                    {/* Header */}
                    <div style={{ textAlign:'center', marginBottom:'3rem', padding:'0 1.5rem' }}>
                        <p style={{ fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:accentColor, marginBottom:'0.75rem' }}>
                            {eyebrow}
                        </p>
                        <h2 style={{ fontSize:'clamp(2.5rem,5vw,4rem)', fontWeight:700, margin:0 }}>{title}</h2>
                    </div>

                    {/* Body */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 2px 1fr', gap:'0 2.5rem', alignItems:'center', maxWidth:'1200px', margin:'0 auto', padding:'0 1.5rem' }}>

                        {/* Griglia */}
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

                        {/* CTA */}
                        <div style={{ padding:'2rem' }}>
                            <p style={{ fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:accentColor, marginBottom:'1.25rem' }}>
                                {ctaEyebrow}
                            </p>
                            <h3 style={{ fontSize:'clamp(1.75rem,3vw,2.75rem)', fontWeight:700, lineHeight:1.15, marginBottom:'1.25rem' }}
                                dangerouslySetInnerHTML={{ __html: ctaTitle }}>
                            </h3>
                            <p style={{ fontSize:'1rem', lineHeight:1.7, opacity:0.7, marginBottom:'2rem' }}>{ctaText}</p>
                            <div style={{ display:'inline-flex', padding:'1rem 2.5rem', background:accentColor, color:'#fff', fontSize:'0.8125rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', borderRadius:'4px' }}>
                                {ctaLabel}
                            </div>
                        </div>

                    </div>

                </section>
            </>
        )
    },

    save: () => null,
})
