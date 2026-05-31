import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls } from '@wordpress/block-editor'
import { PanelBody, TextControl, TextareaControl, Button, ColorPicker, RangeControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import metadata from './block.json'

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
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

        const openMediaFrame = ( cardIndex ) => {
            const frame = wp.media({
                title:    'Seleziona immagine',
                button:   { text: 'Seleziona' },
                multiple: false,
            })
            frame.on( 'select', function() {
                const att     = frame.state().get('selection').first().toJSON()
                const updated = cards.map( ( c, i ) =>
                    i === cardIndex ? { ...c, mediaUrl: att.url, mediaAlt: att.alt || '' } : c
                )
                setAttributes({ cards: [ ...updated ] })
            })
            frame.open()
        }

        const removeCardImage = ( cardIndex ) => {
            const updated = cards.map( ( c, i ) =>
                i === cardIndex ? { ...c, mediaUrl: '', mediaAlt: '' } : c
            )
            setAttributes({ cards: [ ...updated ] })
        }

        const updateCardField = ( cardIndex, key, value ) => {
            const updated = cards.map( ( c, i ) =>
                i === cardIndex ? { ...c, [key]: value } : c
            )
            setAttributes({ cards: [ ...updated ] })
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
                        <ColorPicker color={bgColor} onChange={ val => setAttributes({ bgColor: val }) } enableAlpha />
                        <p style={{fontSize:'11px',fontWeight:600,textTransform:'uppercase',margin:'16px 0 8px'}}>
                            { __('Colore testo','arkimedia') }
                        </p>
                        <ColorPicker color={textColor} onChange={ val => setAttributes({ textColor: val }) } />
                        <p style={{fontSize:'11px',fontWeight:600,textTransform:'uppercase',margin:'16px 0 8px'}}>
                            { __('Colore accent (eyebrow)','arkimedia') }
                        </p>
                        <ColorPicker color={accentColor} onChange={ val => setAttributes({ accentColor: val }) } />
                    </PanelBody>

                    { cards.map( ( card, idx ) => (
                        <PanelBody key={idx} title={ `Card ${ idx + 1 }: ${ card.title || '—' }` } initialOpen={false}>
                            <TextControl
                                label={ __( 'Titolo card', 'arkimedia' ) }
                                value={card.title}
                                onChange={ val => updateCardField( idx, 'title', val ) }
                            />
                            <TextareaControl
                                label={ __( 'Testo card', 'arkimedia' ) }
                                value={card.text}
                                onChange={ val => updateCardField( idx, 'text', val ) }
                            />
                            { card.mediaUrl && (
                                <img src={card.mediaUrl}
                                    style={{ width:'100%', height:'80px', objectFit:'cover', borderRadius:'4px', marginBottom:'8px' }}
                                />
                            )}
                            <Button
                                variant={ card.mediaUrl ? 'secondary' : 'primary' }
                                style={{ width:'100%', justifyContent:'center' }}
                                onClick={ () => openMediaFrame( idx ) }>
                                { card.mediaUrl ? __('Cambia immagine','arkimedia') : __('Seleziona immagine','arkimedia') }
                            </Button>
                            { card.mediaUrl && (
                                <Button
                                    onClick={ () => removeCardImage( idx ) }
                                    variant="tertiary" isDestructive
                                    style={{ width:'100%', justifyContent:'center', marginTop:'4px' }}>
                                    { __('Rimuovi immagine','arkimedia') }
                                </Button>
                            )}
                        </PanelBody>
                    ))}

                </InspectorControls>

                <section { ...blockProps }>
                    <div style={{ textAlign:'center', marginBottom:'2rem', padding:'0 1.5rem' }}>
                        <p style={{ fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:accentColor, margin:'0 0 1rem' }}>
                            {eyebrow}
                        </p>
                        <h2 style={{ fontSize:'clamp(3rem,8vw,7rem)', fontWeight:900, textTransform:'uppercase', lineHeight:1, margin:0, letterSpacing:'-0.02em' }}>
                            {title}
                        </h2>
                    </div>

                    <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', borderBottom:'1px solid rgba(255,255,255,0.1)', padding:'0.875rem 1.5rem', marginBottom:'3rem', fontSize:`${marqueeFontSize}px`, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', opacity:0.8, overflow:'hidden', whiteSpace:'nowrap' }}>
                        {marqueeText}
                    </div>

                    <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'1.5rem', maxWidth:'1200px', margin:'0 auto', padding:'0 1.5rem' }}>
                        { cards.map( ( card, idx ) => (
                            <div key={idx} style={{ background:'rgba(255,255,255,0.04)', borderRadius:'8px', overflow:'hidden' }}>
                                { card.mediaUrl
                                    ? <img src={card.mediaUrl} style={{ width:'100%', aspectRatio:'16/10', objectFit:'cover', display:'block' }} />
                                    : <div style={{ background:'rgba(255,255,255,0.08)', aspectRatio:'16/10', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.3)', fontSize:'0.875rem' }}>
                                        { __('Seleziona immagine nel pannello →','arkimedia') }
                                      </div>
                                }
                                <div style={{ padding:'1.5rem' }}>
                                    <h3 style={{ fontSize:'1.25rem', fontWeight:700, margin:'0 0 0.75rem' }}>{card.title}</h3>
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
