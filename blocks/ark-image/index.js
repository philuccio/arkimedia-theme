import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor'
import {
    PanelBody, TextControl, SelectControl, RangeControl,
    ToggleControl, Button,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { useState, useEffect, useCallback, useRef } from '@wordpress/element'
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

// ── Hook locale per RangeControl ──────────────────────────
function useLocalRange( value, onChange ) {
    const [ local, setLocal ] = useState( value ?? 0 )
    useEffect( () => { setLocal( value ?? 0 ) }, [ value ] )
    return {
        value:    local,
        onChange: ( v ) => { setLocal( v ); onChange( v ) },
    }
}

// ── Cursore: anteprima dal vivo durante il trascinamento, salvataggio al rilascio ──
function LocalRange( { label, value, onChange, onLive, min = 0, max = 200, step = 1, help } ) {
    const [ local, setLocal ] = useState( value ?? 0 )
    const committed = useRef( value ?? 0 )
    useEffect( () => { setLocal( value ?? 0 ); committed.current = value ?? 0 }, [ value ] )
    const commit = useCallback( () => {
        if ( committed.current !== local ) { committed.current = local; onChange( local ) }
    }, [ local, onChange ] )
    return (
        <div onPointerUp={ commit } onKeyUp={ commit }>
            <RangeControl label={label} value={local} onChange={ v => { setLocal( v ); onLive?.( v ) } } min={min} max={max} step={step} help={help} />
        </div>
    )
}

// ── Proporzioni ───────────────────────────────────────────
const RATIOS = [ '1/1', '4/3', '3/2', '16/9', '21/9', '3/4', '2/3', '9/16' ]

function ratioMode( aspectRatio, height ) {
    if ( aspectRatio ) return RATIOS.includes( aspectRatio ) ? aspectRatio : 'custom'
    if ( height && height !== 'auto' ) return 'fixed'
    return 'original'
}

// "100%" → { num: 100, unit: '%' } · "400px" → { num: 400, unit: 'px' }
function parseSize( value, fallback ) {
    const m = String( value || '' ).trim().match( /^(\d+(?:\.\d+)?)\s*(px|%)$/ )
    return m ? { num: parseFloat( m[1] ), unit: m[2] } : fallback
}

const WIDTH_LIMITS = { '%': { min: 5, max: 100, step: 1, def: 100 }, 'px': { min: 50, max: 1600, step: 10, def: 600 } }

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const {
            mediaUrl, mediaAlt, mediaId, caption, linkUrl, linkTarget, lightbox,
            width, height, objectFit, objectPosition, borderRadius,
            align, hoverEffect, opacity,
            paddingTop, paddingBottom, marginTop, marginBottom,
            maxWidth, aspectRatio, filter,
        } = attributes

        // ── Hook locali TextControl ───────────────────────
        const altText      = useLocalText( mediaAlt,    v => setAttributes({ mediaAlt: v }) )
        const captionText  = useLocalText( caption,     v => setAttributes({ caption: v }) )
        const maxWidthText = useLocalText( maxWidth,    v => setAttributes({ maxWidth: v }) )
        const ratioText    = useLocalText( aspectRatio, v => setAttributes({ aspectRatio: v, height: 'auto' }) )
        const linkUrlText  = useLocalText( linkUrl,     v => setAttributes({ linkUrl: v }) )

        // ── Hook locali RangeControl ──────────────────────
        const borderRadiusR  = useLocalRange( borderRadius,  v => setAttributes({ borderRadius: v }) )
        const opacityR       = useLocalRange( opacity,       v => setAttributes({ opacity: v }) )
        const paddingTopR    = useLocalRange( paddingTop,    v => setAttributes({ paddingTop: v }) )
        const paddingBottomR = useLocalRange( paddingBottom, v => setAttributes({ paddingBottom: v }) )
        const marginTopR     = useLocalRange( marginTop,     v => setAttributes({ marginTop: v }) )
        const marginBottomR  = useLocalRange( marginBottom,  v => setAttributes({ marginBottom: v }) )

        // ── Anteprima dal vivo (valori in trascinamento) ──
        const [ live, setLive ] = useState( {} )
        useEffect( () => { setLive( {} ) }, [ width, height ] )
        const pWidth  = live.width  ?? width
        const pHeight = live.height ?? height

        // ── Larghezza: cursore in % o px ──
        const widthSize  = parseSize( width, { num: 100, unit: '%' } )
        const widthLimit = WIDTH_LIMITS[ widthSize.unit ]
        const setUnit    = unit => {
            if ( unit === widthSize.unit ) return
            setAttributes({ width: `${ WIDTH_LIMITS[ unit ].def }${ unit }` })
        }

        // ── Proporzione ──
        const [ mode, setMode ] = useState( ratioMode( aspectRatio, height ) )
        useEffect( () => { if ( mode !== 'custom' ) setMode( ratioMode( aspectRatio, height ) ) }, [ aspectRatio, height ] )
        const heightPx = parseSize( height, { num: 300, unit: 'px' } ).num

        const onRatioChange = v => {
            setMode( v )
            if ( v === 'original' )   setAttributes({ aspectRatio: '', height: 'auto' })
            else if ( v === 'fixed' ) setAttributes({ aspectRatio: '', height: height && height !== 'auto' ? height : '300px' })
            else if ( v === 'custom' ) setAttributes({ aspectRatio: aspectRatio && ! RATIOS.includes( aspectRatio ) ? aspectRatio : '5/4', height: 'auto' })
            else                      setAttributes({ aspectRatio: v, height: 'auto' })
        }

        const alignStyle = align === 'center' ? { marginLeft:'auto', marginRight:'auto' }
                         : align === 'right'  ? { marginLeft:'auto' }
                         : align === 'left'   ? { marginRight:'auto' }
                         : {}

        const blockProps = useBlockProps({
            style: {
                ...alignStyle,
                maxWidth:      maxWidth || undefined,
                paddingTop:    paddingTop    ? `${ paddingTop }px`    : 0,
                paddingBottom: paddingBottom ? `${ paddingBottom }px` : 0,
                marginTop:     marginTop     ? `${ marginTop }px`     : 0,
                marginBottom:  marginBottom  ? `${ marginBottom }px`  : 0,
                display:       'block',
                width:         pWidth || '100%',
            }
        })

        const imgStyle = {
            width:        '100%',
            height:       mode === 'fixed' ? pHeight : 'auto',
            objectFit,
            objectPosition,
            borderRadius: `${ borderRadius }px`,
            opacity,
            display:      'block',
            maxWidth:     '100%',
            aspectRatio:  mode !== 'fixed' && aspectRatio ? aspectRatio : undefined,
            filter:       filter !== 'none' ? filter : undefined,
        }

        return (
            <>
                <InspectorControls>
                    <PanelBody title={ __( 'Immagine', 'arkimedia' ) } initialOpen={true}>
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={ media => setAttributes({ mediaUrl: media.url, mediaAlt: media.alt || '', mediaId: media.id }) }
                                allowedTypes={['image']}
                                value={mediaId}
                                render={ ({ open }) => (
                                    <div>
                                        { mediaUrl && <img src={mediaUrl} style={{ width:'100%', height:'80px', objectFit:'cover', borderRadius:'4px', marginBottom:'8px' }} /> }
                                        <Button onClick={open} variant={ mediaUrl ? 'secondary' : 'primary' } style={{ width:'100%', justifyContent:'center' }}>
                                            { mediaUrl ? __('Cambia immagine','arkimedia') : __('Seleziona immagine','arkimedia') }
                                        </Button>
                                        { mediaUrl && <Button onClick={ () => setAttributes({ mediaUrl:'', mediaAlt:'', mediaId:0 }) } variant="tertiary" isDestructive style={{ width:'100%', justifyContent:'center', marginTop:'4px' }}>{ __('Rimuovi','arkimedia') }</Button> }
                                    </div>
                                )}
                            />
                        </MediaUploadCheck>
                        <TextControl label={ __('Alt text','arkimedia') }    { ...altText }     />
                        <TextControl label={ __('Didascalia','arkimedia') }  { ...captionText } />
                    </PanelBody>

                    <PanelBody title={ __( 'Dimensioni', 'arkimedia' ) } initialOpen={false}>
                        <ToggleGroupControl label={ __('Unità larghezza','arkimedia') } value={ widthSize.unit } onChange={ setUnit } isBlock>
                            <ToggleGroupControlOption value="%"  label="%" />
                            <ToggleGroupControlOption value="px" label="px" />
                        </ToggleGroupControl>
                        <LocalRange
                            label={ __('Larghezza','arkimedia') + ` (${ widthSize.unit })` }
                            value={ widthSize.num }
                            min={ widthLimit.min } max={ widthLimit.max } step={ widthLimit.step }
                            onChange={ v => setAttributes({ width: `${ v }${ widthSize.unit }` }) }
                            onLive={ v => setLive( l => ({ ...l, width: `${ v }${ widthSize.unit }` }) ) }
                            help={ mode === 'fixed' ? undefined : __('L\'altezza segue la larghezza in proporzione.','arkimedia') }
                        />

                        <SelectControl label={ __('Proporzione','arkimedia') } value={ mode }
                            options={[
                                { label: __('Originale','arkimedia'), value: 'original' },
                                { label: '1:1',  value: '1/1' },
                                { label: '4:3',  value: '4/3' },
                                { label: '3:2',  value: '3/2' },
                                { label: '16:9', value: '16/9' },
                                { label: '21:9', value: '21/9' },
                                { label: '3:4',  value: '3/4' },
                                { label: '2:3',  value: '2/3' },
                                { label: '9:16', value: '9/16' },
                                { label: __('Personalizzata','arkimedia'), value: 'custom' },
                                { label: __('Altezza fissa','arkimedia'),  value: 'fixed' },
                            ]}
                            onChange={ onRatioChange }
                        />
                        { mode === 'custom' && (
                            <TextControl label={ __('Proporzione personalizzata (es. 5/4)','arkimedia') } { ...ratioText } />
                        )}
                        { mode === 'fixed' && (
                            <LocalRange
                                label={ __('Altezza (px)','arkimedia') }
                                value={ heightPx }
                                min={ 50 } max={ 1200 } step={ 10 }
                                onChange={ v => setAttributes({ height: `${ v }px` }) }
                                onLive={ v => setLive( l => ({ ...l, height: `${ v }px` }) ) }
                            />
                        )}

                        <TextControl label={ __('Max width','arkimedia') }                     { ...maxWidthText } />
                        <RangeControl label={ __('Border radius (px)','arkimedia') } { ...borderRadiusR } min={0} max={200} />
                    </PanelBody>

                    <PanelBody title={ __( 'Stile', 'arkimedia' ) } initialOpen={false}>
                        <SelectControl label={ __('Object fit','arkimedia') } value={objectFit}
                            options={[ { label:'Cover', value:'cover' }, { label:'Contain', value:'contain' }, { label:'Fill', value:'fill' }, { label:'None', value:'none' } ]}
                            onChange={ v => setAttributes({ objectFit: v }) }
                        />
                        <SelectControl label={ __('Object position','arkimedia') } value={objectPosition}
                            options={[
                                { label:'Center',       value:'center center' },
                                { label:'Top',          value:'center top' },
                                { label:'Bottom',       value:'center bottom' },
                                { label:'Left',         value:'left center' },
                                { label:'Right',        value:'right center' },
                                { label:'Top Left',     value:'left top' },
                                { label:'Top Right',    value:'right top' },
                                { label:'Bottom Left',  value:'left bottom' },
                                { label:'Bottom Right', value:'right bottom' },
                            ]}
                            onChange={ v => setAttributes({ objectPosition: v }) }
                        />
                        <RangeControl label={ __('Opacità','arkimedia') } { ...opacityR } min={0} max={1} step={0.05} />
                        <SelectControl label={ __('Filtro CSS','arkimedia') } value={filter}
                            options={[
                                { label:'Nessuno',    value:'none' },
                                { label:'Grayscale',  value:'grayscale(100%)' },
                                { label:'Sepia',      value:'sepia(100%)' },
                                { label:'Blur',       value:'blur(4px)' },
                                { label:'Brightness', value:'brightness(1.2)' },
                            ]}
                            onChange={ v => setAttributes({ filter: v }) }
                        />
                        <SelectControl label={ __('Hover effect','arkimedia') } value={hoverEffect}
                            options={[
                                { label:'Nessuno',    value:'none' },
                                { label:'Zoom',       value:'zoom' },
                                { label:'Fade',       value:'fade' },
                                { label:'Grayscale',  value:'grayscale' },
                            ]}
                            onChange={ v => setAttributes({ hoverEffect: v }) }
                        />
                        <ToggleGroupControl label={ __('Allineamento','arkimedia') } value={align} onChange={ v => setAttributes({ align: v }) } isBlock>
                            <ToggleGroupControlOption value="none"   label="—" />
                            <ToggleGroupControlOption value="left"   label="←" />
                            <ToggleGroupControlOption value="center" label="↔" />
                            <ToggleGroupControlOption value="right"  label="→" />
                        </ToggleGroupControl>
                    </PanelBody>

                    <PanelBody title={ __( 'Link', 'arkimedia' ) } initialOpen={false}>
                        <ToggleControl label={ __('Lightbox','arkimedia') } checked={lightbox} onChange={ v => setAttributes({ lightbox: v }) } />
                        { ! lightbox && <>
                            <TextControl label={ __('URL link','arkimedia') } { ...linkUrlText } type="url" placeholder="https://..." />
                            <SelectControl label={ __('Apri in','arkimedia') } value={linkTarget}
                                options={[ { label:'Stessa finestra', value:'_self' }, { label:'Nuova finestra', value:'_blank' } ]}
                                onChange={ v => setAttributes({ linkTarget: v }) }
                            />
                        </> }
                    </PanelBody>

                    <PanelBody title={ __( 'Spaziatura', 'arkimedia' ) } initialOpen={false}>
                        <p style={{fontSize:'11px',fontWeight:600,marginBottom:'8px'}}>Padding</p>
                        <RangeControl label="Top"    { ...paddingTopR }    min={0} max={300} step={1} />
                        <RangeControl label="Bottom" { ...paddingBottomR } min={0} max={300} step={1} />
                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Margin</p>
                        <RangeControl label="Top"    { ...marginTopR }    min={0} max={300} step={1} />
                        <RangeControl label="Bottom" { ...marginBottomR } min={0} max={300} step={1} />
                    </PanelBody>
                </InspectorControls>

                <figure { ...blockProps } style={{ ...blockProps.style, margin:0 }}>
                    { mediaUrl ? (
                        <img src={mediaUrl} alt={mediaAlt} style={imgStyle} />
                    ) : (
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={ media => setAttributes({ mediaUrl: media.url, mediaAlt: media.alt || '', mediaId: media.id }) }
                                allowedTypes={['image']}
                                render={ ({ open }) => (
                                    <div onClick={open} style={{ padding:'3rem', textAlign:'center', background:'rgba(0,0,0,0.04)', border:'2px dashed #ddd', borderRadius:'4px', cursor:'pointer' }}>
                                        <p style={{ margin:0, opacity:0.5 }}>{ __('Clicca per selezionare un\'immagine','arkimedia') }</p>
                                    </div>
                                )}
                            />
                        </MediaUploadCheck>
                    )}
                    { caption && <figcaption style={{ fontSize:'0.875rem', opacity:0.6, marginTop:'0.5rem', textAlign:'center' }}>{caption}</figcaption> }
                </figure>
            </>
        )
    },

    save: () => null,
})
