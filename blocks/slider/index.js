import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck, RichText } from '@wordpress/block-editor'
import {
    PanelBody, TextControl, ToggleControl, RangeControl,
    SelectControl, Button, ColorPicker, __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import metadata from './block.json'

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const {
            effect, autoplay, autoplayDelay, loop, speed,
            navigation, pagination, paginationType,
            slidesPerView, spaceBetween, centeredSlides,
            grabCursor, sliderHeight, gsapAnimation, slides
        } = attributes

        const blockProps = useBlockProps({
            style: {
                position:    'relative',
                width:       '100vw',
                maxWidth:    '100vw',
                marginLeft:  'calc(50% - 50vw)',
                marginRight: 'calc(50% - 50vw)',
                height:      sliderHeight,
                overflow:    'hidden',
                background:  '#0a0a0a',
            }
        })

        const [activeSlide, setActiveSlide] = React.useState(0)

        const updateSlide = ( index, data ) => {
            const updated = slides.map( ( s, i ) => i === index ? { ...s, ...data } : s )
            setAttributes({ slides: updated })
        }

        const addSlide = () => {
            setAttributes({ slides: [ ...slides, {
                title: 'Nuova slide', subtitle: '', eyebrow: '',
                ctaLabel: '', ctaUrl: '#',
                mediaUrl: '', mediaAlt: '',
                useBgColor: false, bgColor: '#0a0a0a',
                overlayColor: 'rgba(0,0,0,0.45)', textAlign: 'left'
            }]})
            setActiveSlide( slides.length )
        }

        const removeSlide = ( index ) => {
            if ( slides.length <= 1 ) return
            const updated = slides.filter( ( _, i ) => i !== index )
            setAttributes({ slides: updated })
            setActiveSlide( Math.max( 0, index - 1 ) )
        }

        const current = slides[ activeSlide ] || slides[0]

        return (
            <>
                <InspectorControls>

                    {/* ── Swiper Options ── */}
                    <PanelBody title={ __( 'Opzioni Swiper', 'arkimedia' ) } initialOpen={true}>
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
                        />
                        <SelectControl
                            label={ __( 'Altezza slider', 'arkimedia' ) }
                            value={sliderHeight}
                            options={[
                                { label: '100vh (fullscreen)', value: '100vh' },
                                { label: '90vh',   value: '90vh' },
                                { label: '80vh',   value: '80vh' },
                                { label: '70vh',   value: '70vh' },
                                { label: '600px',  value: '600px' },
                                { label: '500px',  value: '500px' },
                                { label: '400px',  value: '400px' },
                            ]}
                            onChange={ val => setAttributes({ sliderHeight: val }) }
                        />
                        <SelectControl
                            label={ __( 'Slides per view', 'arkimedia' ) }
                            value={slidesPerView}
                            options={[
                                { label: '1',    value: '1' },
                                { label: '2',    value: '2' },
                                { label: '3',    value: '3' },
                                { label: 'Auto', value: 'auto' },
                            ]}
                            onChange={ val => setAttributes({ slidesPerView: val }) }
                        />
                        <RangeControl
                            label={ __( 'Spazio tra slide (px)', 'arkimedia' ) }
                            value={spaceBetween}
                            onChange={ val => setAttributes({ spaceBetween: val }) }
                            min={0} max={100} step={4}
                        />
                        <RangeControl
                            label={ __( 'Velocità transizione (ms)', 'arkimedia' ) }
                            value={speed}
                            onChange={ val => setAttributes({ speed: val }) }
                            min={200} max={2000} step={100}
                        />
                        <ToggleControl label={ __('Loop infinito','arkimedia') } checked={loop} onChange={ val => setAttributes({ loop: val }) } />
                        <ToggleControl label={ __('Grab cursor','arkimedia') } checked={grabCursor} onChange={ val => setAttributes({ grabCursor: val }) } />
                        <ToggleControl label={ __('Slides centrate','arkimedia') } checked={centeredSlides} onChange={ val => setAttributes({ centeredSlides: val }) } />
                        <ToggleControl label={ __('Animazione GSAP','arkimedia') } checked={gsapAnimation} onChange={ val => setAttributes({ gsapAnimation: val }) } />
                    </PanelBody>

                    {/* ── Autoplay ── */}
                    <PanelBody title={ __( 'Autoplay', 'arkimedia' ) } initialOpen={false}>
                        <ToggleControl label={ __('Abilita autoplay','arkimedia') } checked={autoplay} onChange={ val => setAttributes({ autoplay: val }) } />
                        { autoplay &&
                            <RangeControl
                                label={ __( 'Delay (ms)', 'arkimedia' ) }
                                value={autoplayDelay}
                                onChange={ val => setAttributes({ autoplayDelay: val }) }
                                min={1000} max={10000} step={500}
                            />
                        }
                    </PanelBody>

                    {/* ── Navigazione ── */}
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

                    {/* ── Gestione slide ── */}
                    <PanelBody title={ __( `Slide (${ slides.length })`, 'arkimedia' ) } initialOpen={false}>

                        {/* Tabs slide */}
                        <div style={{ display:'flex', flexWrap:'wrap', gap:'4px', marginBottom:'16px' }}>
                            { slides.map( ( s, i ) => (
                                <button key={i}
                                    onClick={ () => setActiveSlide(i) }
                                    style={{
                                        padding:      '4px 10px',
                                        fontSize:     '11px',
                                        fontWeight:   activeSlide === i ? 700 : 400,
                                        background:   activeSlide === i ? '#1a1a2e' : '#f0f0f0',
                                        color:        activeSlide === i ? '#fff' : '#333',
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

                        {/* Editor slide attiva */}
                        { current && (
                            <div>
                                <TextControl
                                    label={ __('Eyebrow','arkimedia') }
                                    value={current.eyebrow}
                                    onChange={ val => updateSlide( activeSlide, { eyebrow: val }) }
                                    placeholder="Es. NOVITÀ"
                                />
                                <TextControl
                                    label={ __('Titolo','arkimedia') }
                                    value={current.title}
                                    onChange={ val => updateSlide( activeSlide, { title: val }) }
                                />
                                <TextControl
                                    label={ __('Sottotitolo','arkimedia') }
                                    value={current.subtitle}
                                    onChange={ val => updateSlide( activeSlide, { subtitle: val }) }
                                />
                                <TextControl
                                    label={ __('Testo pulsante','arkimedia') }
                                    value={current.ctaLabel}
                                    onChange={ val => updateSlide( activeSlide, { ctaLabel: val }) }
                                />
                                <TextControl
                                    label={ __('URL pulsante','arkimedia') }
                                    value={current.ctaUrl}
                                    onChange={ val => updateSlide( activeSlide, { ctaUrl: val }) }
                                    type="url"
                                />

                                {/* Allineamento testo */}
                                <ToggleGroupControl
                                    label={ __('Allineamento testo','arkimedia') }
                                    value={current.textAlign}
                                    onChange={ val => updateSlide( activeSlide, { textAlign: val }) }
                                    isBlock>
                                    <ToggleGroupControlOption value="left"   label="←" />
                                    <ToggleGroupControlOption value="center" label="↔" />
                                    <ToggleGroupControlOption value="right"  label="→" />
                                </ToggleGroupControl>

                                {/* Sfondo */}
                                <div style={{ margin:'16px 0 8px', borderTop:'1px solid #e0e0e0', paddingTop:'12px' }}>
                                    <ToggleControl
                                        label={ __('Usa colore invece di immagine','arkimedia') }
                                        checked={current.useBgColor}
                                        onChange={ val => updateSlide( activeSlide, { useBgColor: val }) }
                                    />
                                </div>

                                { current.useBgColor ? (
                                    <>
                                        <p style={{fontSize:'11px',fontWeight:600,marginBottom:'8px'}}>{ __('Colore sfondo','arkimedia') }</p>
                                        <ColorPicker
                                            color={current.bgColor}
                                            onChange={ val => updateSlide( activeSlide, { bgColor: val }) }
                                            enableAlpha
                                        />
                                    </>
                                ) : (
                                    <>
                                        <MediaUploadCheck>
                                            <MediaUpload
                                                onSelect={ media => updateSlide( activeSlide, { mediaUrl: media.url, mediaAlt: media.alt || '' }) }
                                                allowedTypes={['image']}
                                                value={current.mediaUrl}
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
                                                            <Button onClick={ () => updateSlide( activeSlide, { mediaUrl:'', mediaAlt:'' }) }
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
                                            onChange={ val => updateSlide( activeSlide, { overlayColor: val }) }
                                            enableAlpha
                                            defaultValue="rgba(0,0,0,0.45)"
                                        />
                                    </>
                                )}

                                { slides.length > 1 &&
                                    <Button onClick={ () => removeSlide( activeSlide ) }
                                        variant="tertiary" isDestructive
                                        style={{ width:'100%', justifyContent:'center', marginTop:'12px' }}>
                                        { __(`Elimina Slide ${ activeSlide + 1 }`,'arkimedia') }
                                    </Button>
                                }
                            </div>
                        )}
                    </PanelBody>

                </InspectorControls>

                {/* Preview editor */}
                <div { ...blockProps }>
                    { current && (
                        <div style={{ position:'relative', width:'100%', height:'100%', display:'flex', alignItems:'center', overflow:'hidden',
                            background: current.useBgColor ? current.bgColor : '#0a0a0a' }}>

                            { current.mediaUrl && !current.useBgColor && (
                                <>
                                    <img src={current.mediaUrl}
                                        style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                                    />
                                    <div style={{ position:'absolute', inset:0, background: current.overlayColor }} />
                                </>
                            )}

                            <div style={{
                                position:  'relative', zIndex:2, width:'100%',
                                maxWidth:  '1200px', margin:'0 auto',
                                padding:   '4rem 1.5rem', color:'#ffffff',
                                textAlign: current.textAlign,
                            }}>
                                { current.eyebrow &&
                                    <p style={{ fontSize:'0.8125rem', fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', opacity:0.8, marginBottom:'1rem' }}>
                                        {current.eyebrow}
                                    </p>
                                }
                                <h2 style={{ fontSize:'clamp(2rem,5vw,4.5rem)', fontWeight:700, lineHeight:1.05, marginBottom:'1rem', letterSpacing:'-0.02em' }}>
                                    {current.title || __('Titolo slide','arkimedia')}
                                </h2>
                                { current.subtitle &&
                                    <p style={{ fontSize:'1.125rem', opacity:0.85, marginBottom:'2rem', lineHeight:1.6 }}>
                                        {current.subtitle}
                                    </p>
                                }
                                { current.ctaLabel &&
                                    <span style={{ display:'inline-flex', padding:'0.875rem 2rem', background:'var(--color-accent,#e94560)', color:'#fff', fontWeight:600, borderRadius:'4px' }}>
                                        {current.ctaLabel}
                                    </span>
                                }
                            </div>

                            {/* Indicatore slide */}
                            <div style={{ position:'absolute', bottom:'1rem', left:'50%', transform:'translateX(-50%)', display:'flex', gap:'6px' }}>
                                { slides.map( ( _, i ) => (
                                    <div key={i} style={{
                                        width: i === activeSlide ? '20px' : '8px', height:'8px',
                                        borderRadius:'4px', background: i === activeSlide ? '#e94560' : 'rgba(255,255,255,0.4)',
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
