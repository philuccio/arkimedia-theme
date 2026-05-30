<?php
/**
 * Render blocco CTA.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$layout       = $attributes['layout']         ?? 'A';
$eyebrow      = $attributes['eyebrow']        ?? '';
$eyebrow_color= $attributes['eyebrowColor']   ?? '';
$title        = $attributes['title']          ?? '';
$title_color  = $attributes['titleColor']     ?? '#ffffff';
$title_size   = $attributes['titleSize']      ?? 'clamp(2rem,5vw,3.5rem)';
$title_weight = $attributes['titleWeight']    ?? '700';
$title_lh     = $attributes['titleLineHeight'] ?? '1.1';
$description  = $attributes['description']    ?? '';
$desc_color   = $attributes['descColor']      ?? 'rgba(255,255,255,0.75)';
$desc_size    = $attributes['descSize']       ?? '1rem';
$cta1_label   = $attributes['cta1Label']      ?? '';
$cta1_url     = $attributes['cta1Url']        ?? '#';
$cta1_style   = $attributes['cta1Style']      ?? 'filled';
$cta1_bg      = $attributes['cta1BgColor']    ?? '';
$cta1_text    = $attributes['cta1TextColor']  ?? '#ffffff';
$cta2_label   = $attributes['cta2Label']      ?? '';
$cta2_url     = $attributes['cta2Url']        ?? '#';
$cta2_style   = $attributes['cta2Style']      ?? 'outline';
$cta2_bg      = $attributes['cta2BgColor']    ?? '';
$cta2_text    = $attributes['cta2TextColor']  ?? '#ffffff';
$bg_type      = $attributes['bgType']         ?? 'color';
$bg_color     = $attributes['bgColor']        ?? '#1a1a2e';
$grad_angle   = $attributes['gradientAngle']  ?? 135;
$grad_color1  = $attributes['gradientColor1'] ?? '#1a1a2e';
$grad_color2  = $attributes['gradientColor2'] ?? '#e94560';
$bg_image     = $attributes['bgImageUrl']     ?? '';
$bg_size      = $attributes['bgSize']         ?? 'cover';
$bg_position  = $attributes['bgPosition']     ?? 'center center';
$overlay      = $attributes['overlayColor']   ?? 'rgba(0,0,0,0.5)';
$min_height   = $attributes['minHeight']      ?? '400px';
$is_fullwidth = $attributes['isFullwidth']    ?? true;
$text_align   = $attributes['textAlign']      ?? 'center';
$border_radius= $attributes['borderRadius']   ?? 0;
$box_shadow   = $attributes['boxShadow']      ?? false;
$shadow_color = $attributes['shadowColor']    ?? 'rgba(0,0,0,0.3)';
$shadow_blur  = $attributes['shadowBlur']     ?? 30;
$pt           = $attributes['paddingTop']     ?? 80;
$pb           = $attributes['paddingBottom']  ?? 80;
$pl           = $attributes['paddingLeft']    ?? 0;
$pr           = $attributes['paddingRight']   ?? 0;
$mt           = $attributes['marginTop']      ?? 0;
$mb           = $attributes['marginBottom']   ?? 0;
$anim_type    = $attributes['animationType']  ?? 'none';
$anim_delay   = $attributes['animationDelay'] ?? 0;

// Sfondo
switch ( $bg_type ) {
    case 'gradient':
        $bg_style = "background:linear-gradient({$grad_angle}deg,{$grad_color1},{$grad_color2});";
        break;
    case 'image':
        $bg_style = $bg_image
            ? "background-image:url(" . esc_url( $bg_image ) . ");background-size:{$bg_size};background-position:{$bg_position};background-repeat:no-repeat;"
            : "background:{$bg_color};";
        break;
    default:
        $bg_style = "background:{$bg_color};";
        break;
}

// Larghezza
$width_style = $is_fullwidth
    ? "width:100vw;max-width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);"
    : "width:100%;max-width:var(--container-width,1200px);margin-left:auto;margin-right:auto;";

$wrapper_style  = "{$bg_style}{$width_style}min-height:{$min_height};position:relative;overflow:hidden;margin-top:{$mt}px;margin-bottom:{$mb}px;";
if ( $border_radius ) $wrapper_style .= "border-radius:{$border_radius}px;";
if ( $box_shadow ) $wrapper_style .= "box-shadow:0 0 {$shadow_blur}px {$shadow_color};";

// CTA helper
$ark_cta_btn = function( $label, $url, $style, $bg, $text_color ) {
    if ( ! $label ) return '';
    $css = "display:inline-flex;align-items:center;gap:0.5rem;font-weight:700;font-size:0.9375rem;text-decoration:none;transition:all 0.3s ease;letter-spacing:0.02em;";
    switch ( $style ) {
        case 'filled':
            $css .= "background:" . ( $bg ?: 'var(--color-accent,#e94560)' ) . ";color:{$text_color};padding:1rem 2.5rem;border-radius:4px;";
            break;
        case 'outline':
            $css .= "border:2px solid currentColor;color:{$text_color};padding:1rem 2.5rem;border-radius:4px;";
            break;
        case 'ghost':
            $css .= "color:{$text_color};border-bottom:2px solid currentColor;padding-bottom:4px;";
            break;
    }
    return "<a href=\"" . esc_url( $url ) . "\" class=\"ark-cta__btn ark-cta__btn--{$style}\" style=\"" . esc_attr( $css ) . "\">{$label} →</a>";
};

$wrapper_attrs = get_block_wrapper_attributes([
    'class'          => 'ark-cta ark-cta--' . esc_attr( strtolower( $layout ) ),
    'style'          => $wrapper_style,
    'data-animation' => $anim_type !== 'none' ? $anim_type : '',
    'data-delay'     => $anim_delay ? $anim_delay / 1000 : '',
]);

// Testo content
$content_style = "position:relative;z-index:2;padding:{$pt}px {$pr}px {$pb}px {$pl}px;";
$title_style   = "font-size:{$title_size};font-weight:{$title_weight};color:{$title_color};line-height:{$title_lh};margin:0 0 1rem;";
$eyebrow_style = "font-size:0.75rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 1rem;" . ( $eyebrow_color ? "color:{$eyebrow_color};" : "color:var(--color-accent,#e94560);" );
$desc_style    = "font-size:{$desc_size};color:{$desc_color};line-height:1.7;margin:0 0 2rem;";
?>

<div <?php echo $wrapper_attrs; ?>>

    <?php if ( $bg_type === 'image' && $overlay ) : ?>
        <div style="position:absolute;inset:0;background:<?php echo esc_attr( $overlay ); ?>;z-index:1;"></div>
    <?php endif; ?>

    <?php if ( $layout === 'A' ) : ?>
        <!-- Layout A: tutto centrato -->
        <div class="container" style="<?php echo esc_attr( $content_style ); ?>text-align:<?php echo esc_attr( $text_align ); ?>;">
            <?php if ( $eyebrow ) : ?><p style="<?php echo esc_attr( $eyebrow_style ); ?>"><?php echo esc_html( $eyebrow ); ?></p><?php endif; ?>
            <?php if ( $title ) : ?><h2 style="<?php echo esc_attr( $title_style ); ?>"><?php echo wp_kses_post( $title ); ?></h2><?php endif; ?>
            <?php if ( $description ) : ?><p style="<?php echo esc_attr( $desc_style ); ?>max-width:700px;margin-left:auto;margin-right:auto;"><?php echo wp_kses_post( $description ); ?></p><?php endif; ?>
            <?php if ( $cta1_label || $cta2_label ) : ?>
                <div class="ark-cta__btns" style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:<?php echo $text_align === 'center' ? 'center' : ( $text_align === 'right' ? 'flex-end' : 'flex-start' ); ?>;">
                    <?php echo $ark_cta_btn( $cta1_label, $cta1_url, $cta1_style, $cta1_bg, $cta1_text ); ?>
                    <?php echo $ark_cta_btn( $cta2_label, $cta2_url, $cta2_style, $cta2_bg, $cta2_text ); ?>
                </div>
            <?php endif; ?>
        </div>

    <?php elseif ( $layout === 'B' ) : ?>
        <!-- Layout B: testo sx + pulsanti dx -->
        <div class="container" style="<?php echo esc_attr( $content_style ); ?>display:flex;align-items:center;justify-content:space-between;gap:3rem;flex-wrap:wrap;">
            <div style="flex:1;min-width:300px;">
                <?php if ( $eyebrow ) : ?><p style="<?php echo esc_attr( $eyebrow_style ); ?>"><?php echo esc_html( $eyebrow ); ?></p><?php endif; ?>
                <?php if ( $title ) : ?><h2 style="<?php echo esc_attr( $title_style ); ?>"><?php echo wp_kses_post( $title ); ?></h2><?php endif; ?>
                <?php if ( $description ) : ?><p style="<?php echo esc_attr( $desc_style ); ?>margin-bottom:0;"><?php echo wp_kses_post( $description ); ?></p><?php endif; ?>
            </div>
            <?php if ( $cta1_label || $cta2_label ) : ?>
                <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:center;flex-shrink:0;">
                    <?php echo $ark_cta_btn( $cta1_label, $cta1_url, $cta1_style, $cta1_bg, $cta1_text ); ?>
                    <?php echo $ark_cta_btn( $cta2_label, $cta2_url, $cta2_style, $cta2_bg, $cta2_text ); ?>
                </div>
            <?php endif; ?>
        </div>

    <?php elseif ( $layout === 'C' ) : ?>
        <!-- Layout C: sfondo immagine + contenuto centrato -->
        <div class="container" style="<?php echo esc_attr( $content_style ); ?>text-align:<?php echo esc_attr( $text_align ); ?>;">
            <?php if ( $eyebrow ) : ?><p style="<?php echo esc_attr( $eyebrow_style ); ?>"><?php echo esc_html( $eyebrow ); ?></p><?php endif; ?>
            <?php if ( $title ) : ?><h2 style="<?php echo esc_attr( $title_style ); ?>"><?php echo wp_kses_post( $title ); ?></h2><?php endif; ?>
            <?php if ( $description ) : ?><p style="<?php echo esc_attr( $desc_style ); ?>max-width:700px;margin-left:auto;margin-right:auto;"><?php echo wp_kses_post( $description ); ?></p><?php endif; ?>
            <?php if ( $cta1_label || $cta2_label ) : ?>
                <div class="ark-cta__btns" style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;">
                    <?php echo $ark_cta_btn( $cta1_label, $cta1_url, $cta1_style, $cta1_bg, $cta1_text ); ?>
                    <?php echo $ark_cta_btn( $cta2_label, $cta2_url, $cta2_style, $cta2_bg, $cta2_text ); ?>
                </div>
            <?php endif; ?>
        </div>

    <?php endif; ?>

</div>
