import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor'
import {
    PanelBody, TextControl, SelectControl, RangeControl, ColorPicker, TabPanel,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { useState, useEffect, useCallback, useRef } from '@wordpress/element'
import { FontControl } from '../marquee/preview'
import metadata from './block.json'

// ── Hook locale per TextControl ───────────────────────────
function useLocalText( value, onChange ) {
    const [ local, setLocal ] = useState( value ?? '' )
    useEffect( () => { setLocal( value ?? '' ) }, [ value ] )
    return {
        value:    local,
        onChange: setLocal,
        onBlur:   useCallback( () => onChange( local ), [ local, onChange ] ),
    }
}

// ── Cursore: anteprima dal vivo durante il trascinamento, salvataggio al rilascio ──
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

// ── Dimensione testo: preset responsive oppure cursore in px ──
const TEXT_SIZES = [
    { label:'S',  value:'clamp(0.875rem,1vw,1rem)',  px:15 },
    { label:'M',  value:'clamp(1rem,1.4vw,1.25rem)', px:20 },
    { label:'L',  value:'clamp(1.5rem,3vw,2.5rem)',  px:40 },
    { label:'XL', value:'clamp(2.5rem,6vw,5rem)',    px:80 },
]

function sizeToPx( value, fallback ) {
    const match = /^([\d.]+)(px|rem|em)$/.exec( ( value || '' ).trim() )
    if ( ! match ) return fallback
    return Math.round( parseFloat( match[1] ) * ( match[2] === 'px' ? 1 : 16 ) )
}

function SizeControl( { value, onChange, onLive } ) {
    const preset = TEXT_SIZES.find( p => p.value === value )
    const [ custom, setCustom ] = useState( ! preset )
    useEffect( () => { if ( preset ) setCustom( false ) }, [ value ] )
    const px = sizeToPx( value, 16 )

    return (
        <>
            <ToggleGroupControl label={ __('Dimensione','arkimedia') } value={ custom ? 'custom' : value } isBlock
                onChange={ v => {
                    setCustom( v === 'custom' )
                    if ( v !== 'custom' ) onChange( v )
                }}>
                { TEXT_SIZES.map( p => <ToggleGroupControlOption key={p.label} value={p.value} label={p.label} /> ) }
                <ToggleGroupControlOption value="custom" label="px" />
            </ToggleGroupControl>
            { custom && (
                <LocalRange label={ __('Dimensione (px)','arkimedia') } value={ px }
                    onChange={ v => onChange( `${ v }px` ) } onLive={ v => onLive( `${ v }px` ) } min={10} max={160} />
            )}
            { custom && ! /^[\d.]+(px|rem|em)$/.test( ( value || '' ).trim() ) && (
                <p style={{ fontSize:'12px', opacity:0.7, marginTop:'-8px' }}>
                    { __('Valore attuale','arkimedia') }: <code>{ value }</code> — { __('si sostituisce spostando il cursore.','arkimedia') }
                </p>
            )}
        </>
    )
}

// L'editor è in un iframe: il Google Font va caricato anche nel suo documento
function useEditorFont( font ) {
    useEffect( () => {
        const url = window.arkGoogleFonts?.[ font ]
        if ( ! url ) return
        const iframe = document.querySelector( 'iframe[name="editor-canvas"]' )
        ;[ document, iframe?.contentDocument ].filter( Boolean ).forEach( doc => {
            if ( doc.querySelector( `link[href="${ url }"]` ) ) return
            const link = doc.createElement( 'link' )
            link.rel  = 'stylesheet'
            link.href = url
            doc.head.appendChild( link )
        })
    }, [ font ] )
}

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const {
            content, fontFamily, fontWeight, lineHeight, letterSpacing,
            textAlign, textTransform, color, maxWidth,
            marginTop, marginBottom, htmlTag,
        } = attributes

        const lineHeightText = useLocalText( lineHeight,    v => setAttributes({ lineHeight: v }) )
        const letterSpacText = useLocalText( letterSpacing, v => setAttributes({ letterSpacing: v }) )
        const maxWidthText   = useLocalText( maxWidth,      v => setAttributes({ maxWidth: v }) )

        // ── Anteprima dal vivo: valori in trascinamento, azzerati al salvataggio ──
        const [ live, setLive ] = useState( {} )
        useEffect( () => { setLive( {} ) }, [ attributes ] )
        const p      = { ...attributes, ...live }
        const onLive = key => v => setLive( l => ({ ...l, [ key ]: v }) )
        const range  = ( key, props ) => (
            <LocalRange { ...props } value={ attributes[ key ] }
                onChange={ v => setAttributes({ [ key ]: v }) } onLive={ onLive( key ) } />
        )

        useEditorFont( fontFamily )

        const style = {
            fontSize: p.fontSize, fontWeight, lineHeight,
            fontFamily: fontFamily ? `'${ fontFamily }', sans-serif` : undefined,
            letterSpacing, textAlign, textTransform,
            color: color || 'inherit',
            maxWidth: maxWidth || 'none',
            padding: `${ p.paddingTop }px ${ p.paddingRight }px ${ p.paddingBottom }px ${ p.paddingLeft }px`,
            marginTop:    `${ p.marginTop }px`,
            marginBottom: `${ p.marginBottom }px`,
        }

        const blockProps = useBlockProps({ style })

        // ── Scheda Tipografia ─────────────────────────────
        const typographyTab = (
            <PanelBody title={ __( 'Tipografia', 'arkimedia' ) } initialOpen={true}>
                <SelectControl label={ __('Tag HTML','arkimedia') } value={htmlTag}
                    options={[
                        { label:'p', value:'p' }, { label:'h1', value:'h1' }, { label:'h2', value:'h2' },
                        { label:'h3', value:'h3' }, { label:'h4', value:'h4' }, { label:'h5', value:'h5' },
                        { label:'h6', value:'h6' }, { label:'span', value:'span' }, { label:'div', value:'div' },
                    ]}
                    onChange={ v => setAttributes({ htmlTag: v }) }
                />
                <FontControl value={ fontFamily } onChange={ v => setAttributes({ fontFamily: v }) } />
                <SizeControl value={ attributes.fontSize } onChange={ v => setAttributes({ fontSize: v }) } onLive={ onLive( 'fontSize' ) } />
                <SelectControl label={ __('Font weight','arkimedia') } value={fontWeight}
                    options={[
                        { label:'Light 300', value:'300' }, { label:'Regular 400', value:'400' },
                        { label:'Medium 500', value:'500' }, { label:'SemiBold 600', value:'600' },
                        { label:'Bold 700', value:'700' }, { label:'ExtraBold 800', value:'800' },
                        { label:'Black 900', value:'900' },
                    ]}
                    onChange={ v => setAttributes({ fontWeight: v }) }
                />
                <TextControl label={ __('Line height','arkimedia') }    { ...lineHeightText } />
                <TextControl label={ __('Letter spacing','arkimedia') } { ...letterSpacText } placeholder="0 / 0.1em" />
                <SelectControl label={ __('Text transform','arkimedia') } value={textTransform}
                    options={[
                        { label:'None', value:'none' }, { label:'Uppercase', value:'uppercase' },
                        { label:'Lowercase', value:'lowercase' }, { label:'Capitalize', value:'capitalize' },
                    ]}
                    onChange={ v => setAttributes({ textTransform: v }) }
                />
            </PanelBody>
        )

        // ── Scheda Layout ─────────────────────────────────
        const layoutTab = (
            <>
                <PanelBody title={ __( 'Allineamento', 'arkimedia' ) } initialOpen={true}>
                    <ToggleGroupControl label={ __('Allineamento','arkimedia') } value={textAlign} onChange={ v => setAttributes({ textAlign: v }) } isBlock>
                        <ToggleGroupControlOption value="left" label="←" />
                        <ToggleGroupControlOption value="center" label="↔" />
                        <ToggleGroupControlOption value="right" label="→" />
                        <ToggleGroupControlOption value="justify" label="⇔" />
                    </ToggleGroupControl>
                    <TextControl label={ __('Max width (es. 600px, 80%)','arkimedia') } { ...maxWidthText } />
                </PanelBody>
                <PanelBody title={ __( 'Padding', 'arkimedia' ) } initialOpen={false}>
                    { range( 'paddingTop',    { label: 'Top',    max: 100 } ) }
                    { range( 'paddingRight',  { label: 'Right',  max: 100 } ) }
                    { range( 'paddingBottom', { label: 'Bottom', max: 100 } ) }
                    { range( 'paddingLeft',   { label: 'Left',   max: 100 } ) }
                </PanelBody>
                <PanelBody title={ __( 'Margin', 'arkimedia' ) } initialOpen={false}>
                    { range( 'marginTop',    { label: 'Top',    max: 200 } ) }
                    { range( 'marginBottom', { label: 'Bottom', max: 200 } ) }
                </PanelBody>
            </>
        )

        // ── Scheda Stile ──────────────────────────────────
        const styleTab = (
            <PanelBody title={ __( 'Colore', 'arkimedia' ) } initialOpen={true}>
                <ColorPicker color={color} onChange={ v => setAttributes({ color: v }) } enableAlpha />
            </PanelBody>
        )

        const tabs = { tipografia: typographyTab, layout: layoutTab, stile: styleTab }

        return (
            <>
                <InspectorControls>
                    <TabPanel
                        tabs={[
                            { name: 'tipografia', title: __( 'Tipografia', 'arkimedia' ) },
                            { name: 'layout',     title: __( 'Layout', 'arkimedia' ) },
                            { name: 'stile',      title: __( 'Stile', 'arkimedia' ) },
                        ]}>
                        { tab => tabs[ tab.name ] }
                    </TabPanel>
                </InspectorControls>

                <RichText
                    { ...blockProps }
                    identifier="content"
                    tagName={ htmlTag }
                    value={content}
                    onChange={ v => setAttributes({ content: v }) }
                    placeholder={ __( 'Scrivi il tuo testo...', 'arkimedia' ) }
                    allowedFormats={[ 'core/bold', 'core/italic', 'core/link', 'core/underline', 'core/strikethrough' ]}
                />
            </>
        )
    },

    save: () => null,
})
