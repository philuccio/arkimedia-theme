import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck, RichText } from '@wordpress/block-editor'
import {
    PanelBody, TextControl, SelectControl, RangeControl,
    ToggleControl, Button, ColorPicker,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import metadata from './block.json'

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const {
            mediaUrl, mediaAlt, mediaId, caption, linkUrl, linkTarget, lightbox,
            width, height, objectFit, objectPosition, borderRadius,
            align, hoverEffect, opacity,
            paddingTop, paddingBottom, marginTop, marginBottom,
            maxWidth, aspectRatio, filter,
        } = attributes

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
            }
        })

        const imgStyle = {
            width, height,
            objectFit,
            objectPosition,
            borderRadius: `${ borderRadius }px`,
            opacity,
            display:      'block',
            maxWidth:     '100%',
            aspectRatio:  aspectRatio || undefined,
            filter:       filter !== 'none' ? filter : undefined,
        }

        const Sp = ( { label, value, onChange, max = 200 } ) => (
            <RangeControl label={label} value={value} onChange={onChange} min={0} max={max} step={1} />
        )

        return (
            <>
                <InspectorControls>

                    <PanelBody title={ __( 'Immagine', 'arkimedia' ) } initialOpen={true}>
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={ media => setAttributes({ mediaUrl: media.url, mediaAlt: media.alt || '', mediaId: media.id }) }
                                allowedTypes={['image']}
                                value={mediaId}
                                render={ ({ open }) => <>
                                    { mediaUrl && <img src={mediaUrl} style={{ width:'100%', height:'100px', objectFit:'cover', borderRadius:'4px', marginBottom:'8px' }} /> }
                                    <Button onClick={open} variant={ mediaUrl ? 'secondary' : 'primary' } style={{ width:'100%', justifyContent:'center' }}>
                                        { mediaUrl ? __('Cambia immagine','arkimedia') : __('Seleziona immagine','arkimedia') }
                                    </Button>
                                    { mediaUrl && <Button onClick={ () => setAttributes({ mediaUrl:'', mediaAlt:'', mediaId:0 }) } variant="tertiary" isDestructive style={{ width:'100%', justifyContent:'center', marginTop:'4px' }}>
                                        { __('Rimuovi','arkimedia') }
                                    </Button> }
                                </> }
                            />
                        </MediaUploadCheck>
                        <TextControl label={ __('Alt text','arkimedia') } value={mediaAlt} onChange={ v => setAttributes({ mediaAlt: v }) } />
                        <TextControl label={ __('Didascalia','arkimedia') } value={caption} onChange={ v => setAttributes({ caption: v }) } />
                    </PanelBody>

                    <PanelBody title={ __( 'Dimensioni', 'arkimedia' ) } initialOpen={false}>
                        <TextControl label={ __('Width (es. 100%, 400px)','arkimedia') }       value={width}        onChange={ v => setAttributes({ width: v }) } />
                        <TextControl label={ __('Height (es. auto, 300px)','arkimedia') }      value={height}       onChange={ v => setAttributes({ height: v }) } />
                        <TextControl label={ __('Max width','arkimedia') }                     value={maxWidth}     onChange={ v => setAttributes({ maxWidth: v }) } />
                        <TextControl label={ __('Aspect ratio (es. 16/9, 4/3)','arkimedia') } value={aspectRatio}  onChange={ v => setAttributes({ aspectRatio: v }) } />
                        <RangeControl label={ __('Border radius (px)','arkimedia') } value={borderRadius} onChange={ v => setAttributes({ borderRadius: v }) } min={0} max={200} />
                    </PanelBody>

                    <PanelBody title={ __( 'Layout', 'arkimedia' ) } initialOpen={false}>
                        <ToggleGroupControl label={ __('Allineamento','arkimedia') } value={align} onChange={ v => setAttributes({ align: v }) } isBlock>
                            <ToggleGroupControlOption value="none"   label="—" />
                            <ToggleGroupControlOption value="left"   label="←" />
                            <ToggleGroupControlOption value="center" label="↔" />
                            <ToggleGroupControlOption value="right"  label="→" />
                        </ToggleGroupControl>
                        <SelectControl label={ __('Object fit','arkimedia') } value={objectFit}
                            options={[
                                { label:'Cover',   value:'cover' },
                                { label:'Contain', value:'contain' },
                                { label:'Fill',    value:'fill' },
                                { label:'None',    value:'none' },
                            ]}
                            onChange={ v => setAttributes({ objectFit: v }) }
                        />
                        <SelectControl label={ __('Object position','arkimedia') } value={objectPosition}
                            options={[
                                { label:'Center', value:'center center' },
                                { label:'Top',    value:'center top' },
                                { label:'Bottom', value:'center bottom' },
                                { label:'Left',   value:'left center' },
                                { label:'Right',  value:'right center' },
                            ]}
                            onChange={ v => setAttributes({ objectPosition: v }) }
                        />
                        <RangeControl label={ __('Opacità','arkimedia') } value={opacity} onChange={ v => setAttributes({ opacity: v }) } min={0} max={1} step={0.05} />
                    </PanelBody>

                    <PanelBody title={ __( 'Effetti', 'arkimedia' ) } initialOpen={false}>
                        <SelectControl label={ __('Hover effect','arkimedia') } value={hoverEffect}
                            options={[
                                { label:'Nessuno',    value:'none' },
                                { label:'Zoom',       value:'zoom' },
                                { label:'Fade',       value:'fade' },
                                { label:'Grayscale',  value:'grayscale' },
                            ]}
                            onChange={ v => setAttributes({ hoverEffect: v }) }
                        />
                        <SelectControl label={ __('Filtro CSS','arkimedia') } value={filter}
                            options={[
                                { label:'Nessuno',     value:'none' },
                                { label:'Grayscale',   value:'grayscale(100%)' },
                                { label:'Sepia',       value:'sepia(100%)' },
                                { label:'Blur leggero',value:'blur(2px)' },
                                { label:'Luminosità+', value:'brightness(1.2)' },
                                { label:'Contrasto+',  value:'contrast(1.2)' },
                            ]}
                            onChange={ v => setAttributes({ filter: v }) }
                        />
                    </PanelBody>

                    <PanelBody title={ __( 'Link', 'arkimedia' ) } initialOpen={false}>
                        <ToggleControl label={ __('Apri in lightbox','arkimedia') } checked={lightbox} onChange={ v => setAttributes({ lightbox: v }) } />
                        { ! lightbox && <>
                            <TextControl label={ __('URL link','arkimedia') } value={linkUrl} onChange={ v => setAttributes({ linkUrl: v }) } type="url" placeholder="https://..." />
                            <SelectControl label={ __('Apri in','arkimedia') } value={linkTarget}
                                options={[
                                    { label:'Stessa finestra', value:'_self' },
                                    { label:'Nuova finestra',  value:'_blank' },
                                ]}
                                onChange={ v => setAttributes({ linkTarget: v }) }
                            />
                        </> }
                    </PanelBody>

                    <PanelBody title={ __( 'Spaziatura', 'arkimedia' ) } initialOpen={false}>
                        <p style={{fontSize:'11px',fontWeight:600,marginBottom:'8px'}}>Padding</p>
                        <Sp label="Top"    value={paddingTop}    onChange={ v => setAttributes({ paddingTop: v }) } />
                        <Sp label="Bottom" value={paddingBottom} onChange={ v => setAttributes({ paddingBottom: v }) } />
                        <p style={{fontSize:'11px',fontWeight:600,margin:'12px 0 8px'}}>Margin</p>
                        <Sp label="Top"    value={marginTop}    onChange={ v => setAttributes({ marginTop: v }) } />
                        <Sp label="Bottom" value={marginBottom} onChange={ v => setAttributes({ marginBottom: v }) } />
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
