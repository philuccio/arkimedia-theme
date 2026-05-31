import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor'
import { PanelBody, TextControl, TextareaControl, Button, ColorPicker, RangeControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import metadata from './block.json'

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const {
            eyebrow, title, marqueeText, marqueeFontSize,
            bgColor, textColor, accentColor,
            card1Title, card1Text, card1MediaUrl, card1MediaAlt, card1MediaId,
            card2Title, card2Text, card2MediaUrl, card2MediaAlt, card2MediaId,
            card3Title, card3Text, card3MediaUrl, card3MediaAlt, card3MediaId,
            card4Title, card4Text, card4MediaUrl, card4MediaAlt, card4MediaId,
        } = attributes

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

        const cards = [
            { n: 1, title: card1Title, text: card1Text, mediaUrl: card1MediaUrl, mediaAlt: card1MediaAlt, mediaId: card1MediaId },
            { n: 2, title: card2Title, text: card2Text, mediaUrl: card2MediaUrl, mediaAlt: card2MediaAlt, mediaId: card2MediaId },
            { n: 3, title: card3Title, text: card3Text, mediaUrl: card3MediaUrl, mediaAlt: card3MediaAlt, mediaId: card3MediaId },
            { n: 4, title: card4Title, text: card4Text, mediaUrl: card4MediaUrl, mediaAlt: card4MediaAlt, mediaId: card4MediaId },
        ]

        const CardPanel = ( { n, title, text, mediaUrl, mediaAlt, mediaId } ) => (
            <PanelBody title={ `Card ${ n } — ${ title || '—' }` } initialOpen={ n === 1 }>
                <MediaUploadCheck>
                    <MediaUpload
                        onSelect={ m => setAttributes({
                            [`card${ n }MediaUrl`]: m.url,
                            [`card${ n }MediaAlt`]: m.alt || '',
                            [`card${ n }MediaId`]:  m.id,
                        })}
                        allowedTypes={['image']}
                        value={ mediaId }
                        render={ ({ open }) => (
                            <div>
                                { mediaUrl && (
                                    <img src={ mediaUrl }
                                        style={{ width:'100%', height:'80px', objectFit:'cover', borderRadius:'4px', marginBottom:'8px' }}
                                    />
                                )}
                                <Button onClick={ open }
                                    variant={ mediaUrl ? 'secondary' : 'primary' }
                                    style={{ width:'100%', justifyContent:'center' }}>
                                    { mediaUrl ? __('Cambia immagine','arkimedia') : __('Seleziona immagine','arkimedia') }
                                </Button>
                                { mediaUrl && (
                                    <Button
                                        onClick={ () => setAttributes({
                                            [`card${ n }MediaUrl`]: '',
                                            [`card${ n }MediaAlt`]: '',
                                            [`card${ n }MediaId`]:  0,
                                        })}
                                        variant="tertiary"
                                        isDestructive
                                        style={{ width:'100%', justifyContent:'center', marginTop:'4px' }}>
                                        { __('Rimuovi','arkimedia') }
                                    </Button>
                                )}
                            </div>
                        )}
                    />
                </MediaUploadCheck>
                <TextControl
                    label={ __('Titolo','arkimedia') }
                    value={ title }
                    onChange={ v => setAttributes({ [`card${ n }Title`]: v }) }
                />
                <TextareaControl
                    label={ __('Testo','arkimedia') }
                    value={ text }
                    onChange={ v => setAttributes({ [`card${ n }Text`]: v }) }
                    rows={3}
                />
            </PanelBody>
        )

        return (
            <>
                <InspectorControls>
                    <PanelBody title={ __('Testi sezione','arkimedia') } initialOpen={true}>
                        <TextControl label={ __('Eyebrow','arkimedia') } value={eyebrow} onChange={ v => setAttributes({ eyebrow: v }) } />
                        <TextControl label={ __('Titolo','arkimedia') }   value={title}   onChange={ v => setAttributes({ title: v }) } />
                        <TextControl label={ __('Testo marquee','arkimedia') } value={marqueeText} onChange={ v => setAttributes({ marqueeText: v }) } />
                        <RangeControl label={ __('Font size marquee','arkimedia') } value={marqueeFontSize} onChange={ v => setAttributes({ marqueeFontSize: v }) } min={8} max={32} />
                    </PanelBody>

                    { cards.map( c => (
                        <CardPanel key={ c.n } { ...c } />
                    ))}

                    <PanelBody title={ __('Colori','arkimedia') } initialOpen={false}>
                        <p style={{fontSize:'11px',fontWeight:600,marginBottom:'8px'}}>Sfondo</p>
                        <ColorPicker color={bgColor} onChange={ v => setAttributes({ bgColor: v }) } enableAlpha />
                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Testo</p>
                        <ColorPicker color={textColor} onChange={ v => setAttributes({ textColor: v }) } />
                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Accent</p>
                        <ColorPicker color={accentColor} onChange={ v => setAttributes({ accentColor: v }) } />
                    </PanelBody>
                </InspectorControls>

                <div { ...blockProps }>
                    <div style={{ maxWidth:'var(--container-width,1200px)', margin:'0 auto', padding:'0 0 2rem' }}>
                        { eyebrow && <p style={{ color:accentColor, fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', margin:'0 0 1rem' }}>{eyebrow}</p> }
                        { title && <h2 style={{ fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:700, margin:'0 0 2rem' }}>{title}</h2> }
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', maxWidth:'var(--container-width,1200px)', margin:'0 auto' }}>
                        { cards.map( c => (
                            <div key={ c.n } style={{ background:'rgba(255,255,255,0.05)', borderRadius:'8px', overflow:'hidden' }}>
                                { c.mediaUrl ? (
                                    <img src={ c.mediaUrl } alt={ c.mediaAlt } style={{ width:'100%', height:'200px', objectFit:'cover', display:'block' }} />
                                ) : (
                                    <div style={{ height:'200px', background:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                        <span style={{ opacity:0.3 }}>{ __('Immagine','arkimedia') }</span>
                                    </div>
                                )}
                                <div style={{ padding:'1rem' }}>
                                    <h3 style={{ margin:'0 0 0.5rem', fontSize:'1rem', fontWeight:700 }}>{ c.title }</h3>
                                    { c.text && <p style={{ margin:0, fontSize:'0.875rem', opacity:0.7 }}>{ c.text }</p> }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )
    },

    save: () => null,
})
