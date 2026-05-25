import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor'
import {
    PanelBody, ToggleControl, RangeControl, SelectControl,
    Button, ColorPicker, TextControl, Spinner,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { useState, useEffect } from '@wordpress/element'
import metadata from './block.json'

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const {
            useFolder, folderId, folderName, images,
            layout, columns, gap, aspectRatio,
            lightbox, bgColor, paddingTop, paddingBottom,
        } = attributes

        const [ folders, setFolders ] = useState( [] )
        const [ loadingFolders, setLoadingFolders ] = useState( false )
        const [ pluginActive, setPluginActive ] = useState( null )

        // Verifica se Virtual Media Folders è attivo
        useEffect( () => {
            wp.apiFetch({ path: '/arkimedia/v1/vmf-folders' })
                .then( data => {
                    setPluginActive( true )
                    if ( Array.isArray( data ) ) {
                        setFolders( data.map( f => ({ label: f.name, value: f.id }) ) )
                    }
                })
                .catch( () => setPluginActive( false ) )
        }, [] )

        const blockProps = useBlockProps({
            style: {
                width:       '100vw',
                maxWidth:    '100vw',
                marginLeft:  'calc(50% - 50vw)',
                marginRight: 'calc(50% - 50vw)',
                background:  bgColor || 'transparent',
                paddingTop:  paddingTop ? `${ paddingTop }px` : 0,
                paddingBottom: paddingBottom ? `${ paddingBottom }px` : 0,
                overflow:    'hidden',
            }
        })

        // Selezione multipla immagini
        const onSelectImages = ( media ) => {
            const selected = media.map( m => ({
                src:     m.url,
                thumb:   m.sizes?.large?.url || m.url,
                alt:     m.alt || '',
                caption: m.caption || '',
                link:    '',
                id:      m.id,
            }))
            setAttributes({ images: selected })
        }

        const updateImageLink = ( index, link ) => {
            const updated = images.map( ( img, i ) => i === index ? { ...img, link } : img )
            setAttributes({ images: updated })
        }

        const removeImage = ( index ) => {
            setAttributes({ images: images.filter( ( _, i ) => i !== index ) })
        }

        // Preview griglia nell'editor
        const gridStyle = {
            display:             'grid',
            gap:                 `${ gap }px`,
            gridTemplateColumns: layout === 'bento' ? 'repeat(4,1fr)' : `repeat(${ columns },1fr)`,
        }

        const previewImages = useFolder && folderId ? [] : images

        return (
            <>
                <InspectorControls>

                    {/* ── Sorgente immagini ── */}
                    <PanelBody title={ __( 'Sorgente immagini', 'arkimedia' ) } initialOpen={true}>

                        { pluginActive === true && (
                            <ToggleControl
                                label={ __( 'Usa cartella (Virtual Media Folders)', 'arkimedia' ) }
                                checked={useFolder}
                                onChange={ v => setAttributes({ useFolder: v }) }
                                help={ useFolder
                                    ? __( 'Le immagini vengono caricate dalla cartella selezionata', 'arkimedia' )
                                    : __( 'Selezione manuale dalla Media Library', 'arkimedia' )
                                }
                            />
                        )}

                        { pluginActive === false && (
                            <p style={{ fontSize:'12px', color:'#757575', padding:'8px', background:'#f0f0f0', borderRadius:'4px' }}>
                                { __( 'Plugin Virtual Media Folders non attivo — usa la selezione manuale.', 'arkimedia' ) }
                            </p>
                        )}

                        { pluginActive === null && <Spinner /> }

                        { useFolder && pluginActive ? (
                            <SelectControl
                                label={ __( 'Cartella', 'arkimedia' ) }
                                value={folderId}
                                options={[
                                    { label: __( '— Seleziona cartella —', 'arkimedia' ), value: 0 },
                                    ...folders,
                                ]}
                                onChange={ v => {
                                    const id = parseInt( v )
                                    const name = folders.find( f => f.value === id )?.label || ''
                                    setAttributes({ folderId: id, folderName: name })
                                }}
                            />
                        ) : (
                            <div>
                                <MediaUploadCheck>
                                    <MediaUpload
                                        onSelect={ onSelectImages }
                                        allowedTypes={['image']}
                                        multiple
                                        gallery
                                        value={ images.map( i => i.id ).filter( Boolean ) }
                                        render={ ({ open }) => (
                                            <Button onClick={open} variant="primary"
                                                style={{ width:'100%', justifyContent:'center', marginBottom:'12px' }}>
                                                { images.length
                                                    ? __( `Modifica selezione (${ images.length } foto)`, 'arkimedia' )
                                                    : __( 'Seleziona immagini', 'arkimedia' )
                                                }
                                            </Button>
                                        )}
                                    />
                                </MediaUploadCheck>

                                { images.length > 0 && (
                                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'4px' }}>
                                        { images.map( ( img, i ) => (
                                            <div key={i} style={{ position:'relative' }}>
                                                <img src={img.thumb || img.src}
                                                    style={{ width:'100%', aspectRatio:'1', objectFit:'cover', borderRadius:'4px', display:'block' }}
                                                />
                                                <button onClick={ () => removeImage(i) }
                                                    style={{ position:'absolute', top:'2px', right:'2px', background:'rgba(0,0,0,0.7)', color:'#fff', border:'none', borderRadius:'50%', width:'20px', height:'20px', cursor:'pointer', fontSize:'12px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </PanelBody>

                    {/* ── Link case study per ogni immagine ── */}
                    { ! useFolder && images.length > 0 && (
                        <PanelBody title={ __( 'Link Case Study', 'arkimedia' ) } initialOpen={false}>
                            { images.map( ( img, i ) => (
                                <div key={i} style={{ marginBottom:'12px', paddingBottom:'12px', borderBottom:'1px solid #e0e0e0' }}>
                                    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
                                        <img src={img.thumb || img.src} style={{ width:'32px', height:'32px', objectFit:'cover', borderRadius:'3px' }} />
                                        <span style={{ fontSize:'11px', opacity:0.7 }}>{ img.alt || `Foto ${ i + 1 }` }</span>
                                    </div>
                                    <TextControl
                                        label={ __( 'URL Case Study (opz.)', 'arkimedia' ) }
                                        value={img.link || ''}
                                        onChange={ v => updateImageLink( i, v ) }
                                        placeholder="https://..."
                                        type="url"
                                    />
                                </div>
                            ))}
                        </PanelBody>
                    )}

                    {/* ── Layout ── */}
                    <PanelBody title={ __( 'Layout', 'arkimedia' ) } initialOpen={false}>
                        <ToggleGroupControl
                            label={ __( 'Tipo layout', 'arkimedia' ) }
                            value={layout}
                            onChange={ v => setAttributes({ layout: v }) }
                            isBlock>
                            <ToggleGroupControlOption value="grid"    label="Griglia" />
                            <ToggleGroupControlOption value="masonry" label="Masonry" />
                            <ToggleGroupControlOption value="bento"   label="Bento" />
                        </ToggleGroupControl>

                        { layout !== 'bento' && (
                            <RangeControl
                                label={ __( 'Colonne', 'arkimedia' ) }
                                value={columns}
                                onChange={ v => setAttributes({ columns: v }) }
                                min={1} max={6} step={1}
                            />
                        )}

                        <RangeControl
                            label={ __( 'Gap (px)', 'arkimedia' ) }
                            value={gap}
                            onChange={ v => setAttributes({ gap: v }) }
                            min={0} max={40} step={2}
                        />

                        { layout !== 'masonry' && (
                            <SelectControl
                                label={ __( 'Aspect ratio immagini', 'arkimedia' ) }
                                value={aspectRatio}
                                options={[
                                    { label:'4:3',       value:'4/3' },
                                    { label:'16:9',      value:'16/9' },
                                    { label:'1:1',       value:'1/1' },
                                    { label:'3:4',       value:'3/4' },
                                    { label:'9:16',      value:'9/16' },
                                    { label:'Libero',    value:'free' },
                                ]}
                                onChange={ v => setAttributes({ aspectRatio: v }) }
                            />
                        )}

                        <ToggleControl
                            label={ __( 'Lightbox al click', 'arkimedia' ) }
                            checked={lightbox}
                            onChange={ v => setAttributes({ lightbox: v }) }
                        />
                    </PanelBody>

                    {/* ── Stile sezione ── */}
                    <PanelBody title={ __( 'Stile sezione', 'arkimedia' ) } initialOpen={false}>
                        <p style={{fontSize:'11px',fontWeight:600,marginBottom:'8px'}}>{ __('Colore sfondo','arkimedia') }</p>
                        <ColorPicker color={bgColor} onChange={ v => setAttributes({ bgColor: v }) } enableAlpha />
                        { bgColor && <Button onClick={ () => setAttributes({ bgColor: '' }) } variant="tertiary" isDestructive style={{ marginTop:'8px' }}>{ __('Rimuovi','arkimedia') }</Button> }
                        <RangeControl label={ __('Padding top (px)','arkimedia') }    value={paddingTop}    onChange={ v => setAttributes({ paddingTop: v }) }    min={0} max={200} style={{ marginTop:'16px' }} />
                        <RangeControl label={ __('Padding bottom (px)','arkimedia') } value={paddingBottom} onChange={ v => setAttributes({ paddingBottom: v }) } min={0} max={200} />
                    </PanelBody>

                </InspectorControls>

                {/* Preview editor */}
                <div { ...blockProps }>
                    { useFolder && folderId ? (
                        <div style={{ padding:'2rem', textAlign:'center', background:'rgba(99,102,241,0.1)', border:'2px dashed rgba(99,102,241,0.3)', borderRadius:'4px' }}>
                            <p style={{ margin:0, fontWeight:600 }}>📁 { __('Cartella','arkimedia') }: <strong>{ folderName || folderId }</strong></p>
                            <p style={{ margin:'0.5rem 0 0', fontSize:'12px', opacity:0.7 }}>{ __('Le immagini vengono caricate automaticamente dalla cartella sul frontend','arkimedia') }</p>
                        </div>
                    ) : previewImages.length > 0 ? (
                        <div style={ gridStyle }>
                            { previewImages.map( ( img, i ) => (
                                <div key={i} style={{
                                    overflow:    'hidden',
                                    aspectRatio: layout !== 'masonry' && aspectRatio !== 'free' ? aspectRatio : 'auto',
                                    ...(layout === 'bento' && i === 0 ? { gridColumn:'span 2', gridRow:'span 2' } : {}),
                                }}>
                                    <img src={ img.thumb || img.src }
                                        style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                                        alt={ img.alt }
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ padding:'3rem', textAlign:'center', background:'rgba(0,0,0,0.04)', border:'2px dashed #ddd', borderRadius:'4px' }}>
                            <p style={{ margin:0, opacity:0.5 }}>{ __('Seleziona le immagini nel pannello laterale →','arkimedia') }</p>
                        </div>
                    )}
                </div>
            </>
        )
    },

    save: () => null,
})
