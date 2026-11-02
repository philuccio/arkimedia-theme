import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls } from '@wordpress/block-editor'
import {
    PanelBody, TextControl, TextareaControl, Button, ColorPicker, RangeControl, TabPanel,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { useState, useEffect, useCallback, useRef } from '@wordpress/element'
import { MarqueePreview, SeparatorControl, FontControl, ItemsControl, SEPARATOR_SIZES } from '../marquee/preview'
import metadata from './block.json'

// ── Hook locale per TextControl ───────────────────────────
function useLocalText( value, onChange, onLive ) {
    const [ local, setLocal ] = useState( value ?? '' )
    useEffect( () => { setLocal( value ?? '' ) }, [ value ] )
    return {
        value:    local,
        onChange: v => { setLocal( v ); onLive?.( v ) },
        onBlur:   useCallback( () => onChange( local ), [ local, onChange ] ),
    }
}

// ── RangeControl con salvataggio onPointerUp ──────────────
function LocalRange( { label, value, onChange, onLive, min = 0, max = 200, step = 1 } ) {
    const [ local, setLocal ] = useState( value ?? 0 )
    const committed = useRef( value ?? 0 )
    useEffect( () => { setLocal( value ?? 0 ); committed.current = value ?? 0 }, [ value ] )
    const commit = useCallback( () => {
        if ( committed.current !== local ) { committed.current = local; onChange( local ) }
    }, [ local, onChange ] )
    return (
        <div onPointerUp={ commit } onKeyUp={ commit }>
            <RangeControl label={label} value={local} onChange={ v => { setLocal( v ); onLive?.( v ) } } min={min} max={max} step={step} />
        </div>
    )
}

// ── Misure testo: preset responsive oppure valore libero in px ──
const TITLE_SIZES = [
    { label:'S',  value:'clamp(2rem,5vw,4rem)',       px:64 },
    { label:'M',  value:'clamp(2.5rem,6.5vw,5.5rem)', px:88 },
    { label:'L',  value:'clamp(3rem,8vw,7rem)',       px:112 },
    { label:'XL', value:'clamp(3.5rem,10vw,9rem)',    px:144 },
]
const CARD_TITLE_SIZES = [
    { label:'S',  value:'1rem',    px:16 },
    { label:'M',  value:'1.25rem', px:20 },
    { label:'L',  value:'1.5rem',  px:24 },
    { label:'XL', value:'2rem',    px:32 },
]
const CARD_TEXT_SIZES = [
    { label:'S',  value:'0.875rem',  px:14 },
    { label:'M',  value:'0.9375rem', px:15 },
    { label:'L',  value:'1.0625rem', px:17 },
    { label:'XL', value:'1.25rem',   px:20 },
]

function sizeToPx( value, fallback ) {
    const match = /^([\d.]+)(px|rem)$/.exec( value || '' )
    if ( ! match ) return fallback
    return Math.round( parseFloat( match[1] ) * ( match[2] === 'rem' ? 16 : 1 ) )
}

function SizeControl( { label, value, onChange, onLive, presets, max } ) {
    const preset = presets.find( p => p.value === value )
    const [ custom, setCustom ] = useState( ! preset )
    const fallback = ( preset || presets[1] ).px

    return (
        <>
            <ToggleGroupControl label={label} value={ custom ? 'custom' : value } isBlock
                onChange={ v => {
                    setCustom( v === 'custom' )
                    onChange( v === 'custom' ? `${ sizeToPx( value, fallback ) }px` : v )
                }}>
                { presets.map( p => <ToggleGroupControlOption key={p.label} value={p.value} label={p.label} /> ) }
                <ToggleGroupControlOption value="custom" label="px" />
            </ToggleGroupControl>
            { custom && (
                <LocalRange label={ __('Dimensione (px)','arkimedia') } value={ sizeToPx( value, fallback ) }
                    onChange={ v => onChange( `${ v }px` ) } onLive={ v => onLive?.( `${ v }px` ) } min={10} max={max} />
            ) }
        </>
    )
}

// ── Pannello di una card ──────────────────────────────────
function CardPanel( { card, index, canRemove, onChange, onLive, onRemove, onPickImage } ) {
    const titleText = useLocalText( card.title, v => onChange({ title: v }), v => onLive({ title: v }) )
    const bodyText  = useLocalText( card.text,  v => onChange({ text: v }),  v => onLive({ text: v }) )

    return (
        <PanelBody title={ `Card ${ index + 1 }: ${ card.title || '—' }` } initialOpen={false}>
            <TextControl label={ __( 'Titolo card', 'arkimedia' ) } { ...titleText } />
            <TextareaControl label={ __( 'Testo card', 'arkimedia' ) } { ...bodyText } />
            { card.mediaUrl && (
                <img src={card.mediaUrl}
                    style={{ width:'100%', height:'80px', objectFit:'cover', borderRadius:'4px', marginBottom:'8px' }}
                />
            )}
            <Button
                variant={ card.mediaUrl ? 'secondary' : 'primary' }
                style={{ width:'100%', justifyContent:'center' }}
                onClick={ onPickImage }>
                { card.mediaUrl ? __('Cambia immagine','arkimedia') : __('Seleziona immagine','arkimedia') }
            </Button>
            { card.mediaUrl && (
                <Button
                    onClick={ () => onChange({ mediaId: 0, mediaUrl: '', mediaAlt: '' }) }
                    variant="tertiary" isDestructive
                    style={{ width:'100%', justifyContent:'center', marginTop:'4px' }}>
                    { __('Rimuovi immagine','arkimedia') }
                </Button>
            )}
            { canRemove && (
                <Button onClick={ onRemove } variant="tertiary" isDestructive
                    style={{ width:'100%', justifyContent:'center', marginTop:'12px' }}>
                    { __('Elimina card','arkimedia') }
                </Button>
            )}
        </PanelBody>
    )
}

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const {
            eyebrow, title, titleSize, marqueeText, marqueeFontSize, marqueeSpeed, marqueeSeparator, marqueeSeparatorSize, marqueeFontFamily,
            cards, cardTitleSize, cardTextSize, bgColor, textColor, accentColor,
        } = attributes

        // Anteprima dal vivo: i valori in modifica si vedono subito e si salvano al rilascio
        const [ live, setLive ] = useState( {} )
        useEffect( () => { setLive( {} ) }, [ attributes ] )
        const preview = { ...attributes, ...live }
        const onLive  = key => v => setLive( l => ( { ...l, [ key ]: v } ) )

        const eyebrowText = useLocalText( eyebrow, v => setAttributes({ eyebrow: v }), onLive( 'eyebrow' ) )
        const titleText   = useLocalText( title,   v => setAttributes({ title: v }),   onLive( 'title' ) )

        const blockProps = useBlockProps({
            className: 'ark-services',
            style: {
                background:  bgColor,
                color:       textColor,
                width:       '100vw',
                maxWidth:    '100vw',
                marginLeft:  'calc(50% - 50vw)',
                marginRight: 'calc(50% - 50vw)',
            }
        })

        const updateCard = ( cardIndex, data ) => {
            const updated = cards.map( ( c, i ) => i === cardIndex ? { ...c, ...data } : c )
            setAttributes({ cards: [ ...updated ] })
        }

        const openMediaFrame = ( cardIndex ) => {
            const frame = wp.media({
                title:    'Seleziona immagine',
                button:   { text: 'Seleziona' },
                multiple: false,
            })
            frame.on( 'select', function() {
                const att = frame.state().get('selection').first().toJSON()
                updateCard( cardIndex, { mediaId: att.id, mediaUrl: att.url, mediaAlt: att.alt || '' } )
            })
            frame.open()
        }

        const addCard = () => {
            setAttributes({ cards: [ ...cards, { title: __( 'Nuova card', 'arkimedia' ), text: '', mediaId: 0, mediaUrl: '', mediaAlt: '' } ] })
        }

        const removeCard = ( cardIndex ) => {
            setAttributes({ cards: cards.filter( ( _, i ) => i !== cardIndex ) })
        }

        const contentTab = (
            <>
                <PanelBody title={ __( 'Testi', 'arkimedia' ) } initialOpen={true}>
                    <TextControl label={ __( 'Eyebrow', 'arkimedia' ) } { ...eyebrowText } />
                    <TextControl label={ __( 'Titolo', 'arkimedia' ) } { ...titleText } />
                </PanelBody>

                <PanelBody title={ __( 'Voci marquee', 'arkimedia' ) } initialOpen={false}>
                    <ItemsControl value={marqueeText} onChange={ v => setAttributes({ marqueeText: v }) } onLive={ onLive( 'marqueeText' ) } />
                </PanelBody>

                { cards.map( ( card, idx ) => (
                    <CardPanel key={idx} card={card} index={idx}
                        canRemove={ cards.length > 1 }
                        onChange={ data => updateCard( idx, data ) }
                        onLive={ data => setLive( l => ( { ...l, cards: ( l.cards || cards ).map( ( c, i ) => i === idx ? { ...c, ...data } : c ) } ) ) }
                        onRemove={ () => removeCard( idx ) }
                        onPickImage={ () => openMediaFrame( idx ) }
                    />
                ))}

                <div style={{ padding:'16px' }}>
                    <Button variant="secondary" onClick={addCard} style={{ width:'100%', justifyContent:'center' }}>
                        { __('Aggiungi card','arkimedia') }
                    </Button>
                </div>
            </>
        )

        const layoutTab = (
            <>
                <PanelBody title={ __( 'Dimensioni testo', 'arkimedia' ) } initialOpen={true}>
                    <SizeControl label={ __('Titolo','arkimedia') } value={titleSize} onChange={ v => setAttributes({ titleSize: v }) } onLive={ onLive( 'titleSize' ) } presets={TITLE_SIZES} max={240} />
                    <SizeControl label={ __('Titolo card','arkimedia') } value={cardTitleSize} onChange={ v => setAttributes({ cardTitleSize: v }) } onLive={ onLive( 'cardTitleSize' ) } presets={CARD_TITLE_SIZES} max={80} />
                    <SizeControl label={ __('Testo card','arkimedia') } value={cardTextSize} onChange={ v => setAttributes({ cardTextSize: v }) } onLive={ onLive( 'cardTextSize' ) } presets={CARD_TEXT_SIZES} max={40} />
                </PanelBody>

                <PanelBody title={ __( 'Marquee', 'arkimedia' ) } initialOpen={false}>
                    <FontControl value={marqueeFontFamily} onChange={ v => setAttributes({ marqueeFontFamily: v }) } />
                    <SeparatorControl value={marqueeSeparator} onChange={ v => setAttributes({ marqueeSeparator: v }) } onLive={ onLive( 'marqueeSeparator' ) } />
                    { marqueeSeparator !== '' &&
                        <SizeControl label={ __('Dimensione separatore','arkimedia') } value={marqueeSeparatorSize} onChange={ v => setAttributes({ marqueeSeparatorSize: v }) } onLive={ onLive( 'marqueeSeparatorSize' ) } presets={SEPARATOR_SIZES} max={200} />
                    }
                    <LocalRange label={ __( 'Dimensione font (px)', 'arkimedia' ) } value={marqueeFontSize} onChange={ v => setAttributes({ marqueeFontSize: v }) } onLive={ onLive( 'marqueeFontSize' ) } min={10} max={80} />
                    <LocalRange label={ __( 'Velocità (px al secondo)', 'arkimedia' ) } value={marqueeSpeed} onChange={ v => setAttributes({ marqueeSpeed: v }) } onLive={ onLive( 'marqueeSpeed' ) } min={10} max={300} step={10} />
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
                    { accentColor && <Button onClick={ () => setAttributes({ accentColor:'' }) } variant="tertiary">{ __('Usa accent del tema','arkimedia') }</Button> }
                </PanelBody>
            </>
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
                    <div className="ark-services__header">
                        { preview.eyebrow && <p className="ark-services__eyebrow" style={ accentColor ? { color: accentColor } : undefined }>{preview.eyebrow}</p> }
                        { preview.title && <h2 className="ark-services__title" style={{ fontSize: preview.titleSize }}>{preview.title}</h2> }
                    </div>

                    { preview.marqueeText && (
                        <div className="ark-services__marquee-wrap">
                            <MarqueePreview text={preview.marqueeText} fontSize={ `${ preview.marqueeFontSize }px` } speed={preview.marqueeSpeed} separator={preview.marqueeSeparator} separatorSize={preview.marqueeSeparatorSize} font={marqueeFontFamily} />
                        </div>
                    )}

                    <div className="ark-services__grid">
                        { preview.cards.map( ( card, idx ) => (
                            <article key={idx} className="ark-services__card">
                                <div className="ark-services__card-inner">
                                    { card.mediaUrl
                                        ? <figure className="ark-services__card-thumb"><img src={card.mediaUrl} alt={card.mediaAlt} /></figure>
                                        : <div className="ark-services__card-thumb ark-services__card-thumb--empty" />
                                    }
                                    <div className="ark-services__card-body">
                                        { card.title && <h3 className="ark-services__card-title" style={{ fontSize: preview.cardTitleSize }}>{card.title}</h3> }
                                        { card.text && <p className="ark-services__card-text" style={{ fontSize: preview.cardTextSize }}>{card.text}</p> }
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </>
        )
    },

    save: () => null,
})
