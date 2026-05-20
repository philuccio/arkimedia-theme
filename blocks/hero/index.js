import { registerBlockType } from '@wordpress/blocks'
import {
    useBlockProps,
    InspectorControls,
    MediaUpload,
    MediaUploadCheck,
    RichText,
} from '@wordpress/block-editor'
import {
    PanelBody,
    TextControl,
    SelectControl,
    Button,
    ColorPicker,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import metadata from './block.json'

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const {
            title, subtitle, eyebrow,
            ctaLabel, ctaUrl,
            mediaId, mediaUrl, mediaAlt,
            overlayColor, textAlign, minHeight,
        } = attributes

        const blockProps = useBlockProps({
            className: `ark-hero ark-hero--align-${ textAlign }`,
            style: { minHeight, position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden' },
        })

        return (
            <>
                <InspectorControls>
                    <PanelBody title={ __('Immagine di sfondo', 'arkimedia') } initialOpen={true}>
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={ (media) => setAttributes({
                                    mediaId:  media.id,
                                    mediaUrl: media.url,
                                    mediaAlt: media.alt || '',
                                })}
                                allowedTypes={['image']}
                                value={mediaId}
                                render={ ({ open }) => (
                                    <div>
                                        { mediaUrl && (
                                            <img src={mediaUrl} alt={mediaAlt}
                                                style={{ width:'100%', height:'120px', objectFit:'cover', borderRadius:'4px', marginBottom:'8px' }}
                                            />
                                        )}
                                        <Button onClick={open} variant={mediaUrl ? 'secondary' : 'primary'}
                                            style={{ width:'100%', justifyContent:'center' }}>
                                            { mediaUrl ? __('Cambia immagine','arkimedia') : __('Seleziona immagine','arkimedia') }
                                        </Button>
                                        { mediaUrl && (
                                            <Button onClick={() => setAttributes({ mediaId:0, mediaUrl:'', mediaAlt:'' })}
                                                variant="tertiary" isDestructive
                                                style={{ width:'100%', justifyContent:'center', marginTop:'4px' }}>
                                                { __('Rimuovi immagine','arkimedia') }
                                            </Button>
                                        )}
                                    </div>
                                )}
                            />
                        </MediaUploadCheck>
                    </PanelBody>

                    <PanelBody title={ __('Overlay', 'arkimedia') } initialOpen={false}>
                        <ColorPicker
                            color={overlayColor}
                            onChange={(val) => setAttributes({ overlayColor: val })}
                            enableAlpha
                            defaultValue="rgba(0,0,0,0.45)"
                        />
                    </PanelBody>

                    <PanelBody title={ __('Layout', 'arkimedia') } initialOpen={false}>
                        <ToggleGroupControl
                            label={ __('Allineamento testo', 'arkimedia') }
                            value={textAlign}
                            onChange={(val) => setAttributes({ textAlign: val })}
                            isBlock>
                            <ToggleGroupControlOption value="left"   label={ __('Sinistra','arkimedia') } />
                            <ToggleGroupControlOption value="center" label={ __('Centro','arkimedia') } />
                            <ToggleGroupControlOption value="right"  label={ __('Destra','arkimedia') } />
                        </ToggleGroupControl>
                        <SelectControl
                            label={ __('Altezza minima', 'arkimedia') }
                            value={minHeight}
                            options={[
                                { label:'100vh (fullscreen)', value:'100vh' },
                                { label:'90vh',  value:'90vh' },
                                { label:'80vh',  value:'80vh' },
                                { label:'70vh',  value:'70vh' },
                                { label:'600px', value:'600px' },
                                { label:'500px', value:'500px' },
                            ]}
                            onChange={(val) => setAttributes({ minHeight: val })}
                            style={{ marginTop:'16px' }}
                        />
                    </PanelBody>

                    <PanelBody title={ __('Call to Action', 'arkimedia') } initialOpen={false}>
                        <TextControl
                            label={ __('Testo pulsante', 'arkimedia') }
                            value={ctaLabel}
                            onChange={(val) => setAttributes({ ctaLabel: val })}
                            placeholder={ __('Es. Scopri di più', 'arkimedia') }
                        />
                        <TextControl
                            label={ __('URL pulsante', 'arkimedia') }
                            value={ctaUrl}
                            onChange={(val) => setAttributes({ ctaUrl: val })}
                            placeholder="#contatti"
                            type="url"
                        />
                    </PanelBody>
                </InspectorControls>

                <section { ...blockProps }>
                    <figure className="ark-hero__bg" aria-hidden="true"
                        style={{ position:'absolute', inset:0, margin:0 }}>
                        { mediaUrl
                            ? <img src={mediaUrl} alt={mediaAlt}
                                style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                            : <div style={{ width:'100%', height:'100%', background:'#1a1a2e' }} />
                        }
                        <div className="ark-hero__overlay"
                            style={{ position:'absolute', inset:0, background:overlayColor }} />
                    </figure>

                    <div className="ark-hero__content"
                        style={{ position:'relative', zIndex:2, width:'100%', padding:'4rem 1.5rem', color:'#ffffff' }}>
                        <RichText tagName="p" className="ark-hero__eyebrow"
                            value={eyebrow} onChange={(val) => setAttributes({ eyebrow: val })}
                            placeholder={ __('Eyebrow (opzionale)', 'arkimedia') }
                            allowedFormats={[]} />
                        <RichText tagName="h1" className="ark-hero__title"
                            value={title} onChange={(val) => setAttributes({ title: val })}
                            placeholder={ __('Titolo principale', 'arkimedia') }
                            allowedFormats={['core/bold','core/italic']} />
                        <RichText tagName="p" className="ark-hero__subtitle"
                            value={subtitle} onChange={(val) => setAttributes({ subtitle: val })}
                            placeholder={ __('Sottotitolo o descrizione breve', 'arkimedia') }
                            allowedFormats={['core/bold','core/italic']} />
                        { ctaLabel && (
                            <span className="ark-hero__cta btn"
                                style={{ display:'inline-flex', marginTop:'0.5rem' }}>
                                {ctaLabel}
                            </span>
                        )}
                    </div>
                </section>
            </>
        )
    },

    save: () => null,
})
