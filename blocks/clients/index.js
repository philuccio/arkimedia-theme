import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor'
import { PanelBody, TextControl, RangeControl, ToggleControl, Button, ColorPicker } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import metadata from './block.json'

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const { eyebrow, bgColor, logoColor, logoSize, autoScroll, invertLogos, logoBg, clients } = attributes

        const blockProps = useBlockProps({
            style: {
                background:  bgColor,
                padding:     '3rem 0 4rem',
                overflow:    'hidden',
                width:       '100vw',
                maxWidth:    '100vw',
                marginLeft:  'calc(50% - 50vw)',
                marginRight: 'calc(50% - 50vw)',
            }
        })

        const updateClient = ( index, key, value ) => {
            const updated = clients.map( ( c, i ) => i === index ? { ...c, [key]: value } : c )
            setAttributes({ clients: updated })
        }

        const addClient = () => {
            setAttributes({ clients: [ ...clients, { mediaUrl: '', mediaAlt: '', name: '' } ] })
        }

        const removeClient = ( index ) => {
            setAttributes({ clients: clients.filter( ( _, i ) => i !== index ) })
        }

        const imgStyle = {
            width:      '100%',
            height:     '100%',
            objectFit:  'contain',
            opacity:    0.8,
            filter:     invertLogos ? 'brightness(0) invert(1)' : 'none',
        }

        return (
            <>
                <InspectorControls>

                    <PanelBody title={ __( 'Impostazioni', 'arkimedia' ) } initialOpen={true}>
                        <TextControl
                            label={ __( 'Eyebrow', 'arkimedia' ) }
                            value={eyebrow}
                            onChange={ val => setAttributes({ eyebrow: val }) }
                        />
                        <RangeControl
                            label={ __( 'Dimensione quadrato logo (px)', 'arkimedia' ) }
                            value={logoSize}
                            onChange={ val => setAttributes({ logoSize: val }) }
                            min={80}
                            max={240}
                            step={8}
                        />
                        <ToggleControl
                            label={ __( 'Scorrimento automatico', 'arkimedia' ) }
                            checked={autoScroll}
                            onChange={ val => setAttributes({ autoScroll: val }) }
                        />
                        <ToggleControl
                            label={ __( 'Inverti colore loghi (bianco)', 'arkimedia' ) }
                            checked={invertLogos}
                            onChange={ val => setAttributes({ invertLogos: val }) }
                            help={ __( 'Applica filtro CSS per rendere i loghi bianchi', 'arkimedia' ) }
                        />
                    </PanelBody>

                    <PanelBody title={ __( 'Colori', 'arkimedia' ) } initialOpen={false}>
                        <p style={{fontSize:'11px',fontWeight:600,textTransform:'uppercase',marginBottom:'8px'}}>
                            { __('Sfondo sezione','arkimedia') }
                        </p>
                        <ColorPicker color={bgColor} onChange={ val => setAttributes({ bgColor: val }) } enableAlpha />
                        <p style={{fontSize:'11px',fontWeight:600,textTransform:'uppercase',margin:'16px 0 8px'}}>
                            { __('Sfondo quadrato logo','arkimedia') }
                        </p>
                        <ColorPicker color={logoBg} onChange={ val => setAttributes({ logoBg: val }) } enableAlpha />
                        <p style={{fontSize:'11px',fontWeight:600,textTransform:'uppercase',margin:'16px 0 8px'}}>
                            { __('Colore eyebrow','arkimedia') }
                        </p>
                        <ColorPicker color={logoColor} onChange={ val => setAttributes({ logoColor: val }) } />
                    </PanelBody>

                    <PanelBody title={ __( `Loghi clienti (${ clients.length })`, 'arkimedia' ) } initialOpen={false}>
                        { clients.map( ( client, i ) => (
                            <div key={i} style={{ borderBottom:'1px solid #e0e0e0', paddingBottom:'16px', marginBottom:'16px' }}>
                                <p style={{ fontSize:'11px', fontWeight:600, textTransform:'uppercase', marginBottom:'8px' }}>
                                    { `Cliente ${ i + 1 }` }
                                </p>
                                <TextControl
                                    label={ __( 'Nome cliente', 'arkimedia' ) }
                                    value={client.name}
                                    onChange={ val => updateClient( i, 'name', val ) }
                                    placeholder="Es. Nordvik"
                                />
                                <MediaUploadCheck>
                                    <MediaUpload
                                        onSelect={ media => {
                                            updateClient( i, 'mediaUrl', media.url )
                                            updateClient( i, 'mediaAlt', media.alt || client.name || '' )
                                        }}
                                        allowedTypes={['image']}
                                        value={client.mediaUrl}
                                        render={ ({ open }) => (
                                            <div>
                                                { client.mediaUrl && (
                                                    <img src={client.mediaUrl}
                                                        style={{ width:'100%', height:'60px', objectFit:'contain', background:'#1a1a2e', borderRadius:'4px', marginBottom:'8px', padding:'8px' }}
                                                    />
                                                )}
                                                <Button onClick={open}
                                                    variant={ client.mediaUrl ? 'secondary' : 'primary' }
                                                    style={{ width:'100%', justifyContent:'center' }}>
                                                    { client.mediaUrl ? __('Cambia logo','arkimedia') : __('Seleziona logo','arkimedia') }
                                                </Button>
                                                { client.mediaUrl && (
                                                    <Button
                                                        onClick={ () => { updateClient(i,'mediaUrl',''); updateClient(i,'mediaAlt','') }}
                                                        variant="tertiary" isDestructive
                                                        style={{ width:'100%', justifyContent:'center', marginTop:'4px' }}>
                                                        { __('Rimuovi logo','arkimedia') }
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    />
                                </MediaUploadCheck>
                                <Button onClick={ () => removeClient( i ) }
                                    variant="tertiary" isDestructive
                                    style={{ marginTop:'8px', fontSize:'11px' }}>
                                    { __('Rimuovi cliente','arkimedia') }
                                </Button>
                            </div>
                        ))}
                        <Button onClick={addClient} variant="primary"
                            style={{ width:'100%', justifyContent:'center', marginTop:'8px' }}>
                            { __('+ Aggiungi cliente','arkimedia') }
                        </Button>
                    </PanelBody>

                </InspectorControls>

                <section { ...blockProps }>

                    <p style={{ textAlign:'center', fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:logoColor, opacity:0.5, marginBottom:'2.5rem' }}>
                        {eyebrow}
                    </p>

                    <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'1.5rem', padding:'0 1.5rem' }}>
                        { clients.map( ( client, i ) => (
                            <div key={i} style={{
                                width:           `${logoSize}px`,
                                height:          `${logoSize}px`,
                                background:      logoBg,
                                borderRadius:    '16px',
                                display:         'flex',
                                alignItems:      'center',
                                justifyContent:  'center',
                                padding:         '1.25rem',
                                flexShrink:      0,
                            }}>
                                { client.mediaUrl
                                    ? <img src={client.mediaUrl} style={imgStyle} />
                                    : <span style={{ color:'rgba(255,255,255,0.2)', fontSize:'0.75rem', textAlign:'center' }}>{ `Logo ${ i + 1 }` }</span>
                                }
                            </div>
                        ))}
                    </div>

                </section>
            </>
        )
    },

    save: () => null,
})
