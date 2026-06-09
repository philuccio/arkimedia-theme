import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck, RichText } from '@wordpress/block-editor'
import {
    PanelBody, TextControl, TextareaControl, SelectControl,
    RangeControl, Button, ColorPicker, TabPanel, ToggleControl,
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

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const {
            layout, imageUrl, imageAlt, imageId, objectFit, objectPosition, imagePosition,
            aspectRatio, imageFlex,
            eyebrow, eyebrowColor, eyebrowBg,
            title, titleTag, titleColor, titleSize, titleWeight, titleLineHeight,
            description, descColor, descSize,
            ctaLabel, ctaUrl, ctaStyle, ctaBgColor, ctaTextColor,
            linkUrl, linkTarget,
            bgColor, bgType, gradientColor1, gradientColor2, gradientAngle,
            overlayColor, contentPosition,
            borderRadius, borderWidth, borderColor,
            hoverEffect,
            paddingTop, paddingBottom, paddingLeft, paddingRight,
            marginTop, marginBottom, marginLeft, marginRight,
            animationType, animationDelay, cardHeight, useAspectRatio,
        } = attributes

        // ── Hook locali TextControl ───────────────────────
        const imageFlexText     = useLocalText( imageFlex,       v => setAttributes({ imageFlex: v }) )
        const linkUrlText       = useLocalText( linkUrl,         v => setAttributes({ linkUrl: v }) )
        const eyebrowText       = useLocalText( eyebrow,         v => setAttributes({ eyebrow: v }) )
        const titleText         = useLocalText( title,           v => setAttributes({ title: v }) )
        const titleSizeText     = useLocalText( titleSize,       v => setAttributes({ titleSize: v }) )
        const titleLineHText    = useLocalText( titleLineHeight, v => setAttributes({ titleLineHeight: v }) )
        const descSizeText      = useLocalText( descSize,        v => setAttributes({ descSize: v }) )
        const ctaLabelText      = useLocalText( ctaLabel,        v => setAttributes({ ctaLabel: v }) )
        const ctaUrlText        = useLocalText( ctaUrl,          v => setAttributes({ ctaUrl: v }) )

        const bgStyle = bgType === 'gradient'
            ? { background: `linear-gradient(${ gradientAngle }deg, ${ gradientColor1 }, ${ gradientColor2 })` }
            : { background: bgColor }

        const blockProps = useBlockProps({
            style: {
                borderRadius: `${ borderRadius }px`,
                overflow:     'hidden',
                position:     'relative',
                border:       borderWidth ? `${ borderWidth }px solid ${ borderColor }` : undefined,
                margin:       `${ marginTop }px ${ marginRight }px ${ marginBottom }px ${ marginLeft }px`,
            }
        })

        const TextContent = () => (
            <div style={{ padding:`${ paddingTop }px ${ paddingRight }px ${ paddingBottom }px ${ paddingLeft }px`, ...bgStyle, display:'flex', flexDirection:'column' }}>
                { eyebrow && <p style={{ color:eyebrowColor, fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', margin:'0 0 0.75rem' }}>{eyebrow}</p> }
                { title && <h3 style={{ fontSize:titleSize, fontWeight:titleWeight, color:titleColor, lineHeight:titleLineHeight, margin:'0 0 0.75rem' }}>{title}</h3> }
                { description && <p style={{ fontSize:descSize, color:descColor, lineHeight:1.6, margin:0 }}>{description}</p> }
                { ctaLabel && <span style={{ marginTop:'1rem', fontSize:'0.875rem', fontWeight:600, color:ctaTextColor }}>{ctaLabel} →</span> }
            </div>
        )

        const posMap = {
            'bottom-left':   { justifyContent:'flex-end',   alignItems:'flex-start', textAlign:'left' },
            'bottom-center': { justifyContent:'flex-end',   alignItems:'center',     textAlign:'center' },
            'bottom-right':  { justifyContent:'flex-end',   alignItems:'flex-end',   textAlign:'right' },
            'center-left':   { justifyContent:'center',     alignItems:'flex-start', textAlign:'left' },
            'center-center': { justifyContent:'center',     alignItems:'center',     textAlign:'center' },
            'top-left':      { justifyContent:'flex-start', alignItems:'flex-start', textAlign:'left' },
        }
        const pos = posMap[ contentPosition ] || posMap['bottom-left']

        return (
            <>
                <InspectorControls>
                    <TabPanel tabs={[
                        { name: 'layout',  title: '⚙️ Layout' },
                        { name: 'content', title: '✏️ Contenuto' },
                        { name: 'style',   title: '🎨 Stile' },
                        { name: 'spacing', title: '↔ Spaziatura' },
                    ]}>
                        { tab => {

                            if ( tab.name === 'layout' ) return (
                                <div style={{ padding:'12px' }}>
                                    <PanelBody title={ __('Layout card','arkimedia') } initialOpen={true}>
                                        <ToggleGroupControl label={ __('Tipo','arkimedia') } value={layout} onChange={ v => setAttributes({ layout: v }) } isBlock>
                                            <ToggleGroupControlOption value="A" label="A — Cover" />
                                            <ToggleGroupControlOption value="B" label="B — Top img" />
                                            <ToggleGroupControlOption value="C" label="C — Testo" />
                                            <ToggleGroupControlOption value="E" label="E — Orizzont." />
                                        </ToggleGroupControl>
                                    </PanelBody>

                                    { ( layout === 'A' || layout === 'B' || layout === 'E' ) && (
                                        <PanelBody title={ __('Immagine','arkimedia') } initialOpen={true}>
                                            <MediaUploadCheck>
                                                <MediaUpload
                                                    onSelect={ m => setAttributes({ imageUrl: m.url, imageAlt: m.alt || '', imageId: m.id }) }
                                                    allowedTypes={['image']}
                                                    value={imageId}
                                                    render={ ({ open }) => <>
                                                        { imageUrl && <img src={imageUrl} style={{ width:'100%', height:'80px', objectFit:'cover', borderRadius:'4px', marginBottom:'8px' }} /> }
                                                        <Button onClick={open} variant={ imageUrl ? 'secondary' : 'primary' } style={{ width:'100%', justifyContent:'center' }}>
                                                            { imageUrl ? __('Cambia','arkimedia') : __('Seleziona','arkimedia') }
                                                        </Button>
                                                        { imageUrl && <Button onClick={ () => setAttributes({ imageUrl:'', imageAlt:'', imageId:0 }) } variant="tertiary" isDestructive style={{ width:'100%', justifyContent:'center', marginTop:'4px' }}>{ __('Rimuovi','arkimedia') }</Button> }
                                                    </> }
                                                />
                                            </MediaUploadCheck>
                                            <SelectControl label="Object fit" value={objectFit}
                                                options={[ { label:'Cover', value:'cover' }, { label:'Contain', value:'contain' } ]}
                                                onChange={ v => setAttributes({ objectFit: v }) }
                                            />
                                            <SelectControl label="Object position" value={objectPosition}
                                                options={[
                                                    { label:'Center', value:'center center' }, { label:'Top', value:'center top' },
                                                    { label:'Bottom', value:'center bottom' }, { label:'Left', value:'left center' },
                                                    { label:'Right', value:'right center' },
                                                ]}
                                                onChange={ v => setAttributes({ objectPosition: v }) }
                                            />
                                            { layout !== 'E' && (
                                                <SelectControl label={ __('Aspect ratio','arkimedia') } value={aspectRatio}
                                                    options={[
                                                        { label:'1:1', value:'1/1' }, { label:'4:3', value:'4/3' },
                                                        { label:'16:9', value:'16/9' }, { label:'3:2', value:'3/2' },
                                                        { label:'2:3', value:'2/3' },
                                                    ]}
                                                    onChange={ v => setAttributes({ aspectRatio: v }) }
                                                />
                                            )}
                                            <ToggleControl label={ __('Usa aspect ratio','arkimedia') } checked={useAspectRatio} onChange={ v => setAttributes({ useAspectRatio: v }) } />
                                            { ! useAspectRatio && (
                                                <SelectControl label={ __('Altezza card','arkimedia') } value={cardHeight}
                                                    options={[
                                                        { label:'300px', value:'300px' }, { label:'400px', value:'400px' },
                                                        { label:'500px', value:'500px' }, { label:'600px', value:'600px' },
                                                        { label:'700px', value:'700px' }, { label:'80vh', value:'80vh' },
                                                        { label:'100vh', value:'100vh' },
                                                    ]}
                                                    onChange={ v => setAttributes({ cardHeight: v }) }
                                                />
                                            )}
                                            { layout === 'E' && (<>
                                                <ToggleGroupControl label={ __('Posizione immagine','arkimedia') } value={imagePosition} onChange={ v => setAttributes({ imagePosition: v }) } isBlock>
                                                    <ToggleGroupControlOption value="left"  label="← Sinistra" />
                                                    <ToggleGroupControlOption value="right" label="Destra →" />
                                                </ToggleGroupControl>
                                                <TextControl label={ __('Flex immagine (es. 1)','arkimedia') } { ...imageFlexText } />
                                            </>)}
                                        </PanelBody>
                                    )}

                                    { layout === 'A' && (
                                        <PanelBody title={ __('Posizione testo','arkimedia') } initialOpen={false}>
                                            <SelectControl label={ __('Posizione','arkimedia') } value={contentPosition}
                                                options={[
                                                    { label:'↙ Basso sinistra', value:'bottom-left' }, { label:'↓ Basso centro', value:'bottom-center' },
                                                    { label:'↘ Basso destra', value:'bottom-right' }, { label:'← Centro sinistra', value:'center-left' },
                                                    { label:'· Centro', value:'center-center' }, { label:'↖ Alto sinistra', value:'top-left' },
                                                ]}
                                                onChange={ v => setAttributes({ contentPosition: v }) }
                                            />
                                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Overlay</p>
                                            <ColorPicker color={overlayColor} onChange={ v => setAttributes({ overlayColor: v }) } enableAlpha />
                                        </PanelBody>
                                    )}

                                    <PanelBody title={ __('Link card','arkimedia') } initialOpen={false}>
                                        <TextControl label={ __('URL','arkimedia') } { ...linkUrlText } type="url" placeholder="https://..." />
                                        <SelectControl label={ __('Apri in','arkimedia') } value={linkTarget}
                                            options={[ { label:'Stessa finestra', value:'_self' }, { label:'Nuova finestra', value:'_blank' } ]}
                                            onChange={ v => setAttributes({ linkTarget: v }) }
                                        />
                                    </PanelBody>
                                </div>
                            )

                            if ( tab.name === 'content' ) return (
                                <div style={{ padding:'12px' }}>
                                    <PanelBody title={ __('Eyebrow','arkimedia') } initialOpen={false}>
                                        <TextControl label={ __('Testo','arkimedia') } { ...eyebrowText } />
                                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore</p>
                                        <ColorPicker color={eyebrowColor} onChange={ v => setAttributes({ eyebrowColor: v }) } />
                                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Sfondo eyebrow</p>
                                        <ColorPicker color={eyebrowBg} onChange={ v => setAttributes({ eyebrowBg: v }) } enableAlpha />
                                    </PanelBody>
                                    <PanelBody title={ __('Titolo','arkimedia') } initialOpen={true}>
                                        <TextControl label={ __('Testo','arkimedia') } { ...titleText } />
                                        <SelectControl label={ __('Tag HTML','arkimedia') } value={titleTag}
                                            options={[ { label:'h2', value:'h2' }, { label:'h3', value:'h3' }, { label:'h4', value:'h4' }, { label:'p', value:'p' } ]}
                                            onChange={ v => setAttributes({ titleTag: v }) }
                                        />
                                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore</p>
                                        <ColorPicker color={titleColor} onChange={ v => setAttributes({ titleColor: v }) } />
                                        <TextControl label={ __('Font size','arkimedia') } { ...titleSizeText } />
                                        <SelectControl label={ __('Font weight','arkimedia') } value={titleWeight}
                                            options={[
                                                { label:'Light 300', value:'300' }, { label:'Regular 400', value:'400' },
                                                { label:'Medium 500', value:'500' }, { label:'SemiBold 600', value:'600' },
                                                { label:'Bold 700', value:'700' }, { label:'ExtraBold 800', value:'800' },
                                                { label:'Black 900', value:'900' },
                                            ]}
                                            onChange={ v => setAttributes({ titleWeight: v }) }
                                        />
                                        <TextControl label={ __('Line height','arkimedia') } { ...titleLineHText } />
                                    </PanelBody>
                                    <PanelBody title={ __('Descrizione','arkimedia') } initialOpen={false}>
                                        <RichText
                                            tagName="p"
                                            value={description}
                                            onChange={ v => setAttributes({ description: v }) }
                                            placeholder={ __('Testo descrizione...','arkimedia') }
                                            allowedFormats={[ 'core/bold', 'core/italic', 'core/link', 'core/underline' ]}
                                        />
                                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore</p>
                                        <ColorPicker color={descColor} onChange={ v => setAttributes({ descColor: v }) } enableAlpha />
                                        <TextControl label={ __('Font size','arkimedia') } { ...descSizeText } />
                                    </PanelBody>
                                    <PanelBody title={ __('CTA (opzionale)','arkimedia') } initialOpen={false}>
                                        <TextControl label={ __('Testo','arkimedia') } { ...ctaLabelText } />
                                        <TextControl label={ __('URL','arkimedia') } { ...ctaUrlText } type="url" />
                                        <SelectControl label={ __('Stile','arkimedia') } value={ctaStyle}
                                            options={[ { label:'Filled', value:'filled' }, { label:'Outline', value:'outline' }, { label:'Ghost', value:'ghost' } ]}
                                            onChange={ v => setAttributes({ ctaStyle: v }) }
                                        />
                                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore testo CTA</p>
                                        <ColorPicker color={ctaTextColor} onChange={ v => setAttributes({ ctaTextColor: v }) } />
                                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore sfondo CTA</p>
                                        <ColorPicker color={ctaBgColor} onChange={ v => setAttributes({ ctaBgColor: v }) } />
                                    </PanelBody>
                                </div>
                            )

                            if ( tab.name === 'style' ) return (
                                <div style={{ padding:'12px' }}>
                                    <PanelBody title={ __('Sfondo','arkimedia') } initialOpen={true}>
                                        <ToggleGroupControl label={ __('Tipo','arkimedia') } value={bgType} onChange={ v => setAttributes({ bgType: v }) } isBlock>
                                            <ToggleGroupControlOption value="color"    label="Colore" />
                                            <ToggleGroupControlOption value="gradient" label="Gradiente" />
                                        </ToggleGroupControl>
                                        { bgType === 'color' && <>
                                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore</p>
                                            <ColorPicker color={bgColor} onChange={ v => setAttributes({ bgColor: v }) } enableAlpha />
                                        </> }
                                        { bgType === 'gradient' && <>
                                            <LocalRange label="Angolo (°)" value={gradientAngle} onChange={ v => setAttributes({ gradientAngle: v }) } min={0} max={360} step={1} />
                                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore 1</p>
                                            <ColorPicker color={gradientColor1} onChange={ v => setAttributes({ gradientColor1: v }) } />
                                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore 2</p>
                                            <ColorPicker color={gradientColor2} onChange={ v => setAttributes({ gradientColor2: v }) } />
                                        </> }
                                    </PanelBody>
                                    <PanelBody title={ __('Bordo','arkimedia') } initialOpen={false}>
                                        <LocalRange label={ __('Border radius (px)','arkimedia') } value={borderRadius} onChange={ v => setAttributes({ borderRadius: v }) } max={200} />
                                        <LocalRange label={ __('Spessore bordo (px)','arkimedia') } value={borderWidth} onChange={ v => setAttributes({ borderWidth: v }) } max={10} />
                                        { borderWidth > 0 && <>
                                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore bordo</p>
                                            <ColorPicker color={borderColor} onChange={ v => setAttributes({ borderColor: v }) } enableAlpha />
                                        </> }
                                    </PanelBody>
                                    <PanelBody title={ __('Hover','arkimedia') } initialOpen={false}>
                                        <SelectControl label={ __('Effetto hover','arkimedia') } value={hoverEffect}
                                            options={[
                                                { label:'Zoom immagine', value:'zoom' }, { label:'Lift (shadow)', value:'lift' },
                                                { label:'Overlay scuro', value:'overlay' }, { label:'Nessuno', value:'none' },
                                            ]}
                                            onChange={ v => setAttributes({ hoverEffect: v }) }
                                        />
                                    </PanelBody>
                                    <PanelBody title={ __('Animazione GSAP','arkimedia') } initialOpen={false}>
                                        <SelectControl label={ __('Tipo','arkimedia') } value={animationType}
                                            options={[
                                                { label:'Nessuna', value:'none' }, { label:'Fade up', value:'fadeUp' },
                                                { label:'Fade in', value:'fadeIn' }, { label:'Scale in', value:'scaleIn' },
                                            ]}
                                            onChange={ v => setAttributes({ animationType: v }) }
                                        />
                                        { animationType !== 'none' && (
                                            <LocalRange label={ __('Delay (ms)','arkimedia') } value={animationDelay} onChange={ v => setAttributes({ animationDelay: v }) } min={0} max={2000} step={50} />
                                        )}
                                    </PanelBody>
                                </div>
                            )

                            if ( tab.name === 'spacing' ) return (
                                <div style={{ padding:'12px' }}>
                                    <PanelBody title={ __('Padding interno','arkimedia') } initialOpen={true}>
                                        <LocalRange label="Top"    value={paddingTop}    onChange={ v => setAttributes({ paddingTop: v }) }    max={200} />
                                        <LocalRange label="Bottom" value={paddingBottom} onChange={ v => setAttributes({ paddingBottom: v }) } max={200} />
                                        <LocalRange label="Left"   value={paddingLeft}   onChange={ v => setAttributes({ paddingLeft: v }) }   max={200} />
                                        <LocalRange label="Right"  value={paddingRight}  onChange={ v => setAttributes({ paddingRight: v }) }  max={200} />
                                    </PanelBody>
                                    <PanelBody title={ __('Margin esterno','arkimedia') } initialOpen={true}>
                                        <LocalRange label="Top"    value={marginTop}    onChange={ v => setAttributes({ marginTop: v }) }    max={300} />
                                        <LocalRange label="Bottom" value={marginBottom} onChange={ v => setAttributes({ marginBottom: v }) } max={300} />
                                        <LocalRange label="Left"   value={marginLeft}   onChange={ v => setAttributes({ marginLeft: v }) }   max={300} />
                                        <LocalRange label="Right"  value={marginRight}  onChange={ v => setAttributes({ marginRight: v }) }  max={300} />
                                    </PanelBody>
                                </div>
                            )

                            return null
                        }}
                    </TabPanel>
                </InspectorControls>

                <div { ...blockProps }>
                    { layout === 'A' && (
                        <div style={{ ...(useAspectRatio ? { aspectRatio } : { height: cardHeight }), position:'relative', width:'100%', overflow:'hidden', ...bgStyle }}>
                            { imageUrl && <img src={imageUrl} alt={imageAlt} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit, objectPosition }} /> }
                            <div style={{ position:'absolute', inset:0, background:overlayColor, zIndex:1 }} />
                            <div style={{ position:'absolute', inset:0, zIndex:2, display:'flex', flexDirection:'column', justifyContent:pos.justifyContent, alignItems:pos.alignItems, textAlign:pos.textAlign, padding:`${ paddingTop }px ${ paddingRight }px ${ paddingBottom }px ${ paddingLeft }px` }}>
                                { eyebrow && <p style={{ color:eyebrowColor, fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', margin:'0 0 0.5rem' }}>{eyebrow}</p> }
                                { title && <h3 style={{ fontSize:titleSize, fontWeight:titleWeight, color:titleColor, lineHeight:titleLineHeight, margin:'0 0 0.5rem' }}>{title}</h3> }
                                { description && <p style={{ fontSize:descSize, color:descColor, lineHeight:1.5, margin:0 }}>{description}</p> }
                                { ctaLabel && <span style={{ marginTop:'1rem', fontSize:'0.875rem', fontWeight:600, color:ctaTextColor }}>{ctaLabel} →</span> }
                            </div>
                        </div>
                    )}
                    { layout === 'B' && (
                        <>
                            <div style={{ ...(useAspectRatio ? { aspectRatio } : { height: cardHeight }), position:'relative', overflow:'hidden' }}>
                                { imageUrl ? <img src={imageUrl} alt={imageAlt} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit, objectPosition }} /> : <div style={{ position:'absolute', inset:0, ...bgStyle }} /> }
                            </div>
                            <TextContent />
                        </>
                    )}
                    { layout === 'C' && <TextContent /> }
                    { layout === 'E' && (
                        <div style={{ display:'flex', flexDirection: imagePosition === 'right' ? 'row-reverse' : 'row', height:cardHeight, overflow:'hidden', ...bgStyle }}>
                            { imageUrl ? (
                                <div style={{ flex:imageFlex, position:'relative', overflow:'hidden', flexShrink:0 }}>
                                    <img src={imageUrl} alt={imageAlt} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit, objectPosition }} />
                                </div>
                            ) : (
                                <div style={{ flex:imageFlex, minHeight:'200px', background:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                    <span style={{ opacity:0.3, fontSize:'0.875rem' }}>Immagine</span>
                                </div>
                            )}
                            <div style={{ flex:2, display:'flex', alignItems:'center' }}>
                                <TextContent />
                            </div>
                        </div>
                    )}
                </div>
            </>
        )
    },

    save: () => null,
})
