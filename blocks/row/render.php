<?php
/**
 * Render blocco Riga Avanzata.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$display          = $attributes['display']        ?? 'flex';
$flex_direction   = $attributes['flexDirection']  ?? 'row';
$flex_wrap        = $attributes['flexWrap']       ?? 'wrap';
$justify          = $attributes['justifyContent'] ?? 'center';
$align_items      = $attributes['alignItems']     ?? 'center';
$align_content    = $attributes['alignContent']   ?? 'normal';
$gap              = $attributes['gap']            ?? 24;
$col_gap          = $attributes['columnGap']      ?? 0;
$row_gap          = $attributes['rowGap']         ?? 0;
$use_custom_gap   = $attributes['useCustomGap']   ?? false;
$grid_cols        = $attributes['gridColumns']    ?? 2;
$grid_rows        = $attributes['gridRows']       ?? 'auto';
$grid_flow        = $attributes['gridAutoFlow']   ?? 'row';
$width            = $attributes['width']          ?? 'var(--container-width,1200px)';
$min_height       = $attributes['minHeight']      ?? '';
$max_width        = $attributes['maxWidth']       ?? '';
$overflow         = $attributes['overflow']       ?? 'visible';
$z_index          = $attributes['zIndex']         ?? '';
$pt               = $attributes['paddingTop']     ?? 40;
$pr               = $attributes['paddingRight']   ?? 24;
$pb               = $attributes['paddingBottom']  ?? 40;
$pl               = $attributes['paddingLeft']    ?? 24;
$mt               = $attributes['marginTop']      ?? '0';
$mr               = $attributes['marginRight']    ?? 'auto';
$mb               = $attributes['marginBottom']   ?? '0';
$ml               = $attributes['marginLeft']     ?? 'auto';
$bg_type          = $attributes['bgType']         ?? 'none';
$bg_color         = $attributes['bgColor']        ?? '';
$grad_type        = $attributes['gradientType']   ?? 'linear';
$grad_angle       = $attributes['gradientAngle']  ?? 135;
$grad_color1      = $attributes['gradientColor1'] ?? '#1a1a2e';
$grad_color2      = $attributes['gradientColor2'] ?? '#e94560';
$grad_pos1        = $attributes['gradientPos1']   ?? 0;
$grad_pos2        = $attributes['gradientPos2']   ?? 100;
$bg_image         = $attributes['bgImageUrl']     ?? '';
$bg_size          = $attributes['bgSize']         ?? 'cover';
$bg_position      = $attributes['bgPosition']     ?? 'center center';
$bg_repeat        = $attributes['bgRepeat']       ?? 'no-repeat';
$bg_attachment    = $attributes['bgAttachment']   ?? 'scroll';
$overlay          = $attributes['overlayColor']   ?? '';
$border_t         = $attributes['borderTopWidth']    ?? 0;
$border_r         = $attributes['borderRightWidth']  ?? 0;
$border_b         = $attributes['borderBottomWidth'] ?? 0;
$border_l         = $attributes['borderLeftWidth']   ?? 0;
$border_style     = $attributes['borderStyle']    ?? 'solid';
$border_color     = $attributes['borderColor']    ?? '#e5e5e5';
$radius_tl        = $attributes['borderRadiusTL'] ?? 0;
$radius_tr        = $attributes['borderRadiusTR'] ?? 0;
$radius_bl        = $attributes['borderRadiusBL'] ?? 0;
$radius_br        = $attributes['borderRadiusBR'] ?? 0;
$box_shadow       = $attributes['boxShadow']      ?? false;
$shadow_x         = $attributes['shadowOffsetX']  ?? 0;
$shadow_y         = $attributes['shadowOffsetY']  ?? 4;
$shadow_blur      = $attributes['shadowBlur']     ?? 16;
$shadow_spread    = $attributes['shadowSpread']   ?? 0;
$shadow_color     = $attributes['shadowColor']    ?? 'rgba(0,0,0,0.2)';
$shadow_inset     = $attributes['shadowInset']    ?? false;
$opacity          = $attributes['opacity']        ?? 1;
$translate_x      = $attributes['translateX']     ?? 0;
$translate_y      = $attributes['translateY']     ?? 0;
$rotate           = $attributes['rotate']         ?? 0;
$scale            = $attributes['scale']          ?? 1;
$anim_type        = $attributes['animationType']  ?? 'none';
$anim_delay       = $attributes['animationDelay'] ?? 0;
$anim_duration    = $attributes['animationDuration'] ?? 800;
$anim_trigger     = $attributes['animationTrigger']  ?? 'onScroll';
$anim_scrub       = $attributes['animationScrub']    ?? false;
$is_fullwidth     = $attributes['isFullwidth']    ?? false;
$html_tag         = $attributes['htmlTag']        ?? 'div';
$md_direction     = $attributes['mdFlexDirection'] ?? 'column';
$md_justify       = $attributes['mdJustify']       ?? '';
$md_align         = $attributes['mdAlignItems']    ?? '';
$md_gap           = $attributes['mdGap']           ?? 0;
$md_display       = $attributes['mdDisplay']       ?? '';
$md_grid_cols     = $attributes['mdGridColumns']   ?? 0;
$sm_direction     = $attributes['smFlexDirection'] ?? 'column';
$sm_justify       = $attributes['smJustify']       ?? '';
$sm_align         = $attributes['smAlignItems']    ?? '';
$sm_gap           = $attributes['smGap']           ?? 0;
$sm_display       = $attributes['smDisplay']       ?? '';
$sm_grid_cols     = $attributes['smGridColumns']   ?? 0;

$allowed_tags = [ 'div', 'section', 'article', 'main', 'aside', 'header', 'footer', 'nav' ];
$tag = in_array( $html_tag, $allowed_tags ) ? $html_tag : 'div';

// ── Stili ──────────────────────────────────────────────────
$styles = [];
$styles[] = "display:{$display}";
$styles[] = "box-sizing:border-box";
$styles[] = "position:relative";

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
    $styles[] = "gap:{$gap}px";
}

if ( $is_fullwidth ) {
    $styles[] = "width:100vw";
    $styles[] = "max-width:100vw";
    $styles[] = "margin-left:calc(50% - 50vw)";
    $styles[] = "margin-right:calc(50% - 50vw)";
} else {
    $styles[] = "width:{$width}";
    if ( $max_width ) $styles[] = "max-width:{$max_width}";
    $styles[] = "margin:{$mt} {$mr} {$mb} {$ml}";
}

if ( $min_height ) $styles[] = "min-height:{$min_height}";
$styles[] = "overflow:{$overflow}";
if ( $z_index ) $styles[] = "z-index:{$z_index}";
$styles[] = "padding:{$pt}px {$pr}px {$pb}px {$pl}px";

// Sfondo
switch ( $bg_type ) {
    case 'color':
        if ( $bg_color ) $styles[] = "background:{$bg_color}";
        break;
    case 'gradient':
        $grad = $grad_type === 'linear'
            ? "linear-gradient({$grad_angle}deg,{$grad_color1} {$grad_pos1}%,{$grad_color2} {$grad_pos2}%)"
            : "radial-gradient(circle,{$grad_color1} {$grad_pos1}%,{$grad_color2} {$grad_pos2}%)";
        $styles[] = "background:{$grad}";
        break;
    case 'image':
        if ( $bg_image ) {
            $styles[] = "background-image:url(" . esc_url( $bg_image ) . ")";
            $styles[] = "background-size:{$bg_size}";
            $styles[] = "background-position:{$bg_position}";
            $styles[] = "background-repeat:{$bg_repeat}";
            $styles[] = "background-attachment:{$bg_attachment}";
        }
        break;
}

// Bordo
$has_border = $border_t || $border_r || $border_b || $border_l;
if ( $has_border ) {
    $styles[] = "border-width:{$border_t}px {$border_r}px {$border_b}px {$border_l}px";
    $styles[] = "border-style:{$border_style}";
    $styles[] = "border-color:{$border_color}";
}

$has_radius = $radius_tl || $radius_tr || $radius_bl || $radius_br;
if ( $has_radius ) {
    $styles[] = "border-radius:{$radius_tl}px {$radius_tr}px {$radius_br}px {$radius_bl}px";
}

if ( $box_shadow ) {
    $inset = $shadow_inset ? 'inset ' : '';
    $styles[] = "box-shadow:{$inset}{$shadow_x}px {$shadow_y}px {$shadow_blur}px {$shadow_spread}px {$shadow_color}";
}

if ( $opacity < 1 ) $styles[] = "opacity:{$opacity}";

$transforms = [];
if ( $translate_x ) $transforms[] = "translateX({$translate_x}px)";
if ( $translate_y ) $transforms[] = "translateY({$translate_y}px)";
if ( $rotate )      $transforms[] = "rotate({$rotate}deg)";
if ( $scale != 1 )  $transforms[] = "scale({$scale})";
if ( $transforms )  $styles[] = "transform:" . implode( ' ', $transforms );

$inline_style = implode( ';', $styles );

// ID univoco responsive
$block_id = 'ark-row-' . substr( md5( serialize( $attributes ) ), 0, 8 );

// CSS responsive
$responsive_css = '';
if ( $md_direction || $md_justify || $md_align || $md_gap || $md_display || $md_grid_cols ) {
    $md = [];
    if ( $md_display )   $md[] = "display:{$md_display}";
    if ( $md_direction ) $md[] = "flex-direction:{$md_direction}";
    if ( $md_justify )   $md[] = "justify-content:{$md_justify}";
    if ( $md_align )     $md[] = "align-items:{$md_align}";
    if ( $md_gap )       $md[] = "gap:{$md_gap}px";
    if ( $md_grid_cols ) $md[] = "grid-template-columns:repeat({$md_grid_cols},1fr)";
    $responsive_css .= "@media(max-width:1024px){#{$block_id}{" . implode(';',$md) . "}}";
}
if ( $sm_direction || $sm_justify || $sm_align || $sm_gap || $sm_display || $sm_grid_cols ) {
    $sm = [];
    if ( $sm_display )   $sm[] = "display:{$sm_display}";
    if ( $sm_direction ) $sm[] = "flex-direction:{$sm_direction}";
    if ( $sm_justify )   $sm[] = "justify-content:{$sm_justify}";
    if ( $sm_align )     $sm[] = "align-items:{$sm_align}";
    if ( $sm_gap )       $sm[] = "gap:{$sm_gap}px";
    if ( $sm_grid_cols ) $sm[] = "grid-template-columns:repeat({$sm_grid_cols},1fr)";
    $responsive_css .= "@media(max-width:640px){#{$block_id}{" . implode(';',$sm) . "}}";
}

$anim_data = $anim_type !== 'none' ? wp_json_encode([
    'type'     => $anim_type,
    'delay'    => $anim_delay,
    'duration' => $anim_duration,
    'trigger'  => $anim_trigger,
    'scrub'    => $anim_scrub,
]) : '';

$wrapper_attrs = get_block_wrapper_attributes([
    'id'             => $block_id,
    'class'          => 'ark-row' . ( $is_fullwidth ? ' ark-row--fullwidth' : '' ),
    'style'          => $inline_style,
    'data-animation' => $anim_data,
]);
?>

<?php if ( $responsive_css ) : ?>
<style><?php echo $responsive_css; ?></style>
<?php endif; ?>

<<?php echo esc_attr( $tag ); ?> <?php echo $wrapper_attrs; ?>>
    <?php if ( $bg_type === 'image' && $overlay ) : ?>
        <div class="ark-row__overlay" style="background:<?php echo esc_attr( $overlay ); ?>"></div>
    <?php endif; ?>
    <?php echo $content; ?>
</<?php echo esc_attr( $tag ); ?>>
