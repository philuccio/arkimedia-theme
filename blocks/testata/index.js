import { registerBlockType } from '@wordpress/blocks'
import {
    useBlockProps,
    InspectorControls,
    MediaUpload,
    MediaUploadCheck,
} from '@wordpress/block-editor'
import {
    PanelBody, TextControl, ToggleControl, SelectControl, RangeControl, Button, ColorPicker,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { useState, useEffect, useCallback, useRef } from '@wordpress/element'
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
    { label:'S',  value:'clamp(2rem,4vw,3rem)',   px:48 },
    { label:'M',  value:'clamp(2.5rem,5vw,5rem)', px:80 },
    { label:'L',  value:'clamp(3rem,9vw,8rem)',   px:128 },
    { label:'XL', value:'clamp(4rem,12vw,11rem)', px:176 },
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

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const {
            usePageTitle, customTitle, showTitle, eyebrow,
            height, bgType, mediaId, mediaUrl, mediaAlt,
            bgColor, gradientType, gradientAngle, gradientColor1, gradientColor2,
            overlayColor, bgSize, bgPosition, bgAttachment,
            textColor, titleSize, contentPosition,
            paddingTop, paddingBottom, paddingLeft, paddingRight,
        } = attributes

        const customTitleText = useLocalText( customTitle, v => setAttributes({ customTitle: v }) )
        const eyebrowText     = useLocalText( eyebrow,     v => setAttributes({ eyebrow: v }) )

        // Costruisce lo stile sfondo
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
                if ( mediaUrl ) {
                    bgStyle.backgroundImage      = `url(${ mediaUrl })`
                    bgStyle.backgroundSize       = bgSize
                    bgStyle.backgroundPosition   = bgPosition
                    bgStyle.backgroundRepeat     = 'no-repeat'
                } else {
                    bgStyle.background = bgColor
                }
                break
        }

        const alignMap = { top: 'flex-start', center: 'center', bottom: 'flex-end' }

        // Stessi stili di render.php: l'anteprima deve coincidere con il sito
        const contentStyle = {
            paddingTop:    `calc(var(--header-height,80px) + 2rem + ${ paddingTop }px)`,
            paddingRight:  `calc(var(--container-pad,1.5rem) + ${ paddingRight }px)`,
            paddingBottom: `${ paddingBottom }px`,
            paddingLeft:   `calc(var(--container-pad,1.5rem) + ${ paddingLeft }px)`,
        }

        const blockProps = useBlockProps({
            className: 'ark-testata',
            style: {
                ...bgStyle,
                minHeight:   height,
                color:       textColor,
                width:       '100vw',
                maxWidth:    '100vw',
                marginLeft:  'calc(50% - 50vw)',
                marginRight: 'calc(50% - 50vw)',
                display:     'flex',
                alignItems:  alignMap[ contentPosition ] || 'flex-end',
                position:    'relative',
                overflow:    'hidden',
            }
        })

        return (
            <>
                <InspectorControls>

                    <PanelBody title={ __( 'Titolo', 'arkimedia' ) } initialOpen={true}>
                        <ToggleControl
                            label={ __( 'Mostra titolo', 'arkimedia' ) }
                            checked={showTitle}
                            onChange={ v => setAttributes({ showTitle: v }) }
                        />
                        { showTitle && <>
                            <ToggleControl
                                label={ __( 'Usa titolo pagina automatico', 'arkimedia' ) }
                                checked={usePageTitle}
                                onChange={ v => setAttributes({ usePageTitle: v }) }
                                help={ __( 'Se disattivato puoi inserire un titolo custom', 'arkimedia' ) }
                            />
                            { ! usePageTitle &&
                                <TextControl label={ __( 'Titolo custom', 'arkimedia' ) } { ...customTitleText } />
                            }
                            <TextControl label={ __( 'Eyebrow (opzionale)', 'arkimedia' ) } { ...eyebrowText } />
                            <SizeControl label={ __('Dimensione titolo','arkimedia') } value={titleSize} onChange={ v => setAttributes({ titleSize: v }) } presets={TITLE_SIZES} max={240} />
                        </> }
                    </PanelBody>

                    <PanelBody title={ __( 'Layout', 'arkimedia' ) } initialOpen={false}>
                        <SelectControl
                            label={ __( 'Altezza', 'arkimedia' ) }
                            value={height}
                            options={[
                                { label:'100vh', value:'100vh' },
                                { label:'90vh',  value:'90vh' },
                                { label:'80vh',  value:'80vh' },
                                { label:'70vh',  value:'70vh' },
                                { label:'60vh',  value:'60vh' },
                                { label:'50vh',  value:'50vh' },
                                { label:'600px', value:'600px' },
                                { label:'500px', value:'500px' },
                                { label:'400px', value:'400px' },
                            ]}
                            onChange={ v => setAttributes({ height: v }) }
                        />
                        <SelectControl
                            label={ __( 'Posizione contenuto', 'arkimedia' ) }
                            value={contentPosition}
                            options={[
                                { label:'In alto',  value:'top' },
                                { label:'Al centro', value:'center' },
                                { label:'In basso',  value:'bottom' },
                            ]}
                            onChange={ v => setAttributes({ contentPosition: v }) }
                        />
                    </PanelBody>

                    <PanelBody title={ __( 'Sfondo', 'arkimedia' ) } initialOpen={false}>
                        <ToggleGroupControl
                            label={ __( 'Tipo sfondo', 'arkimedia' ) }
                            value={bgType}
                            onChange={ v => setAttributes({ bgType: v }) }
                            isBlock>
                            <ToggleGroupControlOption value="image"    label="Immagine" />
                            <ToggleGroupControlOption value="color"    label="Colore" />
                            <ToggleGroupControlOption value="gradient" label="Gradiente" />
                        </ToggleGroupControl>

                        { bgType === 'image' && <>
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={ media => setAttributes({ mediaId: media.id, mediaUrl: media.url, mediaAlt: media.alt || '' }) }
                                    allowedTypes={['image']}
                                    value={mediaId}
                                    render={ ({ open }) => <>
                                        { mediaUrl && <img src={mediaUrl} style={{ width:'100%', height:'80px', objectFit:'cover', borderRadius:'4px', marginBottom:'8px' }} /> }
                                        <Button onClick={open} variant={ mediaUrl ? 'secondary' : 'primary' } style={{ width:'100%', justifyContent:'center' }}>
                                            { mediaUrl ? __('Cambia immagine','arkimedia') : __('Seleziona immagine','arkimedia') }
                                        </Button>
                                        { mediaUrl && <Button onClick={ () => setAttributes({ mediaId:0, mediaUrl:'', mediaAlt:'' }) } variant="tertiary" isDestructive style={{ width:'100%', justifyContent:'center', marginTop:'4px' }}>
                                            { __('Rimuovi','arkimedia') }
                                        </Button> }
                                    </> }
                                />
                            </MediaUploadCheck>
                            <SelectControl
                                label={ __('Size','arkimedia') } value={bgSize}
                                options={[ { label:'Cover', value:'cover' }, { label:'Contain', value:'contain' }, { label:'Auto', value:'auto' } ]}
                                onChange={ v => setAttributes({ bgSize: v }) }
                            />
                            <SelectControl
                                label={ __('Position','arkimedia') } value={bgPosition}
                                options={[
                                    { label:'Center', value:'center center' },
                                    { label:'Top',    value:'center top' },
                                    { label:'Bottom', value:'center bottom' },
                                    { label:'Left',   value:'left center' },
                                    { label:'Right',  value:'right center' },
                                ]}
                                onChange={ v => setAttributes({ bgPosition: v }) }
                            />
                            <SelectControl
                                label={ __('Effetto allo scroll','arkimedia') } value={bgAttachment}
                                options={[ { label: __('Nessuno','arkimedia'), value:'scroll' }, { label: __('Parallax','arkimedia'), value:'fixed' } ]}
                                onChange={ v => setAttributes({ bgAttachment: v }) }
                            />
                        </> }

                        { bgType === 'color' && <>
                            <p style={{fontSize:'11px',fontWeight:600,marginBottom:'8px'}}>{ __('Colore','arkimedia') }</p>
                            <ColorPicker color={bgColor} onChange={ v => setAttributes({ bgColor: v }) } enableAlpha />
                        </> }

                        { bgType === 'gradient' && <>
                            <SelectControl
                                label={ __('Tipo','arkimedia') } value={gradientType}
                                options={[ { label:'Lineare', value:'linear' }, { label:'Radiale', value:'radial' } ]}
                                onChange={ v => setAttributes({ gradientType: v }) }
                            />
                            { gradientType === 'linear' &&
                                <LocalRange label={ __('Angolo','arkimedia') } value={gradientAngle} onChange={ v => setAttributes({ gradientAngle: v }) } min={0} max={360} />
                            }
                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>{ __('Colore 1','arkimedia') }</p>
                            <ColorPicker color={gradientColor1} onChange={ v => setAttributes({ gradientColor1: v }) } />
                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>{ __('Colore 2','arkimedia') }</p>
                            <ColorPicker color={gradientColor2} onChange={ v => setAttributes({ gradientColor2: v }) } />
                        </> }

                        <p style={{fontSize:'11px',fontWeight:600,margin:'16px 0 8px'}}>{ __('Overlay','arkimedia') }</p>
                        <ColorPicker color={overlayColor} onChange={ v => setAttributes({ overlayColor: v }) } enableAlpha defaultValue="rgba(0,0,0,0.45)" />
                        { overlayColor && <Button onClick={ () => setAttributes({ overlayColor:'' }) } variant="tertiary" isDestructive>{ __('Rimuovi overlay','arkimedia') }</Button> }

                        <p style={{fontSize:'11px',fontWeight:600,margin:'16px 0 8px'}}>{ __('Colore testo','arkimedia') }</p>
                        <ColorPicker color={textColor} onChange={ v => setAttributes({ textColor: v }) } />
                    </PanelBody>

                    <PanelBody title={ __( 'Padding', 'arkimedia' ) } initialOpen={false}>
                        <LocalRange label="Top"    value={paddingTop}    onChange={ v => setAttributes({ paddingTop: v }) }    min={0} max={300} step={4} />
                        <LocalRange label="Bottom" value={paddingBottom} onChange={ v => setAttributes({ paddingBottom: v }) } min={0} max={300} step={4} />
                        <LocalRange label="Left"   value={paddingLeft}   onChange={ v => setAttributes({ paddingLeft: v }) }   min={0} max={200} step={4} />
                        <LocalRange label="Right"  value={paddingRight}  onChange={ v => setAttributes({ paddingRight: v }) }  min={0} max={200} step={4} />
                    </PanelBody>

                </InspectorControls>

                <div { ...blockProps }>
                    { overlayColor && ( bgType !== 'image' || mediaUrl ) && (
                        <div style={{ position:'absolute', inset:0, background:overlayColor, zIndex:1, pointerEvents:'none' }} />
                    )}
                    <div className="ark-testata__content" style={ contentStyle }>
                        { eyebrow && showTitle && (
                            <p className="ark-testata__eyebrow">
                                {eyebrow}
                            </p>
                        )}
                        { showTitle && ( usePageTitle || customTitle ) && (
                            <h1 className="ark-testata__title" style={{ fontSize:titleSize }}>
                                { usePageTitle ? __( '← Titolo pagina automatico', 'arkimedia' ) : customTitle }
                            </h1>
                        )}
                    </div>
                </div>
            </>
        )
    },

    save: () => null,
})
