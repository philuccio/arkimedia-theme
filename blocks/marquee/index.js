import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls } from '@wordpress/block-editor'
import {
    PanelBody, ToggleControl, RangeControl, ColorPicker, Button, TabPanel,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { useState, useEffect, useCallback, useRef } from '@wordpress/element'
import { MarqueePreview, SeparatorControl, FontControl, ItemsControl, SEPARATOR_SIZES } from './preview'
import metadata from './block.json'

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
const TEXT_SIZES = [
    { label:'S',  value:'clamp(0.75rem,1vw,0.875rem)', px:14 },
    { label:'M',  value:'clamp(1rem,1.5vw,1.25rem)',   px:20 },
    { label:'L',  value:'clamp(1.5rem,3vw,2.5rem)',    px:40 },
    { label:'XL', value:'clamp(2.5rem,6vw,5rem)',      px:80 },
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

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const {
            text, separator, separatorSize, fontFamily, fontSize, speed, direction, pauseOnHover,
            textColor, separatorColor, bgColor, showLines, lineColor, paddingY,
        } = attributes

        // Anteprima dal vivo: i valori in modifica si vedono subito e si salvano al rilascio
        const [ live, setLive ] = useState( {} )
        useEffect( () => { setLive( {} ) }, [ attributes ] )
        const preview = { ...attributes, ...live }
        const onLive  = key => v => setLive( l => ( { ...l, [ key ]: v } ) )

        const blockProps = useBlockProps({
            className: 'ark-marquee-block',
            style: {
                color:         textColor,
                paddingTop:    `${ preview.paddingY }px`,
                paddingBottom: `${ preview.paddingY }px`,
                background:    bgColor || undefined,
                borderTop:     showLines ? `1px solid ${ lineColor }` : undefined,
                borderBottom:  showLines ? `1px solid ${ lineColor }` : undefined,
            }
        })

        const contentTab = (
            <PanelBody title={ __( 'Testo', 'arkimedia' ) } initialOpen={true}>
                <ItemsControl value={text} onChange={ v => setAttributes({ text: v }) } onLive={ onLive( 'text' ) } />
                <FontControl value={fontFamily} onChange={ v => setAttributes({ fontFamily: v }) } />
                <SeparatorControl value={separator} onChange={ v => setAttributes({ separator: v }) } onLive={ onLive( 'separator' ) } />
                { separator !== '' &&
                    <SizeControl label={ __('Dimensione separatore','arkimedia') } value={separatorSize} onChange={ v => setAttributes({ separatorSize: v }) } onLive={ onLive( 'separatorSize' ) } presets={SEPARATOR_SIZES} max={200} />
                }
                <SizeControl label={ __('Dimensione','arkimedia') } value={fontSize} onChange={ v => setAttributes({ fontSize: v }) } onLive={ onLive( 'fontSize' ) } presets={TEXT_SIZES} max={200} />
            </PanelBody>
        )

        const layoutTab = (
            <>
                <PanelBody title={ __( 'Movimento', 'arkimedia' ) } initialOpen={true}>
                    <LocalRange label={ __( 'Velocità (px al secondo)', 'arkimedia' ) } value={speed} onChange={ v => setAttributes({ speed: v }) } onLive={ onLive( 'speed' ) } min={10} max={300} step={10} />
                    <ToggleGroupControl label={ __('Direzione','arkimedia') } value={direction} onChange={ v => setAttributes({ direction: v }) } isBlock>
                        <ToggleGroupControlOption value="left"  label={ __('← Sinistra','arkimedia') } />
                        <ToggleGroupControlOption value="right" label={ __('Destra →','arkimedia') } />
                    </ToggleGroupControl>
                    <ToggleControl label={ __('Pausa al passaggio del mouse','arkimedia') } checked={pauseOnHover} onChange={ v => setAttributes({ pauseOnHover: v }) } />
                </PanelBody>

                <PanelBody title={ __( 'Stile', 'arkimedia' ) } initialOpen={false}>
                    <p style={{fontSize:'11px',fontWeight:600,marginBottom:'8px'}}>{ __('Colore testo','arkimedia') }</p>
                    <ColorPicker color={textColor} onChange={ v => setAttributes({ textColor: v }) } enableAlpha />
                    { separator !== '' && <>
                        <p style={{fontSize:'11px',fontWeight:600,margin:'16px 0 8px'}}>{ __('Colore bullet','arkimedia') }</p>
                        <ColorPicker color={separatorColor || textColor} onChange={ v => setAttributes({ separatorColor: v }) } enableAlpha />
                        { separatorColor && <Button onClick={ () => setAttributes({ separatorColor:'' }) } variant="tertiary">{ __('Usa colore testo','arkimedia') }</Button> }
                    </> }
                    <p style={{fontSize:'11px',fontWeight:600,margin:'16px 0 8px'}}>{ __('Colore sfondo','arkimedia') }</p>
                    <ColorPicker color={bgColor} onChange={ v => setAttributes({ bgColor: v }) } enableAlpha />
                    { bgColor && <Button onClick={ () => setAttributes({ bgColor:'' }) } variant="tertiary" isDestructive>{ __('Rimuovi sfondo','arkimedia') }</Button> }
                    <ToggleControl label={ __('Linee sopra e sotto','arkimedia') } checked={showLines} onChange={ v => setAttributes({ showLines: v }) } />
                    { showLines && <>
                        <p style={{fontSize:'11px',fontWeight:600,marginBottom:'8px'}}>{ __('Colore linee','arkimedia') }</p>
                        <ColorPicker color={lineColor} onChange={ v => setAttributes({ lineColor: v }) } enableAlpha />
                    </> }
                    <LocalRange label={ __( 'Padding verticale (px)', 'arkimedia' ) } value={paddingY} onChange={ v => setAttributes({ paddingY: v }) } onLive={ onLive( 'paddingY' ) } max={100} />
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

                <div { ...blockProps }>
                    <MarqueePreview text={preview.text} fontSize={preview.fontSize} speed={preview.speed} direction={direction} pause={pauseOnHover} separator={preview.separator} separatorSize={preview.separatorSize} font={fontFamily} separatorColor={separatorColor} />
                </div>
            </>
        )
    },

    save: () => null,
})
