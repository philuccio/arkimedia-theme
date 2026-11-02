import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor'
import {
    PanelBody, TextControl, ToggleControl, RangeControl,
    SelectControl, Button, ColorPicker, TabPanel,
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

// ── Misure testo: preset responsive oppure valore libero in px ──
const TITLE_SIZES = [
    { label:'S',  value:'clamp(1.5rem,3vw,2.5rem)',  px:40 },
    { label:'M',  value:'clamp(2rem,5vw,4.5rem)',    px:72 },
    { label:'L',  value:'clamp(2.5rem,7vw,6.5rem)',  px:104 },
    { label:'XL', value:'clamp(3rem,9vw,8.5rem)',    px:136 },
]
const SUBTITLE_SIZES = [
    { label:'S',  value:'clamp(0.875rem,1.2vw,1rem)', px:16 },
    { label:'M',  value:'clamp(1rem,1.5vw,1.25rem)',  px:20 },
    { label:'L',  value:'clamp(1.125rem,2vw,1.5rem)', px:24 },
    { label:'XL', value:'clamp(1.25rem,2.5vw,2rem)',  px:32 },
]

function sizeToPx( value, fallback ) {
    const match = /^([\d.]+)(px|rem)$/.exec( value || '' )
    if ( ! match ) return fallback
    return Math.round( parseFloat( match[1] ) * ( match[2] === 'rem' ? 16 : 1 ) )
}

function SizeControl( { label, value, onChange, presets, max } ) {
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
                    onChange={ v => onChange( `${ v }px` ) } min={10} max={max} />
            ) }
        </>
    )
}

const HEIGHT_PRESETS = [ '100vh', '90vh', '80vh', '70vh', '600px', '500px', '400px', 'auto' ]

