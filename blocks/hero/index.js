import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor'
import {
    PanelBody, TextControl, TextareaControl, SelectControl,
    RangeControl, ToggleControl, Button, ColorPicker, TabPanel,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { useState, useEffect, useCallback, useRef } from '@wordpress/element'
import { safeHTML } from '@wordpress/dom'
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

// ── RangeControl con salvataggio onPointerUp ──────────────
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

// ── Misure testo: preset responsive oppure valore libero in px ──
const TITLE_SIZES = [
    { label:'S',  value:'clamp(2rem,4vw,3rem)',     px:48 },
    { label:'M',  value:'clamp(2.5rem,6vw,5rem)',   px:80 },
    { label:'L',  value:'clamp(3rem,9vw,8rem)',     px:128 },
    { label:'XL', value:'clamp(4rem,12vw,11rem)',   px:176 },
]
const SUBTITLE_SIZES = [
    { label:'S',  value:'clamp(0.875rem,1.5vw,1rem)',  px:16 },
    { label:'M',  value:'clamp(1rem,2vw,1.375rem)',    px:22 },
    { label:'L',  value:'clamp(1.125rem,2.5vw,1.75rem)', px:28 },
    { label:'XL', value:'clamp(1.25rem,3vw,2.25rem)',  px:36 },
]

function sizeToPx( value, fallback ) {
    const match = /^([\d.]+)(px|rem)$/.exec( value || '' )
    if ( ! match ) return fallback
    return Math.round( parseFloat( match[1] ) * ( match[2] === 'rem' ? 16 : 1 ) )
}

function SizeControl( { label, value, onChange, presets, max } ) {
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
                    onChange={ v => onChange( `${ v }px` ) } min={10} max={max} />
            ) }
        </>
    )
}

