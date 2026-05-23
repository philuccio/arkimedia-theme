import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls } from '@wordpress/block-editor'
import {
    PanelBody, TextControl, TextareaControl, RangeControl,
    SelectControl, ToggleControl, ColorPicker,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import metadata from './block.json'

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const {
            lat, lng, zoom, mapType, height, layout,
            showMarker, markerTitle, markerText,
            bgColor, textColor, accentColor,
            panelTitle, panelText, address,
        } = attributes

        const blockProps = useBlockProps({
            style: {
                width:       '100vw',
                maxWidth:    '100vw',
                marginLeft:  'calc(50% - 50vw)',
                marginRight: 'calc(50% - 50vw)',
                overflow:    'hidden',
            }
        })

        const embedUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d5000!2d${ lng }!3d${ lat }!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f${ zoom }!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sit!2sit`

        return (
            <>
                <InspectorControls>

                    <PanelBody title={ __( 'Coordinate', 'arkimedia' ) } initialOpen={true}>
                        <TextControl
                            label={ __( 'Latitudine', 'arkimedia' ) }
                            value={String( lat )}
                            onChange={ v => setAttributes({ lat: parseFloat( v ) || 0 }) }
                            help="Es. 41.9028"
                            type="number"
                        />
                        <TextControl
                            label={ __( 'Longitudine', 'arkimedia' ) }
                            value={String( lng )}
                            onChange={ v => setAttributes({ lng: parseFloat( v ) || 0 }) }
                            help="Es. 12.4964"
                            type="number"
                        />
                        <RangeControl
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

                    <PanelBody title={ __( 'Layout', 'arkimedia' ) } initialOpen={false}>
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
                    </PanelBody>

                    { layout === 'split' && (
                        <PanelBody title={ __( 'Pannello info', 'arkimedia' ) } initialOpen={false}>
                            <TextControl
                                label={ __( 'Titolo', 'arkimedia' ) }
                                value={panelTitle}
                                onChange={ v => setAttributes({ panelTitle: v }) }
                            />
                            <TextareaControl
                                label={ __( 'Testo', 'arkimedia' ) }
                                value={panelText}
                                onChange={ v => setAttributes({ panelText: v }) }
                            />
                            <TextControl
                                label={ __( 'Indirizzo (testo link)', 'arkimedia' ) }
                                value={address}
                                onChange={ v => setAttributes({ address: v }) }
                                placeholder="Via Roma 1, Milano"
                            />
                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>{ __('Sfondo pannello','arkimedia') }</p>
                            <ColorPicker color={bgColor} onChange={ v => setAttributes({ bgColor: v }) } enableAlpha />
                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>{ __('Colore testo','arkimedia') }</p>
                            <ColorPicker color={textColor} onChange={ v => setAttributes({ textColor: v }) } />
                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>{ __('Colore accent','arkimedia') }</p>
                            <ColorPicker color={accentColor} onChange={ v => setAttributes({ accentColor: v }) } />
                        </PanelBody>
                    )}

                </InspectorControls>

                <div { ...blockProps }>
                    { layout === 'split' ? (
                        <div style={{ display:'flex', width:'100%' }}>
                            <div style={{ flex:'0 0 380px', background:bgColor, color:textColor, padding:'3rem 2.5rem', display:'flex', flexDirection:'column', gap:'1.5rem', justifyContent:'center' }}>
                                { panelTitle && <h3 style={{ fontSize:'clamp(1.5rem,3vw,2.25rem)', fontWeight:700, margin:0, lineHeight:1.2 }}>{panelTitle}</h3> }
                                { panelText  && <p style={{ opacity:0.75, margin:0, lineHeight:1.7 }}>{panelText}</p> }
                                { address    && <span style={{ color:accentColor, fontSize:'0.9375rem' }}>📍 {address}</span> }
                                <div style={{ display:'inline-flex', padding:'0.875rem 1.75rem', background:accentColor, color:'#fff', fontSize:'0.875rem', fontWeight:700, borderRadius:'6px', alignSelf:'flex-start' }}>
                                    { __('Indicazioni stradali','arkimedia') }
                                </div>
                            </div>
                            <div style={{ flex:1, height }}>
                                <iframe src={embedUrl} width="100%" height="100%" style={{ border:0, display:'block' }} loading="lazy" title="Mappa" />
                            </div>
                        </div>
                    ) : (
                        <div style={{ height, width:'100%' }}>
                            <iframe src={embedUrl} width="100%" height="100%" style={{ border:0, display:'block' }} loading="lazy" title="Mappa" />
                        </div>
                    )}
                </div>
            </>
        )
    },

    save: () => null,
})
