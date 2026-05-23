<?php
/**
 * Render blocco Container.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$display         = $attributes['display']        ?? 'flex';
$flex_direction  = $attributes['flexDirection']  ?? 'row';
$flex_wrap       = $attributes['flexWrap']       ?? 'nowrap';
$justify         = $attributes['justifyContent'] ?? 'flex-start';
$align_items     = $attributes['alignItems']     ?? 'stretch';
$align_content   = $attributes['alignContent']   ?? 'normal';
$gap             = $attributes['gap']            ?? 0;
$col_gap         = $attributes['columnGap']      ?? 0;
$row_gap         = $attributes['rowGap']         ?? 0;
$use_custom_gap  = $attributes['useCustomGap']   ?? false;
$grid_cols       = $attributes['gridColumns']    ?? 3;
$grid_rows       = $attributes['gridRows']       ?? 'auto';
$grid_flow       = $attributes['gridAutoFlow']   ?? 'row';
$width           = $attributes['width']          ?? '100%';
$min_height      = $attributes['minHeight']      ?? '';
$max_width       = $attributes['maxWidth']       ?? '';
$overflow        = $attributes['overflow']       ?? 'visible';
$z_index         = $attributes['zIndex']         ?? '';
$pt              = $attributes['paddingTop']     ?? 0;
$pr              = $attributes['paddingRight']   ?? 0;
$pb              = $attributes['paddingBottom']  ?? 0;
$pl              = $attributes['paddingLeft']    ?? 0;
$mt              = $attributes['marginTop']      ?? '0';
$mr              = $attributes['marginRight']    ?? '0';
$mb              = $attributes['marginBottom']   ?? '0';
$ml              = $attributes['marginLeft']     ?? '0';
$bg_color        = $attributes['bgColor']        ?? '';
$border_t        = $attributes['borderTopWidth']    ?? 0;
$border_r        = $attributes['borderRightWidth']  ?? 0;
$border_b        = $attributes['borderBottomWidth'] ?? 0;
$border_l        = $attributes['borderLeftWidth']   ?? 0;
$border_style    = $attributes['borderStyle']    ?? 'solid';
$border_color    = $attributes['borderColor']    ?? '#e5e5e5';
$radius_tl       = $attributes['borderRadiusTL'] ?? 0;
$radius_tr       = $attributes['borderRadiusTR'] ?? 0;
$radius_bl       = $attributes['borderRadiusBL'] ?? 0;
$radius_br       = $attributes['borderRadiusBR'] ?? 0;
$is_first        = $attributes['isFirstLevel']   ?? true;
$html_tag        = $attributes['htmlTag']        ?? 'div';

// Valida tag HTML
$allowed_tags = [ 'div', 'section', 'article', 'main', 'aside', 'header', 'footer', 'nav' ];
$tag = in_array( $html_tag, $allowed_tags ) ? $html_tag : 'div';

// Costruisci stili inline
$styles = [];
$styles[] = "display:{$display}";

if ( $display === 'flex' ) {
    $styles[] = "flex-direction:{$flex_direction}";
    $styles[] = "flex-wrap:{$flex_wrap}";
    $styles[] = "justify-content:{$justify}";
    $styles[] = "align-items:{$align_items}";
    if ( $align_content !== 'normal' ) $styles[] = "align-content:{$align_content}";
}

if ( $display === 'grid' ) {
    $styles[] = "grid-template-columns:repeat({$grid_cols},1fr)";
    if ( $grid_rows !== 'auto' ) $styles[] = "grid-template-rows:{$grid_rows}";
    $styles[] = "grid-auto-flow:{$grid_flow}";
}

if ( $use_custom_gap ) {
    if ( $col_gap ) $styles[] = "column-gap:{$col_gap}px";
    if ( $row_gap ) $styles[] = "row-gap:{$row_gap}px";
} else {
    if ( $gap ) $styles[] = "gap:{$gap}px";
}

$styles[] = "width:{$width}";
if ( $min_height ) $styles[] = "min-height:{$min_height}";
if ( $max_width )  $styles[] = "max-width:{$max_width}";
$styles[] = "overflow:{$overflow}";
if ( $z_index ) $styles[] = "z-index:{$z_index}";

$styles[] = "padding:{$pt}px {$pr}px {$pb}px {$pl}px";
$styles[] = "margin:{$mt} {$mr} {$mb} {$ml}";

if ( $bg_color ) $styles[] = "background:{$bg_color}";

$border_width = "{$border_t}px {$border_r}px {$border_b}px {$border_l}px";
$has_border = $border_t || $border_r || $border_b || $border_l;
if ( $has_border ) {
    $styles[] = "border-width:{$border_width}";
    $styles[] = "border-style:{$border_style}";
    $styles[] = "border-color:{$border_color}";
}

$has_radius = $radius_tl || $radius_tr || $radius_bl || $radius_br;
if ( $has_radius ) {
    $styles[] = "border-radius:{$radius_tl}px {$radius_tr}px {$radius_br}px {$radius_bl}px";
}

// Fullwidth solo sul primo livello
if ( $is_first && isset( $attributes['align'] ) && $attributes['align'] === 'full' ) {
    $styles[] = "width:100vw";
    $styles[] = "max-width:100vw";
    $styles[] = "margin-left:calc(50% - 50vw)";
    $styles[] = "margin-right:calc(50% - 50vw)";
}

$inline_style = implode( ';', $styles );

$wrapper_attrs = get_block_wrapper_attributes([
    'class' => 'ark-container' . ( $is_first ? ' ark-container--root' : ' ark-container--nested' ),
    'style' => $inline_style,
]);
?>
<<?php echo esc_attr( $tag ); ?> <?php echo $wrapper_attrs; ?>>
    <?php echo $content; ?>
</<?php echo esc_attr( $tag ); ?>>
