import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor'
import {
    PanelBody, TextControl, SelectControl, RangeControl, ColorPicker,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import metadata from './block.json'

registerBlockType( metadata.name, {

    edit( { attributes, setAttributes } ) {
        const {
            content, fontSize, fontWeight, lineHeight, letterSpacing,
            textAlign, textTransform, color, maxWidth,
            paddingTop, paddingRight, paddingBottom, paddingLeft,
            marginTop, marginBottom, htmlTag,
        } = attributes

        const style = {
            fontSize, fontWeight, lineHeight,
            letterSpacing, textAlign, textTransform,
            color: color || 'inherit',
            maxWidth: maxWidth || 'none',
            padding: `${ paddingTop }px ${ paddingRight }px ${ paddingBottom }px ${ paddingLeft }px`,
            marginTop:    `${ marginTop }px`,
            marginBottom: `${ marginBottom }px`,
        }

        const blockProps = useBlockProps({ style })

        const Sp = ( { label, value, onChange, max = 100 } ) => (
            <RangeControl label={label} value={value} onChange={onChange} min={0} max={max} step={1} />
        )

        return (
            <>
                <InspectorControls>

                    <PanelBody title={ __( 'Tipografia', 'arkimedia' ) } initialOpen={true}>
                        <SelectControl label={ __('Tag HTML','arkimedia') } value={htmlTag}
                            options={[
                                { label:'p',    value:'p' },
                                { label:'h1',   value:'h1' },
                                { label:'h2',   value:'h2' },
                                { label:'h3',   value:'h3' },
                                { label:'h4',   value:'h4' },
                                { label:'h5',   value:'h5' },
                                { label:'h6',   value:'h6' },
                                { label:'span', value:'span' },
                                { label:'div',  value:'div' },
                            ]}
                            onChange={ v => setAttributes({ htmlTag: v }) }
                        />
                        <TextControl label={ __('Font size (es. 1rem, 18px, clamp(...))','arkimedia') } value={fontSize} onChange={ v => setAttributes({ fontSize: v }) } />
                        <SelectControl label={ __('Font weight','arkimedia') } value={fontWeight}
                            options={[
                                { label:'Light 300',    value:'300' },
                                { label:'Regular 400',  value:'400' },
                                { label:'Medium 500',   value:'500' },
                                { label:'SemiBold 600', value:'600' },
                                { label:'Bold 700',     value:'700' },
                                { label:'ExtraBold 800',value:'800' },
                                { label:'Black 900',    value:'900' },
                            ]}
                            onChange={ v => setAttributes({ fontWeight: v }) }
                        />
                        <TextControl label={ __('Line height','arkimedia') }     value={lineHeight}    onChange={ v => setAttributes({ lineHeight: v }) } />
                        <TextControl label={ __('Letter spacing','arkimedia') }  value={letterSpacing} onChange={ v => setAttributes({ letterSpacing: v }) } placeholder="0 / 0.1em" />
                        <SelectControl label={ __('Text transform','arkimedia') } value={textTransform}
                            options={[
                                { label:'None',       value:'none' },
                                { label:'Uppercase',  value:'uppercase' },
                                { label:'Lowercase',  value:'lowercase' },
                                { label:'Capitalize', value:'capitalize' },
                            ]}
                            onChange={ v => setAttributes({ textTransform: v }) }
                        />
                        <ToggleGroupControl label={ __('Allineamento','arkimedia') } value={textAlign} onChange={ v => setAttributes({ textAlign: v }) } isBlock>
                            <ToggleGroupControlOption value="left"    label="←" />
                            <ToggleGroupControlOption value="center"  label="↔" />
                            <ToggleGroupControlOption value="right"   label="→" />
                            <ToggleGroupControlOption value="justify" label="⇔" />
                        </ToggleGroupControl>
                        <TextControl label={ __('Max width (es. 600px, 80%)','arkimedia') } value={maxWidth} onChange={ v => setAttributes({ maxWidth: v }) } />
                    </PanelBody>

                    <PanelBody title={ __( 'Colore', 'arkimedia' ) } initialOpen={false}>
                        <ColorPicker color={color} onChange={ v => setAttributes({ color: v }) } enableAlpha />
                    </PanelBody>

                    <PanelBody title={ __( 'Padding', 'arkimedia' ) } initialOpen={false}>
                        <Sp label="Top"    value={paddingTop}    onChange={ v => setAttributes({ paddingTop: v }) } />
                        <Sp label="Right"  value={paddingRight}  onChange={ v => setAttributes({ paddingRight: v }) } />
                        <Sp label="Bottom" value={paddingBottom} onChange={ v => setAttributes({ paddingBottom: v }) } />
                        <Sp label="Left"   value={paddingLeft}   onChange={ v => setAttributes({ paddingLeft: v }) } />
                    </PanelBody>

                    <PanelBody title={ __( 'Margin', 'arkimedia' ) } initialOpen={false}>
                        <Sp label="Top"    value={marginTop}    onChange={ v => setAttributes({ marginTop: v }) }    max={200} />
                        <Sp label="Bottom" value={marginBottom} onChange={ v => setAttributes({ marginBottom: v }) } max={200} />
                    </PanelBody>

                </InspectorControls>

                <RichText
                    { ...blockProps }
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
