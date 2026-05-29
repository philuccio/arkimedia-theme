import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor'
import {
    PanelBody, TextControl, TextareaControl, SelectControl,
    RangeControl, ToggleControl, Button, ColorPicker,
    TabPanel,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import metadata from './block.json'

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const {
            imageUrl, imageAlt, imageId, imagePosition,
            objectFit, objectPosition, imageFlex, textFlex,
            title, titleColor, titleSize, titleWeight, titleLineHeight,
            description, descColor, descSize,
            ctaLabel, ctaUrl, ctaBgColor, ctaTextColor, ctaBorderColor, ctaStyle,
            minHeight, alignItems, gap, bgColor,
            textPaddingTop, textPaddingBottom, textPaddingLeft, textPaddingRight,
            borderRadius, boxShadow, shadowColor, shadowBlur, shadowSpread,
            animationType,
        } = attributes

        const isReversed = imagePosition === 'right'

        const wrapperStyle = {
            background:     bgColor,
            minHeight,
            display:        'flex',
            flexDirection:  isReversed ? 'row-reverse' : 'row',
            alignItems,
            gap:            `${ gap }px`,
            overflow:       'hidden',
            borderRadius:   borderRadius ? `${ borderRadius }px` : undefined,
            boxShadow:      boxShadow ? `0 0 ${ shadowBlur }px ${ shadowSpread }px ${ shadowColor }` : undefined,
            width:          '100vw',
            maxWidth:       '100vw',
            marginLeft:     'calc(50% - 50vw)',
            marginRight:    'calc(50% - 50vw)',
        }

        const ctaStyle_computed = {
            color:          ctaTextColor,
            textDecoration: 'none',
            display:        'inline-flex',
            alignItems:     'center',
            gap:            '0.5rem',
            fontWeight:     '600',
            fontSize:       '0.9375rem',
            padding:        '0.875rem 2rem',
            borderRadius:   '4px',
            background:     ctaStyle === 'filled' ? ( ctaBgColor || 'var(--color-accent,#e94560)' ) : 'transparent',
            border:         ctaStyle === 'outline' ? `2px solid ${ ctaBorderColor || ctaTextColor }` : undefined,
            borderBottom:   ctaStyle === 'ghost'   ? `2px solid ${ ctaBorderColor || ctaTextColor }` : undefined,
        }

        const blockProps = useBlockProps({ style: wrapperStyle })

        const Sp = ( { label, value, onChange, max = 200 } ) => (
            <RangeControl label={label} value={value} onChange={onChange} min={0} max={max} step={4} />
        )

        return (
            <>
                <InspectorControls>
                    <TabPanel
                        tabs={[
                            { name: 'image',  title: '🖼 Immagine' },
                            { name: 'text',   title: '✏️ Testo' },
                            { name: 'layout', title: '⚙️ Layout' },
                            { name: 'style',  title: '🎨 Stile' },
                        ]}
                    >
                        { tab => {

                            // ── Tab Immagine ──────────────────────────────────
                            if ( tab.name === 'image' ) return (
                                <div style={{ padding: '12px' }}>
                                    <PanelBody title={ __('Immagine','arkimedia') } initialOpen={true}>
                                        <MediaUploadCheck>
                                            <MediaUpload
                                                onSelect={ m => setAttributes({ imageUrl: m.url, imageAlt: m.alt || '', imageId: m.id }) }
                                                allowedTypes={['image']}
                                                value={imageId}
                                                render={ ({ open }) => <>
                                                    { imageUrl && <img src={imageUrl} style={{ width:'100%', height:'100px', objectFit:'cover', borderRadius:'4px', marginBottom:'8px' }} /> }
                                                    <Button onClick={open} variant={ imageUrl ? 'secondary' : 'primary' } style={{ width:'100%', justifyContent:'center' }}>
                                                        { imageUrl ? __('Cambia','arkimedia') : __('Seleziona immagine','arkimedia') }
                                                    </Button>
                                                    { imageUrl && <Button onClick={ () => setAttributes({ imageUrl:'', imageAlt:'', imageId:0 }) } variant="tertiary" isDestructive style={{ width:'100%', justifyContent:'center', marginTop:'4px' }}>{ __('Rimuovi','arkimedia') }</Button> }
                                                </> }
                                            />
                                        </MediaUploadCheck>
                                        <TextControl label={ __('Alt text','arkimedia') } value={imageAlt} onChange={ v => setAttributes({ imageAlt: v }) } />
                                    </PanelBody>
                                    <PanelBody title={ __('Posizione immagine','arkimedia') } initialOpen={true}>
                                        <ToggleGroupControl label={ __('Lato','arkimedia') } value={imagePosition} onChange={ v => setAttributes({ imagePosition: v }) } isBlock>
                                            <ToggleGroupControlOption value="left"  label="← Sinistra" />
                                            <ToggleGroupControlOption value="right" label="Destra →" />
                                        </ToggleGroupControl>
                                        <SelectControl label={ __('Object fit','arkimedia') } value={objectFit}
                                            options={[ { label:'Cover', value:'cover' }, { label:'Contain', value:'contain' }, { label:'Fill', value:'fill' } ]}
                                            onChange={ v => setAttributes({ objectFit: v }) }
                                        />
                                        <SelectControl label={ __('Object position','arkimedia') } value={objectPosition}
                                            options={[
                                                { label:'Center', value:'center center' },
                                                { label:'Top',    value:'center top' },
                                                { label:'Bottom', value:'center bottom' },
                                                { label:'Left',   value:'left center' },
                                                { label:'Right',  value:'right center' },
                                            ]}
                                            onChange={ v => setAttributes({ objectPosition: v }) }
                                        />
                                    </PanelBody>
                                </div>
                            )

                            // ── Tab Testo ─────────────────────────────────────
                            if ( tab.name === 'text' ) return (
                                <div style={{ padding: '12px' }}>
                                    <PanelBody title={ __('Titolo','arkimedia') } initialOpen={true}>
                                        <TextControl label={ __('Testo titolo','arkimedia') } value={title} onChange={ v => setAttributes({ title: v }) } />
                                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore</p>
                                        <ColorPicker color={titleColor} onChange={ v => setAttributes({ titleColor: v }) } />
                                        <TextControl label={ __('Font size','arkimedia') } value={titleSize} onChange={ v => setAttributes({ titleSize: v }) } help="Es. clamp(2rem,5vw,3.5rem)" />
                                        <SelectControl label={ __('Font weight','arkimedia') } value={titleWeight}
                                            options={[
                                                { label:'Light 300', value:'300' }, { label:'Regular 400', value:'400' },
                                                { label:'Medium 500', value:'500' }, { label:'SemiBold 600', value:'600' },
                                                { label:'Bold 700', value:'700' }, { label:'ExtraBold 800', value:'800' },
                                                { label:'Black 900', value:'900' },
                                            ]}
                                            onChange={ v => setAttributes({ titleWeight: v }) }
                                        />
                                        <TextControl label={ __('Line height','arkimedia') } value={titleLineHeight} onChange={ v => setAttributes({ titleLineHeight: v }) } />
                                    </PanelBody>
                                    <PanelBody title={ __('Descrizione','arkimedia') } initialOpen={true}>
                                        <TextareaControl label={ __('Testo','arkimedia') } value={description} onChange={ v => setAttributes({ description: v }) } rows={5} />
                                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore</p>
                                        <ColorPicker color={descColor} onChange={ v => setAttributes({ descColor: v }) } enableAlpha />
                                        <TextControl label={ __('Font size','arkimedia') } value={descSize} onChange={ v => setAttributes({ descSize: v }) } />
                                    </PanelBody>
                                    <PanelBody title={ __('CTA','arkimedia') } initialOpen={true}>
                                        <TextControl label={ __('Testo pulsante','arkimedia') } value={ctaLabel} onChange={ v => setAttributes({ ctaLabel: v }) } />
                                        <TextControl label={ __('URL','arkimedia') } value={ctaUrl} onChange={ v => setAttributes({ ctaUrl: v }) } type="url" />
                                        <SelectControl label={ __('Stile CTA','arkimedia') } value={ctaStyle}
                                            options={[
                                                { label:'Filled (pieno)', value:'filled' },
                                                { label:'Outline (bordo)', value:'outline' },
                                                { label:'Ghost (testo+linea)', value:'ghost' },
                                            ]}
                                            onChange={ v => setAttributes({ ctaStyle: v }) }
                                        />
                                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore sfondo CTA</p>
                                        <ColorPicker color={ctaBgColor} onChange={ v => setAttributes({ ctaBgColor: v }) } />
                                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore testo CTA</p>
                                        <ColorPicker color={ctaTextColor} onChange={ v => setAttributes({ ctaTextColor: v }) } />
                                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore bordo CTA</p>
                                        <ColorPicker color={ctaBorderColor} onChange={ v => setAttributes({ ctaBorderColor: v }) } />
                                    </PanelBody>
                                </div>
                            )

                            // ── Tab Layout ────────────────────────────────────
                            if ( tab.name === 'layout' ) return (
                                <div style={{ padding: '12px' }}>
                                    <PanelBody title={ __('Proporzioni','arkimedia') } initialOpen={true}>
                                        <TextControl label={ __('Flex immagine (es. 1)','arkimedia') } value={imageFlex} onChange={ v => setAttributes({ imageFlex: v }) } help="Es. 1 = 33%, 2 = 50%" />
                                        <TextControl label={ __('Flex testo (es. 2)','arkimedia') }    value={textFlex}  onChange={ v => setAttributes({ textFlex: v }) } />
                                    </PanelBody>
                                    <PanelBody title={ __('Dimensioni','arkimedia') } initialOpen={true}>
                                        <SelectControl label={ __('Min height','arkimedia') } value={minHeight}
                                            options={[
                                                { label:'400px', value:'400px' }, { label:'500px', value:'500px' },
                                                { label:'600px', value:'600px' }, { label:'700px', value:'700px' },
                                                { label:'80vh',  value:'80vh'  }, { label:'100vh', value:'100vh' },
                                            ]}
                                            onChange={ v => setAttributes({ minHeight: v }) }
                                        />
                                        <SelectControl label={ __('Align items','arkimedia') } value={alignItems}
                                            options={[
                                                { label:'Center',  value:'center' },
                                                { label:'Start',   value:'flex-start' },
                                                { label:'End',     value:'flex-end' },
                                                { label:'Stretch', value:'stretch' },
                                            ]}
                                            onChange={ v => setAttributes({ alignItems: v }) }
                                        />
                                        <Sp label={ __('Gap (px)','arkimedia') } value={gap} onChange={ v => setAttributes({ gap: v }) } max={100} />
                                    </PanelBody>
                                    <PanelBody title={ __('Padding testo','arkimedia') } initialOpen={false}>
                                        <Sp label="Top"    value={textPaddingTop}    onChange={ v => setAttributes({ textPaddingTop: v }) } />
                                        <Sp label="Bottom" value={textPaddingBottom} onChange={ v => setAttributes({ textPaddingBottom: v }) } />
                                        <Sp label="Left"   value={textPaddingLeft}   onChange={ v => setAttributes({ textPaddingLeft: v }) } />
                                        <Sp label="Right"  value={textPaddingRight}  onChange={ v => setAttributes({ textPaddingRight: v }) } />
                                    </PanelBody>
                                </div>
                            )

                            // ── Tab Stile ─────────────────────────────────────
                            if ( tab.name === 'style' ) return (
                                <div style={{ padding: '12px' }}>
                                    <PanelBody title={ __('Sfondo','arkimedia') } initialOpen={true}>
                                        <p style={{fontSize:'11px',fontWeight:600,marginBottom:'8px'}}>Colore sfondo</p>
                                        <ColorPicker color={bgColor} onChange={ v => setAttributes({ bgColor: v }) } enableAlpha />
                                    </PanelBody>
                                    <PanelBody title={ __('Bordo','arkimedia') } initialOpen={false}>
                                        <Sp label={ __('Border radius (px)','arkimedia') } value={borderRadius} onChange={ v => setAttributes({ borderRadius: v }) } />
                                    </PanelBody>
                                    <PanelBody title={ __('Box Shadow','arkimedia') } initialOpen={false}>
                                        <ToggleControl label={ __('Abilita shadow','arkimedia') } checked={boxShadow} onChange={ v => setAttributes({ boxShadow: v }) } />
                                        { boxShadow && <>
                                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore shadow</p>
                                            <ColorPicker color={shadowColor} onChange={ v => setAttributes({ shadowColor: v }) } enableAlpha />
                                            <Sp label="Blur"   value={shadowBlur}   onChange={ v => setAttributes({ shadowBlur: v }) }   max={100} />
                                            <Sp label="Spread" value={shadowSpread} onChange={ v => setAttributes({ shadowSpread: v }) } max={50} />
                                        </> }
                                    </PanelBody>
                                    <PanelBody title={ __('Animazione GSAP','arkimedia') } initialOpen={false}>
                                        <SelectControl label={ __('Tipo','arkimedia') } value={animationType}
                                            options={[
                                                { label:'Nessuna',    value:'none' },
                                                { label:'Fade up',    value:'fadeUp' },
                                                { label:'Fade in',    value:'fadeIn' },
                                                { label:'Slide left', value:'slideLeft' },
                                                { label:'Slide right',value:'slideRight' },
                                            ]}
                                            onChange={ v => setAttributes({ animationType: v }) }
                                        />
                                    </PanelBody>
                                </div>
                            )

                            return null
                        }}
                    </TabPanel>
                </InspectorControls>

                {/* Preview editor */}
                <div { ...blockProps }>
                    { imageUrl && (
                        <div style={{ flex: imageFlex, minHeight, position:'relative', overflow:'hidden', flexShrink:0 }}>
                            <img src={imageUrl} alt={imageAlt} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit, objectPosition }} />
                        </div>
                    )}
                    { ! imageUrl && (
                        <div style={{ flex: imageFlex, minHeight, background:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            <span style={{ opacity:0.3, fontSize:'0.875rem' }}>{ __('Seleziona immagine','arkimedia') }</span>
                        </div>
                    )}
                    <div style={{ flex: textFlex, padding:`${ textPaddingTop }px ${ textPaddingRight }px ${ textPaddingBottom }px ${ textPaddingLeft }px`, display:'flex', flexDirection:'column', justifyContent:'center' }}>
                        { title && <h2 style={{ fontSize:titleSize, fontWeight:titleWeight, color:titleColor, lineHeight:titleLineHeight, margin:'0 0 1.25rem' }}>{title}</h2> }
                        { description && <p style={{ fontSize:descSize, color:descColor, lineHeight:1.7, margin:'0 0 2rem' }}>{description}</p> }
                        { ctaLabel && <div><span style={ ctaStyle_computed }>{ctaLabel} →</span></div> }
                    </div>
                </div>
            </>
        )
    },

    save: () => null,
})
