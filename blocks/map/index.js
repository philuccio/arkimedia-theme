import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls } from '@wordpress/block-editor'
import {
    PanelBody, TextControl, TextareaControl, RangeControl,
    SelectControl, ColorPicker, TabPanel,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { useState, useEffect, useCallback, useRef } from '@wordpress/element'
import metadata from './block.json'

const MAP_TYPES = { roadmap: 'm', satellite: 'k', terrain: 'p', hybrid: 'h' }

// ── TextControl / TextareaControl che salvano al blur ─────
function LocalField( { as: Control = TextControl, value, onCommit, ...props } ) {
    const [ local, setLocal ] = useState( value ?? '' )
    useEffect( () => { setLocal( value ?? '' ) }, [ value ] )
    return (
        <Control
            { ...props }
            value={local}
            onChange={ setLocal }
            onBlur={ () => onCommit( local ) }
        />
    )
}

// ── Coordinata: un valore non valido ripristina quello salvato ──
function CoordField( { label, help, value, onCommit } ) {
    const [ local, setLocal ] = useState( String( value ) )
    useEffect( () => { setLocal( String( value ) ) }, [ value ] )
    return (
        <TextControl
            label={label}
            help={help}
            type="number"
            value={local}
            onChange={ setLocal }
            onBlur={ () => {
                const parsed = parseFloat( local )
                if ( Number.isNaN( parsed ) ) setLocal( String( value ) )
                else onCommit( parsed )
            } }
        />
    )
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
            lat, lng, zoom, mapType, height, layout,
            bgColor, textColor, accentColor,
            panelTitle, panelText, address, directionsLabel,
        } = attributes

        const blockProps = useBlockProps({
            className: `ark-map ark-map--layout-${ layout }`,
            style: {
                width:       '100vw',
                maxWidth:    '100vw',
                marginLeft:  'calc(50% - 50vw)',
                marginRight: 'calc(50% - 50vw)',
            }
        })

        const embedUrl = `https://maps.google.com/maps?q=${ lat },${ lng }&z=${ zoom }&output=embed&t=${ MAP_TYPES[ mapType ] || 'm' }`

        // pointerEvents: il click deve selezionare il blocco, non la mappa
        const iframe = (
            <iframe className="ark-map__iframe" src={embedUrl} width="100%" height="100%" style={{ border:0, pointerEvents:'none' }} loading="lazy" title={ panelTitle || 'Mappa' } />
        )

        const contentTab = (
            <>
                <PanelBody title={ __( 'Coordinate', 'arkimedia' ) } initialOpen={true}>
                    <CoordField
                        label={ __( 'Latitudine', 'arkimedia' ) }
                        value={lat}
                        onCommit={ v => setAttributes({ lat: v }) }
                        help="Es. 41.9028"
                    />
                    <CoordField
                        label={ __( 'Longitudine', 'arkimedia' ) }
                        value={lng}
                        onCommit={ v => setAttributes({ lng: v }) }
                        help="Es. 12.4964"
                    />
                </PanelBody>

                { layout === 'split' && (
                    <PanelBody title={ __( 'Pannello info', 'arkimedia' ) } initialOpen={true}>
                        <LocalField label={ __( 'Titolo', 'arkimedia' ) } value={panelTitle} onCommit={ v => setAttributes({ panelTitle: v }) } />
                        <LocalField as={TextareaControl} label={ __( 'Testo', 'arkimedia' ) } value={panelText} onCommit={ v => setAttributes({ panelText: v }) } />
                        <LocalField label={ __( 'Indirizzo (testo link)', 'arkimedia' ) } value={address} onCommit={ v => setAttributes({ address: v }) } placeholder="Via Roma 1, Milano" />
                        <LocalField label={ __( 'Testo pulsante', 'arkimedia' ) } value={directionsLabel} onCommit={ v => setAttributes({ directionsLabel: v }) } />
                    </PanelBody>
                )}
            </>
        )

        const layoutTab = (
            <>
                <PanelBody title={ __( 'Layout', 'arkimedia' ) } initialOpen={true}>
                    <ToggleGroupControl
                        label={ __( 'Tipo layout', 'arkimedia' ) }
                        value={layout}
                        onChange={ v => setAttributes({ layout: v }) }
                        isBlock>
                        <ToggleGroupControlOption value="full"  label="Fullwidth" />
                        <ToggleGroupControlOption value="split" label="Split + Info" />
                    </ToggleGroupControl>
                    <SelectControl
                        label={ __( 'Altezza mappa', 'arkimedia' ) }
                        value={height}
                        options={[
                            { label:'300px', value:'300px' },
                            { label:'400px', value:'400px' },
                            { label:'500px', value:'500px' },
                            { label:'600px', value:'600px' },
                            { label:'70vh',  value:'70vh' },
                            { label:'100vh', value:'100vh' },
                        ]}
                        onChange={ v => setAttributes({ height: v }) }
                    />
                    <LocalRange
                        label={ __( 'Zoom', 'arkimedia' ) }
                        value={zoom}
                        onChange={ v => setAttributes({ zoom: v }) }
                        min={1} max={20} step={1}
                    />
                    <SelectControl
                        label={ __( 'Tipo mappa', 'arkimedia' ) }
                        value={mapType}
                        options={[
                            { label:'Stradale',   value:'roadmap' },
                            { label:'Satellite',  value:'satellite' },
                            { label:'Terrain',    value:'terrain' },
                            { label:'Ibrida',     value:'hybrid' },
                        ]}
                        onChange={ v => setAttributes({ mapType: v }) }
                    />
                </PanelBody>

                { layout === 'split' && (
                    <PanelBody title={ __( 'Colori', 'arkimedia' ) } initialOpen={false}>
                        <p style={{fontSize:'11px',fontWeight:600,marginBottom:'8px'}}>{ __('Sfondo pannello','arkimedia') }</p>
                        <ColorPicker color={bgColor} onChange={ v => setAttributes({ bgColor: v }) } enableAlpha />
                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>{ __('Colore testo','arkimedia') }</p>
                        <ColorPicker color={textColor} onChange={ v => setAttributes({ textColor: v }) } />
                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>{ __('Colore accent','arkimedia') }</p>
                        <ColorPicker color={accentColor} onChange={ v => setAttributes({ accentColor: v }) } />
                    </PanelBody>
                )}
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

                {/* Stesso markup di render.php: l'anteprima deve coincidere con il sito */}
                <div { ...blockProps }>
                    { layout === 'split' ? (
                        <div className="ark-map__split">
                            <div className="ark-map__panel" style={{ background:bgColor, color:textColor }}>
                                { panelTitle && <h3 className="ark-map__panel-title" style={{ color:textColor }}>{panelTitle}</h3> }
                                { panelText  && <p className="ark-map__panel-text">{panelText}</p> }
                                { address    && <span className="ark-map__panel-address" style={{ color:accentColor }}><span aria-hidden="true">📍</span> {address}</span> }
                                <span className="ark-map__directions" style={{ background:accentColor }}>{directionsLabel}</span>
                            </div>
                            <div className="ark-map__embed-wrap" style={{ minHeight:height }}>{iframe}</div>
                        </div>
                    ) : (
                        <div className="ark-map__embed-wrap" style={{ height }}>{iframe}</div>
                    )}
                </div>
            </>
        )
    },

    save: () => null,
})
