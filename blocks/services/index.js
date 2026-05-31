import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor'
import { PanelBody, TextControl, TextareaControl, Button, ColorPicker, RangeControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import metadata from './block.json'

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const { eyebrow, title, marqueeText, marqueeFontSize, cards,
            bgColor, textColor, accentColor,
            card1Title, card1Text, card1MediaUrl, card1MediaAlt, card1MediaId,
            card2Title, card2Text, card2MediaUrl, card2MediaAlt, card2MediaId,
            card3Title, card3Text, card3MediaUrl, card3MediaAlt, card3MediaId,
            card4Title, card4Text, card4MediaUrl, card4MediaAlt, card4MediaId,
        } = attributes

        // Usa attributi separati con fallback all'array legacy
        const cardData = [
            { n:1, title: card1Title || (cards[0]?.title||''), text: card1Text || (cards[0]?.text||''), mediaUrl: card1MediaUrl || (cards[0]?.mediaUrl||''), mediaAlt: card1MediaAlt || (cards[0]?.mediaAlt||''), mediaId: card1MediaId },
            { n:2, title: card2Title || (cards[1]?.title||''), text: card2Text || (cards[1]?.text||''), mediaUrl: card2MediaUrl || (cards[1]?.mediaUrl||''), mediaAlt: card2MediaAlt || (cards[1]?.mediaAlt||''), mediaId: card2MediaId },
            { n:3, title: card3Title || (cards[2]?.title||''), text: card3Text || (cards[2]?.text||''), mediaUrl: card3MediaUrl || (cards[2]?.mediaUrl||''), mediaAlt: card3MediaAlt || (cards[2]?.mediaAlt||''), mediaId: card3MediaId },
            { n:4, title: card4Title || (cards[3]?.title||''), text: card4Text || (cards[3]?.text||''), mediaUrl: card4MediaUrl || (cards[3]?.mediaUrl||''), mediaAlt: card4MediaAlt || (cards[3]?.mediaAlt||''), mediaId: card4MediaId },
        ]

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
            const updated = cards.map( ( c, i ) => i === index ? { ...c, [key]: value } : c )
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

                    { cardData.map( ( card ) => (
                        <PanelBody key={i} title={ `Card ${ i + 1 }: ${ card.title || '—' }` } initialOpen={false}>
                            <TextControl
                                label={ __( 'Titolo card', 'arkimedia' ) }
                                value={card.title}
                                onChange={ val => setAttributes({ [`card${card.n}Title`]: val }) }
                            />
                            <TextareaControl
                                label={ __( 'Testo card', 'arkimedia' ) }
                                value={card.text}
                                onChange={ val => setAttributes({ [`card${card.n}Text`]: val }) }
                            />
                            <div>
                                { card.mediaUrl && (
                                    <img src={card.mediaUrl}
                                        style={{ width:'100%', height:'80px', objectFit:'cover', borderRadius:'4px', marginBottom:'8px' }}
                                    />
                                )}
                                <Button
                                    variant={ card.mediaUrl ? 'secondary' : 'primary' }
                                    style={{ width:'100%', justifyContent:'center' }}
                                    onClick={ () => {
                                        const n = card.n
                                        const frame = wp.media({
                                            title: 'Seleziona immagine',
                                            button: { text: 'Seleziona' },
                                            multiple: false,
                                        })
                                        frame.on( 'select', () => {
                                            const att = frame.state().get('selection').first().toJSON()
                                            const update = {}
                                            update[`card${n}MediaUrl`] = att.url
                                            update[`card${n}MediaAlt`] = att.alt || ''
                                            update[`card${n}MediaId`]  = att.id
                                            setAttributes( update )
                                        })
                                        frame.open()
                                    }}>
                                    { card.mediaUrl ? __('Cambia immagine','arkimedia') : __('Seleziona immagine','arkimedia') }
                                </Button>
                                { card.mediaUrl && (
                                    <Button
                                        onClick={ () => setAttributes({ [`card${card.n}MediaUrl`]:'', [`card${card.n}MediaAlt`]:'', [`card${card.n}MediaId`]:0 }) }
                                        variant="tertiary" isDestructive
                                        style={{ width:'100%', justifyContent:'center', marginTop:'4px' }}>
                                        { __('Rimuovi immagine','arkimedia') }
                                    </Button>
                                )}
                            </div>
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
                        { cardData.map( ( card ) => (
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
