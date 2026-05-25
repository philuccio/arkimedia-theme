<?php
/**
 * Render blocco Testo.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$content       = $attributes['content']       ?? '';
$font_size     = $attributes['fontSize']      ?? '1rem';
$font_weight   = $attributes['fontWeight']    ?? '400';
$line_height   = $attributes['lineHeight']    ?? '1.6';
$letter_spacing= $attributes['letterSpacing'] ?? '0';
$text_align    = $attributes['textAlign']     ?? 'left';
$text_transform= $attributes['textTransform'] ?? 'none';
$color         = $attributes['color']         ?? '';
$max_width     = $attributes['maxWidth']      ?? '';
$pt            = $attributes['paddingTop']    ?? 0;
$pr            = $attributes['paddingRight']  ?? 0;
$pb            = $attributes['paddingBottom'] ?? 0;
$pl            = $attributes['paddingLeft']   ?? 0;
$mt            = $attributes['marginTop']     ?? 0;
$mb            = $attributes['marginBottom']  ?? 0;
$html_tag      = $attributes['htmlTag']       ?? 'p';

$allowed_tags = [ 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div' ];
$tag = in_array( $html_tag, $allowed_tags ) ? $html_tag : 'p';

$styles = [
    "font-size:{$font_size}",
    "font-weight:{$font_weight}",
    "line-height:{$line_height}",
    "letter-spacing:{$letter_spacing}",
    "text-align:{$text_align}",
    "text-transform:{$text_transform}",
    "padding:{$pt}px {$pr}px {$pb}px {$pl}px",
    "margin-top:{$mt}px",
    "margin-bottom:{$mb}px",
];

if ( $color )     $styles[] = "color:{$color}";
if ( $max_width ) $styles[] = "max-width:{$max_width}";

$wrapper_attrs = get_block_wrapper_attributes([
    'style' => implode(';', $styles),
]);
?>
<<?php echo esc_attr( $tag ); ?> <?php echo $wrapper_attrs; ?>>
    <?php echo wp_kses_post( $content ); ?>
</<?php echo esc_attr( $tag ); ?>>
