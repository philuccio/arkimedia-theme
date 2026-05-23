import { registerBlockType } from '@wordpress/blocks'
import {
    useBlockProps,
    InspectorControls,
    InnerBlocks,
    useInnerBlocksProps,
} from '@wordpress/block-editor'
import {
    PanelBody,
    SelectControl,
    RangeControl,
    ToggleControl,
    TextControl,
    Button,
    ColorPicker,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
    __experimentalBoxControl as BoxControl,
    __experimentalBorderBoxControl as BorderBoxControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import metadata from './block.json'

// Helper per costruire lo stile inline
function buildStyle( a ) {
    const s = {}

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
        if ( a.gap ) s.gap = `${ a.gap }px`
    }

    s.width    = a.width
    s.overflow = a.overflow
    if ( a.minHeight ) s.minHeight = a.minHeight
    if ( a.maxWidth )  s.maxWidth  = a.maxWidth
    if ( a.zIndex )    s.zIndex    = a.zIndex

    s.padding = `${ a.paddingTop }px ${ a.paddingRight }px ${ a.paddingBottom }px ${ a.paddingLeft }px`
    s.margin  = `${ a.marginTop } ${ a.marginRight } ${ a.marginBottom } ${ a.marginLeft }`

    if ( a.bgColor ) s.background = a.bgColor

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

    s.boxSizing = 'border-box'
    s.position  = 'relative'

    return s
}

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes, clientId } ) {
        const a = attributes

        const containerStyle = buildStyle( a )

        const blockProps = useBlockProps({ style: containerStyle })

        const innerBlocksProps = useInnerBlocksProps( blockProps, {
            allowedBlocks: undefined, // tutti i blocchi
            orientation:   a.flexDirection === 'column' ? 'vertical' : 'horizontal',
            renderAppender: InnerBlocks.ButtonBlockAppender,
            template:       [],
        })

        // Range con label
        const Spacing = ( { label, value, onChange } ) => (
            <RangeControl label={label} value={value} onChange={onChange} min={0} max={200} step={2} />
        )

        return (
            <>
                <InspectorControls>

                    {/* ── Tag HTML ── */}
                    <PanelBody title={ __( 'Impostazioni generali', 'arkimedia' ) } initialOpen={true}>
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
                            label={ __( 'Primo livello (fullwidth disponibile)', 'arkimedia' ) }
                            checked={a.isFirstLevel}
                            onChange={ val => setAttributes({ isFirstLevel: val }) }
                        />
                    </PanelBody>

                    {/* ── Layout ── */}
                    <PanelBody title={ __( 'Layout', 'arkimedia' ) } initialOpen={true}>
                        <ToggleGroupControl
                            label={ __( 'Tipo display', 'arkimedia' ) }
                            value={a.display}
                            onChange={ val => setAttributes({ display: val }) }
                            isBlock>
                            <ToggleGroupControlOption value="flex"  label="Flex" />
                            <ToggleGroupControlOption value="grid"  label="Grid" />
                            <ToggleGroupControlOption value="block" label="Block" />
                        </ToggleGroupControl>

                        { a.display === 'flex' && (
                            <>
                                <SelectControl
                                    label={ __( 'Direzione', 'arkimedia' ) }
                                    value={a.flexDirection}
                                    options={[
                                        { label: 'Row →',           value: 'row' },
                                        { label: 'Row inverse ←',   value: 'row-reverse' },
                                        { label: 'Column ↓',        value: 'column' },
                                        { label: 'Column inverse ↑', value: 'column-reverse' },
                                    ]}
                                    onChange={ val => setAttributes({ flexDirection: val }) }
                                />
                                <SelectControl
                                    label={ __( 'Flex wrap', 'arkimedia' ) }
                                    value={a.flexWrap}
                                    options={[
                                        { label: 'No wrap',      value: 'nowrap' },
                                        { label: 'Wrap',         value: 'wrap' },
                                        { label: 'Wrap inverse', value: 'wrap-reverse' },
                                    ]}
                                    onChange={ val => setAttributes({ flexWrap: val }) }
                                />
                                <SelectControl
                                    label={ __( 'Justify content', 'arkimedia' ) }
                                    value={a.justifyContent}
                                    options={[
                                        { label: 'Start',         value: 'flex-start' },
                                        { label: 'Center',        value: 'center' },
                                        { label: 'End',           value: 'flex-end' },
                                        { label: 'Space between', value: 'space-between' },
                                        { label: 'Space around',  value: 'space-around' },
                                        { label: 'Space evenly',  value: 'space-evenly' },
                                    ]}
                                    onChange={ val => setAttributes({ justifyContent: val }) }
                                />
                                <SelectControl
                                    label={ __( 'Align items', 'arkimedia' ) }
                                    value={a.alignItems}
                                    options={[
                                        { label: 'Stretch',    value: 'stretch' },
                                        { label: 'Start',      value: 'flex-start' },
                                        { label: 'Center',     value: 'center' },
                                        { label: 'End',        value: 'flex-end' },
                                        { label: 'Baseline',   value: 'baseline' },
                                    ]}
                                    onChange={ val => setAttributes({ alignItems: val }) }
                                />
                                <SelectControl
                                    label={ __( 'Align content (multi-riga)', 'arkimedia' ) }
                                    value={a.alignContent}
                                    options={[
                                        { label: 'Normal',        value: 'normal' },
                                        { label: 'Start',         value: 'flex-start' },
                                        { label: 'Center',        value: 'center' },
                                        { label: 'End',           value: 'flex-end' },
                                        { label: 'Space between', value: 'space-between' },
                                        { label: 'Space around',  value: 'space-around' },
                                        { label: 'Stretch',       value: 'stretch' },
                                    ]}
                                    onChange={ val => setAttributes({ alignContent: val }) }
                                />
                            </>
                        )}

                        { a.display === 'grid' && (
                            <>
                                <RangeControl
                                    label={ __( 'Colonne griglia', 'arkimedia' ) }
                                    value={a.gridColumns}
                                    onChange={ val => setAttributes({ gridColumns: val }) }
                                    min={1} max={12} step={1}
                                />
                                <TextControl
                                    label={ __( 'Grid rows (es. auto / 200px 1fr)', 'arkimedia' ) }
                                    value={a.gridRows}
                                    onChange={ val => setAttributes({ gridRows: val }) }
                                />
                                <SelectControl
                                    label={ __( 'Grid auto flow', 'arkimedia' ) }
                                    value={a.gridAutoFlow}
                                    options={[
                                        { label: 'Row',    value: 'row' },
                                        { label: 'Column', value: 'column' },
                                        { label: 'Dense',  value: 'dense' },
                                    ]}
                                    onChange={ val => setAttributes({ gridAutoFlow: val }) }
                                />
                            </>
                        )}

                        {/* Gap */}
                        <ToggleControl
                            label={ __( 'Gap colonna/riga separati', 'arkimedia' ) }
                            checked={a.useCustomGap}
                            onChange={ val => setAttributes({ useCustomGap: val }) }
                        />
                        { a.useCustomGap ? (
                            <>
                                <Spacing label={ __('Column gap (px)','arkimedia') } value={a.columnGap} onChange={ val => setAttributes({ columnGap: val }) } />
                                <Spacing label={ __('Row gap (px)','arkimedia') }    value={a.rowGap}    onChange={ val => setAttributes({ rowGap: val }) } />
                            </>
                        ) : (
                            <Spacing label={ __('Gap (px)','arkimedia') } value={a.gap} onChange={ val => setAttributes({ gap: val }) } />
                        )}
                    </PanelBody>

                    {/* ── Dimensioni ── */}
                    <PanelBody title={ __( 'Dimensioni', 'arkimedia' ) } initialOpen={false}>
                        <TextControl
                            label={ __( 'Width (es. 100% / 800px / 50vw)', 'arkimedia' ) }
                            value={a.width}
                            onChange={ val => setAttributes({ width: val }) }
                        />
                        <TextControl
                            label={ __( 'Min height (es. 400px / 50vh)', 'arkimedia' ) }
                            value={a.minHeight}
                            onChange={ val => setAttributes({ minHeight: val }) }
                        />
                        <TextControl
                            label={ __( 'Max width (es. 1200px / 100%)', 'arkimedia' ) }
                            value={a.maxWidth}
                            onChange={ val => setAttributes({ maxWidth: val }) }
                        />
                        <SelectControl
                            label={ __( 'Overflow', 'arkimedia' ) }
                            value={a.overflow}
                            options={[
                                { label: 'Visible', value: 'visible' },
                                { label: 'Hidden',  value: 'hidden' },
                                { label: 'Auto',    value: 'auto' },
                                { label: 'Scroll',  value: 'scroll' },
                            ]}
                            onChange={ val => setAttributes({ overflow: val }) }
                        />
                        <TextControl
                            label={ __( 'Z-index', 'arkimedia' ) }
                            value={a.zIndex}
                            onChange={ val => setAttributes({ zIndex: val }) }
                            type="number"
                        />
                    </PanelBody>

                    {/* ── Spacing ── */}
                    <PanelBody title={ __( 'Padding', 'arkimedia' ) } initialOpen={false}>
                        <Spacing label="Top"    value={a.paddingTop}    onChange={ val => setAttributes({ paddingTop: val }) } />
                        <Spacing label="Right"  value={a.paddingRight}  onChange={ val => setAttributes({ paddingRight: val }) } />
                        <Spacing label="Bottom" value={a.paddingBottom} onChange={ val => setAttributes({ paddingBottom: val }) } />
                        <Spacing label="Left"   value={a.paddingLeft}   onChange={ val => setAttributes({ paddingLeft: val }) } />
                    </PanelBody>

                    <PanelBody title={ __( 'Margin', 'arkimedia' ) } initialOpen={false}>
                        <TextControl label="Top"    value={a.marginTop}    onChange={ val => setAttributes({ marginTop: val }) }    placeholder="0 / auto" />
                        <TextControl label="Right"  value={a.marginRight}  onChange={ val => setAttributes({ marginRight: val }) }  placeholder="0 / auto" />
                        <TextControl label="Bottom" value={a.marginBottom} onChange={ val => setAttributes({ marginBottom: val }) } placeholder="0 / auto" />
                        <TextControl label="Left"   value={a.marginLeft}   onChange={ val => setAttributes({ marginLeft: val }) }   placeholder="0 / auto" />
                    </PanelBody>

                    {/* ── Sfondo ── */}
                    <PanelBody title={ __( 'Sfondo', 'arkimedia' ) } initialOpen={false}>
                        <p style={{fontSize:'11px',fontWeight:600,textTransform:'uppercase',marginBottom:'8px'}}>
                            { __('Colore sfondo','arkimedia') }
                        </p>
                        <ColorPicker
                            color={a.bgColor}
                            onChange={ val => setAttributes({ bgColor: val }) }
                            enableAlpha
                        />
                        { a.bgColor &&
                            <Button
                                onClick={ () => setAttributes({ bgColor: '' }) }
                                variant="tertiary" isDestructive
                                style={{ marginTop:'8px' }}>
                                { __('Rimuovi colore','arkimedia') }
                            </Button>
                        }
                    </PanelBody>

                    {/* ── Bordo ── */}
                    <PanelBody title={ __( 'Bordo', 'arkimedia' ) } initialOpen={false}>
                        <p style={{fontSize:'11px',fontWeight:600,marginBottom:'8px'}}>{ __('Spessore bordo (px)','arkimedia') }</p>
                        <Spacing label="Top"    value={a.borderTopWidth}    onChange={ val => setAttributes({ borderTopWidth: val }) } />
                        <Spacing label="Right"  value={a.borderRightWidth}  onChange={ val => setAttributes({ borderRightWidth: val }) } />
                        <Spacing label="Bottom" value={a.borderBottomWidth} onChange={ val => setAttributes({ borderBottomWidth: val }) } />
                        <Spacing label="Left"   value={a.borderLeftWidth}   onChange={ val => setAttributes({ borderLeftWidth: val }) } />
                        <SelectControl
                            label={ __( 'Stile bordo', 'arkimedia' ) }
                            value={a.borderStyle}
                            options={[
                                { label: 'Solid',  value: 'solid' },
                                { label: 'Dashed', value: 'dashed' },
                                { label: 'Dotted', value: 'dotted' },
                                { label: 'Double', value: 'double' },
                                { label: 'None',   value: 'none' },
                            ]}
                            onChange={ val => setAttributes({ borderStyle: val }) }
                        />
                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>{ __('Colore bordo','arkimedia') }</p>
                        <ColorPicker color={a.borderColor} onChange={ val => setAttributes({ borderColor: val }) } />
                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>{ __('Border radius (px)','arkimedia') }</p>
                        <Spacing label="Top Left"     value={a.borderRadiusTL} onChange={ val => setAttributes({ borderRadiusTL: val }) } />
                        <Spacing label="Top Right"    value={a.borderRadiusTR} onChange={ val => setAttributes({ borderRadiusTR: val }) } />
                        <Spacing label="Bottom Right" value={a.borderRadiusBR} onChange={ val => setAttributes({ borderRadiusBR: val }) } />
                        <Spacing label="Bottom Left"  value={a.borderRadiusBL} onChange={ val => setAttributes({ borderRadiusBL: val }) } />
                    </PanelBody>

                </InspectorControls>

                <div { ...innerBlocksProps } />
            </>
        )
    },

    save( { attributes } ) {
        // render lato server
        return <InnerBlocks.Content />
    },
})
