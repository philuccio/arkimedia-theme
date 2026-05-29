<?php
/**
 * Render blocco Single Service.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$image_url      = $attributes['imageUrl']        ?? '';
$image_alt      = $attributes['imageAlt']        ?? '';
$image_position = $attributes['imagePosition']   ?? 'left';
$object_fit     = $attributes['objectFit']       ?? 'cover';
$object_pos     = $attributes['objectPosition']  ?? 'center center';
$image_flex     = $attributes['imageFlex']       ?? '1';
$text_flex      = $attributes['textFlex']        ?? '2';
$title          = $attributes['title']           ?? '';
$title_color    = $attributes['titleColor']      ?? '#ffffff';
$title_size     = $attributes['titleSize']       ?? 'clamp(2rem,5vw,3.5rem)';
$title_weight   = $attributes['titleWeight']     ?? '700';
$title_lh       = $attributes['titleLineHeight'] ?? '1.1';
$description    = $attributes['description']     ?? '';
$desc_color     = $attributes['descColor']       ?? 'rgba(255,255,255,0.75)';
$desc_size      = $attributes['descSize']        ?? '1rem';
$cta_label      = $attributes['ctaLabel']        ?? '';
$cta_url        = $attributes['ctaUrl']          ?? '#';
$cta_bg         = $attributes['ctaBgColor']      ?? '';
$cta_text       = $attributes['ctaTextColor']    ?? '#ffffff';
$cta_border     = $attributes['ctaBorderColor']  ?? '';
$cta_style      = $attributes['ctaStyle']        ?? 'filled';
$min_height     = $attributes['minHeight']       ?? '500px';
$align_items    = $attributes['alignItems']      ?? 'center';
$gap            = $attributes['gap']             ?? 0;
$bg_color       = $attributes['bgColor']         ?? '#0a0a0a';
$text_pt        = $attributes['textPaddingTop']    ?? 60;
$text_pb        = $attributes['textPaddingBottom'] ?? 60;
$text_pl        = $attributes['textPaddingLeft']   ?? 60;
$text_pr        = $attributes['textPaddingRight']  ?? 60;
$border_radius  = $attributes['borderRadius']    ?? 0;
$box_shadow     = $attributes['boxShadow']       ?? false;
$shadow_color   = $attributes['shadowColor']     ?? 'rgba(0,0,0,0.3)';
$shadow_blur    = $attributes['shadowBlur']      ?? 30;
$shadow_spread  = $attributes['shadowSpread']    ?? 0;
$anim_type      = $attributes['animationType']   ?? 'none';
$is_fullwidth   = $attributes['isFullwidth']     ?? false;
$block_pt       = $attributes['blockPaddingTop']    ?? 0;
$block_pb       = $attributes['blockPaddingBottom'] ?? 0;
$block_pl       = $attributes['blockPaddingLeft']   ?? 0;
$block_pr       = $attributes['blockPaddingRight']  ?? 0;
$block_mt       = $attributes['blockMarginTop']     ?? 0;
$block_mb       = $attributes['blockMarginBottom']  ?? 0;

$block_id = 'ark-ss-' . substr( md5( serialize( $attributes ) ), 0, 8 );

// Sempre fullwidth come sfondo, contenuto dentro container
$wrapper_style = "background:{$bg_color};width:100vw;max-width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);margin-top:{$block_mt}px;margin-bottom:{$block_mb}px;padding:{$block_pt}px {$block_pr}px {$block_pb}px {$block_pl}px;";

if ( $border_radius ) $wrapper_style .= "border-radius:{$border_radius}px;";
if ( $box_shadow ) $wrapper_style .= "box-shadow:0 0 {$shadow_blur}px {$shadow_spread}px {$shadow_color};";

// CTA style
$cta_inline = "color:{$cta_text};text-decoration:none;display:inline-flex;align-items:center;gap:0.5rem;font-weight:600;font-size:0.9375rem;transition:all 0.3s ease;padding:0.875rem 2rem;border-radius:4px;";
if ( $cta_style === 'filled' ) {
    $cta_inline .= "background:" . ( $cta_bg ?: 'var(--color-accent,#e94560)' ) . ";";
} elseif ( $cta_style === 'outline' ) {
    $cta_inline .= "background:transparent;border:2px solid " . ( $cta_border ?: $cta_text ) . ";";
} elseif ( $cta_style === 'ghost' ) {
    $cta_inline .= "background:transparent;padding-left:0;padding-right:0;border-bottom:2px solid " . ( $cta_border ?: $cta_text ) . ";border-radius:0;";
}

$wrapper_attrs = get_block_wrapper_attributes([
    'id'             => $block_id,
    'class'          => 'ark-single-service' . ( $is_fullwidth ? ' is-fullwidth' : '' ),
    'style'          => $wrapper_style,
    'data-animation' => $anim_type !== 'none' ? $anim_type : '',
]);
?>

<div <?php echo $wrapper_attrs; ?>>

    <!-- Inner container -->
    <div class="ark-single-service__inner" style="display:flex;flex-direction:<?php echo $image_position === 'right' ? 'row-reverse' : 'row'; ?>;align-items:<?php echo esc_attr( $align_items ); ?>;gap:<?php echo absint( $gap ); ?>px;width:calc(100% - (var(--container-pad,1.5rem) * 2));max-width:var(--container-width,1200px);margin:0 auto;min-height:<?php echo esc_attr( $min_height ); ?>;box-sizing:border-box;">

    <?php if ( $image_url ) : ?>
    <div class="ark-single-service__image" style="flex:<?php echo esc_attr( $image_flex ); ?>;position:relative;overflow:hidden;align-self:stretch;">
        <img src="<?php echo esc_url( $image_url ); ?>"
             alt="<?php echo esc_attr( $image_alt ); ?>"
             loading="lazy"
             style="position:absolute;inset:0;width:100%;height:100%;object-fit:<?php echo esc_attr( $object_fit ); ?>;object-position:<?php echo esc_attr( $object_pos ); ?>;">
    </div>
    <?php endif; ?>

    <div class="ark-single-service__text" style="flex:<?php echo esc_attr( $text_flex ); ?>;padding:<?php echo absint($text_pt); ?>px <?php echo absint($text_pr); ?>px <?php echo absint($text_pb); ?>px <?php echo absint($text_pl); ?>px;display:flex;flex-direction:column;justify-content:center;">

        <?php if ( $title ) : ?>
        <h2 class="ark-single-service__title" style="font-size:<?php echo esc_attr( $title_size ); ?>;font-weight:<?php echo esc_attr( $title_weight ); ?>;color:<?php echo esc_attr( $title_color ); ?>;line-height:<?php echo esc_attr( $title_lh ); ?>;margin:0 0 1.25rem;">
            <?php echo wp_kses_post( $title ); ?>
        </h2>
        <?php endif; ?>

        <?php if ( $description ) : ?>
        <p class="ark-single-service__desc" style="font-size:<?php echo esc_attr( $desc_size ); ?>;color:<?php echo esc_attr( $desc_color ); ?>;line-height:1.7;margin:0 0 2rem;">
            <?php echo wp_kses_post( $description ); ?>
        </p>
        <?php endif; ?>

        <?php if ( $cta_label ) : ?>
        <div>
            <a href="<?php echo esc_url( $cta_url ); ?>" class="ark-single-service__cta" style="<?php echo esc_attr( $cta_inline ); ?>">
                <?php echo esc_html( $cta_label ); ?>
                <span aria-hidden="true">→</span>
            </a>
        </div>
        <?php endif; ?>

    </div>

    </div><!-- /.ark-single-service__inner -->

</div>
