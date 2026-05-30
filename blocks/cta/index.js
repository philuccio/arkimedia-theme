import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor'
import {
    PanelBody, TextControl, TextareaControl, SelectControl,
    RangeControl, ToggleControl, Button, ColorPicker, TabPanel,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import metadata from './block.json'

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const {
            layout, eyebrow, eyebrowColor,
            title, titleColor, titleSize, titleWeight, titleLineHeight,
            description, descColor, descSize, descLineHeight,
            cta1Label, cta1Url, cta1Style, cta1BgColor, cta1TextColor,
            cta2Label, cta2Url, cta2Style, cta2BgColor, cta2TextColor,
            bgType, bgColor, gradientAngle, gradientColor1, gradientColor2,
            bgImageUrl, bgImageAlt, bgImageId, bgSize, bgPosition, overlayColor,
            minHeight, isFullwidth, textAlign,
            borderRadius, boxShadow, shadowColor, shadowBlur,
            paddingTop, paddingBottom, paddingLeft, paddingRight,
            marginTop, marginBottom,
            animationType, animationDelay,
        } = attributes

        // Sfondo preview
        let bgStyle = {}
        switch ( bgType ) {
            case 'gradient':
                bgStyle.background = `linear-gradient(${ gradientAngle }deg, ${ gradientColor1 }, ${ gradientColor2 })`
                break
            case 'image':
                bgStyle = bgImageUrl ? {
                    backgroundImage: `url(${ bgImageUrl })`,
                    backgroundSize: bgSize,
                    backgroundPosition: bgPosition,
                } : { background: bgColor }
                break
            default:
                bgStyle.background = bgColor
        }

        const blockProps = useBlockProps({
            style: {
                ...bgStyle,
                minHeight,
                position:    'relative',
                overflow:    'hidden',
                width:       isFullwidth ? '100vw' : '100%',
                maxWidth:    isFullwidth ? '100vw' : 'var(--container-width,1200px)',
                marginLeft:  isFullwidth ? 'calc(50% - 50vw)' : 'auto',
                marginRight: isFullwidth ? 'calc(50% - 50vw)' : 'auto',
                marginTop:   marginTop ? `${ marginTop }px` : undefined,
                marginBottom:marginBottom ? `${ marginBottom }px` : undefined,
                borderRadius: borderRadius ? `${ borderRadius }px` : undefined,
                boxShadow:   boxShadow ? `0 0 ${ shadowBlur }px ${ shadowColor }` : undefined,
            }
        })

        const ctaBtn = ( label, style, bg, textColor ) => {
            if ( ! label ) return null
            const css = {
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                fontWeight: 700, fontSize: '0.9375rem', textDecoration: 'none',
                padding: style === 'ghost' ? '0 0 4px' : '1rem 2.5rem',
                borderRadius: style === 'ghost' ? 0 : '4px',
                background: style === 'filled' ? ( bg || 'var(--color-accent,#e94560)' ) : 'transparent',
                border: style === 'outline' ? `2px solid ${ textColor }` : style === 'ghost' ? `0 0 2px 0 solid ${ textColor }` : 'none',
                borderBottom: style === 'ghost' ? `2px solid ${ textColor }` : undefined,
                color: textColor,
            }
            return <span style={css}>{label} →</span>
        }

        const contentStyle = {
            position: 'relative', zIndex: 2,
            padding: `${ paddingTop }px ${ paddingRight }px ${ paddingBottom }px ${ paddingLeft }px`,
        }

        const Sp = ( { label, value, onChange, max = 300 } ) => (
            <RangeControl label={label} value={value} onChange={onChange} min={0} max={max} step={4} />
        )

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
                                    <PanelBody title={ __('Layout','arkimedia') } initialOpen={true}>
                                        <ToggleGroupControl label={ __('Tipo','arkimedia') } value={layout} onChange={ v => setAttributes({ layout: v }) } isBlock>
                                            <ToggleGroupControlOption value="A" label="A — Centrato" />
                                            <ToggleGroupControlOption value="B" label="B — Sx + Dx" />
                                            <ToggleGroupControlOption value="C" label="C — Immagine" />
                                        </ToggleGroupControl>
                                        <ToggleControl label={ __('Fullwidth','arkimedia') } checked={isFullwidth} onChange={ v => setAttributes({ isFullwidth: v }) } />
                                        { ( layout === 'A' || layout === 'C' ) && (
                                            <ToggleGroupControl label={ __('Allineamento testo','arkimedia') } value={textAlign} onChange={ v => setAttributes({ textAlign: v }) } isBlock>
                                                <ToggleGroupControlOption value="left"   label="←" />
                                                <ToggleGroupControlOption value="center" label="↔" />
                                                <ToggleGroupControlOption value="right"  label="→" />
                                            </ToggleGroupControl>
                                        )}
                                        <SelectControl label={ __('Altezza minima','arkimedia') } value={minHeight}
                                            options={[
                                                { label:'300px', value:'300px' }, { label:'400px', value:'400px' },
                                                { label:'500px', value:'500px' }, { label:'600px', value:'600px' },
                                                { label:'80vh',  value:'80vh'  }, { label:'100vh', value:'100vh' },
                                                { label:'Auto',  value:'auto'  },
                                            ]}
                                            onChange={ v => setAttributes({ minHeight: v }) }
                                        />
                                    </PanelBody>
                                </div>
                            )

                            if ( tab.name === 'content' ) return (
                                <div style={{ padding:'12px' }}>
                                    <PanelBody title={ __('Eyebrow','arkimedia') } initialOpen={false}>
                                        <TextControl label={ __('Testo','arkimedia') } value={eyebrow} onChange={ v => setAttributes({ eyebrow: v }) } />
                                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore</p>
                                        <ColorPicker color={eyebrowColor} onChange={ v => setAttributes({ eyebrowColor: v }) } />
                                    </PanelBody>
                                    <PanelBody title={ __('Titolo','arkimedia') } initialOpen={true}>
                                        <TextareaControl label={ __('Testo','arkimedia') } value={title} onChange={ v => setAttributes({ title: v }) } rows={3} />
                                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore</p>
                                        <ColorPicker color={titleColor} onChange={ v => setAttributes({ titleColor: v }) } />
                                        <TextControl label={ __('Font size','arkimedia') } value={titleSize} onChange={ v => setAttributes({ titleSize: v }) } />
                                        <SelectControl label={ __('Font weight','arkimedia') } value={titleWeight}
                                            options={[
                                                { label:'300', value:'300' }, { label:'400', value:'400' },
                                                { label:'500', value:'500' }, { label:'600', value:'600' },
                                                { label:'700', value:'700' }, { label:'800', value:'800' },
                                                { label:'900', value:'900' },
                                            ]}
                                            onChange={ v => setAttributes({ titleWeight: v }) }
                                        />
                                        <TextControl label={ __('Line height','arkimedia') } value={titleLineHeight} onChange={ v => setAttributes({ titleLineHeight: v }) } />
                                    </PanelBody>
                                    <PanelBody title={ __('Descrizione','arkimedia') } initialOpen={false}>
                                        <TextareaControl label={ __('Testo','arkimedia') } value={description} onChange={ v => setAttributes({ description: v }) } rows={4} />
                                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore</p>
                                        <ColorPicker color={descColor} onChange={ v => setAttributes({ descColor: v }) } enableAlpha />
                                        <TextControl label={ __('Font size','arkimedia') } value={descSize} onChange={ v => setAttributes({ descSize: v }) } />
                                        <TextControl label={ __('Line height','arkimedia') } value={descLineHeight} onChange={ v => setAttributes({ descLineHeight: v }) } />
                                    </PanelBody>
                                    <PanelBody title={ __('CTA Primario','arkimedia') } initialOpen={true}>
                                        <TextControl label={ __('Testo','arkimedia') } value={cta1Label} onChange={ v => setAttributes({ cta1Label: v }) } />
                                        <TextControl label={ __('URL','arkimedia') } value={cta1Url} onChange={ v => setAttributes({ cta1Url: v }) } type="url" />
                                        <SelectControl label={ __('Stile','arkimedia') } value={cta1Style}
                                            options={[ { label:'Filled', value:'filled' }, { label:'Outline', value:'outline' }, { label:'Ghost', value:'ghost' } ]}
                                            onChange={ v => setAttributes({ cta1Style: v }) }
                                        />
                                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore sfondo</p>
                                        <ColorPicker color={cta1BgColor} onChange={ v => setAttributes({ cta1BgColor: v }) } />
                                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore testo</p>
                                        <ColorPicker color={cta1TextColor} onChange={ v => setAttributes({ cta1TextColor: v }) } />
                                    </PanelBody>
                                    <PanelBody title={ __('CTA Secondario','arkimedia') } initialOpen={false}>
                                        <TextControl label={ __('Testo','arkimedia') } value={cta2Label} onChange={ v => setAttributes({ cta2Label: v }) } />
                                        <TextControl label={ __('URL','arkimedia') } value={cta2Url} onChange={ v => setAttributes({ cta2Url: v }) } type="url" />
                                        <SelectControl label={ __('Stile','arkimedia') } value={cta2Style}
                                            options={[ { label:'Filled', value:'filled' }, { label:'Outline', value:'outline' }, { label:'Ghost', value:'ghost' } ]}
                                            onChange={ v => setAttributes({ cta2Style: v }) }
                                        />
                                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore sfondo</p>
                                        <ColorPicker color={cta2BgColor} onChange={ v => setAttributes({ cta2BgColor: v }) } />
                                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore testo</p>
                                        <ColorPicker color={cta2TextColor} onChange={ v => setAttributes({ cta2TextColor: v }) } />
                                    </PanelBody>
                                </div>
                            )

                            if ( tab.name === 'style' ) return (
                                <div style={{ padding:'12px' }}>
                                    <PanelBody title={ __('Sfondo','arkimedia') } initialOpen={true}>
                                        <ToggleGroupControl label={ __('Tipo','arkimedia') } value={bgType} onChange={ v => setAttributes({ bgType: v }) } isBlock>
                                            <ToggleGroupControlOption value="color"    label="Colore" />
                                            <ToggleGroupControlOption value="gradient" label="Gradiente" />
                                            <ToggleGroupControlOption value="image"    label="Immagine" />
                                        </ToggleGroupControl>

                                        { bgType === 'color' && <>
                                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore</p>
                                            <ColorPicker color={bgColor} onChange={ v => setAttributes({ bgColor: v }) } enableAlpha />
                                        </> }

                                        { bgType === 'gradient' && <>
                                            <RangeControl label="Angolo (°)" value={gradientAngle} onChange={ v => setAttributes({ gradientAngle: v }) } min={0} max={360} />
                                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore 1</p>
                                            <ColorPicker color={gradientColor1} onChange={ v => setAttributes({ gradientColor1: v }) } />
                                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore 2</p>
                                            <ColorPicker color={gradientColor2} onChange={ v => setAttributes({ gradientColor2: v }) } />
                                        </> }

                                        { bgType === 'image' && <>
                                            <MediaUploadCheck>
                                                <MediaUpload
                                                    onSelect={ m => setAttributes({ bgImageUrl: m.url, bgImageAlt: m.alt || '', bgImageId: m.id }) }
                                                    allowedTypes={['image']}
                                                    value={bgImageId}
                                                    render={ ({ open }) => <>
                                                        { bgImageUrl && <img src={bgImageUrl} style={{ width:'100%', height:'80px', objectFit:'cover', borderRadius:'4px', marginBottom:'8px' }} /> }
                                                        <Button onClick={open} variant={ bgImageUrl ? 'secondary' : 'primary' } style={{ width:'100%', justifyContent:'center' }}>
                                                            { bgImageUrl ? __('Cambia','arkimedia') : __('Seleziona immagine','arkimedia') }
                                                        </Button>
                                                        { bgImageUrl && <Button onClick={ () => setAttributes({ bgImageUrl:'', bgImageAlt:'', bgImageId:0 }) } variant="tertiary" isDestructive style={{ width:'100%', justifyContent:'center', marginTop:'4px' }}>{ __('Rimuovi','arkimedia') }</Button> }
                                                    </> }
                                                />
                                            </MediaUploadCheck>
                                            <SelectControl label="Size" value={bgSize}
                                                options={[ { label:'Cover', value:'cover' }, { label:'Contain', value:'contain' } ]}
                                                onChange={ v => setAttributes({ bgSize: v }) }
                                            />
                                            <SelectControl label="Position" value={bgPosition}
                                                options={[
                                                    { label:'Center', value:'center center' },
                                                    { label:'Top',    value:'center top' },
                                                    { label:'Bottom', value:'center bottom' },
                                                ]}
                                                onChange={ v => setAttributes({ bgPosition: v }) }
                                            />
                                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Overlay</p>
                                            <ColorPicker color={overlayColor} onChange={ v => setAttributes({ overlayColor: v }) } enableAlpha />
                                        </> }
                                    </PanelBody>
                                    <PanelBody title={ __('Bordo','arkimedia') } initialOpen={false}>
                                        <Sp label={ __('Border radius','arkimedia') } value={borderRadius} onChange={ v => setAttributes({ borderRadius: v }) } max={50} />
                                    </PanelBody>
                                    <PanelBody title={ __('Box Shadow','arkimedia') } initialOpen={false}>
                                        <ToggleControl label={ __('Abilita shadow','arkimedia') } checked={boxShadow} onChange={ v => setAttributes({ boxShadow: v }) } />
                                        { boxShadow && <>
                                            <Sp label="Blur" value={shadowBlur} onChange={ v => setAttributes({ shadowBlur: v }) } max={100} />
                                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore shadow</p>
                                            <ColorPicker color={shadowColor} onChange={ v => setAttributes({ shadowColor: v }) } enableAlpha />
                                        </> }
                                    </PanelBody>
                                    <PanelBody title={ __('Animazione GSAP','arkimedia') } initialOpen={false}>
                                        <SelectControl label={ __('Tipo','arkimedia') } value={animationType}
                                            options={[
                                                { label:'Nessuna',     value:'none' },
                                                { label:'Fade up',     value:'fadeUp' },
                                                { label:'Fade in',     value:'fadeIn' },
                                                { label:'Slide left',  value:'slideLeft' },
                                                { label:'Slide right', value:'slideRight' },
                                            ]}
                                            onChange={ v => setAttributes({ animationType: v }) }
                                        />
                                        { animationType !== 'none' && (
                                            <RangeControl label={ __('Delay (ms)','arkimedia') } value={animationDelay} onChange={ v => setAttributes({ animationDelay: v }) } min={0} max={2000} step={50} />
                                        )}
                                    </PanelBody>
                                </div>
                            )

                            if ( tab.name === 'spacing' ) return (
                                <div style={{ padding:'12px' }}>
                                    <PanelBody title={ __('Padding','arkimedia') } initialOpen={true}>
                                        <Sp label="Top"    value={paddingTop}    onChange={ v => setAttributes({ paddingTop: v }) } />
                                        <Sp label="Bottom" value={paddingBottom} onChange={ v => setAttributes({ paddingBottom: v }) } />
                                        <Sp label="Left"   value={paddingLeft}   onChange={ v => setAttributes({ paddingLeft: v }) } />
                                        <Sp label="Right"  value={paddingRight}  onChange={ v => setAttributes({ paddingRight: v }) } />
                                    </PanelBody>
                                    <PanelBody title={ __('Margin','arkimedia') } initialOpen={false}>
                                        <Sp label="Top"    value={marginTop}    onChange={ v => setAttributes({ marginTop: v }) } />
                                        <Sp label="Bottom" value={marginBottom} onChange={ v => setAttributes({ marginBottom: v }) } />
                                    </PanelBody>
                                </div>
                            )

                            return null
                        }}
                    </TabPanel>
                </InspectorControls>

                {/* Preview editor */}
                <div { ...blockProps }>
                    { bgType === 'image' && overlayColor && (
                        <div style={{ position:'absolute', inset:0, background:overlayColor, zIndex:1 }} />
                    )}
                    <div style={{ ...contentStyle, position:'relative', zIndex:2, maxWidth:'var(--container-width,1200px)', margin:'0 auto' }}>

                        { layout === 'B' ? (
                            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'3rem', flexWrap:'wrap' }}>
                                <div style={{ flex:1, minWidth:'300px' }}>
                                    { eyebrow && <p style={{ fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color: eyebrowColor || 'var(--color-accent,#e94560)', margin:'0 0 1rem' }}>{eyebrow}</p> }
                                    { title && <h2 style={{ fontSize:titleSize, fontWeight:titleWeight, color:titleColor, lineHeight:titleLineHeight, margin:'0 0 1rem' }}>{title}</h2> }
                                    { description && <p style={{ fontSize:descSize, color:descColor, lineHeight:1.7, margin:0 }}>{description}</p> }
                                </div>
                                { ( cta1Label || cta2Label ) && (
                                    <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', alignItems:'center', flexShrink:0 }}>
                                        { ctaBtn( cta1Label, cta1Style, cta1BgColor, cta1TextColor ) }
                                        { ctaBtn( cta2Label, cta2Style, cta2BgColor, cta2TextColor ) }
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ textAlign }}>
                                { eyebrow && <p style={{ fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color: eyebrowColor || 'var(--color-accent,#e94560)', margin:'0 0 1rem' }}>{eyebrow}</p> }
                                { title && <h2 style={{ fontSize:titleSize, fontWeight:titleWeight, color:titleColor, lineHeight:titleLineHeight, margin:'0 0 1rem' }}>{title}</h2> }
                                { description && <p style={{ fontSize:descSize, color:descColor, lineHeight:1.7, margin:'0 0 2rem', maxWidth:'700px', marginLeft:'auto', marginRight:'auto' }}>{description}</p> }
                                { ( cta1Label || cta2Label ) && (
                                    <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start' }}>
                                        { ctaBtn( cta1Label, cta1Style, cta1BgColor, cta1TextColor ) }
                                        { ctaBtn( cta2Label, cta2Style, cta2BgColor, cta2TextColor ) }
                                    </div>
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
