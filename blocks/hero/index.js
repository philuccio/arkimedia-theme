import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor'
import {
    PanelBody, TextControl, TextareaControl, SelectControl,
    RangeControl, ToggleControl, Button, ColorPicker,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import metadata from './block.json'

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

        // Posizione contenuto
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

        // Sfondo preview
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

        const blockProps = useBlockProps({
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

        const Sp = ( { label, value, onChange, max = 200 } ) => (
            <RangeControl label={label} value={value} onChange={onChange} min={0} max={max} step={4} />
        )

        return (
            <>
                <InspectorControls>

                    {/* ── Titolo 1 ── */}
                    <PanelBody title={ __( 'Titolo riga 1', 'arkimedia' ) } initialOpen={true}>
                        <TextControl
                            label={ __('Testo','arkimedia') }
                            value={title}
                            onChange={ v => setAttributes({ title: v }) }
                            placeholder={ __('Prima riga del titolo','arkimedia') }
                        />
                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore</p>
                        <ColorPicker color={title1Color} onChange={ v => setAttributes({ title1Color: v }) } />
                        <TextControl
                            label={ __('Font size (CSS)','arkimedia') }
                            value={title1Size}
                            onChange={ v => setAttributes({ title1Size: v }) }
                            help="Es. clamp(3rem,9vw,8rem) oppure 5rem"
                        />
                        <SelectControl
                            label={ __('Font weight','arkimedia') }
                            value={title1Weight}
                            options={[
                                { label:'Light 300',    value:'300' },
                                { label:'Regular 400',  value:'400' },
                                { label:'Medium 500',   value:'500' },
                                { label:'SemiBold 600', value:'600' },
                                { label:'Bold 700',     value:'700' },
                                { label:'ExtraBold 800',value:'800' },
                                { label:'Black 900',    value:'900' },
                            ]}
                            onChange={ v => setAttributes({ title1Weight: v }) }
                        />
                    </PanelBody>

                    {/* ── Titolo 2 ── */}
                    <PanelBody title={ __( 'Titolo riga 2', 'arkimedia' ) } initialOpen={false}>
                        <TextControl
                            label={ __('Testo','arkimedia') }
                            value={title2}
                            onChange={ v => setAttributes({ title2: v }) }
                            placeholder={ __('Seconda riga (opzionale)','arkimedia') }
                        />
                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore</p>
                        <ColorPicker color={title2Color} onChange={ v => setAttributes({ title2Color: v }) } />
                        <TextControl
                            label={ __('Font size (CSS)','arkimedia') }
                            value={title2Size}
                            onChange={ v => setAttributes({ title2Size: v }) }
                        />
                        <SelectControl
                            label={ __('Font weight','arkimedia') }
                            value={title2Weight}
                            options={[
                                { label:'Light 300',    value:'300' },
                                { label:'Regular 400',  value:'400' },
                                { label:'Medium 500',   value:'500' },
                                { label:'SemiBold 600', value:'600' },
                                { label:'Bold 700',     value:'700' },
                                { label:'ExtraBold 800',value:'800' },
                                { label:'Black 900',    value:'900' },
                            ]}
                            onChange={ v => setAttributes({ title2Weight: v }) }
                        />
                    </PanelBody>

                    {/* ── Sottotitolo ── */}
                    <PanelBody title={ __( 'Sottotitolo', 'arkimedia' ) } initialOpen={false}>
                        <TextareaControl
                            label={ __('Testo','arkimedia') }
                            value={subtitle}
                            onChange={ v => setAttributes({ subtitle: v }) }
                        />
                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore</p>
                        <ColorPicker color={subtitleColor} onChange={ v => setAttributes({ subtitleColor: v }) } enableAlpha />
                        <TextControl
                            label={ __('Font size','arkimedia') }
                            value={subtitleSize}
                            onChange={ v => setAttributes({ subtitleSize: v }) }
                        />
                    </PanelBody>

                    {/* ── Eyebrow ── */}
                    <PanelBody title={ __( 'Eyebrow', 'arkimedia' ) } initialOpen={false}>
                        <TextControl
                            label={ __('Testo','arkimedia') }
                            value={eyebrow}
                            onChange={ v => setAttributes({ eyebrow: v }) }
                        />
                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore</p>
                        <ColorPicker color={eyebrowColor} onChange={ v => setAttributes({ eyebrowColor: v }) } />
                    </PanelBody>

                    {/* ── CTA ── */}
                    <PanelBody title={ __( 'Pulsanti CTA', 'arkimedia' ) } initialOpen={false}>
                        <p style={{fontSize:'11px',fontWeight:600,marginBottom:'8px'}}>CTA Primario</p>
                        <TextControl label={ __('Testo','arkimedia') }  value={ctaLabel} onChange={ v => setAttributes({ ctaLabel: v }) } />
                        <TextControl label={ __('URL','arkimedia') }    value={ctaUrl}   onChange={ v => setAttributes({ ctaUrl: v }) }   type="url" />
                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore sfondo CTA</p>
                        <ColorPicker color={ctaBgColor} onChange={ v => setAttributes({ ctaBgColor: v }) } />
                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore testo CTA</p>
                        <ColorPicker color={ctaTextColor} onChange={ v => setAttributes({ ctaTextColor: v }) } />
                        <p style={{fontSize:'11px',fontWeight:600,margin:'16px 0 8px',borderTop:'1px solid #e0e0e0',paddingTop:'12px'}}>CTA Secondario</p>
                        <TextControl label={ __('Testo','arkimedia') }  value={ctaLabel2} onChange={ v => setAttributes({ ctaLabel2: v }) } />
                        <TextControl label={ __('URL','arkimedia') }    value={ctaUrl2}   onChange={ v => setAttributes({ ctaUrl2: v }) }   type="url" />
                    </PanelBody>

                    {/* ── Sfondo ── */}
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
                                    { label:'Center', value:'center center' },
                                    { label:'Top',    value:'center top' },
                                    { label:'Bottom', value:'center bottom' },
                                    { label:'Left',   value:'left center' },
                                    { label:'Right',  value:'right center' },
                                ]}
                                onChange={ v => setAttributes({ bgPosition: v }) }
                            />
                            <SelectControl label="Attachment" value={bgAttachment}
                                options={[ { label:'Scroll', value:'scroll' }, { label:'Fixed (parallax)', value:'fixed' } ]}
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
                            { gradientType === 'linear' && <RangeControl label="Angolo (°)" value={gradientAngle} onChange={ v => setAttributes({ gradientAngle: v }) } min={0} max={360} /> }
                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore 1</p>
                            <ColorPicker color={gradientColor1} onChange={ v => setAttributes({ gradientColor1: v }) } />
                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore 2</p>
                            <ColorPicker color={gradientColor2} onChange={ v => setAttributes({ gradientColor2: v }) } />
                        </> }

                        <p style={{fontSize:'11px',fontWeight:600,margin:'16px 0 8px'}}>Overlay</p>
                        <ColorPicker color={overlayColor} onChange={ v => setAttributes({ overlayColor: v }) } enableAlpha />
                    </PanelBody>

                    {/* ── Layout ── */}
                    <PanelBody title={ __( 'Layout', 'arkimedia' ) } initialOpen={false}>
                        <SelectControl
                            label={ __('Altezza','arkimedia') }
                            value={minHeight}
                            options={[
                                { label:'100vh', value:'100vh' },
                                { label:'90vh',  value:'90vh' },
                                { label:'80vh',  value:'80vh' },
                                { label:'70vh',  value:'70vh' },
                                { label:'600px', value:'600px' },
                                { label:'500px', value:'500px' },
                            ]}
                            onChange={ v => setAttributes({ minHeight: v }) }
                        />
                        <SelectControl
                            label={ __('Posizione contenuto','arkimedia') }
                            value={contentPosition}
                            options={[
                                { label:'↙ In basso a sinistra',  value:'bottom-left' },
                                { label:'↓ In basso al centro',   value:'bottom-center' },
                                { label:'↘ In basso a destra',    value:'bottom-right' },
                                { label:'← Al centro a sinistra', value:'center-left' },
                                { label:'· Al centro',             value:'center-center' },
                                { label:'→ Al centro a destra',   value:'center-right' },
                                { label:'↖ In alto a sinistra',   value:'top-left' },
                                { label:'↑ In alto al centro',    value:'top-center' },
                                { label:'↗ In alto a destra',     value:'top-right' },
                            ]}
                            onChange={ v => setAttributes({ contentPosition: v }) }
                        />
                    </PanelBody>

                    {/* ── Padding ── */}
                    <PanelBody title={ __( 'Padding contenuto', 'arkimedia' ) } initialOpen={false}>
                        <Sp label="Top"    value={paddingTop}    onChange={ v => setAttributes({ paddingTop: v }) }    max={300} />
                        <Sp label="Bottom" value={paddingBottom} onChange={ v => setAttributes({ paddingBottom: v }) } max={300} />
                        <Sp label="Left"   value={paddingLeft}   onChange={ v => setAttributes({ paddingLeft: v }) } />
                        <Sp label="Right"  value={paddingRight}  onChange={ v => setAttributes({ paddingRight: v }) } />
                    </PanelBody>

                </InspectorControls>

                {/* ── Preview editor ── */}
                <div { ...blockProps }>
                    { overlayColor && (
                        <div style={{ position:'absolute', inset:0, background:overlayColor, zIndex:1, pointerEvents:'none' }} />
                    )}
                    <div style={{
                        position:  'relative',
                        zIndex:    2,
                        width:     '100%',
                        maxWidth:  '1200px',
                        margin:    '0 auto',
                        padding:   `${ paddingTop }px ${ paddingRight }px ${ paddingBottom }px ${ paddingLeft }px`,
                        textAlign: pos.textAlign,
                    }}>
                        { eyebrow && (
                            <p style={{ fontSize:'0.8125rem', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color: eyebrowColor || 'var(--color-accent,#e94560)', marginBottom:'1rem' }}>
                                {eyebrow}
                            </p>
                        )}
                        { title && (
                            <h1 style={{ fontSize:title1Size, fontWeight:title1Weight, color:title1Color, lineHeight:1, letterSpacing:'-0.02em', margin:0 }}>
                                {title}
                            </h1>
                        )}
                        { title2 && (
                            <p style={{ fontSize:title2Size, fontWeight:title2Weight, color:title2Color, lineHeight:1, letterSpacing:'-0.02em', margin:0 }}>
                                {title2}
                            </p>
                        )}
                        { subtitle && (
                            <p style={{ fontSize:subtitleSize, color:subtitleColor, marginTop:'0.75rem', lineHeight:1.6 }}>
                                {subtitle}
                            </p>
                        )}
                        { ( ctaLabel || ctaLabel2 ) && (
                            <div style={{ display:'flex', gap:'1rem', marginTop:'2rem', flexWrap:'wrap', justifyContent: pos.textAlign === 'center' ? 'center' : pos.textAlign === 'right' ? 'flex-end' : 'flex-start' }}>
                                { ctaLabel && (
                                    <span style={{ padding:'0.875rem 2rem', background: ctaBgColor || 'var(--color-accent,#e94560)', color:ctaTextColor, fontWeight:700, borderRadius:'4px', fontSize:'0.9375rem' }}>
                                        {ctaLabel}
                                    </span>
                                )}
                                { ctaLabel2 && (
                                    <span style={{ padding:'0.875rem 2rem', border:'2px solid rgba(255,255,255,0.5)', color:'#ffffff', fontWeight:700, borderRadius:'4px', fontSize:'0.9375rem' }}>
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
