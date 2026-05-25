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
import './editor.css'

function buildStyle( a ) {
    const s = { boxSizing: 'border-box', position: 'relative' }

    s.display = a.display

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
        s.gap = `${ a.gap }px`
    }

    s.width   = a.isFullwidth ? '100vw' : a.width
    s.overflow = a.overflow
    if ( a.minHeight ) s.minHeight = a.minHeight
    if ( a.maxWidth )  s.maxWidth  = a.maxWidth
    if ( a.zIndex )    s.zIndex    = a.zIndex

    s.padding      = `${ a.paddingTop }px ${ a.paddingRight }px ${ a.paddingBottom }px ${ a.paddingLeft }px`
    s.marginTop    = a.marginTop
    s.marginRight  = a.isFullwidth ? 'auto' : a.marginRight
    s.marginBottom = a.marginBottom
    s.marginLeft   = a.isFullwidth ? 'auto' : a.marginLeft

    if ( a.isFullwidth ) {
        s.marginLeft  = 'calc(50% - 50vw)'
        s.marginRight = 'calc(50% - 50vw)'
    }

    // Sfondo
    switch ( a.bgType ) {
        case 'color':
            if ( a.bgColor ) s.background = a.bgColor
            break
        case 'gradient':
            s.background = a.gradientType === 'linear'
                ? `linear-gradient(${ a.gradientAngle }deg, ${ a.gradientColor1 } ${ a.gradientPos1 }%, ${ a.gradientColor2 } ${ a.gradientPos2 }%)`
                : `radial-gradient(circle, ${ a.gradientColor1 } ${ a.gradientPos1 }%, ${ a.gradientColor2 } ${ a.gradientPos2 }%)`
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

    // Shadow
    if ( a.boxShadow ) {
        const inset = a.shadowInset ? 'inset ' : ''
        s.boxShadow = `${ inset }${ a.shadowOffsetX }px ${ a.shadowOffsetY }px ${ a.shadowBlur }px ${ a.shadowSpread }px ${ a.shadowColor }`
    }

    if ( a.opacity < 1 ) s.opacity = a.opacity

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
        const rowStyle = buildStyle( a )

        const blockProps = useBlockProps({ style: rowStyle, className: 'ark-row' + ( a.isFullwidth ? ' ark-row--fullwidth' : '' ) })

        const innerBlocksProps = useInnerBlocksProps( blockProps, {
            renderAppender: InnerBlocks.ButtonBlockAppender,
            templateLock:   false,
        })

        const Sp = ( { label, value, onChange, max = 200 } ) => (
            <RangeControl label={label} value={value} onChange={onChange} min={0} max={max} step={1} />
        )

        return (
            <>
                <InspectorControls>

                    {/* Generali */}
                    <PanelBody title={ __( 'Generali', 'arkimedia' ) } initialOpen={true}>
                        <SelectControl label={ __('Tag HTML','arkimedia') } value={a.htmlTag}
                            options={[
                                { label:'div',     value:'div' },
                                { label:'section', value:'section' },
                                { label:'article', value:'article' },
                                { label:'main',    value:'main' },
                                { label:'aside',   value:'aside' },
                                { label:'header',  value:'header' },
                                { label:'footer',  value:'footer' },
                                { label:'nav',     value:'nav' },
                            ]}
                            onChange={ v => setAttributes({ htmlTag: v }) }
                        />
                        <ToggleControl
                            label={ __('Fullwidth (100vw)','arkimedia') }
                            checked={a.isFullwidth}
                            onChange={ v => setAttributes({ isFullwidth: v }) }
                        />
                    </PanelBody>

                    {/* Layout */}
                    <PanelBody title={ __( 'Layout', 'arkimedia' ) } initialOpen={true}>
                        <ToggleGroupControl label={ __('Display','arkimedia') } value={a.display} onChange={ v => setAttributes({ display: v }) } isBlock>
                            <ToggleGroupControlOption value="flex"  label="Flex" />
                            <ToggleGroupControlOption value="grid"  label="Grid" />
                            <ToggleGroupControlOption value="block" label="Block" />
                        </ToggleGroupControl>

                        { a.display === 'flex' && <>
                            <SelectControl label={ __('Direzione','arkimedia') } value={a.flexDirection}
                                options={[
                                    { label:'Row →',    value:'row' },
                                    { label:'Row ←',    value:'row-reverse' },
                                    { label:'Column ↓', value:'column' },
                                    { label:'Column ↑', value:'column-reverse' },
                                ]}
                                onChange={ v => setAttributes({ flexDirection: v }) }
                            />
                            <SelectControl label={ __('Flex wrap','arkimedia') } value={a.flexWrap}
                                options={[
                                    { label:'Wrap',    value:'wrap' },
                                    { label:'No wrap', value:'nowrap' },
                                    { label:'Wrap ↑',  value:'wrap-reverse' },
                                ]}
                                onChange={ v => setAttributes({ flexWrap: v }) }
                            />
                            <SelectControl label={ __('Justify content','arkimedia') } value={a.justifyContent}
                                options={[
                                    { label:'Start',         value:'flex-start' },
                                    { label:'Center',        value:'center' },
                                    { label:'End',           value:'flex-end' },
                                    { label:'Space between', value:'space-between' },
                                    { label:'Space around',  value:'space-around' },
                                    { label:'Space evenly',  value:'space-evenly' },
                                ]}
                                onChange={ v => setAttributes({ justifyContent: v }) }
                            />
                            <SelectControl label={ __('Align items','arkimedia') } value={a.alignItems}
                                options={[
                                    { label:'Stretch',  value:'stretch' },
                                    { label:'Start',    value:'flex-start' },
                                    { label:'Center',   value:'center' },
                                    { label:'End',      value:'flex-end' },
                                    { label:'Baseline', value:'baseline' },
                                ]}
                                onChange={ v => setAttributes({ alignItems: v }) }
                            />
                            <SelectControl label={ __('Align content','arkimedia') } value={a.alignContent}
                                options={[
                                    { label:'Normal',        value:'normal' },
                                    { label:'Start',         value:'flex-start' },
                                    { label:'Center',        value:'center' },
                                    { label:'End',           value:'flex-end' },
                                    { label:'Space between', value:'space-between' },
                                    { label:'Space around',  value:'space-around' },
                                    { label:'Stretch',       value:'stretch' },
                                ]}
                                onChange={ v => setAttributes({ alignContent: v }) }
                            />
                        </> }

                        { a.display === 'grid' && <>
                            <RangeControl label={ __('Colonne','arkimedia') } value={a.gridColumns} onChange={ v => setAttributes({ gridColumns: v }) } min={1} max={12} />
                            <TextControl  label={ __('Grid rows','arkimedia') } value={a.gridRows} onChange={ v => setAttributes({ gridRows: v }) } />
                            <SelectControl label={ __('Auto flow','arkimedia') } value={a.gridAutoFlow}
                                options={[
                                    { label:'Row',    value:'row' },
                                    { label:'Column', value:'column' },
                                    { label:'Dense',  value:'dense' },
                                ]}
                                onChange={ v => setAttributes({ gridAutoFlow: v }) }
                            />
                        </> }

                        <ToggleControl label={ __('Gap colonna/riga separati','arkimedia') } checked={a.useCustomGap} onChange={ v => setAttributes({ useCustomGap: v }) } />
                        { a.useCustomGap ? <>
                            <Sp label="Column gap (px)" value={a.columnGap} onChange={ v => setAttributes({ columnGap: v }) } max={100} />
                            <Sp label="Row gap (px)"    value={a.rowGap}    onChange={ v => setAttributes({ rowGap: v }) }    max={100} />
                        </> : <Sp label="Gap (px)" value={a.gap} onChange={ v => setAttributes({ gap: v }) } max={100} /> }
                    </PanelBody>

                    {/* Dimensioni */}
                    <PanelBody title={ __( 'Dimensioni', 'arkimedia' ) } initialOpen={false}>
                        { ! a.isFullwidth && <TextControl label={ __('Width','arkimedia') } value={a.width} onChange={ v => setAttributes({ width: v }) } /> }
                        <TextControl label={ __('Min height','arkimedia') } value={a.minHeight}  onChange={ v => setAttributes({ minHeight: v }) }  placeholder="es. 400px" />
                        <TextControl label={ __('Max width','arkimedia') }  value={a.maxWidth}   onChange={ v => setAttributes({ maxWidth: v }) }   placeholder="es. 1200px" />
                        <SelectControl label={ __('Overflow','arkimedia') } value={a.overflow}
                            options={[
                                { label:'Visible', value:'visible' },
                                { label:'Hidden',  value:'hidden' },
                                { label:'Auto',    value:'auto' },
                            ]}
                            onChange={ v => setAttributes({ overflow: v }) }
                        />
                        <TextControl label={ __('Z-index','arkimedia') } value={a.zIndex} onChange={ v => setAttributes({ zIndex: v }) } type="number" />
                    </PanelBody>

                    {/* Padding */}
                    <PanelBody title={ __( 'Padding', 'arkimedia' ) } initialOpen={false}>
                        <Sp label="Top"    value={a.paddingTop}    onChange={ v => setAttributes({ paddingTop: v }) } />
                        <Sp label="Right"  value={a.paddingRight}  onChange={ v => setAttributes({ paddingRight: v }) } />
                        <Sp label="Bottom" value={a.paddingBottom} onChange={ v => setAttributes({ paddingBottom: v }) } />
                        <Sp label="Left"   value={a.paddingLeft}   onChange={ v => setAttributes({ paddingLeft: v }) } />
                    </PanelBody>

                    {/* Margin */}
                    <PanelBody title={ __( 'Margin', 'arkimedia' ) } initialOpen={false}>
                        <TextControl label="Top"    value={a.marginTop}    onChange={ v => setAttributes({ marginTop: v }) }    placeholder="0 / auto" />
                        <TextControl label="Right"  value={a.marginRight}  onChange={ v => setAttributes({ marginRight: v }) }  placeholder="0 / auto" />
                        <TextControl label="Bottom" value={a.marginBottom} onChange={ v => setAttributes({ marginBottom: v }) } placeholder="0 / auto" />
                        <TextControl label="Left"   value={a.marginLeft}   onChange={ v => setAttributes({ marginLeft: v }) }   placeholder="0 / auto" />
                    </PanelBody>

                    {/* Sfondo */}
                    <PanelBody title={ __( 'Sfondo', 'arkimedia' ) } initialOpen={false}>
                        <ToggleGroupControl label={ __('Tipo','arkimedia') } value={a.bgType} onChange={ v => setAttributes({ bgType: v }) } isBlock>
                            <ToggleGroupControlOption value="none"     label="Nessuno" />
                            <ToggleGroupControlOption value="color"    label="Colore" />
                            <ToggleGroupControlOption value="gradient" label="Gradiente" />
                            <ToggleGroupControlOption value="image"    label="Immagine" />
                        </ToggleGroupControl>

                        { a.bgType === 'color' && <>
                            <p style={{fontSize:'11px',fontWeight:600,marginBottom:'8px'}}>Colore</p>
                            <ColorPicker color={a.bgColor} onChange={ v => setAttributes({ bgColor: v }) } enableAlpha />
                        </> }

                        { a.bgType === 'gradient' && <>
                            <SelectControl label="Tipo" value={a.gradientType}
                                options={[ { label:'Lineare', value:'linear' }, { label:'Radiale', value:'radial' } ]}
                                onChange={ v => setAttributes({ gradientType: v }) }
                            />
                            { a.gradientType === 'linear' && <RangeControl label="Angolo (°)" value={a.gradientAngle} onChange={ v => setAttributes({ gradientAngle: v }) } min={0} max={360} /> }
                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore 1</p>
                            <ColorPicker color={a.gradientColor1} onChange={ v => setAttributes({ gradientColor1: v }) } />
                            <RangeControl label="Posizione 1 (%)" value={a.gradientPos1} onChange={ v => setAttributes({ gradientPos1: v }) } min={0} max={100} />
                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore 2</p>
                            <ColorPicker color={a.gradientColor2} onChange={ v => setAttributes({ gradientColor2: v }) } />
                            <RangeControl label="Posizione 2 (%)" value={a.gradientPos2} onChange={ v => setAttributes({ gradientPos2: v }) } min={0} max={100} />
                        </> }

                        { a.bgType === 'image' && <>
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={ m => setAttributes({ bgImageUrl: m.url, bgImageAlt: m.alt || '' }) }
                                    allowedTypes={['image']}
                                    value={a.bgImageUrl}
                                    render={ ({ open }) => <>
                                        { a.bgImageUrl && <img src={a.bgImageUrl} style={{ width:'100%', height:'80px', objectFit:'cover', borderRadius:'4px', marginBottom:'8px' }} /> }
                                        <Button onClick={open} variant={ a.bgImageUrl ? 'secondary' : 'primary' } style={{ width:'100%', justifyContent:'center' }}>
                                            { a.bgImageUrl ? __('Cambia','arkimedia') : __('Seleziona immagine','arkimedia') }
                                        </Button>
                                        { a.bgImageUrl && <Button onClick={ () => setAttributes({ bgImageUrl:'', bgImageAlt:'' }) } variant="tertiary" isDestructive style={{ width:'100%', justifyContent:'center', marginTop:'4px' }}>{ __('Rimuovi','arkimedia') }</Button> }
                                    </> }
                                />
                            </MediaUploadCheck>
                            <SelectControl label="Size" value={a.bgSize}
                                options={[ { label:'Cover', value:'cover' }, { label:'Contain', value:'contain' }, { label:'Auto', value:'auto' } ]}
                                onChange={ v => setAttributes({ bgSize: v }) }
                            />
                            <SelectControl label="Position" value={a.bgPosition}
                                options={[
                                    { label:'Center', value:'center center' },
                                    { label:'Top',    value:'center top' },
                                    { label:'Bottom', value:'center bottom' },
                                    { label:'Left',   value:'left center' },
                                    { label:'Right',  value:'right center' },
                                ]}
                                onChange={ v => setAttributes({ bgPosition: v }) }
                            />
                            <SelectControl label="Attachment" value={a.bgAttachment}
                                options={[ { label:'Scroll', value:'scroll' }, { label:'Fixed (parallax)', value:'fixed' } ]}
                                onChange={ v => setAttributes({ bgAttachment: v }) }
                            />
                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Overlay</p>
                            <ColorPicker color={a.overlayColor} onChange={ v => setAttributes({ overlayColor: v }) } enableAlpha />
                        </> }
                    </PanelBody>

                    {/* Bordo */}
                    <PanelBody title={ __( 'Bordo', 'arkimedia' ) } initialOpen={false}>
                        <p style={{fontSize:'11px',fontWeight:600,marginBottom:'8px'}}>Spessore (px)</p>
                        <Sp label="Top"    value={a.borderTopWidth}    onChange={ v => setAttributes({ borderTopWidth: v }) }    max={20} />
                        <Sp label="Right"  value={a.borderRightWidth}  onChange={ v => setAttributes({ borderRightWidth: v }) }  max={20} />
                        <Sp label="Bottom" value={a.borderBottomWidth} onChange={ v => setAttributes({ borderBottomWidth: v }) } max={20} />
                        <Sp label="Left"   value={a.borderLeftWidth}   onChange={ v => setAttributes({ borderLeftWidth: v }) }   max={20} />
                        <SelectControl label="Stile" value={a.borderStyle}
                            options={[
                                { label:'Solid',  value:'solid' },
                                { label:'Dashed', value:'dashed' },
                                { label:'Dotted', value:'dotted' },
                                { label:'Double', value:'double' },
                            ]}
                            onChange={ v => setAttributes({ borderStyle: v }) }
                        />
                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore bordo</p>
                        <ColorPicker color={a.borderColor} onChange={ v => setAttributes({ borderColor: v }) } enableAlpha />
                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Border radius (px)</p>
                        <Sp label="Top Left"     value={a.borderRadiusTL} onChange={ v => setAttributes({ borderRadiusTL: v }) } />
                        <Sp label="Top Right"    value={a.borderRadiusTR} onChange={ v => setAttributes({ borderRadiusTR: v }) } />
                        <Sp label="Bottom Right" value={a.borderRadiusBR} onChange={ v => setAttributes({ borderRadiusBR: v }) } />
                        <Sp label="Bottom Left"  value={a.borderRadiusBL} onChange={ v => setAttributes({ borderRadiusBL: v }) } />
                    </PanelBody>

                    {/* Effetti */}
                    <PanelBody title={ __( 'Effetti', 'arkimedia' ) } initialOpen={false}>
                        <RangeControl label={ __('Opacità','arkimedia') } value={a.opacity} onChange={ v => setAttributes({ opacity: v }) } min={0} max={1} step={0.05} />
                        <ToggleControl label={ __('Box shadow','arkimedia') } checked={a.boxShadow} onChange={ v => setAttributes({ boxShadow: v }) } />
                        { a.boxShadow && <>
                            <RangeControl label="Offset X" value={a.shadowOffsetX} onChange={ v => setAttributes({ shadowOffsetX: v }) } min={-50} max={50} />
                            <RangeControl label="Offset Y" value={a.shadowOffsetY} onChange={ v => setAttributes({ shadowOffsetY: v }) } min={-50} max={50} />
                            <RangeControl label="Blur"     value={a.shadowBlur}    onChange={ v => setAttributes({ shadowBlur: v }) }    min={0} max={100} />
                            <RangeControl label="Spread"   value={a.shadowSpread}  onChange={ v => setAttributes({ shadowSpread: v }) }  min={-50} max={50} />
                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Colore shadow</p>
                            <ColorPicker color={a.shadowColor} onChange={ v => setAttributes({ shadowColor: v }) } enableAlpha />
                            <ToggleControl label="Inset" checked={a.shadowInset} onChange={ v => setAttributes({ shadowInset: v }) } />
                        </> }
                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Transform</p>
                        <RangeControl label="Translate X (px)" value={a.translateX} onChange={ v => setAttributes({ translateX: v }) } min={-200} max={200} />
                        <RangeControl label="Translate Y (px)" value={a.translateY} onChange={ v => setAttributes({ translateY: v }) } min={-200} max={200} />
                        <RangeControl label="Rotate (deg)"     value={a.rotate}     onChange={ v => setAttributes({ rotate: v }) }     min={-180} max={180} />
                        <RangeControl label="Scale"            value={a.scale}      onChange={ v => setAttributes({ scale: v }) }      min={0.1} max={3} step={0.05} />
                    </PanelBody>

                    {/* Animazioni */}
                    <PanelBody title={ __( 'Animazioni GSAP', 'arkimedia' ) } initialOpen={false}>
                        <SelectControl label={ __('Tipo','arkimedia') } value={a.animationType}
                            options={[
                                { label:'Nessuna',     value:'none' },
                                { label:'Fade up',     value:'fadeUp' },
                                { label:'Fade in',     value:'fadeIn' },
                                { label:'Slide left',  value:'slideLeft' },
                                { label:'Slide right', value:'slideRight' },
                                { label:'Scale up',    value:'scaleUp' },
                                { label:'Flip',        value:'flip' },
                            ]}
                            onChange={ v => setAttributes({ animationType: v }) }
                        />
                        { a.animationType !== 'none' && <>
                            <SelectControl label={ __('Trigger','arkimedia') } value={a.animationTrigger}
                                options={[ { label:'On scroll', value:'onScroll' }, { label:'On load', value:'onLoad' } ]}
                                onChange={ v => setAttributes({ animationTrigger: v }) }
                            />
                            <RangeControl label={ __('Durata (ms)','arkimedia') }  value={a.animationDuration} onChange={ v => setAttributes({ animationDuration: v }) } min={100} max={3000} step={50} />
                            <RangeControl label={ __('Delay (ms)','arkimedia') }   value={a.animationDelay}    onChange={ v => setAttributes({ animationDelay: v }) }    min={0}   max={2000} step={50} />
                            <ToggleControl label={ __('Scrub (parallax)','arkimedia') } checked={a.animationScrub} onChange={ v => setAttributes({ animationScrub: v }) } />
                        </> }
                    </PanelBody>

                    {/* Responsive Tablet */}
                    <PanelBody title={ __( 'Responsive — Tablet (≤1024px)', 'arkimedia' ) } initialOpen={false}>
                        <SelectControl label={ __('Display','arkimedia') } value={a.mdDisplay}
                            options={[ { label:'Eredita', value:'' }, { label:'Flex', value:'flex' }, { label:'Grid', value:'grid' }, { label:'Block', value:'block' }, { label:'None', value:'none' } ]}
                            onChange={ v => setAttributes({ mdDisplay: v }) }
                        />
                        <SelectControl label={ __('Direzione flex','arkimedia') } value={a.mdFlexDirection}
                            options={[ { label:'Eredita', value:'' }, { label:'Row', value:'row' }, { label:'Column', value:'column' } ]}
                            onChange={ v => setAttributes({ mdFlexDirection: v }) }
                        />
                        <SelectControl label={ __('Justify','arkimedia') } value={a.mdJustify}
                            options={[ { label:'Eredita', value:'' }, { label:'Start', value:'flex-start' }, { label:'Center', value:'center' }, { label:'End', value:'flex-end' }, { label:'Space between', value:'space-between' } ]}
                            onChange={ v => setAttributes({ mdJustify: v }) }
                        />
                        <SelectControl label={ __('Align items','arkimedia') } value={a.mdAlignItems}
                            options={[ { label:'Eredita', value:'' }, { label:'Stretch', value:'stretch' }, { label:'Start', value:'flex-start' }, { label:'Center', value:'center' }, { label:'End', value:'flex-end' } ]}
                            onChange={ v => setAttributes({ mdAlignItems: v }) }
                        />
                        <Sp label="Gap (px)" value={a.mdGap} onChange={ v => setAttributes({ mdGap: v }) } />
                        <RangeControl label={ __('Colonne grid','arkimedia') } value={a.mdGridColumns} onChange={ v => setAttributes({ mdGridColumns: v }) } min={0} max={12} />
                    </PanelBody>

                    {/* Responsive Mobile */}
                    <PanelBody title={ __( 'Responsive — Mobile (≤640px)', 'arkimedia' ) } initialOpen={false}>
                        <SelectControl label={ __('Display','arkimedia') } value={a.smDisplay}
                            options={[ { label:'Eredita', value:'' }, { label:'Flex', value:'flex' }, { label:'Grid', value:'grid' }, { label:'Block', value:'block' }, { label:'None', value:'none' } ]}
                            onChange={ v => setAttributes({ smDisplay: v }) }
                        />
                        <SelectControl label={ __('Direzione flex','arkimedia') } value={a.smFlexDirection}
                            options={[ { label:'Eredita', value:'' }, { label:'Row', value:'row' }, { label:'Column', value:'column' } ]}
                            onChange={ v => setAttributes({ smFlexDirection: v }) }
                        />
                        <SelectControl label={ __('Justify','arkimedia') } value={a.smJustify}
                            options={[ { label:'Eredita', value:'' }, { label:'Start', value:'flex-start' }, { label:'Center', value:'center' }, { label:'End', value:'flex-end' }, { label:'Space between', value:'space-between' } ]}
                            onChange={ v => setAttributes({ smJustify: v }) }
                        />
                        <SelectControl label={ __('Align items','arkimedia') } value={a.smAlignItems}
                            options={[ { label:'Eredita', value:'' }, { label:'Stretch', value:'stretch' }, { label:'Start', value:'flex-start' }, { label:'Center', value:'center' }, { label:'End', value:'flex-end' } ]}
                            onChange={ v => setAttributes({ smAlignItems: v }) }
                        />
                        <Sp label="Gap (px)" value={a.smGap} onChange={ v => setAttributes({ smGap: v }) } />
                        <RangeControl label={ __('Colonne grid','arkimedia') } value={a.smGridColumns} onChange={ v => setAttributes({ smGridColumns: v }) } min={0} max={12} />
                    </PanelBody>

                </InspectorControls>

                <div { ...innerBlocksProps } />
            </>
        )
    },

    save() {
        return <InnerBlocks.Content />
    },
})
