import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor'
import { PanelBody, TextControl, RangeControl, ToggleControl, Button, ColorPicker, TabPanel } from '@wordpress/components'
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

// ── TextControl locale per campi dentro array di oggetti ──
function ClientTextField( { label, value, onCommit, placeholder, type } ) {
    const [ local, setLocal ] = useState( value ?? '' )
    useEffect( () => { setLocal( value ?? '' ) }, [ value ] )
    return (
        <TextControl
            label={label}
            value={local}
            onChange={ setLocal }
            onBlur={ () => onCommit( local ) }
            placeholder={placeholder}
            type={type}
        />
    )
}

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const { eyebrow, bgColor, logoColor, logoSize, autoScroll, invertLogos, logoBg, clients } = attributes

        const blockProps = useBlockProps({
            className: 'ark-clients',
            style: {
                background:  bgColor,
                width:       '100vw',
                maxWidth:    '100vw',
                marginLeft:  'calc(50% - 50vw)',
                marginRight: 'calc(50% - 50vw)',
            }
        })

        const eyebrowText = useLocalText( eyebrow, v => setAttributes({ eyebrow: v }) )

        const updateClient = ( index, data ) => {
            const updated = clients.map( ( c, i ) => i === index ? { ...c, ...data } : c )
            setAttributes({ clients: [ ...updated ] })
        }

        const addClient = () => {
            setAttributes({ clients: [ ...clients, { mediaId: 0, mediaUrl: '', mediaAlt: '', name: '', clientUrl: '' } ] })
        }

        const removeClient = ( index ) => {
            setAttributes({ clients: clients.filter( ( _, i ) => i !== index ) })
        }

        const imgStyle = invertLogos ? { filter: 'brightness(0) invert(1)' } : undefined

        // Stessi calcoli di render.php
        const setWidth  = Math.max( clients.length, 1 ) * ( logoSize + 24 )
        const setRepeat = Math.ceil( 2560 / setWidth )
        const lists     = Array.from( { length: autoScroll ? setRepeat * 2 : 1 } )

        const contentTab = (
            <>
                <PanelBody title={ __( 'Testi', 'arkimedia' ) } initialOpen={true}>
                    <TextControl
                        label={ __( 'Eyebrow', 'arkimedia' ) }
                        { ...eyebrowText }
                    />
                </PanelBody>

                <PanelBody title={ `${ __( 'Loghi clienti', 'arkimedia' ) } (${ clients.length })` } initialOpen={true}>
                    { clients.map( ( client, i ) => (
                        <div key={i} style={{ borderBottom:'1px solid #e0e0e0', paddingBottom:'16px', marginBottom:'16px' }}>
                            <p style={{ fontSize:'11px', fontWeight:600, textTransform:'uppercase', marginBottom:'8px' }}>
                                { `Cliente ${ i + 1 }` }
                            </p>
                            <ClientTextField
                                label={ __( 'Nome cliente', 'arkimedia' ) }
                                value={client.name}
                                onCommit={ v => updateClient( i, { name: v } ) }
                                placeholder="Es. Nordvik"
                            />
                            <ClientTextField
                                label={ __( 'URL sito cliente', 'arkimedia' ) }
                                value={client.clientUrl}
                                onCommit={ v => updateClient( i, { clientUrl: v } ) }
                                placeholder="https://esempio.it"
                                type="url"
                            />
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={ media => updateClient( i, {
                                        mediaId:  media.id,
                                        mediaUrl: media.url,
                                        mediaAlt: media.alt || client.name || '',
                                    })}
                                    allowedTypes={['image']}
                                    value={client.mediaId}
                                    render={ ({ open }) => (
                                        <div>
                                            { client.mediaUrl &&
                                                <img src={client.mediaUrl}
                                                    style={{ width:'100%', height:'70px', objectFit:'contain', background:'#ffffff', borderRadius:'4px', marginBottom:'8px', padding:'8px' }}
                                                />
                                            }
                                            <Button onClick={open}
                                                variant={ client.mediaUrl ? 'secondary' : 'primary' }
                                                style={{ width:'100%', justifyContent:'center' }}>
                                                { client.mediaUrl ? __('Cambia logo','arkimedia') : __('Seleziona logo','arkimedia') }
                                            </Button>
                                            { client.mediaUrl &&
                                                <Button
                                                    onClick={ () => updateClient( i, { mediaId: 0, mediaUrl: '', mediaAlt: '' }) }
                                                    variant="tertiary" isDestructive
                                                    style={{ width:'100%', justifyContent:'center', marginTop:'4px' }}>
                                                    { __('Rimuovi logo','arkimedia') }
                                                </Button>
                                            }
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
            </>
        )

        const layoutTab = (
            <>
                <PanelBody title={ __( 'Impostazioni', 'arkimedia' ) } initialOpen={true}>
                    <LocalRange
                        label={ __( 'Dimensione quadrato logo (px)', 'arkimedia' ) }
                        value={logoSize}
                        onChange={ v => setAttributes({ logoSize: v }) }
                        min={80} max={240} step={8}
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
                    />
                </PanelBody>

                <PanelBody title={ __( 'Colori', 'arkimedia' ) } initialOpen={false}>
                    <p style={{fontSize:'11px',fontWeight:600,textTransform:'uppercase',marginBottom:'8px'}}>{ __('Sfondo sezione','arkimedia') }</p>
                    <ColorPicker color={bgColor} onChange={ val => setAttributes({ bgColor: val }) } enableAlpha />
                    <p style={{fontSize:'11px',fontWeight:600,textTransform:'uppercase',margin:'16px 0 8px'}}>{ __('Sfondo quadrato logo','arkimedia') }</p>
                    <ColorPicker color={logoBg} onChange={ val => setAttributes({ logoBg: val }) } enableAlpha />
                    <p style={{fontSize:'11px',fontWeight:600,textTransform:'uppercase',margin:'16px 0 8px'}}>{ __('Colore eyebrow','arkimedia') }</p>
                    <ColorPicker color={logoColor} onChange={ val => setAttributes({ logoColor: val }) } />
                </PanelBody>
            </>
        )

        return (
            <>
                <InspectorControls>
                    <TabPanel
                        tabs={[
                            { name: 'contenuto', title: __( 'Contenuto', 'arkimedia' ) },
                            { name: 'layout',    title: __( 'Layout', 'arkimedia' ) },
                        ]}>
                        { tab => tab.name === 'contenuto' ? contentTab : layoutTab }
                    </TabPanel>
                </InspectorControls>

                {/* Stesso markup di render.php: l'anteprima deve coincidere con il sito */}
                <section { ...blockProps }>
                    { eyebrow && <p className="ark-clients__eyebrow" style={{ color: logoColor }}>{eyebrow}</p> }
                    <div
                        className={ `ark-clients__track${ autoScroll ? ' ark-clients__track--scroll' : '' }` }
                        style={ autoScroll ? { animationDuration: `${ Math.round( setWidth * setRepeat / 40 ) }s` } : undefined }>
                        { lists.map( ( _, list ) => (
                            <div className="ark-clients__list" aria-hidden={ list > 0 ? 'true' : undefined } key={list}>
                                { clients.map( ( client, i ) => (
                                    <div className="ark-clients__item" key={i} style={{ width: `${logoSize}px`, height: `${logoSize}px` }}>
                                        <div className="ark-clients__item-inner" style={{ background: logoBg }}>
                                            { client.mediaUrl
                                                ? <img src={client.mediaUrl} alt="" style={imgStyle} />
                                                : <span style={{ color:'rgba(0,0,0,0.2)', fontSize:'0.75rem', textAlign:'center' }}>
                                                    { `Logo ${ i + 1 }` }
                                                  </span>
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </section>
            </>
        )
    },

    save: () => null,
})
