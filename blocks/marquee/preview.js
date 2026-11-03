import { Fragment, useState, useEffect, useRef } from '@wordpress/element'
import { SelectControl, TextControl, Button } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

const SEPARATORS = [
    { label: '• Pallino',   value: '•' },
    { label: '| Barra',     value: '|' },
    { label: '/ Slash',     value: '/' },
    { label: '— Trattino',  value: '—' },
    { label: '★ Stella',    value: '★' },
    { label: '✦ Scintilla', value: '✦' },
]

// Scelta del Google Font: l'elenco arriva dal PHP
export function FontControl( { value, onChange } ) {
    return (
        <SelectControl
            label={ __( 'Font', 'arkimedia' ) }
            value={value}
            options={[
                { label: __( 'Font del tema', 'arkimedia' ), value: '' },
                ...Object.keys( window.arkGoogleFonts || {} ).map( font => ({ label: font, value: font }) ),
            ]}
            onChange={onChange}
        />
    )
}

// Misure del separatore, relative al testo: M è uguale al testo
export const SEPARATOR_SIZES = [
    { label:'S',  value:'0.6em', px:12 },
    { label:'M',  value:'1em',   px:20 },
    { label:'L',  value:'1.5em', px:30 },
    { label:'XL', value:'2em',   px:40 },
]

// Stessa divisione di ark_render_marquee(): una voce per riga, • per i testi già salvati
function splitItems( text ) {
    return ( text || '' ).split( /[•\r\n]+/ ).map( s => s.replace( /\s+/g, ' ' ).trim() ).filter( Boolean )
}

// Una riga per ogni voce, salvate nel testo una per riga
export function ItemsControl( { value, onChange, onLive } ) {
    const parsed = splitItems( value )
    const [ items, setItems ] = useState( parsed.length ? parsed : [ '' ] )

    useEffect( () => {
        if ( items.map( s => s.trim() ).filter( Boolean ).join( '\n' ) !== parsed.join( '\n' ) ) {
            setItems( parsed.length ? parsed : [ '' ] )
        }
    }, [ value ] )

    const join   = ( next ) => next.map( s => s.trim() ).filter( Boolean ).join( '\n' )
    const commit = ( next ) => onChange( join( next ) )

    return (
        <div>
            { items.map( ( item, i ) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'4px' }}>
                    <div style={{ flex:1 }}>
                        <TextControl
                            label={ `${ __( 'Voce', 'arkimedia' ) } ${ i + 1 }` }
                            value={item}
                            onChange={ v => {
                                const next = items.map( ( s, n ) => n === i ? v : s )
                                setItems( next )
                                onLive?.( join( next ) )
                            }}
                            onBlur={ () => commit( items ) }
                        />
                    </div>
                    { items.length > 1 &&
                        <Button
                            icon="no-alt" isDestructive
                            label={ __( 'Elimina voce', 'arkimedia' ) }
                            style={{ marginTop:'24px' }}
                            onClick={ () => {
                                const next = items.filter( ( _, n ) => n !== i )
                                setItems( next )
                                commit( next )
                            }}
                        />
                    }
                </div>
            ))}
            <Button variant="secondary" onClick={ () => setItems( [ ...items, '' ] ) }
                style={{ width:'100%', justifyContent:'center', marginBottom:'16px' }}>
                { __( 'Aggiungi voce', 'arkimedia' ) }
            </Button>
        </div>
    )
}

// Scelta del simbolo tra le voci: elenco, nessuno o valore personalizzato
export function SeparatorControl( { value, onChange, onLive } ) {
    const isPreset = value === '' || SEPARATORS.some( s => s.value === value )
    const [ custom, setCustom ] = useState( ! isPreset )
    const [ local, setLocal ]   = useState( value )
    useEffect( () => { setLocal( value ) }, [ value ] )

    return (
        <>
            <SelectControl
                label={ __( 'Separatore tra le voci', 'arkimedia' ) }
                value={ custom ? 'custom' : ( value === '' ? 'none' : value ) }
                options={[
                    ...SEPARATORS,
                    { label: __( 'Nessuno', 'arkimedia' ), value: 'none' },
                    { label: __( 'Personalizzato', 'arkimedia' ), value: 'custom' },
                ]}
                onChange={ v => {
                    setCustom( v === 'custom' )
                    if ( v !== 'custom' ) onChange( v === 'none' ? '' : v )
                }}
            />
            { custom && (
                <TextControl
                    label={ __( 'Separatore personalizzato', 'arkimedia' ) }
                    value={local}
                    onChange={ v => { setLocal( v ); onLive?.( v ) } }
                    onBlur={ () => onChange( local ) }
                />
            ) }
        </>
    )
}

// Anteprima del marquee: stesso markup di ark_render_marquee() e stesso script del sito
export function MarqueePreview( { text, fontSize, speed, direction = 'left', pause = false, separator = '•', separatorSize = '1em', font = '', color = '', separatorColor = '' } ) {
    const ref = useRef()

    useEffect( () => {
        if ( ! ref.current || ! window.arkMarquee ) return
        return window.arkMarquee.init( ref.current )
    }, [ text, fontSize, speed, separator, separatorSize, font ] )

    // L'editor è in un iframe: il font va caricato nel suo documento
    useEffect( () => {
        const doc = ref.current?.ownerDocument
        const url = window.arkGoogleFonts?.[ font ]
        if ( ! doc || ! url || doc.querySelector( `link[href="${ url }"]` ) ) return
        const link = doc.createElement( 'link' )
        link.rel  = 'stylesheet'
        link.href = url
        doc.head.appendChild( link )
    }, [ font ] )

    // Stessa normalizzazione di ark_render_marquee()
    const glue = separator === ''
        ? '    '
        : <>{ '\u00A0' }<span className="ark-marquee__sep" style={{ fontSize: separatorSize, color: separatorColor || undefined }}>{separator}</span>{ '\u00A0' }</>

    const classes = [
        'ark-marquee',
        direction === 'right' ? 'ark-marquee--right' : '',
        pause ? 'ark-marquee--pause' : '',
    ].filter( Boolean ).join( ' ' )

    return (
        <div ref={ref} className={classes} data-speed={speed}>
            <div className="ark-marquee__track">
                <span className="ark-marquee__group" style={{ fontSize, fontFamily: font ? `'${ font }', sans-serif` : undefined, color: color || undefined }}>
                    { splitItems( text ).map( ( item, i ) => <Fragment key={i}>{item}{glue}</Fragment> ) }
                </span>
            </div>
        </div>
    )
}
