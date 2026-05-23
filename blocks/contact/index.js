import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor'
import {
    PanelBody, TextControl, TextareaControl, ToggleControl,
    SelectControl, Button, ColorPicker,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import metadata from './block.json'

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const {
            eyebrow, title, intro,
            bgColor, textColor, accentColor, inputBg, inputBorder,
            columnLayout, showPhone, showSubject, showHours,
            btnLabel, successMessage, errorMessage,
            privacyText, privacyLabel, privacyUrl,
            contacts, hours,
        } = attributes

        const blockProps = useBlockProps({
            style: {
                background:  bgColor,
                color:       textColor,
                padding:     '6rem 0',
                width:       '100vw',
                maxWidth:    '100vw',
                marginLeft:  'calc(50% - 50vw)',
                marginRight: 'calc(50% - 50vw)',
            }
        })

        const updateContact = ( i, data ) => {
            const updated = contacts.map( ( c, idx ) => idx === i ? { ...c, ...data } : c )
            setAttributes({ contacts: updated })
        }

        const addContact = () => setAttributes({ contacts: [ ...contacts, { icon: '📌', label: '', value: '', url: '' } ] })
        const removeContact = ( i ) => setAttributes({ contacts: contacts.filter( ( _, idx ) => idx !== i ) })

        const updateHour = ( i, data ) => {
            const updated = hours.map( ( h, idx ) => idx === i ? { ...h, ...data } : h )
            setAttributes({ hours: updated })
        }

        const colWidths = {
            '50-50': [ '50%', '50%' ],
            '40-60': [ '40%', '60%' ],
            '60-40': [ '60%', '40%' ],
        }
        const [ colLeft, colRight ] = colWidths[ columnLayout ] || [ '50%', '50%' ]

        return (
            <>
                <InspectorControls>

                    <PanelBody title={ __( 'Testi', 'arkimedia' ) } initialOpen={true}>
                        <TextControl label={ __('Eyebrow','arkimedia') } value={eyebrow} onChange={ v => setAttributes({ eyebrow: v }) } />
                        <TextControl label={ __('Titolo','arkimedia') }  value={title}   onChange={ v => setAttributes({ title: v }) } />
                        <TextareaControl label={ __('Intro','arkimedia') } value={intro} onChange={ v => setAttributes({ intro: v }) } />
                    </PanelBody>

                    <PanelBody title={ __( 'Layout', 'arkimedia' ) } initialOpen={false}>
                        <SelectControl
                            label={ __('Proporzioni colonne','arkimedia') }
                            value={columnLayout}
                            options={[
                                { label:'50% / 50%', value:'50-50' },
                                { label:'40% / 60%', value:'40-60' },
                                { label:'60% / 40%', value:'60-40' },
                            ]}
                            onChange={ v => setAttributes({ columnLayout: v }) }
                        />
                        <ToggleControl label={ __('Mostra campo telefono','arkimedia') }  checked={showPhone}   onChange={ v => setAttributes({ showPhone: v }) } />
                        <ToggleControl label={ __('Mostra campo oggetto','arkimedia') }   checked={showSubject} onChange={ v => setAttributes({ showSubject: v }) } />
                        <ToggleControl label={ __('Mostra orari','arkimedia') }           checked={showHours}  onChange={ v => setAttributes({ showHours: v }) } />
                    </PanelBody>

                    <PanelBody title={ __( 'Colori', 'arkimedia' ) } initialOpen={false}>
                        <p style={{fontSize:'11px',fontWeight:600,marginBottom:'8px'}}>{ __('Sfondo','arkimedia') }</p>
                        <ColorPicker color={bgColor} onChange={ v => setAttributes({ bgColor: v }) } enableAlpha />
                        <p style={{fontSize:'11px',fontWeight:600,margin:'16px 0 8px'}}>{ __('Testo','arkimedia') }</p>
                        <ColorPicker color={textColor} onChange={ v => setAttributes({ textColor: v }) } />
                        <p style={{fontSize:'11px',fontWeight:600,margin:'16px 0 8px'}}>{ __('Accent','arkimedia') }</p>
                        <ColorPicker color={accentColor} onChange={ v => setAttributes({ accentColor: v }) } />
                        <p style={{fontSize:'11px',fontWeight:600,margin:'16px 0 8px'}}>{ __('Sfondo input','arkimedia') }</p>
                        <ColorPicker color={inputBg} onChange={ v => setAttributes({ inputBg: v }) } enableAlpha />
                        <p style={{fontSize:'11px',fontWeight:600,margin:'16px 0 8px'}}>{ __('Bordo input','arkimedia') }</p>
                        <ColorPicker color={inputBorder} onChange={ v => setAttributes({ inputBorder: v }) } enableAlpha />
                    </PanelBody>

                    <PanelBody title={ __( 'Form', 'arkimedia' ) } initialOpen={false}>
                        <TextControl label={ __('Testo pulsante','arkimedia') }     value={btnLabel}       onChange={ v => setAttributes({ btnLabel: v }) } />
                        <TextControl label={ __('Messaggio successo','arkimedia') } value={successMessage} onChange={ v => setAttributes({ successMessage: v }) } />
                        <TextControl label={ __('Messaggio errore','arkimedia') }   value={errorMessage}   onChange={ v => setAttributes({ errorMessage: v }) } />
                        <TextControl label={ __('Testo privacy','arkimedia') }      value={privacyText}    onChange={ v => setAttributes({ privacyText: v }) } />
                        <TextControl label={ __('Label link privacy','arkimedia') } value={privacyLabel}   onChange={ v => setAttributes({ privacyLabel: v }) } />
                        <TextControl label={ __('URL privacy','arkimedia') }        value={privacyUrl}     onChange={ v => setAttributes({ privacyUrl: v }) } type="url" />
                    </PanelBody>

                    <PanelBody title={ __( `Contatti (${ contacts.length })`, 'arkimedia' ) } initialOpen={false}>
                        { contacts.map( ( c, i ) => (
                            <div key={i} style={{ borderBottom:'1px solid #e0e0e0', paddingBottom:'12px', marginBottom:'12px' }}>
                                <p style={{ fontSize:'11px', fontWeight:600, marginBottom:'8px' }}>{ `Contatto ${ i + 1 }` }</p>
                                <TextControl label="Icona (emoji)" value={c.icon}  onChange={ v => updateContact( i, { icon: v }) } />
                                <TextControl label="Etichetta"     value={c.label} onChange={ v => updateContact( i, { label: v }) } />
                                <TextControl label="Valore"        value={c.value} onChange={ v => updateContact( i, { value: v }) } />
                                <TextControl label="URL (opz.)"    value={c.url}   onChange={ v => updateContact( i, { url: v }) } />
                                <Button onClick={ () => removeContact(i) } variant="tertiary" isDestructive style={{ fontSize:'11px' }}>
                                    { __('Rimuovi','arkimedia') }
                                </Button>
                            </div>
                        ))}
                        <Button onClick={addContact} variant="primary" style={{ width:'100%', justifyContent:'center' }}>
                            { __('+ Aggiungi contatto','arkimedia') }
                        </Button>
                    </PanelBody>

                    { showHours && (
                        <PanelBody title={ __( 'Orari', 'arkimedia' ) } initialOpen={false}>
                            { hours.map( ( h, i ) => (
                                <div key={i} style={{ borderBottom:'1px solid #e0e0e0', paddingBottom:'8px', marginBottom:'8px' }}>
                                    <TextControl label="Giorni" value={h.days} onChange={ v => updateHour( i, { days: v }) } />
                                    <TextControl label="Orario" value={h.time} onChange={ v => updateHour( i, { time: v }) } />
                                </div>
                            ))}
                            <Button onClick={ () => setAttributes({ hours: [ ...hours, { days: '', time: '' } ] }) }
                                variant="primary" style={{ width:'100%', justifyContent:'center' }}>
                                { __('+ Aggiungi orario','arkimedia') }
                            </Button>
                        </PanelBody>
                    )}

                </InspectorControls>

                {/* Preview editor */}
                <section { ...blockProps }>
                    <div style={{ display:'flex', gap:'4rem', maxWidth:'1200px', margin:'0 auto', padding:'0 1.5rem', alignItems:'flex-start' }}>

                        {/* Info */}
                        <div style={{ flex:`0 0 ${ colLeft }` }}>
                            <p style={{ fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:accentColor, marginBottom:'1rem' }}>{eyebrow}</p>
                            <h2 style={{ fontSize:'clamp(2rem,4vw,3.5rem)', fontWeight:700, lineHeight:1.1, marginBottom:'1.5rem', letterSpacing:'-0.02em' }}>{title}</h2>
                            { intro && <p style={{ opacity:0.75, marginBottom:'2.5rem', lineHeight:1.7 }}>{intro}</p> }
                            <ul style={{ listStyle:'none', margin:0, padding:0, display:'flex', flexDirection:'column', gap:'1.5rem' }}>
                                { contacts.map( ( c, i ) => (
                                    <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:'1rem' }}>
                                        <span style={{ fontSize:'1.25rem' }}>{c.icon}</span>
                                        <div>
                                            <div style={{ fontSize:'0.75rem', fontWeight:600, textTransform:'uppercase', opacity:0.5, marginBottom:'0.25rem' }}>{c.label}</div>
                                            <div style={{ opacity:0.9 }}>{c.value}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Form preview */}
                        <div style={{ flex:`0 0 ${ colRight }`, display:'flex', flexDirection:'column', gap:'1.25rem' }}>
                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
                                { ['Nome *', 'Email *'].map( p => (
                                    <div key={p} style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                                        <label style={{ fontSize:'0.8125rem', fontWeight:600, opacity:0.7 }}>{p}</label>
                                        <div style={{ padding:'0.875rem 1rem', border:`1px solid ${inputBorder}`, borderRadius:'6px', background:inputBg, opacity:0.6 }}></div>
                                    </div>
                                ))}
                            </div>
                            { showPhone && <div style={{ padding:'0.875rem 1rem', border:`1px solid ${inputBorder}`, borderRadius:'6px', background:inputBg, opacity:0.6 }}></div> }
                            { showSubject && <div style={{ padding:'0.875rem 1rem', border:`1px solid ${inputBorder}`, borderRadius:'6px', background:inputBg, opacity:0.6 }}></div> }
                            <div style={{ padding:'0.875rem 1rem', height:'140px', border:`1px solid ${inputBorder}`, borderRadius:'6px', background:inputBg, opacity:0.6 }}></div>
                            <div style={{ display:'inline-flex', padding:'1rem 2.5rem', background:accentColor, color:'#fff', fontWeight:700, borderRadius:'6px', alignSelf:'flex-start', fontSize:'0.9375rem' }}>
                                {btnLabel}
                            </div>
                        </div>

                    </div>
                </section>
            </>
        )
    },

    save: () => null,
})
