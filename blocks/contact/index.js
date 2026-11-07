import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls } from '@wordpress/block-editor'
import {
    PanelBody, TextControl, TextareaControl, ToggleControl,
    SelectControl, Button, ColorPicker, TabPanel,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { useState, useEffect } from '@wordpress/element'
import { useSelect } from '@wordpress/data'
import metadata from './block.json'
import ICONS from './icons.json'

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

// ── Icone e link dei contatti ─────────────────────────────
// Le pagine create prima della 2.1.43 salvavano un'emoji e un URL libero:
// normalizeContact le traduce nel nuovo formato (stessa logica in render.php).
const LEGACY_EMOJI = {
    '📍':'pin', '📌':'pin', '📞':'phone', '☎️':'phone', '📱':'mobile', '✉️':'mail', '✉':'mail', '📧':'mail',
    '🌐':'globe', '🕐':'clock', '⏰':'clock', '💬':'chat', '🏢':'building', '📠':'printer', '📅':'calendar',
}

const normalizeContact = ( c = {} ) => {
    let icon = c.icon ?? ''
    if ( icon && icon !== 'custom' && ! ICONS[ icon ] ) icon = LEGACY_EMOJI[ icon ] || 'info'
    const linkType = c.linkType || ( c.url ? 'url' : 'none' )
    return { ...c, icon, linkType }
}

const LINK_TYPES = [
    { label: 'Nessun link',      value: 'none' },
    { label: 'Pagina del sito',  value: 'page' },
    { label: 'Telefono',         value: 'tel' },
    { label: 'Email',            value: 'mailto' },
    { label: 'WhatsApp',         value: 'whatsapp' },
    { label: 'URL esterno',      value: 'url' },
]

const LINK_HELP = {
    tel:      'Il link chiama il numero scritto in "Valore".',
    mailto:   'Il link apre la mail all’indirizzo scritto in "Valore".',
    whatsapp: 'Usa il numero in "Valore", con prefisso internazionale (es. +39 333 1234567).',
}

function SvgIcon( { name, size = 24 } ) {
    const icon = ICONS[ name ]
    if ( ! icon ) return null
    return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: icon.svg }} />
    )
}

// Icona mostrata nell'anteprima: stesso markup di render.php
function ContactIcon( { contact, color } ) {
    if ( ! contact.icon ) return null
    if ( contact.icon === 'custom' ) {
        if ( ! contact.iconUrl ) return null
        return <span className="ark-contact__icon ark-contact__icon--img" aria-hidden="true"><img src={contact.iconUrl} alt="" /></span>
    }
    return <span className="ark-contact__icon" style={{ color }}><SvgIcon name={contact.icon} /></span>
}

const pickerBtn = ( active ) => ({
    width:'36px', height:'36px', display:'flex', alignItems:'center', justifyContent:'center',
    padding:0, cursor:'pointer', borderRadius:'4px', background: active ? '#f0f6fc' : '#fff', color:'#1e1e1e',
    border: active ? '2px solid var(--wp-admin-theme-color, #007cba)' : '1px solid #ddd',
})

// Griglia di scelta icona + caricamento icona personalizzata
function IconPicker( { contact, onChange } ) {
    const openMedia = () => {
        const frame = wp.media({ title: 'Seleziona icona', button: { text: 'Usa come icona' }, library: { type: 'image' }, multiple: false })
        frame.on( 'select', function() {
            const att = frame.state().get('selection').first().toJSON()
            onChange({ icon: 'custom', iconId: att.id, iconUrl: att.url })
        })
        frame.open()
    }
    return (
        <div style={{ marginBottom:'16px' }}>
            <p style={{ fontSize:'11px', fontWeight:500, textTransform:'uppercase', margin:'0 0 8px' }}>Icona</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 36px)', gap:'6px' }}>
                <button type="button" title="Nessuna icona" aria-label="Nessuna icona"
                    style={ pickerBtn( ! contact.icon ) } onClick={ () => onChange({ icon: '' }) }>
                    <span style={{ fontSize:'16px', lineHeight:1, color:'#949494' }}>∅</span>
                </button>
                { Object.keys( ICONS ).map( key => (
                    <button type="button" key={key} title={ ICONS[ key ].label } aria-label={ ICONS[ key ].label }
                        style={ pickerBtn( contact.icon === key ) } onClick={ () => onChange({ icon: key }) }>
                        <SvgIcon name={key} size={20} />
                    </button>
                ))}
                <button type="button" title="Carica immagine" aria-label="Carica immagine"
                    style={ pickerBtn( contact.icon === 'custom' ) } onClick={ openMedia }>
                    { contact.icon === 'custom' && contact.iconUrl
                        ? <img src={contact.iconUrl} alt="" style={{ width:'20px', height:'20px', objectFit:'contain' }} />
                        : <span style={{ fontSize:'18px', lineHeight:1 }}>+</span> }
                </button>
            </div>
            <p style={{ fontSize:'12px', color:'#757575', margin:'6px 0 0' }}>
                { contact.icon === 'custom' ? 'Icona personalizzata (clic su + per cambiarla)'
                    : contact.icon ? ICONS[ contact.icon ]?.label : 'Nessuna icona' }
            </p>
        </div>
    )
}

