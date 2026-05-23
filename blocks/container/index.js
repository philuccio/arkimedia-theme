import './editor.css';
import { registerBlockType } from '@wordpress/blocks'
import {
    useBlockProps,
    InspectorControls,
    InnerBlocks,
    useInnerBlocksProps,
    MediaUpload,
    MediaUploadCheck,
} from '@wordpress/block-editor'
import {
    PanelBody, SelectControl, RangeControl, ToggleControl,
    TextControl, Button, ColorPicker,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import metadata from './block.json'

function buildStyle( a ) {
    const s = {}
    s.display   = a.display
    s.boxSizing = 'border-box'
    s.position  = 'relative'

    if ( a.display === 'flex' ) {
        s.flexDirection  = a.flexDirection
        s.flexWrap       = a.flexWrap
        s.justifyContent = a.justifyContent
        s.alignItems     = a.alignItems
        if ( a.alignContent !== 'normal' ) s.alignContent = a.alignContent
    }

    if ( a.display === 'grid' ) {
        s.gridTemplateColumns = `repeat(${ a.gridColumns }, 1fr)`
        s.gridAutoFlow        = a.gridAutoFlow
        if ( a.gridRows !== 'auto' ) s.gridTemplateRows = a.gridRows
    }

    if ( a.useCustomGap ) {
        if ( a.columnGap ) s.columnGap = `${ a.columnGap }px`
        if ( a.rowGap )    s.rowGap    = `${ a.rowGap }px`
    } else {
        if ( a.gap ) s.gap = `${ a.gap }px`
    }

    s.width    = a.width
    s.overflow = a.overflow
    if ( a.minHeight ) s.minHeight = a.minHeight
    if ( a.maxWidth )  s.maxWidth  = a.maxWidth
    if ( a.zIndex )    s.zIndex    = a.zIndex

    s.padding = `${ a.paddingTop }px ${ a.paddingRight }px ${ a.paddingBottom }px ${ a.paddingLeft }px`
    s.margin  = `${ a.marginTop } ${ a.marginRight } ${ a.marginBottom } ${ a.marginLeft }`

    // Sfondo
    switch ( a.bgType ) {
        case 'color':
            if ( a.bgColor ) s.background = a.bgColor
            break
        case 'gradient':
            if ( a.gradientType === 'linear' ) {
                s.background = `linear-gradient(${ a.gradientAngle }deg, ${ a.gradientColor1 } ${ a.gradientPos1 }%, ${ a.gradientColor2 } ${ a.gradientPos2 }%)`
            } else {
                s.background = `radial-gradient(circle, ${ a.gradientColor1 } ${ a.gradientPos1 }%, ${ a.gradientColor2 } ${ a.gradientPos2 }%)`
            }
            break
        case 'image':
            if ( a.bgImageUrl ) {
                s.backgroundImage      = `url(${ a.bgImageUrl })`
                s.backgroundSize       = a.bgSize
                s.backgroundPosition   = a.bgPosition
                s.backgroundRepeat     = a.bgRepeat
                s.backgroundAttachment = a.bgAttachment
            }
            break
    }

    // Bordo
    const hasBorder = a.borderTopWidth || a.borderRightWidth || a.borderBottomWidth || a.borderLeftWidth
    if ( hasBorder ) {
        s.borderWidth = `${ a.borderTopWidth }px ${ a.borderRightWidth }px ${ a.borderBottomWidth }px ${ a.borderLeftWidth }px`
        s.borderStyle = a.borderStyle
        s.borderColor = a.borderColor
    }

    const hasRadius = a.borderRadiusTL || a.borderRadiusTR || a.borderRadiusBL || a.borderRadiusBR
    if ( hasRadius ) {
        s.borderRadius = `${ a.borderRadiusTL }px ${ a.borderRadiusTR }px ${ a.borderRadiusBR }px ${ a.borderRadiusBL }px`
    }

    // Box shadow
    if ( a.boxShadow ) {
        const inset = a.shadowInset ? 'inset ' : ''
        s.boxShadow = `${ inset }${ a.shadowOffsetX }px ${ a.shadowOffsetY }px ${ a.shadowBlur }px ${ a.shadowSpread }px ${ a.shadowColor }`
    }

    // Opacity
    if ( a.opacity < 1 ) s.opacity = a.opacity

    // Transform
    const transforms = []
    if ( a.translateX ) transforms.push( `translateX(${ a.translateX }px)` )
    if ( a.translateY ) transforms.push( `translateY(${ a.translateY }px)` )
    if ( a.rotate )     transforms.push( `rotate(${ a.rotate }deg)` )
    if ( a.scale !== 1 ) transforms.push( `scale(${ a.scale })` )
    if ( transforms.length ) s.transform = transforms.join( ' ' )

    return s
}

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const a = attributes
        const containerStyle = buildStyle( a )
        const blockProps = useBlockProps({ style: containerStyle })
        const innerBlocksProps = useInnerBlocksProps(
            { style: containerStyle, className: blockProps.className },
            {
                renderAppender: InnerBlocks.ButtonBlockAppender,
                templateLock:   false,
            }
        )

        const Spacing = ( { label, value, onChange, max = 200 } ) => (
            <RangeControl label={label} value={value} onChange={onChange} min={0} max={max} step={1} />
        )

        return (
            <>
                <InspectorControls>

                    {/* ── Generali ── */}
                    <PanelBody title={ __( 'Generali', 'arkimedia' ) } initialOpen={true}>
                        <SelectControl
                            label={ __( 'Tag HTML', 'arkimedia' ) }
                            value={a.htmlTag}
                            options={[
                                { label: 'div',     value: 'div' },
                                { label: 'section', value: 'section' },
                                { label: 'article', value: 'article' },
                                { label: 'main',    value: 'main' },
                                { label: 'aside',   value: 'aside' },
                                { label: 'header',  value: 'header' },
                                { label: 'footer',  value: 'footer' },
                                { label: 'nav',     value: 'nav' },
                            ]}
                            onChange={ val => setAttributes({ htmlTag: val }) }
                        />
                        <ToggleControl
                            label={ __( 'Primo livello (fullwidth)', 'arkimedia' ) }
                            checked={a.isFirstLevel}
                            onChange={ val => setAttributes({ isFirstLevel: val }) }
                        />
                    </PanelBody>

                    {/* ── Layout ── */}
                    <PanelBody title={ __( 'Layout', 'arkimedia' ) } initialOpen={true}>
                        <ToggleGroupControl label={ __('Display','arkimedia') } value={a.display} onChange={ val => setAttributes({ display: val }) } isBlock>
                            <ToggleGroupControlOption value="flex"  label="Flex" />
                            <ToggleGroupControlOption value="grid"  label="Grid" />
                            <ToggleGroupControlOption value="block" label="Block" />
                        </ToggleGroupControl>

                        { a.display === 'flex' && <>
                            <SelectControl label={ __('Direzione','arkimedia') } value={a.flexDirection}
                                options={[
                                    { label:'Row →', value:'row' },
                                    { label:'Row ←', value:'row-reverse' },
                                    { label:'Column ↓', value:'column' },
                                    { label:'Column ↑', value:'column-reverse' },
                                ]}
                                onChange={ val => setAttributes({ flexDirection: val }) }
                            />
                            <SelectControl label={ __('Flex wrap','arkimedia') } value={a.flexWrap}
                                options={[
                                    { label:'No wrap', value:'nowrap' },
                                    { label:'Wrap', value:'wrap' },
                                    { label:'Wrap reverse', value:'wrap-reverse' },
                                ]}
                                onChange={ val => setAttributes({ flexWrap: val }) }
                            />
                            <SelectControl label={ __('Justify content','arkimedia') } value={a.justifyContent}
                                options={[
                                    { label:'Start', value:'flex-start' },
                                    { label:'Center', value:'center' },
                                    { label:'End', value:'flex-end' },
                                    { label:'Space between', value:'space-between' },
                                    { label:'Space around', value:'space-around' },
                                    { label:'Space evenly', value:'space-evenly' },
                                ]}
                                onChange={ val => setAttributes({ justifyContent: val }) }
                            />
                            <SelectControl label={ __('Align items','arkimedia') } value={a.alignItems}
                                options={[
                                    { label:'Stretch', value:'stretch' },
                                    { label:'Start', value:'flex-start' },
                                    { label:'Center', value:'center' },
                                    { label:'End', value:'flex-end' },
                                    { label:'Baseline', value:'baseline' },
                                ]}
                                onChange={ val => setAttributes({ alignItems: val }) }
                            />
                            <SelectControl label={ __('Align content','arkimedia') } value={a.alignContent}
                                options={[
                                    { label:'Normal', value:'normal' },
                                    { label:'Start', value:'flex-start' },
                                    { label:'Center', value:'center' },
                                    { label:'End', value:'flex-end' },
                                    { label:'Space between', value:'space-between' },
                                    { label:'Space around', value:'space-around' },
                                    { label:'Stretch', value:'stretch' },
                                ]}
                                onChange={ val => setAttributes({ alignContent: val }) }
                            />
                        </> }

                        { a.display === 'grid' && <>
                            <RangeControl label={ __('Colonne','arkimedia') } value={a.gridColumns} onChange={ val => setAttributes({ gridColumns: val }) } min={1} max={12} />
                            <TextControl label={ __('Grid rows','arkimedia') } value={a.gridRows} onChange={ val => setAttributes({ gridRows: val }) } />
                            <SelectControl label={ __('Auto flow','arkimedia') } value={a.gridAutoFlow}
                                options={[
                                    { label:'Row', value:'row' },
                                    { label:'Column', value:'column' },
                                    { label:'Dense', value:'dense' },
                                ]}
                                onChange={ val => setAttributes({ gridAutoFlow: val }) }
                            />
                        </> }

                        <ToggleControl label={ __('Gap separato col/row','arkimedia') } checked={a.useCustomGap} onChange={ val => setAttributes({ useCustomGap: val }) } />
                        { a.useCustomGap ? <>
                            <Spacing label="Column gap (px)" value={a.columnGap} onChange={ val => setAttributes({ columnGap: val }) } />
                            <Spacing label="Row gap (px)"    value={a.rowGap}    onChange={ val => setAttributes({ rowGap: val }) } />
                        </> : <Spacing label="Gap (px)" value={a.gap} onChange={ val => setAttributes({ gap: val }) } /> }
                    </PanelBody>

                    {/* ── Dimensioni ── */}
                    <PanelBody title={ __( 'Dimensioni', 'arkimedia' ) } initialOpen={false}>
                        <TextControl label={ __('Width','arkimedia') }      value={a.width}     onChange={ val => setAttributes({ width: val }) } />
                        <TextControl label={ __('Min height','arkimedia') } value={a.minHeight} onChange={ val => setAttributes({ minHeight: val }) } />
                        <TextControl label={ __('Max width','arkimedia') }  value={a.maxWidth}  onChange={ val => setAttributes({ maxWidth: val }) } />
                        <SelectControl label={ __('Overflow','arkimedia') } value={a.overflow}
                            options={[
                                { label:'Visible', value:'visible' },
                                { label:'Hidden',  value:'hidden' },
                                { label:'Auto',    value:'auto' },
                                { label:'Scroll',  value:'scroll' },
                            ]}
                            onChange={ val => setAttributes({ overflow: val }) }
                        />
                        <TextControl label={ __('Z-index','arkimedia') } value={a.zIndex} onChange={ val => setAttributes({ zIndex: val }) } type="number" />
                    </PanelBody>

                    {/* ── Padding ── */}
                    <PanelBody title={ __( 'Padding', 'arkimedia' ) } initialOpen={false}>
                        <Spacing label="Top"    value={a.paddingTop}    onChange={ val => setAttributes({ paddingTop: val }) } />
                        <Spacing label="Right"  value={a.paddingRight}  onChange={ val => setAttributes({ paddingRight: val }) } />
                        <Spacing label="Bottom" value={a.paddingBottom} onChange={ val => setAttributes({ paddingBottom: val }) } />
                        <Spacing label="Left"   value={a.paddingLeft}   onChange={ val => setAttributes({ paddingLeft: val }) } />
                    </PanelBody>

                    {/* ── Margin ── */}
                    <PanelBody title={ __( 'Margin', 'arkimedia' ) } initialOpen={false}>
                        <TextControl label="Top"    value={a.marginTop}    onChange={ val => setAttributes({ marginTop: val }) }    placeholder="0 / auto" />
                        <TextControl label="Right"  value={a.marginRight}  onChange={ val => setAttributes({ marginRight: val }) }  placeholder="0 / auto" />
                        <TextControl label="Bottom" value={a.marginBottom} onChange={ val => setAttributes({ marginBottom: val }) } placeholder="0 / auto" />
                        <TextControl label="Left"   value={a.marginLeft}   onChange={ val => setAttributes({ marginLeft: val }) }   placeholder="0 / auto" />
                    </PanelBody>

                    {/* ── Sfondo ── */}
                    <PanelBody title={ __( 'Sfondo', 'arkimedia' ) } initialOpen={false}>
                        <ToggleGroupControl label={ __('Tipo sfondo','arkimedia') } value={a.bgType} onChange={ val => setAttributes({ bgType: val }) } isBlock>
                            <ToggleGroupControlOption value="none"     label="Nessuno" />
                            <ToggleGroupControlOption value="color"    label="Colore" />
                            <ToggleGroupControlOption value="gradient" label="Gradiente" />
                            <ToggleGroupControlOption value="image"    label="Immagine" />
                        </ToggleGroupControl>

                        { a.bgType === 'color' && <>
                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>{ __('Colore','arkimedia') }</p>
                            <ColorPicker color={a.bgColor} onChange={ val => setAttributes({ bgColor: val }) } enableAlpha />
                        </> }

                        { a.bgType === 'gradient' && <>
                            <SelectControl label={ __('Tipo gradiente','arkimedia') } value={a.gradientType}
                                options={[ { label:'Lineare', value:'linear' }, { label:'Radiale', value:'radial' } ]}
                                onChange={ val => setAttributes({ gradientType: val }) }
                            />
                            { a.gradientType === 'linear' &&
                                <RangeControl label={ __('Angolo (°)','arkimedia') } value={a.gradientAngle} onChange={ val => setAttributes({ gradientAngle: val }) } min={0} max={360} />
                            }
                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>{ __('Colore 1','arkimedia') }</p>
                            <ColorPicker color={a.gradientColor1} onChange={ val => setAttributes({ gradientColor1: val }) } />
                            <RangeControl label={ __('Posizione 1 (%)','arkimedia') } value={a.gradientPos1} onChange={ val => setAttributes({ gradientPos1: val }) } min={0} max={100} />
                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>{ __('Colore 2','arkimedia') }</p>
                            <ColorPicker color={a.gradientColor2} onChange={ val => setAttributes({ gradientColor2: val }) } />
                            <RangeControl label={ __('Posizione 2 (%)','arkimedia') } value={a.gradientPos2} onChange={ val => setAttributes({ gradientPos2: val }) } min={0} max={100} />
                        </> }

                        { a.bgType === 'image' && <>
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={ media => setAttributes({ bgImageUrl: media.url, bgImageAlt: media.alt || '' }) }
                                    allowedTypes={['image']}
                                    value={a.bgImageUrl}
                                    render={ ({ open }) => <>
                                        { a.bgImageUrl && <img src={a.bgImageUrl} style={{ width:'100%', height:'80px', objectFit:'cover', borderRadius:'4px', marginBottom:'8px' }} /> }
                                        <Button onClick={open} variant={ a.bgImageUrl ? 'secondary' : 'primary' } style={{ width:'100%', justifyContent:'center' }}>
                                            { a.bgImageUrl ? __('Cambia immagine','arkimedia') : __('Seleziona immagine','arkimedia') }
                                        </Button>
                                        { a.bgImageUrl && <Button onClick={ () => setAttributes({ bgImageUrl: '', bgImageAlt: '' }) } variant="tertiary" isDestructive style={{ width:'100%', justifyContent:'center', marginTop:'4px' }}>
                                            { __('Rimuovi','arkimedia') }
                                        </Button> }
                                    </> }
                                />
                            </MediaUploadCheck>
                            <SelectControl label={ __('Size','arkimedia') } value={a.bgSize}
                                options={[
                                    { label:'Cover',   value:'cover' },
                                    { label:'Contain', value:'contain' },
                                    { label:'Auto',    value:'auto' },
                                    { label:'100%',    value:'100%' },
                                ]}
                                onChange={ val => setAttributes({ bgSize: val }) }
                            />
                            <SelectControl label={ __('Position','arkimedia') } value={a.bgPosition}
                                options={[
                                    { label:'Center', value:'center center' },
                                    { label:'Top',    value:'center top' },
                                    { label:'Bottom', value:'center bottom' },
                                    { label:'Left',   value:'left center' },
                                    { label:'Right',  value:'right center' },
                                ]}
                                onChange={ val => setAttributes({ bgPosition: val }) }
                            />
                            <SelectControl label={ __('Repeat','arkimedia') } value={a.bgRepeat}
                                options={[
                                    { label:'No repeat', value:'no-repeat' },
                                    { label:'Repeat',    value:'repeat' },
                                    { label:'Repeat X',  value:'repeat-x' },
                                    { label:'Repeat Y',  value:'repeat-y' },
                                ]}
                                onChange={ val => setAttributes({ bgRepeat: val }) }
                            />
                            <SelectControl label={ __('Attachment','arkimedia') } value={a.bgAttachment}
                                options={[
                                    { label:'Scroll', value:'scroll' },
                                    { label:'Fixed (parallax)', value:'fixed' },
                                ]}
                                onChange={ val => setAttributes({ bgAttachment: val }) }
                            />
                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>{ __('Overlay colore','arkimedia') }</p>
                            <ColorPicker color={a.overlayColor} onChange={ val => setAttributes({ overlayColor: val }) } enableAlpha />
                            <SelectControl label={ __('Overlay blend mode','arkimedia') } value={a.overlayBlendMode}
                                options={[
                                    { label:'Normal',     value:'normal' },
                                    { label:'Multiply',   value:'multiply' },
                                    { label:'Screen',     value:'screen' },
                                    { label:'Overlay',    value:'overlay' },
                                    { label:'Darken',     value:'darken' },
                                    { label:'Lighten',    value:'lighten' },
                                    { label:'Color dodge', value:'color-dodge' },
                                    { label:'Color burn',  value:'color-burn' },
                                ]}
                                onChange={ val => setAttributes({ overlayBlendMode: val }) }
                            />
                        </> }
                    </PanelBody>

                    {/* ── Bordo ── */}
                    <PanelBody title={ __( 'Bordo', 'arkimedia' ) } initialOpen={false}>
                        <p style={{fontSize:'11px',fontWeight:600,marginBottom:'8px'}}>{ __('Spessore (px)','arkimedia') }</p>
                        <Spacing label="Top"    value={a.borderTopWidth}    onChange={ val => setAttributes({ borderTopWidth: val }) } max={20} />
                        <Spacing label="Right"  value={a.borderRightWidth}  onChange={ val => setAttributes({ borderRightWidth: val }) } max={20} />
                        <Spacing label="Bottom" value={a.borderBottomWidth} onChange={ val => setAttributes({ borderBottomWidth: val }) } max={20} />
                        <Spacing label="Left"   value={a.borderLeftWidth}   onChange={ val => setAttributes({ borderLeftWidth: val }) } max={20} />
                        <SelectControl label={ __('Stile','arkimedia') } value={a.borderStyle}
                            options={[
                                { label:'Solid',  value:'solid' },
                                { label:'Dashed', value:'dashed' },
                                { label:'Dotted', value:'dotted' },
                                { label:'Double', value:'double' },
                            ]}
                            onChange={ val => setAttributes({ borderStyle: val }) }
                        />
                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>{ __('Colore bordo','arkimedia') }</p>
                        <ColorPicker color={a.borderColor} onChange={ val => setAttributes({ borderColor: val }) } enableAlpha />
                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>{ __('Border radius (px)','arkimedia') }</p>
                        <Spacing label="Top Left"     value={a.borderRadiusTL} onChange={ val => setAttributes({ borderRadiusTL: val }) } />
                        <Spacing label="Top Right"    value={a.borderRadiusTR} onChange={ val => setAttributes({ borderRadiusTR: val }) } />
                        <Spacing label="Bottom Right" value={a.borderRadiusBR} onChange={ val => setAttributes({ borderRadiusBR: val }) } />
                        <Spacing label="Bottom Left"  value={a.borderRadiusBL} onChange={ val => setAttributes({ borderRadiusBL: val }) } />
                    </PanelBody>

                    {/* ── Effetti ── */}
                    <PanelBody title={ __( 'Effetti', 'arkimedia' ) } initialOpen={false}>
                        <RangeControl label={ __('Opacità','arkimedia') } value={a.opacity} onChange={ val => setAttributes({ opacity: val }) } min={0} max={1} step={0.05} />
                        <ToggleControl label={ __('Box shadow','arkimedia') } checked={a.boxShadow} onChange={ val => setAttributes({ boxShadow: val }) } />
                        { a.boxShadow && <>
                            <RangeControl label="Offset X (px)" value={a.shadowOffsetX} onChange={ val => setAttributes({ shadowOffsetX: val }) } min={-50} max={50} />
                            <RangeControl label="Offset Y (px)" value={a.shadowOffsetY} onChange={ val => setAttributes({ shadowOffsetY: val }) } min={-50} max={50} />
                            <RangeControl label="Blur (px)"     value={a.shadowBlur}    onChange={ val => setAttributes({ shadowBlur: val }) }    min={0} max={100} />
                            <RangeControl label="Spread (px)"   value={a.shadowSpread}  onChange={ val => setAttributes({ shadowSpread: val }) }  min={-50} max={50} />
                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>{ __('Colore shadow','arkimedia') }</p>
                            <ColorPicker color={a.shadowColor} onChange={ val => setAttributes({ shadowColor: val }) } enableAlpha />
                            <ToggleControl label={ __('Inset','arkimedia') } checked={a.shadowInset} onChange={ val => setAttributes({ shadowInset: val }) } />
                        </> }
                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>{ __('Transform','arkimedia') }</p>
                        <RangeControl label="Translate X (px)" value={a.translateX} onChange={ val => setAttributes({ translateX: val }) } min={-200} max={200} />
                        <RangeControl label="Translate Y (px)" value={a.translateY} onChange={ val => setAttributes({ translateY: val }) } min={-200} max={200} />
                        <RangeControl label="Rotate (deg)"     value={a.rotate}     onChange={ val => setAttributes({ rotate: val }) }     min={-180} max={180} />
                        <RangeControl label="Scale"            value={a.scale}      onChange={ val => setAttributes({ scale: val }) }      min={0.1} max={3} step={0.05} />
                    </PanelBody>

                    {/* ── Animazioni ── */}
                    <PanelBody title={ __( 'Animazioni GSAP', 'arkimedia' ) } initialOpen={false}>
                        <SelectControl label={ __('Tipo animazione','arkimedia') } value={a.animationType}
                            options={[
                                { label:'Nessuna',     value:'none' },
                                { label:'Fade up',     value:'fadeUp' },
                                { label:'Fade in',     value:'fadeIn' },
                                { label:'Slide left',  value:'slideLeft' },
                                { label:'Slide right', value:'slideRight' },
                                { label:'Scale up',    value:'scaleUp' },
                                { label:'Flip',        value:'flip' },
                            ]}
                            onChange={ val => setAttributes({ animationType: val }) }
                        />
                        { a.animationType !== 'none' && <>
                            <SelectControl label={ __('Trigger','arkimedia') } value={a.animationTrigger}
                                options={[
                                    { label:'On scroll', value:'onScroll' },
                                    { label:'On load',   value:'onLoad' },
                                ]}
                                onChange={ val => setAttributes({ animationTrigger: val }) }
                            />
                            <RangeControl label={ __('Durata (ms)','arkimedia') }  value={a.animationDuration} onChange={ val => setAttributes({ animationDuration: val }) } min={100} max={3000} step={50} />
                            <RangeControl label={ __('Delay (ms)','arkimedia') }   value={a.animationDelay}    onChange={ val => setAttributes({ animationDelay: val }) }    min={0} max={2000} step={50} />
                            <ToggleControl label={ __('Scrub (parallax)','arkimedia') } checked={a.animationScrub} onChange={ val => setAttributes({ animationScrub: val }) } />
                        </> }
                    </PanelBody>

                    {/* ── Responsive Tablet ── */}
                    <PanelBody title={ __( 'Responsive — Tablet (≤1024px)', 'arkimedia' ) } initialOpen={false}>
                        <SelectControl label={ __('Display','arkimedia') } value={a.mdDisplay}
                            options={[ { label:'Eredita', value:'' }, { label:'Flex', value:'flex' }, { label:'Grid', value:'grid' }, { label:'Block', value:'block' }, { label:'None', value:'none' } ]}
                            onChange={ val => setAttributes({ mdDisplay: val }) }
                        />
                        <SelectControl label={ __('Direzione flex','arkimedia') } value={a.mdFlexDirection}
                            options={[ { label:'Eredita', value:'' }, { label:'Row', value:'row' }, { label:'Column', value:'column' } ]}
                            onChange={ val => setAttributes({ mdFlexDirection: val }) }
                        />
                        <SelectControl label={ __('Justify content','arkimedia') } value={a.mdJustify}
                            options={[ { label:'Eredita', value:'' }, { label:'Start', value:'flex-start' }, { label:'Center', value:'center' }, { label:'End', value:'flex-end' }, { label:'Space between', value:'space-between' } ]}
                            onChange={ val => setAttributes({ mdJustify: val }) }
                        />
                        <SelectControl label={ __('Align items','arkimedia') } value={a.mdAlignItems}
                            options={[ { label:'Eredita', value:'' }, { label:'Stretch', value:'stretch' }, { label:'Start', value:'flex-start' }, { label:'Center', value:'center' }, { label:'End', value:'flex-end' } ]}
                            onChange={ val => setAttributes({ mdAlignItems: val }) }
                        />
                        <Spacing label="Gap (px)" value={a.mdGap} onChange={ val => setAttributes({ mdGap: val }) } />
                        <RangeControl label={ __('Colonne grid','arkimedia') } value={a.mdGridColumns} onChange={ val => setAttributes({ mdGridColumns: val }) } min={0} max={12} />
                    </PanelBody>

                    {/* ── Responsive Mobile ── */}
                    <PanelBody title={ __( 'Responsive — Mobile (≤640px)', 'arkimedia' ) } initialOpen={false}>
                        <SelectControl label={ __('Display','arkimedia') } value={a.smDisplay}
                            options={[ { label:'Eredita', value:'' }, { label:'Flex', value:'flex' }, { label:'Grid', value:'grid' }, { label:'Block', value:'block' }, { label:'None', value:'none' } ]}
                            onChange={ val => setAttributes({ smDisplay: val }) }
                        />
                        <SelectControl label={ __('Direzione flex','arkimedia') } value={a.smFlexDirection}
                            options={[ { label:'Eredita', value:'' }, { label:'Row', value:'row' }, { label:'Column', value:'column' } ]}
                            onChange={ val => setAttributes({ smFlexDirection: val }) }
                        />
                        <SelectControl label={ __('Justify content','arkimedia') } value={a.smJustify}
                            options={[ { label:'Eredita', value:'' }, { label:'Start', value:'flex-start' }, { label:'Center', value:'center' }, { label:'End', value:'flex-end' }, { label:'Space between', value:'space-between' } ]}
                            onChange={ val => setAttributes({ smJustify: val }) }
                        />
                        <SelectControl label={ __('Align items','arkimedia') } value={a.smAlignItems}
                            options={[ { label:'Eredita', value:'' }, { label:'Stretch', value:'stretch' }, { label:'Start', value:'flex-start' }, { label:'Center', value:'center' }, { label:'End', value:'flex-end' } ]}
                            onChange={ val => setAttributes({ smAlignItems: val }) }
                        />
                        <Spacing label="Gap (px)" value={a.smGap} onChange={ val => setAttributes({ smGap: val }) } />
                        <RangeControl label={ __('Colonne grid','arkimedia') } value={a.smGridColumns} onChange={ val => setAttributes({ smGridColumns: val }) } min={0} max={12} />
                    </PanelBody>

                </InspectorControls>

                <div { ...innerBlocksProps } />
            </>
        )
    },

    save( { attributes } ) {
        const blockProps = useBlockProps.save()
        return (
            <div { ...blockProps }>
                <InnerBlocks.Content />
            </div>
        )
    },
})