const HEIGHT_PRESETS = [ '100vh', '90vh', '80vh', '70vh', '600px', '500px', 'auto' ]

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const {
            title, title2,
            title1Color, title1Size, title1Weight,
            title2Color, title2Size, title2Weight,
            subtitle, subtitleColor, subtitleSize,
            eyebrow, eyebrowColor,
            ctaLabel, ctaUrl, ctaLabel2, ctaUrl2, ctaBgColor, ctaTextColor,
            mediaUrl, mediaAlt, mediaId,
            overlayColor, textAlign, minHeight,
            bgType, bgColor, gradientType, gradientAngle, gradientColor1, gradientColor2,
            bgAttachment, bgPosition, bgSize,
            contentPosition,
            paddingTop, paddingBottom, paddingLeft, paddingRight,
        } = attributes

        // ── Hook locali TextControl ───────────────────────
        const titleText        = useLocalText( title,       v => setAttributes({ title: v }) )
        const title2Text       = useLocalText( title2,      v => setAttributes({ title2: v }) )
        const eyebrowText      = useLocalText( eyebrow,     v => setAttributes({ eyebrow: v }) )
        const ctaLabelText     = useLocalText( ctaLabel,    v => setAttributes({ ctaLabel: v }) )
        const ctaUrlText       = useLocalText( ctaUrl,      v => setAttributes({ ctaUrl: v }) )
        const ctaLabel2Text    = useLocalText( ctaLabel2,   v => setAttributes({ ctaLabel2: v }) )
        const ctaUrl2Text      = useLocalText( ctaUrl2,     v => setAttributes({ ctaUrl2: v }) )
        const minHeightText    = useLocalText( minHeight,   v => setAttributes({ minHeight: v }) )

        const [ customHeight, setCustomHeight ] = useState( ! HEIGHT_PRESETS.includes( minHeight ) )

        const posMap = {
            'bottom-left':   { alignItems: 'flex-end',   textAlign: 'left' },
            'bottom-center': { alignItems: 'flex-end',   textAlign: 'center' },
            'bottom-right':  { alignItems: 'flex-end',   textAlign: 'right' },
            'center-left':   { alignItems: 'center',     textAlign: 'left' },
            'center-center': { alignItems: 'center',     textAlign: 'center' },
            'center-right':  { alignItems: 'center',     textAlign: 'right' },
            'top-left':      { alignItems: 'flex-start', textAlign: 'left' },
            'top-center':    { alignItems: 'flex-start', textAlign: 'center' },
            'top-right':     { alignItems: 'flex-start', textAlign: 'right' },
        }
        const pos = posMap[ contentPosition ] || posMap['bottom-left']

        let bgStyle = {}
        switch ( bgType ) {
            case 'color':
                bgStyle.background = bgColor
                break
            case 'gradient':
                bgStyle.background = gradientType === 'linear'
                    ? `linear-gradient(${ gradientAngle }deg, ${ gradientColor1 }, ${ gradientColor2 })`
                    : `radial-gradient(circle, ${ gradientColor1 }, ${ gradientColor2 })`
                break
            case 'image':
            default:
                if ( mediaUrl ) {
                    bgStyle.backgroundImage    = `url(${ mediaUrl })`
                    bgStyle.backgroundSize     = bgSize
                    bgStyle.backgroundPosition = bgPosition
                    bgStyle.backgroundRepeat   = 'no-repeat'
                } else {
                    bgStyle.background = bgColor || '#0a0a0a'
                }
                break
        }

        // Stessi stili di render.php: l'anteprima deve coincidere con il sito
        const contentStyle = {
            paddingTop:    `calc(var(--header-height,80px) + 2rem + ${ paddingTop }px)`,
            paddingRight:  `calc(var(--container-pad,1.5rem) + ${ paddingRight }px)`,
            paddingBottom: `${ paddingBottom }px`,
            paddingLeft:   `calc(var(--container-pad,1.5rem) + ${ paddingLeft }px)`,
        }

        const titleStyle = ( n ) => {
            const a = ( key ) => attributes[ `title${ n }${ key }` ]
            return {
                fontSize:      a( 'Size' ),
                fontWeight:    a( 'Weight' ),
                color:         a( 'Color' ),
                lineHeight:    1,
                letterSpacing: '-0.02em',
                display:       'block',
                padding:       `${ a( 'PaddingTop' ) }px ${ a( 'PaddingRight' ) }px ${ a( 'PaddingBottom' ) }px ${ a( 'PaddingLeft' ) }px`,
                margin:        `${ a( 'MarginTop' ) }px ${ a( 'MarginRight' ) }px ${ a( 'MarginBottom' ) }px ${ a( 'MarginLeft' ) }px`,
            }
        }

        const alignClass = pos.textAlign === 'left' ? '' : ` ark-hero--align-${ pos.textAlign }`

        const blockProps = useBlockProps({
            className: `ark-hero${ alignClass }`,
            style: {
                ...bgStyle,
                minHeight,
                display:     'flex',
                alignItems:  pos.alignItems,
                position:    'relative',
                overflow:    'hidden',
                width:       '100vw',
                maxWidth:    '100vw',
                marginLeft:  'calc(50% - 50vw)',
                marginRight: 'calc(50% - 50vw)',
            }
        })

        return (
            <>
                <InspectorControls>
                    <TabPanel
                        tabs={[
                            { name: 'contenuto', title: __( 'Contenuto', 'arkimedia' ) },
                            { name: 'layout',    title: __( 'Layout', 'arkimedia' ) },
                        ]}>
                        { tab => tab.name === 'contenuto' ? (
                            <>
                                <PanelBody title={ __( 'Titolo riga 1', 'arkimedia' ) } initialOpen={true}>
                                    <TextControl label={ __('Testo','arkimedia') } { ...titleText } placeholder={ __('Prima riga del titolo','arkimedia') } />
                                    <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore</p>
                                    <ColorPicker color={title1Color} onChange={ v => setAttributes({ title1Color: v }) } />
                                    <SizeControl label={ __('Dimensione','arkimedia') } value={title1Size} onChange={ v => setAttributes({ title1Size: v }) } presets={TITLE_SIZES} max={240} />
                                    <SelectControl label={ __('Font weight','arkimedia') } value={title1Weight}
                                        options={[
                                            { label:'Light 300', value:'300' }, { label:'Regular 400', value:'400' },
                                            { label:'Medium 500', value:'500' }, { label:'SemiBold 600', value:'600' },
                                            { label:'Bold 700', value:'700' }, { label:'ExtraBold 800', value:'800' },
                                            { label:'Black 900', value:'900' },
                                        ]}
                                        onChange={ v => setAttributes({ title1Weight: v }) }
                                    />
                                </PanelBody>

                                <PanelBody title={ __( 'Titolo riga 2', 'arkimedia' ) } initialOpen={false}>
                                    <TextControl label={ __('Testo','arkimedia') } { ...title2Text } placeholder={ __('Seconda riga (opzionale)','arkimedia') } />
                                    <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore</p>
                                    <ColorPicker color={title2Color} onChange={ v => setAttributes({ title2Color: v }) } />
                                    <SizeControl label={ __('Dimensione','arkimedia') } value={title2Size} onChange={ v => setAttributes({ title2Size: v }) } presets={TITLE_SIZES} max={240} />
                                    <SelectControl label={ __('Font weight','arkimedia') } value={title2Weight}
                                        options={[
                                            { label:'Light 300', value:'300' }, { label:'Regular 400', value:'400' },
                                            { label:'Medium 500', value:'500' }, { label:'SemiBold 600', value:'600' },
                                            { label:'Bold 700', value:'700' }, { label:'ExtraBold 800', value:'800' },
                                            { label:'Black 900', value:'900' },
                                        ]}
                                        onChange={ v => setAttributes({ title2Weight: v }) }
                                    />
                                </PanelBody>

                                <PanelBody title={ __( 'Sottotitolo', 'arkimedia' ) } initialOpen={false}>
                                    <TextareaControl label={ __('Testo','arkimedia') } value={subtitle} onChange={ v => setAttributes({ subtitle: v }) } />
                                    <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore</p>
                                    <ColorPicker color={subtitleColor} onChange={ v => setAttributes({ subtitleColor: v }) } enableAlpha />
                                    <SizeControl label={ __('Dimensione','arkimedia') } value={subtitleSize} onChange={ v => setAttributes({ subtitleSize: v }) } presets={SUBTITLE_SIZES} max={72} />
                                </PanelBody>

                                <PanelBody title={ __( 'Eyebrow', 'arkimedia' ) } initialOpen={false}>
                                    <TextControl label={ __('Testo','arkimedia') } { ...eyebrowText } />
                                    <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore</p>
                                    <ColorPicker color={eyebrowColor} onChange={ v => setAttributes({ eyebrowColor: v }) } />
                                </PanelBody>

                                <PanelBody title={ __( 'Pulsanti CTA', 'arkimedia' ) } initialOpen={false}>
                                    <p style={{fontSize:'11px',fontWeight:600,marginBottom:'8px'}}>CTA Primario</p>
                                    <TextControl label={ __('Testo','arkimedia') } { ...ctaLabelText } />
                                    <TextControl label={ __('URL','arkimedia') }   { ...ctaUrlText }   type="url" />
                                    <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore sfondo CTA</p>
                                    <ColorPicker color={ctaBgColor} onChange={ v => setAttributes({ ctaBgColor: v }) } />
                                    <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore testo CTA</p>
                                    <ColorPicker color={ctaTextColor} onChange={ v => setAttributes({ ctaTextColor: v }) } />
                                    <p style={{fontSize:'11px',fontWeight:600,margin:'16px 0 8px',borderTop:'1px solid #e0e0e0',paddingTop:'12px'}}>CTA Secondario</p>
                                    <TextControl label={ __('Testo','arkimedia') } { ...ctaLabel2Text } />
                                    <TextControl label={ __('URL','arkimedia') }   { ...ctaUrl2Text }   type="url" help={ __('Senza URL il pulsante non viene mostrato','arkimedia') } />
                                </PanelBody>

                                <PanelBody title={ __( 'Sfondo', 'arkimedia' ) } initialOpen={false}>
                                    <ToggleGroupControl label={ __('Tipo sfondo','arkimedia') } value={bgType} onChange={ v => setAttributes({ bgType: v }) } isBlock>
                                        <ToggleGroupControlOption value="image"    label="Immagine" />
                                        <ToggleGroupControlOption value="color"    label="Colore" />
                                        <ToggleGroupControlOption value="gradient" label="Gradiente" />
                                    </ToggleGroupControl>

                                    { bgType === 'image' && <>
                                        <MediaUploadCheck>
                                            <MediaUpload
                                                onSelect={ m => setAttributes({ mediaUrl: m.url, mediaAlt: m.alt || '', mediaId: m.id }) }
                                                allowedTypes={['image']}
                                                value={mediaId}
                                                render={ ({ open }) => <>
                                                    { mediaUrl && <img src={mediaUrl} style={{ width:'100%', height:'80px', objectFit:'cover', borderRadius:'4px', marginBottom:'8px' }} /> }
                                                    <Button onClick={open} variant={ mediaUrl ? 'secondary' : 'primary' } style={{ width:'100%', justifyContent:'center' }}>
                                                        { mediaUrl ? __('Cambia immagine','arkimedia') : __('Seleziona immagine','arkimedia') }
                                                    </Button>
                                                    { mediaUrl && <Button onClick={ () => setAttributes({ mediaUrl:'', mediaAlt:'', mediaId:0 }) } variant="tertiary" isDestructive style={{ width:'100%', justifyContent:'center', marginTop:'4px' }}>
                                                        { __('Rimuovi','arkimedia') }
                                                    </Button> }
                                                </> }
                                            />
                                        </MediaUploadCheck>
                                        <SelectControl label="Size" value={bgSize}
                                            options={[ { label:'Cover', value:'cover' }, { label:'Contain', value:'contain' }, { label:'Auto', value:'auto' } ]}
                                            onChange={ v => setAttributes({ bgSize: v }) }
                                        />
                                        <SelectControl label="Position" value={bgPosition}
                                            options={[
                                                { label:'Center', value:'center center' }, { label:'Top', value:'center top' },
                                                { label:'Bottom', value:'center bottom' }, { label:'Left', value:'left center' },
                                                { label:'Right', value:'right center' },
                                            ]}
                                            onChange={ v => setAttributes({ bgPosition: v }) }
                                        />
                                        <SelectControl label={ __('Effetto allo scroll','arkimedia') } value={bgAttachment}
                                            options={[ { label: __('Parallax','arkimedia'), value:'fixed' }, { label: __('Nessuno','arkimedia'), value:'scroll' } ]}
                                            onChange={ v => setAttributes({ bgAttachment: v }) }
                                        />
                                    </> }

                                    { bgType === 'color' && <>
                                        <p style={{fontSize:'11px',fontWeight:600,marginBottom:'8px'}}>Colore sfondo</p>
                                        <ColorPicker color={bgColor} onChange={ v => setAttributes({ bgColor: v }) } enableAlpha />
                                    </> }

                                    { bgType === 'gradient' && <>
                                        <SelectControl label="Tipo" value={gradientType}
                                            options={[ { label:'Lineare', value:'linear' }, { label:'Radiale', value:'radial' } ]}
                                            onChange={ v => setAttributes({ gradientType: v }) }
                                        />
                                        { gradientType === 'linear' && <LocalRange label="Angolo (°)" value={gradientAngle} onChange={ v => setAttributes({ gradientAngle: v }) } min={0} max={360} step={1} /> }
                                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore 1</p>
                                        <ColorPicker color={gradientColor1} onChange={ v => setAttributes({ gradientColor1: v }) } />
                                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore 2</p>
                                        <ColorPicker color={gradientColor2} onChange={ v => setAttributes({ gradientColor2: v }) } />
                                    </> }

                                    <p style={{fontSize:'11px',fontWeight:600,margin:'16px 0 8px'}}>Overlay</p>
                                    <ColorPicker color={overlayColor} onChange={ v => setAttributes({ overlayColor: v }) } enableAlpha />
                                </PanelBody>
                            </>
                        ) : (
                            <>
                                <PanelBody title={ __( 'Layout', 'arkimedia' ) } initialOpen={true}>
                                    <SelectControl label={ __('Altezza','arkimedia') } value={ customHeight ? 'custom' : minHeight }
                                        options={[
                                            { label:'100vh', value:'100vh' }, { label:'90vh', value:'90vh' },
                                            { label:'80vh', value:'80vh' }, { label:'70vh', value:'70vh' },
                                            { label:'600px', value:'600px' }, { label:'500px', value:'500px' },
                                            { label: __('Adatta al contenuto','arkimedia'), value:'auto' },
                                            { label: __('Personalizzata','arkimedia'), value:'custom' },
                                        ]}
                                        onChange={ v => {
                                            setCustomHeight( v === 'custom' )
                                            if ( v !== 'custom' ) setAttributes({ minHeight: v })
                                        }}
                                    />
                                    { customHeight && (
                                        <TextControl
                                            label={ __('Altezza personalizzata (CSS)','arkimedia') }
                                            { ...minHeightText }
                                            help={ __('Es. 75vh, 60svh, 40rem, clamp(400px,70vh,900px), calc(100vh - 100px). Percentuali non supportate.','arkimedia') }
                                        />
                                    ) }
                                    <SelectControl label={ __('Posizione contenuto','arkimedia') } value={contentPosition}
                                        options={[
                                            { label:'↙ In basso a sinistra', value:'bottom-left' }, { label:'↓ In basso al centro', value:'bottom-center' },
                                            { label:'↘ In basso a destra', value:'bottom-right' }, { label:'← Al centro a sinistra', value:'center-left' },
                                            { label:'· Al centro', value:'center-center' }, { label:'→ Al centro a destra', value:'center-right' },
                                            { label:'↖ In alto a sinistra', value:'top-left' }, { label:'↑ In alto al centro', value:'top-center' },
                                            { label:'↗ In alto a destra', value:'top-right' },
                                        ]}
                                        onChange={ v => setAttributes({ contentPosition: v }) }
                                    />
                                </PanelBody>

                                <PanelBody title={ __( 'Padding contenuto', 'arkimedia' ) } initialOpen={false}>
                                    <LocalRange label="Top"    value={paddingTop}    onChange={ v => setAttributes({ paddingTop: v }) }    max={300} />
                                    <LocalRange label="Bottom" value={paddingBottom} onChange={ v => setAttributes({ paddingBottom: v }) } max={300} />
                                    <LocalRange label="Left"   value={paddingLeft}   onChange={ v => setAttributes({ paddingLeft: v }) } />
                                    <LocalRange label="Right"  value={paddingRight}  onChange={ v => setAttributes({ paddingRight: v }) } />
                                </PanelBody>

                                <PanelBody title={ __( 'Spaziatura titolo riga 1', 'arkimedia' ) } initialOpen={false}>
                                    <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 4px'}}>Padding (px)</p>
                                    <LocalRange label="Top"    value={attributes.title1PaddingTop}    onChange={ v => setAttributes({ title1PaddingTop: v }) }    min={0}    max={200} />
                                    <LocalRange label="Bottom" value={attributes.title1PaddingBottom} onChange={ v => setAttributes({ title1PaddingBottom: v }) } min={0}    max={200} />
                                    <LocalRange label="Left"   value={attributes.title1PaddingLeft}   onChange={ v => setAttributes({ title1PaddingLeft: v }) }   min={0}    max={200} />
                                    <LocalRange label="Right"  value={attributes.title1PaddingRight}  onChange={ v => setAttributes({ title1PaddingRight: v }) }  min={0}    max={200} />
                                    <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 4px'}}>Margin (px)</p>
                                    <LocalRange label="Top"    value={attributes.title1MarginTop}    onChange={ v => setAttributes({ title1MarginTop: v }) }    min={-100} max={200} />
                                    <LocalRange label="Bottom" value={attributes.title1MarginBottom} onChange={ v => setAttributes({ title1MarginBottom: v }) } min={-100} max={200} />
                                    <LocalRange label="Left"   value={attributes.title1MarginLeft}   onChange={ v => setAttributes({ title1MarginLeft: v }) }   min={-100} max={200} />
                                    <LocalRange label="Right"  value={attributes.title1MarginRight}  onChange={ v => setAttributes({ title1MarginRight: v }) }  min={-100} max={200} />
                                </PanelBody>

                                <PanelBody title={ __( 'Spaziatura titolo riga 2', 'arkimedia' ) } initialOpen={false}>
                                    <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 4px'}}>Padding (px)</p>
                                    <LocalRange label="Top"    value={attributes.title2PaddingTop}    onChange={ v => setAttributes({ title2PaddingTop: v }) }    min={0}    max={200} />
                                    <LocalRange label="Bottom" value={attributes.title2PaddingBottom} onChange={ v => setAttributes({ title2PaddingBottom: v }) } min={0}    max={200} />
                                    <LocalRange label="Left"   value={attributes.title2PaddingLeft}   onChange={ v => setAttributes({ title2PaddingLeft: v }) }   min={0}    max={200} />
                                    <LocalRange label="Right"  value={attributes.title2PaddingRight}  onChange={ v => setAttributes({ title2PaddingRight: v }) }  min={0}    max={200} />
                                    <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 4px'}}>Margin (px)</p>
                                    <LocalRange label="Top"    value={attributes.title2MarginTop}    onChange={ v => setAttributes({ title2MarginTop: v }) }    min={-100} max={200} />
                                    <LocalRange label="Bottom" value={attributes.title2MarginBottom} onChange={ v => setAttributes({ title2MarginBottom: v }) } min={-100} max={200} />
                                    <LocalRange label="Left"   value={attributes.title2MarginLeft}   onChange={ v => setAttributes({ title2MarginLeft: v }) }   min={-100} max={200} />
                                    <LocalRange label="Right"  value={attributes.title2MarginRight}  onChange={ v => setAttributes({ title2MarginRight: v }) }  min={-100} max={200} />
                                </PanelBody>
                            </>
                        ) }
                    </TabPanel>
                </InspectorControls>

                <div { ...blockProps }>
                    { overlayColor && (
                        <div style={{ position:'absolute', inset:0, background:overlayColor, zIndex:1, pointerEvents:'none' }} />
                    )}
                    <div className="ark-hero__content" style={ contentStyle }>
                        { eyebrow && (
                            <p className="ark-hero__eyebrow" style={ eyebrowColor ? { color: eyebrowColor } : undefined }>
                                {eyebrow}
                            </p>
                        )}
                        { ( title || title2 ) && (
                            <h1 className="ark-hero__heading">
                                { title && <span className="ark-hero__title ark-hero__title--1" style={ titleStyle( 1 ) } dangerouslySetInnerHTML={{ __html: safeHTML( title ) }} /> }
                                { title2 && <span className="ark-hero__title ark-hero__title--2" style={ titleStyle( 2 ) } dangerouslySetInnerHTML={{ __html: safeHTML( title2 ) }} /> }
                            </h1>
                        )}
                        { subtitle && (
                            <p className="ark-hero__subtitle" style={{ fontSize:subtitleSize, color:subtitleColor }}>
                                {subtitle}
                            </p>
                        )}
                        { ( ctaLabel || ctaLabel2 ) && (
                            <div className="ark-hero__ctas">
                                { ctaLabel && (
                                    <span className="ark-hero__cta" style={{ ...( ctaBgColor ? { background: ctaBgColor } : {} ), color: ctaTextColor }}>
                                        {ctaLabel}
                                    </span>
                                )}
                                { ctaLabel2 && ctaUrl2 && (
                                    <span className="ark-hero__cta ark-hero__cta--secondary">
                                        {ctaLabel2}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </>
        )
    },

    save: () => null,
})