// Barra di una voce: titolo + sposta su / giù + rimuovi
function ItemBar( { title, index, count, onMove, onRemove } ) {
    return (
        <div style={{ display:'flex', alignItems:'center', gap:'2px', marginBottom:'8px' }}>
            <p style={{ fontSize:'11px', fontWeight:600, margin:0, flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{title}</p>
            <Button size="small" icon="arrow-up-alt2" label={ __( 'Sposta su', 'arkimedia' ) }
                disabled={ index === 0 } onClick={ () => onMove( index, index - 1 ) } />
            <Button size="small" icon="arrow-down-alt2" label={ __( 'Sposta giù', 'arkimedia' ) }
                disabled={ index === count - 1 } onClick={ () => onMove( index, index + 1 ) } />
            <Button size="small" icon="trash" label={ __( 'Rimuovi', 'arkimedia' ) } isDestructive
                onClick={ onRemove } />
        </div>
    )
}

const moveItem = ( list, from, to ) => {
    if ( to < 0 || to >= list.length || to === from ) return list
    const next = [ ...list ]
    next.splice( to, 0, next.splice( from, 1 )[0] )
    return next
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
            bgColor, textColor, accentColor, inputBg, inputBorder, iconColor,
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
            const updated = contacts.map( ( c, idx ) => idx === i ? { ...normalizeContact( c ), ...data } : c )
            setAttributes({ contacts: updated })
        }

        const addContact = () => setAttributes({ contacts: [ ...contacts, { icon: 'info', label: '', value: '', linkType: 'none' } ] })
        const removeContact = ( i ) => setAttributes({ contacts: contacts.filter( ( _, idx ) => idx !== i ) })
        const moveContact = ( from, to ) => setAttributes({ contacts: moveItem( contacts, from, to ) })

        const updateHour = ( i, data ) => {
            const updated = hours.map( ( h, idx ) => idx === i ? { ...h, ...data } : h )
            setAttributes({ hours: updated })
        }

        const removeHour = ( i ) => setAttributes({ hours: hours.filter( ( _, idx ) => idx !== i ) })
        const moveHour = ( from, to ) => setAttributes({ hours: moveItem( hours, from, to ) })

        // Pagine pubblicate per il menu "Pagina del sito"
        const pages = useSelect( select => select( 'core' ).getEntityRecords( 'postType', 'page', {
            per_page: -1, status: 'publish', orderby: 'title', order: 'asc', _fields: 'id,title',
        }), [] )
        const pageOptions = [
            { label: pages ? '— Scegli una pagina —' : 'Caricamento pagine…', value: 0 },
            ...( pages || [] ).map( p => ({ label: p.title?.rendered || `(senza titolo) #${ p.id }`, value: p.id }) ),
        ]

        const iconTint = iconColor === 'text' ? textColor : accentColor
        const items = contacts.map( normalizeContact )

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
                    { items.map( ( c, i ) => (
                        <div key={i} style={{ borderBottom:'1px solid #e0e0e0', paddingBottom:'12px', marginBottom:'12px' }}>
                            <ItemBar title={ `${ i + 1 }. ${ c.label || 'Contatto' }` } index={i} count={items.length}
                                onMove={moveContact} onRemove={ () => removeContact(i) } />
                            <IconPicker contact={c} onChange={ data => updateContact( i, data ) } />
                            <LocalField label="Etichetta" value={c.label} onCommit={ v => updateContact( i, { label: v }) } />
                            <LocalField label="Valore"    value={c.value} onCommit={ v => updateContact( i, { value: v }) } />
                            <SelectControl
                                label="Tipo di link"
                                value={c.linkType}
                                options={LINK_TYPES}
                                onChange={ v => updateContact( i, { linkType: v }) }
                                help={ LINK_HELP[ c.linkType ] }
                            />
                            { c.linkType === 'page' && (
                                <SelectControl
                                    label="Pagina"
                                    value={ c.pageId || 0 }
                                    options={pageOptions}
                                    onChange={ v => updateContact( i, { pageId: parseInt( v, 10 ) || 0 }) }
                                />
                            )}
                            { c.linkType === 'url' && (
                                <LocalField label="URL" type="url" placeholder="https://…" value={c.url}
                                    onCommit={ v => updateContact( i, { url: v }) }
                                    help="Si apre in una nuova scheda se porta fuori dal sito." />
                            )}
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
                                <ItemBar title={ `${ i + 1 }. ${ h.days || 'Orario' }` } index={i} count={hours.length}
                                    onMove={moveHour} onRemove={ () => removeHour(i) } />
                                <LocalField label="Giorni" value={h.days} onCommit={ v => updateHour( i, { days: v }) } />
                                <LocalField label="Orario" value={h.time} onCommit={ v => updateHour( i, { time: v }) } />
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
                    <ToggleControl label={ __('Mostra orari','arkimedia') }           checked={showHours}  onChange={ v => setAttributes({ showHours: v }) }
                        help={ __('Gli orari si compilano nella scheda Contenuto, pannello "Orari".','arkimedia') } />
                    <SelectControl
                        label={ __('Colore icone contatti','arkimedia') }
                        value={iconColor}
                        options={[
                            { label: __('Colore accento','arkimedia'), value:'accent' },
                            { label: __('Colore testo','arkimedia'),   value:'text' },
                        ]}
                        onChange={ v => setAttributes({ iconColor: v }) }
                    />
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
                            { items.length > 0 && (
                                <ul className="ark-contact__list">
                                    { items.map( ( c, i ) => (
                                        <li className="ark-contact__item" key={i}>
                                            <ContactIcon contact={c} color={iconTint} />
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