const POSITION_MAP = { top: 'flex-start', center: 'center', bottom: 'flex-end' }

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const {
            effect, autoplay, autoplayDelay, loop, speed,
            navigation, pagination, paginationType,
            slidesPerView, spaceBetween, centeredSlides,
            grabCursor, sliderHeight, gsapAnimation, slides
        } = attributes

        const [ activeSlide, setActiveSlide ] = useState( 0 )
        const [ customHeight, setCustomHeight ] = useState( ! HEIGHT_PRESETS.includes( sliderHeight ) )

        const current = slides[ activeSlide ] || slides[0]
        const index   = slides[ activeSlide ] ? activeSlide : 0

        const updateSlide = ( i, data ) => {
            const updated = slides.map( ( s, n ) => n === i ? { ...s, ...data } : s )
            setAttributes({ slides: updated })
        }

        const heightText   = useLocalText( sliderHeight, v => setAttributes({ sliderHeight: v }) )
        const eyebrowText  = useLocalText( current?.eyebrow,  v => updateSlide( index, { eyebrow: v }) )
        const titleText    = useLocalText( current?.title,    v => updateSlide( index, { title: v }) )
        const subtitleText = useLocalText( current?.subtitle, v => updateSlide( index, { subtitle: v }) )
        const ctaLabelText = useLocalText( current?.ctaLabel, v => updateSlide( index, { ctaLabel: v }) )
        const ctaUrlText   = useLocalText( current?.ctaUrl,   v => updateSlide( index, { ctaUrl: v }) )

        const blockProps = useBlockProps({
            className: 'ark-slider-block',
            style: {
                position:    'relative',
                width:       '100vw',
                maxWidth:    '100vw',
                marginLeft:  'calc(50% - 50vw)',
                marginRight: 'calc(50% - 50vw)',
                minHeight:   sliderHeight,
                overflow:    'hidden',
            }
        })

        const addSlide = () => {
            setAttributes({ slides: [ ...slides, {
                title: 'Nuova slide', subtitle: '', eyebrow: '',
                ctaLabel: '', ctaUrl: '#',
                mediaId: 0, mediaUrl: '', mediaAlt: '',
                useBgColor: false, bgColor: '#0a0a0a',
                overlayColor: 'rgba(0,0,0,0.45)', textAlign: 'left',
                contentPosition: 'bottom',
                titleSize: TITLE_SIZES[1].value, subtitleSize: SUBTITLE_SIZES[1].value,
            }]})
            setActiveSlide( slides.length )
        }

        const removeSlide = ( i ) => {
            if ( slides.length <= 1 ) return
            setAttributes({ slides: slides.filter( ( _, n ) => n !== i ) })
            setActiveSlide( Math.max( 0, i - 1 ) )
        }

        const perView    = parseInt( slidesPerView ) || 1
        const loopBlocked = loop && effect !== 'cards' && slidesPerView !== 'auto' && slides.length <= perView

        const swiperTab = (
            <>
                <PanelBody title={ __( 'Effetto', 'arkimedia' ) } initialOpen={true}>
                    <SelectControl
                        label={ __( 'Effetto transizione', 'arkimedia' ) }
                        value={effect}
                        options={[
                            { label: 'Slide',      value: 'slide' },
                            { label: 'Fade',       value: 'fade' },
                            { label: 'Cube',       value: 'cube' },
                            { label: 'Coverflow',  value: 'coverflow' },
                            { label: 'Cards',      value: 'cards' },
                            { label: 'Flip',       value: 'flip' },
                        ]}
                        onChange={ val => setAttributes({ effect: val }) }
                        help={ effect === 'cards' ? __( 'Con Cards il loop non è disponibile', 'arkimedia' ) : undefined }
                    />
                    <LocalRange label={ __( 'Velocità transizione (ms)', 'arkimedia' ) } value={speed} onChange={ val => setAttributes({ speed: val }) } min={200} max={2000} step={100} />
                    <ToggleControl label={ __('Animazione GSAP','arkimedia') } checked={gsapAnimation} onChange={ val => setAttributes({ gsapAnimation: val }) } />
                </PanelBody>

                <PanelBody title={ __( 'Dimensioni', 'arkimedia' ) } initialOpen={false}>
                    <SelectControl
                        label={ __( 'Altezza slider', 'arkimedia' ) }
                        value={ customHeight ? 'custom' : sliderHeight }
                        options={[
                            { label: '100vh (fullscreen)', value: '100vh' },
                            { label: '90vh',   value: '90vh' },
                            { label: '80vh',   value: '80vh' },
                            { label: '70vh',   value: '70vh' },
                            { label: '600px',  value: '600px' },
                            { label: '500px',  value: '500px' },
                            { label: '400px',  value: '400px' },
                            { label: __('Adatta al contenuto','arkimedia'), value: 'auto' },
                            { label: __('Personalizzata','arkimedia'),      value: 'custom' },
                        ]}
                        onChange={ val => {
                            setCustomHeight( val === 'custom' )
                            if ( val !== 'custom' ) setAttributes({ sliderHeight: val })
                        }}
                    />
                    { customHeight && (
                        <TextControl
                            label={ __('Altezza personalizzata (CSS)','arkimedia') }
                            { ...heightText }
                            help={ __('Es. 75vh, 60svh, 40rem, clamp(400px,70vh,900px), calc(100vh - 100px). Percentuali non supportate.','arkimedia') }
                        />
                    ) }
                    <SelectControl
                        label={ __( 'Slide per vista', 'arkimedia' ) }
                        value={slidesPerView}
                        options={[
                            { label: '1',    value: '1' },
                            { label: '2',    value: '2' },
                            { label: '3',    value: '3' },
                            { label: 'Auto', value: 'auto' },
                        ]}
                        onChange={ val => setAttributes({ slidesPerView: val }) }
                        help={ loopBlocked ? __( 'Tutte le slide sono già visibili: aggiungine altre per attivare scorrimento e loop', 'arkimedia' ) : undefined }
                    />
                    <LocalRange label={ __( 'Spazio tra slide (px)', 'arkimedia' ) } value={spaceBetween} onChange={ val => setAttributes({ spaceBetween: val }) } min={0} max={100} step={4} />
                    <ToggleControl label={ __('Slide centrate','arkimedia') } checked={centeredSlides} onChange={ val => setAttributes({ centeredSlides: val }) } />
                </PanelBody>

                <PanelBody title={ __( 'Comportamento', 'arkimedia' ) } initialOpen={false}>
                    <ToggleControl label={ __('Loop infinito','arkimedia') } checked={loop} onChange={ val => setAttributes({ loop: val }) } />
                    <ToggleControl label={ __('Grab cursor','arkimedia') } checked={grabCursor} onChange={ val => setAttributes({ grabCursor: val }) } />
                </PanelBody>

                <PanelBody title={ __( 'Autoplay', 'arkimedia' ) } initialOpen={false}>
                    <ToggleControl label={ __('Abilita autoplay','arkimedia') } checked={autoplay} onChange={ val => setAttributes({ autoplay: val }) } />
                    { autoplay &&
                        <LocalRange label={ __( 'Delay (ms)', 'arkimedia' ) } value={autoplayDelay} onChange={ val => setAttributes({ autoplayDelay: val }) } min={1000} max={10000} step={500} />
                    }
                </PanelBody>

                <PanelBody title={ __( 'Navigazione', 'arkimedia' ) } initialOpen={false}>
                    <ToggleControl label={ __('Frecce navigazione','arkimedia') } checked={navigation} onChange={ val => setAttributes({ navigation: val }) } />
                    <ToggleControl label={ __('Paginazione','arkimedia') } checked={pagination} onChange={ val => setAttributes({ pagination: val }) } />
                    { pagination &&
                        <SelectControl
                            label={ __( 'Tipo paginazione', 'arkimedia' ) }
                            value={paginationType}
                            options={[
                                { label: 'Bullets',     value: 'bullets' },
                                { label: 'Fraction',    value: 'fraction' },
                                { label: 'Progressbar', value: 'progressbar' },
                            ]}
                            onChange={ val => setAttributes({ paginationType: val }) }
                        />
                    }
                </PanelBody>
            </>
        )

        const slideTab = current && (
            <>
                <PanelBody title={ `${ __( 'Slide', 'arkimedia' ) } (${ slides.length })` } initialOpen={true}>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'4px' }}>
                        { slides.map( ( s, i ) => (
                            <button key={i}
                                onClick={ () => setActiveSlide(i) }
                                style={{
                                    padding:      '4px 10px',
                                    fontSize:     '11px',
                                    fontWeight:   index === i ? 700 : 400,
                                    background:   index === i ? '#1a1a2e' : '#f0f0f0',
                                    color:        index === i ? '#fff' : '#333',
                                    border:       'none',
                                    borderRadius: '4px',
                                    cursor:       'pointer',
                                }}>
                                { `Slide ${ i + 1 }` }
                            </button>
                        ))}
                        <button onClick={addSlide}
                            style={{ padding:'4px 10px', fontSize:'11px', background:'#e94560', color:'#fff', border:'none', borderRadius:'4px', cursor:'pointer' }}>
                            +
                        </button>
                    </div>
                    { slides.length > 1 &&
                        <Button onClick={ () => removeSlide( index ) }
                            variant="tertiary" isDestructive
                            style={{ width:'100%', justifyContent:'center', marginTop:'12px' }}>
                            { `${ __( 'Elimina slide', 'arkimedia' ) } ${ index + 1 }` }
                        </Button>
                    }
                </PanelBody>

                <PanelBody title={ __( 'Testi', 'arkimedia' ) } initialOpen={true}>
                    <TextControl label={ __('Eyebrow','arkimedia') } { ...eyebrowText } placeholder="Es. NOVITÀ" />
                    <TextControl label={ __('Titolo','arkimedia') } { ...titleText } />
                    <SizeControl key={ `title-${ index }` } label={ __('Dimensione titolo','arkimedia') } presets={TITLE_SIZES} max={240}
                        value={ current.titleSize || TITLE_SIZES[1].value }
                        onChange={ v => updateSlide( index, { titleSize: v }) } />
                    <TextControl label={ __('Sottotitolo','arkimedia') } { ...subtitleText } />
                    <SizeControl key={ `subtitle-${ index }` } label={ __('Dimensione sottotitolo','arkimedia') } presets={SUBTITLE_SIZES} max={72}
                        value={ current.subtitleSize || SUBTITLE_SIZES[1].value }
                        onChange={ v => updateSlide( index, { subtitleSize: v }) } />
                    <TextControl label={ __('Testo pulsante','arkimedia') } { ...ctaLabelText } />
                    <TextControl label={ __('URL pulsante','arkimedia') } { ...ctaUrlText } type="url" />
                </PanelBody>

                <PanelBody title={ __( 'Posizione testo', 'arkimedia' ) } initialOpen={false}>
                    <ToggleGroupControl
                        label={ __('Allineamento testo','arkimedia') }
                        value={current.textAlign || 'left'}
                        onChange={ val => updateSlide( index, { textAlign: val }) }
                        isBlock>
                        <ToggleGroupControlOption value="left"   label="←" />
                        <ToggleGroupControlOption value="center" label="↔" />
                        <ToggleGroupControlOption value="right"  label="→" />
                    </ToggleGroupControl>
                    <ToggleGroupControl
                        label={ __('Posizione contenuto','arkimedia') }
                        value={current.contentPosition || 'bottom'}
                        onChange={ val => updateSlide( index, { contentPosition: val }) }
                        isBlock>
                        <ToggleGroupControlOption value="top"    label={ __('In alto','arkimedia') } />
                        <ToggleGroupControlOption value="center" label={ __('Al centro','arkimedia') } />
                        <ToggleGroupControlOption value="bottom" label={ __('In basso','arkimedia') } />
                    </ToggleGroupControl>
                </PanelBody>

                <PanelBody title={ __( 'Sfondo', 'arkimedia' ) } initialOpen={false}>
                    <ToggleControl
                        label={ __('Usa colore invece di immagine','arkimedia') }
                        checked={current.useBgColor}
                        onChange={ val => updateSlide( index, { useBgColor: val }) }
                    />

                    { current.useBgColor ? (
                        <>
                            <p style={{fontSize:'11px',fontWeight:600,marginBottom:'8px'}}>{ __('Colore sfondo','arkimedia') }</p>
                            <ColorPicker
                                color={current.bgColor}
                                onChange={ val => updateSlide( index, { bgColor: val }) }
                                enableAlpha
                            />
                        </>
                    ) : (
                        <>
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={ media => updateSlide( index, { mediaId: media.id, mediaUrl: media.url, mediaAlt: media.alt || '' }) }
                                    allowedTypes={['image']}
                                    value={current.mediaId}
                                    render={ ({ open }) => (
                                        <div>
                                            { current.mediaUrl &&
                                                <img src={current.mediaUrl}
                                                    style={{ width:'100%', height:'80px', objectFit:'cover', borderRadius:'4px', marginBottom:'8px' }}
                                                />
                                            }
                                            <Button onClick={open} variant={ current.mediaUrl ? 'secondary' : 'primary' }
                                                style={{ width:'100%', justifyContent:'center' }}>
                                                { current.mediaUrl ? __('Cambia immagine','arkimedia') : __('Seleziona immagine','arkimedia') }
                                            </Button>
                                            { current.mediaUrl &&
                                                <Button onClick={ () => updateSlide( index, { mediaId:0, mediaUrl:'', mediaAlt:'' }) }
                                                    variant="tertiary" isDestructive
                                                    style={{ width:'100%', justifyContent:'center', marginTop:'4px' }}>
                                                    { __('Rimuovi immagine','arkimedia') }
                                                </Button>
                                            }
                                        </div>
                                    )}
                                />
                            </MediaUploadCheck>
                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>{ __('Overlay','arkimedia') }</p>
                            <ColorPicker
                                color={current.overlayColor}
                                onChange={ val => updateSlide( index, { overlayColor: val }) }
                                enableAlpha
                                defaultValue="rgba(0,0,0,0.45)"
                            />
                        </>
                    )}
                </PanelBody>
            </>
        )

        const align = current?.textAlign || 'left'

        return (
            <>
                <InspectorControls>
                    <TabPanel
                        initialTabName="slide"
                        tabs={[
                            { name: 'swiper', title: __( 'Opzioni Swiper', 'arkimedia' ) },
                            { name: 'slide',  title: __( 'Slide', 'arkimedia' ) },
                        ]}>
                        { tab => tab.name === 'swiper' ? swiperTab : slideTab }
                    </TabPanel>
                </InspectorControls>

                {/* Stesso markup di render.php: l'anteprima deve coincidere con il sito */}
                <div { ...blockProps }>
                    { current && (
                        <div className={ `ark-slider-block__slide ark-slider-block__slide--align-${ align }` }
                            style={{
                                alignItems: POSITION_MAP[ current.contentPosition ] || 'flex-end',
                                background: current.useBgColor || ! current.mediaUrl ? current.bgColor : undefined,
                            }}>

                            { current.mediaUrl && ! current.useBgColor && (
                                <figure className="ark-slider-block__bg">
                                    <img src={current.mediaUrl} alt={current.mediaAlt} />
                                    <div className="ark-slider-block__overlay" style={{ background: current.overlayColor }} />
                                </figure>
                            )}

                            { ( current.eyebrow || current.title || current.subtitle || ( current.ctaLabel && current.ctaUrl ) ) && (
                                <div className="ark-slider-block__content">
                                    { current.eyebrow && <p className="ark-slider-block__eyebrow">{current.eyebrow}</p> }
                                    { current.title &&
                                        <h2 className="ark-slider-block__title" style={{ fontSize: current.titleSize || undefined }}>
                                            {current.title}
                                        </h2>
                                    }
                                    { current.subtitle &&
                                        <p className="ark-slider-block__subtitle" style={{ fontSize: current.subtitleSize || undefined }}>
                                            {current.subtitle}
                                        </p>
                                    }
                                    { current.ctaLabel && current.ctaUrl &&
                                        <span className="ark-slider-block__cta">{current.ctaLabel}</span>
                                    }
                                </div>
                            )}

                            {/* Indicatore slide */}
                            <div style={{ position:'absolute', bottom:'1rem', left:'50%', transform:'translateX(-50%)', display:'flex', gap:'6px', zIndex:3 }}>
                                { slides.map( ( _, i ) => (
                                    <div key={i} style={{
                                        width: i === index ? '20px' : '8px', height:'8px',
                                        borderRadius:'4px', background: i === index ? '#e94560' : 'rgba(255,255,255,0.4)',
                                        transition:'width 0.3s ease', cursor:'pointer',
                                    }} onClick={ () => setActiveSlide(i) } />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </>
        )
    },

    save: () => null,
})
