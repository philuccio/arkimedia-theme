import { registerBlockType } from '@wordpress/blocks'
import {
    useBlockProps,
    InspectorControls,
    MediaUpload,
    MediaUploadCheck,
} from '@wordpress/block-editor'
import {
    PanelBody, TextControl, ToggleControl, SelectControl,
    RangeControl, Button, ColorPicker,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import metadata from './block.json'

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const {
            usePageTitle, customTitle, showTitle, eyebrow,
            height, bgType, mediaUrl, mediaAlt,
            bgColor, gradientType, gradientAngle, gradientColor1, gradientColor2,
            overlayColor, bgSize, bgPosition, bgAttachment,
            textColor, titleSize, contentPosition,
        } = attributes

        // Costruisce lo stile sfondo
        let bgStyle = {}
        switch ( bgType ) {
            case 'color':
                bgStyle.background = bgColor
                break
            case 'gradient':
                bgStyle.background = gradientType === 'linear'
                    ? `linear-gradient(${ gradientAngle }deg, ${ gradientColor1 }, ${ gradientColor2 })`
                    : `radial-gradient(circle, ${ gradientColor1 }, ${ gradientColor2 })`
                break
            case 'image':
                if ( mediaUrl ) {
                    bgStyle.backgroundImage      = `url(${ mediaUrl })`
                    bgStyle.backgroundSize       = bgSize
                    bgStyle.backgroundPosition   = bgPosition
                    bgStyle.backgroundAttachment = bgAttachment
                    bgStyle.backgroundRepeat     = 'no-repeat'
                } else {
                    bgStyle.background = bgColor
                }
                break
        }

        const alignMap = { top: 'flex-start', center: 'center', bottom: 'flex-end' }

        const blockProps = useBlockProps({
            style: {
                ...bgStyle,
                minHeight:   height,
                color:       textColor,
                width:       '100vw',
                maxWidth:    '100vw',
                marginLeft:  'calc(50% - 50vw)',
                marginRight: 'calc(50% - 50vw)',
                display:     'flex',
                alignItems:  alignMap[ contentPosition ] || 'flex-end',
                position:    'relative',
                overflow:    'hidden',
            }
        })

        return (
            <>
                <InspectorControls>

                    <PanelBody title={ __( 'Titolo', 'arkimedia' ) } initialOpen={true}>
                        <ToggleControl
                            label={ __( 'Mostra titolo', 'arkimedia' ) }
                            checked={showTitle}
                            onChange={ v => setAttributes({ showTitle: v }) }
                        />
                        { showTitle && <>
                            <ToggleControl
                                label={ __( 'Usa titolo pagina automatico', 'arkimedia' ) }
                                checked={usePageTitle}
                                onChange={ v => setAttributes({ usePageTitle: v }) }
                                help={ __( 'Se disattivato puoi inserire un titolo custom', 'arkimedia' ) }
                            />
                            { ! usePageTitle &&
                                <TextControl
                                    label={ __( 'Titolo custom', 'arkimedia' ) }
                                    value={customTitle}
                                    onChange={ v => setAttributes({ customTitle: v }) }
                                />
                            }
                            <TextControl
                                label={ __( 'Eyebrow (opzionale)', 'arkimedia' ) }
                                value={eyebrow}
                                onChange={ v => setAttributes({ eyebrow: v }) }
                            />
                            <TextControl
                                label={ __( 'Dimensione titolo (CSS)', 'arkimedia' ) }
                                value={titleSize}
                                onChange={ v => setAttributes({ titleSize: v }) }
                                help="Es. clamp(2rem,5vw,5rem) oppure 4rem"
                            />
                        </> }
                    </PanelBody>

                    <PanelBody title={ __( 'Layout', 'arkimedia' ) } initialOpen={false}>
                        <SelectControl
                            label={ __( 'Altezza', 'arkimedia' ) }
                            value={height}
                            options={[
                                { label:'100vh', value:'100vh' },
                                { label:'90vh',  value:'90vh' },
                                { label:'80vh',  value:'80vh' },
                                { label:'70vh',  value:'70vh' },
                                { label:'60vh',  value:'60vh' },
                                { label:'50vh',  value:'50vh' },
                                { label:'600px', value:'600px' },
                                { label:'500px', value:'500px' },
                                { label:'400px', value:'400px' },
                            ]}
                            onChange={ v => setAttributes({ height: v }) }
                        />
                        <SelectControl
                            label={ __( 'Posizione contenuto', 'arkimedia' ) }
                            value={contentPosition}
                            options={[
                                { label:'In alto',  value:'top' },
                                { label:'Al centro', value:'center' },
                                { label:'In basso',  value:'bottom' },
                            ]}
                            onChange={ v => setAttributes({ contentPosition: v }) }
                        />
                    </PanelBody>

                    <PanelBody title={ __( 'Sfondo', 'arkimedia' ) } initialOpen={false}>
                        <ToggleGroupControl
                            label={ __( 'Tipo sfondo', 'arkimedia' ) }
                            value={bgType}
                            onChange={ v => setAttributes({ bgType: v }) }
                            isBlock>
                            <ToggleGroupControlOption value="image"    label="Immagine" />
                            <ToggleGroupControlOption value="color"    label="Colore" />
                            <ToggleGroupControlOption value="gradient" label="Gradiente" />
                        </ToggleGroupControl>

                        { bgType === 'image' && <>
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={ media => setAttributes({ mediaUrl: media.url, mediaAlt: media.alt || '' }) }
                                    allowedTypes={['image']}
                                    value={mediaUrl}
                                    render={ ({ open }) => <>
                                        { mediaUrl && <img src={mediaUrl} style={{ width:'100%', height:'80px', objectFit:'cover', borderRadius:'4px', marginBottom:'8px' }} /> }
                                        <Button onClick={open} variant={ mediaUrl ? 'secondary' : 'primary' } style={{ width:'100%', justifyContent:'center' }}>
                                            { mediaUrl ? __('Cambia immagine','arkimedia') : __('Seleziona immagine','arkimedia') }
                                        </Button>
                                        { mediaUrl && <Button onClick={ () => setAttributes({ mediaUrl:'', mediaAlt:'' }) } variant="tertiary" isDestructive style={{ width:'100%', justifyContent:'center', marginTop:'4px' }}>
                                            { __('Rimuovi','arkimedia') }
                                        </Button> }
                                    </> }
                                />
                            </MediaUploadCheck>
                            <SelectControl
                                label={ __('Size','arkimedia') } value={bgSize}
                                options={[ { label:'Cover', value:'cover' }, { label:'Contain', value:'contain' }, { label:'Auto', value:'auto' } ]}
                                onChange={ v => setAttributes({ bgSize: v }) }
                            />
                            <SelectControl
                                label={ __('Position','arkimedia') } value={bgPosition}
                                options={[
                                    { label:'Center', value:'center center' },
                                    { label:'Top',    value:'center top' },
                                    { label:'Bottom', value:'center bottom' },
                                    { label:'Left',   value:'left center' },
                                    { label:'Right',  value:'right center' },
                                ]}
                                onChange={ v => setAttributes({ bgPosition: v }) }
                            />
                            <SelectControl
                                label={ __('Attachment','arkimedia') } value={bgAttachment}
                                options={[ { label:'Scroll', value:'scroll' }, { label:'Fixed (parallax)', value:'fixed' } ]}
                                onChange={ v => setAttributes({ bgAttachment: v }) }
                            />
                        </> }

                        { bgType === 'color' && <>
                            <p style={{fontSize:'11px',fontWeight:600,marginBottom:'8px'}}>{ __('Colore','arkimedia') }</p>
                            <ColorPicker color={bgColor} onChange={ v => setAttributes({ bgColor: v }) } enableAlpha />
                        </> }

                        { bgType === 'gradient' && <>
                            <SelectControl
                                label={ __('Tipo','arkimedia') } value={gradientType}
                                options={[ { label:'Lineare', value:'linear' }, { label:'Radiale', value:'radial' } ]}
                                onChange={ v => setAttributes({ gradientType: v }) }
                            />
                            { gradientType === 'linear' &&
                                <RangeControl label={ __('Angolo','arkimedia') } value={gradientAngle} onChange={ v => setAttributes({ gradientAngle: v }) } min={0} max={360} />
                            }
                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>{ __('Colore 1','arkimedia') }</p>
                            <ColorPicker color={gradientColor1} onChange={ v => setAttributes({ gradientColor1: v }) } />
                            <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>{ __('Colore 2','arkimedia') }</p>
                            <ColorPicker color={gradientColor2} onChange={ v => setAttributes({ gradientColor2: v }) } />
                        </> }

                        <p style={{fontSize:'11px',fontWeight:600,margin:'16px 0 8px'}}>{ __('Overlay','arkimedia') }</p>
                        <ColorPicker color={overlayColor} onChange={ v => setAttributes({ overlayColor: v }) } enableAlpha defaultValue="rgba(0,0,0,0.45)" />

                        <p style={{fontSize:'11px',fontWeight:600,margin:'16px 0 8px'}}>{ __('Colore testo','arkimedia') }</p>
                        <ColorPicker color={textColor} onChange={ v => setAttributes({ textColor: v }) } />
                    </PanelBody>

                </InspectorControls>

                <div { ...blockProps }>
                    { ( bgType === 'image' || overlayColor ) && (
                        <div style={{ position:'absolute', inset:0, background:overlayColor, zIndex:1, pointerEvents:'none' }} />
                    )}
                    <div style={{ position:'relative', zIndex:2, width:'100%', maxWidth:'1200px', margin:'0 auto', padding:'calc(80px + 2rem) 1.5rem 4rem' }}>
                        { eyebrow && showTitle && (
                            <p style={{ fontSize:'0.8125rem', fontWeight:600, letterSpacing:'0.15em', textTransform:'uppercase', opacity:0.75, marginBottom:'1rem' }}>
                                {eyebrow}
                            </p>
                        )}
                        { showTitle && (
                            <h1 style={{ fontSize:titleSize, fontWeight:700, lineHeight:1.05, letterSpacing:'-0.02em', margin:0 }}>
                                { usePageTitle
                                    ? __( '← Titolo pagina automatico', 'arkimedia' )
                                    : ( customTitle || __( 'Titolo custom', 'arkimedia' ) )
                                }
                            </h1>
                        )}
                    </div>
                </div>
            </>
        )
    },

    save: () => null,
})
