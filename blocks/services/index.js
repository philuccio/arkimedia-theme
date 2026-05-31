import { registerBlockType } from '@wordpress/blocks'
import { useState, useEffect } from '@wordpress/element'
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor'
import { PanelBody, TextControl, TextareaControl, Button, ColorPicker, RangeControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import metadata from './block.json'

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const [ localCards, setLocalCards ] = useState( cards )
        useEffect( () => { setLocalCards( cards ) }, [] )
        const { eyebrow, title, marqueeText, marqueeFontSize, cards, bgColor, textColor, accentColor } = attributes

        const blockProps = useBlockProps({
            style: {
                background:  bgColor,
                color:       textColor,
                padding:     '4rem 0',
                overflow:    'hidden',
                width:       '100vw',
                maxWidth:    '100vw',
                marginLeft:  'calc(50% - 50vw)',
                marginRight: 'calc(50% - 50vw)',
            }
        })

        const updateCard = ( index, key, value ) => {
            const updated = localCards.map( ( c, i ) =>
                i === index ? { ...c, [key]: value } : c
            )
            setLocalCards( updated )
            setAttributes({ cards: updated })
        }

        return (
            <>
                <InspectorControls>

                    <PanelBody title={ __( 'Testi', 'arkimedia' ) } initialOpen={true}>
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
                        <TextareaControl
                            label={ __( 'Testo marquee', 'arkimedia' ) }
                            value={marqueeText}
                            onChange={ val => setAttributes({ marqueeText: val }) }
                            help={ __( 'Usa • come separatore tra le voci', 'arkimedia' ) }
                        />
                        <RangeControl
                            label={ __( 'Dimensione font marquee (px)', 'arkimedia' ) }
                            value={marqueeFontSize}
                            onChange={ val => setAttributes({ marqueeFontSize: val }) }
                            min={10}
                            max={32}
                            step={1}
                        />
                    </PanelBody>

                    <PanelBody title={ __( 'Colori', 'arkimedia' ) } initialOpen={false}>
                        <p style={{fontSize:'11px',fontWeight:600,textTransform:'uppercase',marginBottom:'8px'}}>
                            { __('Colore sfondo','arkimedia') }
                        </p>
                        <ColorPicker
                            color={bgColor}
                            onChange={ val => setAttributes({ bgColor: val }) }
                            enableAlpha
                        />
                        <p style={{fontSize:'11px',fontWeight:600,textTransform:'uppercase',margin:'16px 0 8px'}}>
                            { __('Colore testo','arkimedia') }
                        </p>
                        <ColorPicker
                            color={textColor}
                            onChange={ val => setAttributes({ textColor: val }) }
                        />
                        <p style={{fontSize:'11px',fontWeight:600,textTransform:'uppercase',margin:'16px 0 8px'}}>
                            { __('Colore accent (eyebrow)','arkimedia') }
                        </p>
                        <ColorPicker
                            color={accentColor}
                            onChange={ val => setAttributes({ accentColor: val }) }
                        />
                    </PanelBody>

                    { localCards.map( ( card, i ) => (
                        <PanelBody key={i} title={ `Card ${ i + 1 }: ${ card.title || '—' }` } initialOpen={false}>
                            <TextControl
                                label={ __( 'Titolo card', 'arkimedia' ) }
                                value={card.title}
                                onChange={ val => updateCard( i, 'title', val ) }
                            />
                            <TextareaControl
                                label={ __( 'Testo card', 'arkimedia' ) }
                                value={card.text}
                                onChange={ val => updateCard( i, 'text', val ) }
                            />
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={ media => {
                                        updateCard( i, 'mediaUrl', media.url )
                                        updateCard( i, 'mediaAlt', media.alt || '' )
                                    }}
                                    allowedTypes={['image']}
                                    value={card.mediaUrl}
                                    render={ ({ open }) => (
                                        <div>
                                            { card.mediaUrl && (
                                                <img src={card.mediaUrl}
                                                    style={{ width:'100%', height:'80px', objectFit:'cover', borderRadius:'4px', marginBottom:'8px' }}
                                                />
                                            )}
                                            <Button onClick={open}
                                                variant={ card.mediaUrl ? 'secondary' : 'primary' }
                                                style={{ width:'100%', justifyContent:'center' }}>
                                                { card.mediaUrl
                                                    ? __('Cambia immagine','arkimedia')
                                                    : __('Seleziona immagine','arkimedia')
                                                }
                                            </Button>
                                            { card.mediaUrl && (
                                                <Button
                                                    onClick={ () => { updateCard(i,'mediaUrl',''); updateCard(i,'mediaAlt','') }}
                                                    variant="tertiary" isDestructive
                                                    style={{ width:'100%', justifyContent:'center', marginTop:'4px' }}>
                                                    { __('Rimuovi immagine','arkimedia') }
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                />
                            </MediaUploadCheck>
                        </PanelBody>
                    ))}

                </InspectorControls>

                <section { ...blockProps }>

                    {/* Header */}
                    <div style={{ textAlign:'center', marginBottom:'2rem', padding:'0 1.5rem' }}>
                        <p style={{ fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:accentColor, marginBottom:'1rem', margin:'0 0 1rem' }}>
                            {eyebrow}
                        </p>
                        <h2 style={{ fontSize:'clamp(3rem,8vw,7rem)', fontWeight:900, textTransform:'uppercase', lineHeight:1, margin:0, letterSpacing:'-0.02em' }}>
                            {title}
                        </h2>
                    </div>

                    {/* Marquee preview */}
                    <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', borderBottom:'1px solid rgba(255,255,255,0.1)', padding:'0.875rem 1.5rem', marginBottom:'3rem', fontSize:`${marqueeFontSize}px`, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', opacity:0.8, overflow:'hidden', whiteSpace:'nowrap' }}>
                        {marqueeText}
                    </div>

                    {/* Cards grid */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'1.5rem', maxWidth:'1200px', margin:'0 auto', padding:'0 1.5rem' }}>
                        { localCards.map( ( card, i ) => (
                            <div key={i} style={{ background:'rgba(255,255,255,0.04)', borderRadius:'8px', overflow:'hidden' }}>
                                { card.mediaUrl
                                    ? <img src={card.mediaUrl} style={{ width:'100%', aspectRatio:'16/10', objectFit:'cover', display:'block' }} />
                                    : <div style={{ background:'rgba(255,255,255,0.08)', aspectRatio:'16/10', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.3)', fontSize:'0.875rem' }}>
                                        { __('Seleziona immagine nel pannello →','arkimedia') }
                                      </div>
                                }
                                <div style={{ padding:'1.5rem' }}>
                                    <h3 style={{ fontSize:'1.25rem', fontWeight:700, marginBottom:'0.75rem', margin:'0 0 0.75rem' }}>{card.title}</h3>
                                    <p style={{ fontSize:'0.9375rem', opacity:0.75, margin:0, lineHeight:1.6 }}>{card.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </section>
            </>
        )
    },

    save: () => null,
})
