<?php
/**
 * Render blocco Marquee.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$text = $attributes['text'] ?? '';

if ( ! trim( $text ) ) return;

$padding_y = absint( $attributes['paddingY'] ?? 14 );

$style  = 'color:' . ( $attributes['textColor'] ?? '#ffffff' ) . ';';
$style .= "padding-top:{$padding_y}px;padding-bottom:{$padding_y}px;";

if ( ! empty( $attributes['bgColor'] ) ) {
    $style .= 'background:' . $attributes['bgColor'] . ';';
}
if ( ! empty( $attributes['showLines'] ) ) {
    $line   = $attributes['lineColor'] ?? '#ffffff33';
    $style .= "border-top:1px solid {$line};border-bottom:1px solid {$line};";
}

$wrapper_attrs = get_block_wrapper_attributes([
    'class' => 'ark-marquee-block',
    'style' => $style,
]);
?>

<div <?php echo $wrapper_attrs; ?>>
    <?php
    echo ark_render_marquee( $text, [
        'font_size' => $attributes['fontSize'] ?? '',
        'font'      => $attributes['fontFamily'] ?? '',
        'speed'     => $attributes['speed'] ?? 60,
        'direction' => $attributes['direction'] ?? 'left',
        'pause'     => $attributes['pauseOnHover'] ?? true,
        'separator' => $attributes['separator'] ?? '•',
        'separator_size' => $attributes['separatorSize'] ?? '1em',
        'separator_color' => $attributes['separatorColor'] ?? '',
    ] );
    ?>
</div>
