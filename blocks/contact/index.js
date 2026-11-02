import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls } from '@wordpress/block-editor'
import {
    PanelBody, TextControl, TextareaControl, ToggleControl,
    SelectControl, Button, ColorPicker, TabPanel,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { useState, useEffect } from '@wordpress/element'
import metadata from './block.json'

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

const COL_WIDTHS = {
    '50-50': [ '50%', '50%' ],
    '40-60': [ '40%', '60%' ],
    '60-40': [ '60%', '40%' ],
}

const labelStyle = { fontSize:'11px', fontWeight:600, margin:'16px 0 8px' }

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const {
            eyebrow, title, intro,
            bgColor, textColor, accentColor, inputBg, inputBorder,
            columnLayout, showPhone, showSubject, showHours,
            btnLabel, successMessage, errorMessage,
            privacyText, privacyLabel, privacyUrl,
            nameLabel, namePlaceholder, emailLabel, emailPlaceholder,
            phoneLabel, phonePlaceholder, subjectLabel, subjectPlaceholder,
            messageLabel, messagePlaceholder, hoursTitle,
            contacts, hours,
        } = attributes

        const blockProps = useBlockProps({
            className: 'ark-contact',
            style: {
                background:  bgColor,
                color:       textColor,
                width:       '100vw',
                maxWidth:    '100vw',
                marginLeft:  'calc(50% - 50vw)',
                marginRight: 'calc(50% - 50vw)',
            }
        })

        // Campo di testo legato a un attributo
        const field = ( label, key, props = {} ) => (
            <LocalField label={label} value={ attributes[ key ] } onCommit={ v => setAttributes({ [ key ]: v }) } { ...props } />
        )

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

        const removeHour = ( i ) => setAttributes({ hours: hours.filter( ( _, idx ) => idx !== i ) })

        const [ colLeft, colRight ] = COL_WIDTHS[ columnLayout ] || COL_WIDTHS[ '50-50' ]

        const inputStyle = { background: inputBg, borderColor: inputBorder, color: textColor }

        const contentTab = (
            <>
                <PanelBody title={ __( 'Testi', 'arkimedia' ) } initialOpen={true}>
                    { field( __('Eyebrow','arkimedia'), 'eyebrow' ) }
                    { field( __('Titolo','arkimedia'), 'title' ) }
                    { field( __('Intro','arkimedia'), 'intro', { as: TextareaControl } ) }
                </PanelBody>

                <PanelBody title={ __( 'Campi form', 'arkimedia' ) } initialOpen={false}>
                    { field( __('Etichetta nome','arkimedia'), 'nameLabel' ) }
                    { field( __('Suggerimento nome','arkimedia'), 'namePlaceholder' ) }
                    { field( __('Etichetta email','arkimedia'), 'emailLabel' ) }
                    { field( __('Suggerimento email','arkimedia'), 'emailPlaceholder' ) }
                    { field( __('Etichetta telefono','arkimedia'), 'phoneLabel' ) }
                    { field( __('Suggerimento telefono','arkimedia'), 'phonePlaceholder' ) }
                    { field( __('Etichetta oggetto','arkimedia'), 'subjectLabel' ) }
                    { field( __('Suggerimento oggetto','arkimedia'), 'subjectPlaceholder' ) }
                    { field( __('Etichetta messaggio','arkimedia'), 'messageLabel' ) }
                    { field( __('Suggerimento messaggio','arkimedia'), 'messagePlaceholder' ) }
                </PanelBody>

                <PanelBody title={ __( 'Invio e privacy', 'arkimedia' ) } initialOpen={false}>
                    { field( __('Testo pulsante','arkimedia'), 'btnLabel' ) }
                    { field( __('Messaggio successo','arkimedia'), 'successMessage' ) }
                    { field( __('Messaggio errore','arkimedia'), 'errorMessage' ) }
                    { field( __('Testo privacy','arkimedia'), 'privacyText' ) }
                    { field( __('Label link privacy','arkimedia'), 'privacyLabel' ) }
                    { field( __('URL privacy','arkimedia'), 'privacyUrl', { type: 'url', help: __( 'Se vuoto, usa la pagina privacy del sito.', 'arkimedia' ) } ) }
                </PanelBody>

                <PanelBody title={ `${ __( 'Contatti', 'arkimedia' ) } (${ contacts.length })` } initialOpen={false}>
                    { contacts.map( ( c, i ) => (
                        <div key={i} style={{ borderBottom:'1px solid #e0e0e0', paddingBottom:'12px', marginBottom:'12px' }}>
                            <p style={{ fontSize:'11px', fontWeight:600, marginBottom:'8px' }}>{ `Contatto ${ i + 1 }` }</p>
                            <LocalField label="Icona (emoji)" value={c.icon}  onCommit={ v => updateContact( i, { icon: v }) } />
                            <LocalField label="Etichetta"     value={c.label} onCommit={ v => updateContact( i, { label: v }) } />
                            <LocalField label="Valore"        value={c.value} onCommit={ v => updateContact( i, { value: v }) } />
                            <LocalField label="URL (opz.)"    value={c.url}   onCommit={ v => updateContact( i, { url: v }) } />
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
                        { field( __('Titolo orari','arkimedia'), 'hoursTitle' ) }
                        { hours.map( ( h, i ) => (
                            <div key={i} style={{ borderBottom:'1px solid #e0e0e0', paddingBottom:'8px', marginBottom:'8px' }}>
                                <LocalField label="Giorni" value={h.days} onCommit={ v => updateHour( i, { days: v }) } />
                                <LocalField label="Orario" value={h.time} onCommit={ v => updateHour( i, { time: v }) } />
                                <Button onClick={ () => removeHour(i) } variant="tertiary" isDestructive style={{ fontSize:'11px' }}>
                                    { __('Rimuovi','arkimedia') }
                                </Button>
                            </div>
                        ))}
                        <Button onClick={ () => setAttributes({ hours: [ ...hours, { days: '', time: '' } ] }) }
                            variant="primary" style={{ width:'100%', justifyContent:'center' }}>
                            { __('+ Aggiungi orario','arkimedia') }
                        </Button>
                    </PanelBody>
                )}
            </>
        )

        const layoutTab = (
            <>
                <PanelBody title={ __( 'Layout', 'arkimedia' ) } initialOpen={true}>
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
                    <p style={{ ...labelStyle, marginTop:0 }}>{ __('Sfondo','arkimedia') }</p>
                    <ColorPicker color={bgColor} onChange={ v => setAttributes({ bgColor: v }) } enableAlpha />
                    <p style={labelStyle}>{ __('Testo','arkimedia') }</p>
                    <ColorPicker color={textColor} onChange={ v => setAttributes({ textColor: v }) } />
                    <p style={labelStyle}>{ __('Accent','arkimedia') }</p>
                    <ColorPicker color={accentColor} onChange={ v => setAttributes({ accentColor: v }) } />
                    <p style={labelStyle}>{ __('Sfondo input','arkimedia') }</p>
                    <ColorPicker color={inputBg} onChange={ v => setAttributes({ inputBg: v }) } enableAlpha />
                    <p style={labelStyle}>{ __('Bordo input','arkimedia') }</p>
                    <ColorPicker color={inputBorder} onChange={ v => setAttributes({ inputBorder: v }) } enableAlpha />
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

                {/* Stesso markup di render.php: l'anteprima deve coincidere con il sito */}
                <section { ...blockProps }>
                    <div className="ark-contact__inner container" style={{ maxWidth:'1200px', margin:'0 auto' }}>

                        {/* Info */}
                        <div className="ark-contact__info" style={{ flex:`1 1 ${ colLeft }`, minWidth:0, boxSizing:'border-box' }}>
                            { eyebrow && <p className="ark-contact__eyebrow" style={{ color:accentColor }}>{eyebrow}</p> }
                            <h2 className="ark-contact__title">{title}</h2>
                            { intro && <p className="ark-contact__intro">{intro}</p> }
                            { contacts.length > 0 && (
                                <ul className="ark-contact__list">
                                    { contacts.map( ( c, i ) => (
                                        <li className="ark-contact__item" key={i}>
                                            { c.icon && <span className="ark-contact__icon" aria-hidden="true">{c.icon}</span> }
                                            <div className="ark-contact__item-content">
                                                <span className="ark-contact__item-label">{c.label}</span>
                                                <span className="ark-contact__item-value">{c.value}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            { showHours && hours.length > 0 && (
                                <div className="ark-contact__hours">
                                    <p className="ark-contact__hours-title" style={{ color:accentColor }}>{hoursTitle}</p>
                                    <ul className="ark-contact__hours-list">
                                        { hours.map( ( h, i ) => (
                                            <li key={i}><span>{h.days}</span><span>{h.time}</span></li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Form */}
                        <div className="ark-contact__form-wrap" style={{ flex:`1 1 ${ colRight }`, minWidth:0, boxSizing:'border-box' }}>
                            <div className="ark-contact__form" style={{ '--ark-contact-accent': accentColor }}>
                                <div className="ark-contact__form-row">
                                    <div className="ark-contact__field">
                                        <label>{nameLabel}</label>
                                        <input type="text" disabled placeholder={namePlaceholder} style={inputStyle} />
                                    </div>
                                    <div className="ark-contact__field">
                                        <label>{emailLabel}</label>
                                        <input type="email" disabled placeholder={emailPlaceholder} style={inputStyle} />
                                    </div>
                                </div>
                                { showPhone && (
                                    <div className="ark-contact__field">
                                        <label>{phoneLabel}</label>
                                        <input type="tel" disabled placeholder={phonePlaceholder} style={inputStyle} />
                                    </div>
                                )}
                                { showSubject && (
                                    <div className="ark-contact__field">
                                        <label>{subjectLabel}</label>
                                        <input type="text" disabled placeholder={subjectPlaceholder} style={inputStyle} />
                                    </div>
                                )}
                                <div className="ark-contact__field">
                                    <label>{messageLabel}</label>
                                    <textarea rows="6" disabled placeholder={messagePlaceholder} style={inputStyle}></textarea>
                                </div>
                                <div className="ark-contact__privacy">
                                    <input type="checkbox" disabled />
                                    <label>{privacyText} <span style={{ color:accentColor }}>{privacyLabel}</span></label>
                                </div>
                                <div className="ark-contact__submit" style={{ background:accentColor }}>
                                    <span className="ark-contact__submit-label">{btnLabel}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
            </>
        )
    },

    save: () => null,
})
