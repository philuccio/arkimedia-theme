import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls } from '@wordpress/block-editor'
import { PanelBody, TextControl, ToggleControl, ColorPicker } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import metadata from './block.json'

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const { client, year, role, duration, url, urlLabel, bgColor, textColor, showBack } = attributes

        const blockProps = useBlockProps({
            style: {
                background:  bgColor  || 'var(--color-bg-alt, #f5f5f5)',
                color:       textColor || 'inherit',
                borderRadius: '8px',
                padding:     '1.5rem',
            }
        })

        const fields = [
            { key: 'client',   label: __( 'Cliente', 'arkimedia' ),  value: client },
            { key: 'year',     label: __( 'Anno', 'arkimedia' ),      value: year },
            { key: 'role',     label: __( 'Ruolo', 'arkimedia' ),     value: role },
            { key: 'duration', label: __( 'Durata', 'arkimedia' ),    value: duration },
        ]

        return (
            <>
                <InspectorControls>
                    <PanelBody title={ __( 'Dettagli progetto', 'arkimedia' ) } initialOpen={true}>
                        { fields.map( f => (
                            <TextControl key={f.key}
                                label={f.label}
                                value={f.value}
                                onChange={ v => setAttributes({ [f.key]: v }) }
                            />
                        ))}
                        <TextControl
                            label={ __( 'URL progetto', 'arkimedia' ) }
                            value={url}
                            onChange={ v => setAttributes({ url: v }) }
                            type="url"
                            placeholder="https://..."
                        />
                        <TextControl
                            label={ __( 'Testo link URL', 'arkimedia' ) }
                            value={urlLabel}
                            onChange={ v => setAttributes({ urlLabel: v }) }
                        />
                        <ToggleControl
                            label={ __( 'Mostra link "Tutti i progetti"', 'arkimedia' ) }
                            checked={showBack}
                            onChange={ v => setAttributes({ showBack: v }) }
                        />
                    </PanelBody>
                    <PanelBody title={ __( 'Colori', 'arkimedia' ) } initialOpen={false}>
                        <p style={{fontSize:'11px',fontWeight:600,marginBottom:'8px'}}>{ __('Sfondo','arkimedia') }</p>
                        <ColorPicker color={bgColor} onChange={ v => setAttributes({ bgColor: v }) } enableAlpha />
                        <p style={{fontSize:'11px',fontWeight:600,margin:'16px 0 8px'}}>{ __('Testo','arkimedia') }</p>
                        <ColorPicker color={textColor} onChange={ v => setAttributes({ textColor: v }) } />
                    </PanelBody>
                </InspectorControls>

                <aside { ...blockProps }>
                    <dl style={{ margin:'0 0 1.5rem', padding:0, display:'flex', flexDirection:'column' }}>
                        { fields.filter( f => f.value ).map( f => (
                            <div key={f.key} style={{ padding:'0.875rem 0', borderBottom:'1px solid var(--color-border,#e5e5e5)' }}>
                                <dt style={{ fontSize:'0.75rem', fontWeight:600, textTransform:'uppercase', opacity:0.5, marginBottom:'0.25rem', letterSpacing:'0.08em' }}>{f.label}</dt>
                                <dd style={{ margin:0, fontSize:'0.9375rem', fontWeight:500 }}>{f.value}</dd>
                            </div>
                        ))}
                        { url && (
                            <div style={{ padding:'0.875rem 0' }}>
                                <dt style={{ fontSize:'0.75rem', fontWeight:600, textTransform:'uppercase', opacity:0.5, marginBottom:'0.25rem', letterSpacing:'0.08em' }}>{ __('Progetto','arkimedia') }</dt>
                                <dd style={{ margin:0 }}>
                                    <span style={{ color:'var(--color-accent,#e94560)', fontSize:'0.9375rem', fontWeight:500 }}>{urlLabel} ↗</span>
                                </dd>
                            </div>
                        )}
                    </dl>
                    { showBack && (
                        <span style={{ fontSize:'0.875rem', fontWeight:600, color:'var(--color-text,#1a1a1a)' }}>
                            ← { __('Tutti i progetti','arkimedia') }
                        </span>
                    )}
                </aside>
            </>
        )
    },

    save: () => null,
})
