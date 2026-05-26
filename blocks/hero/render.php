<?php
/**
 * Render blocco Hero.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$title          = $attributes['title']          ?? '';
$title2         = $attributes['title2']         ?? '';
$title1_color   = $attributes['title1Color']    ?? '#ffffff';
$title1_size    = $attributes['title1Size']     ?? 'clamp(3rem,9vw,8rem)';
$title1_weight  = $attributes['title1Weight']   ?? '900';
$title2_color   = $attributes['title2Color']    ?? '#ffffff';
$title2_size    = $attributes['title2Size']     ?? 'clamp(3rem,9vw,8rem)';
$title2_weight  = $attributes['title2Weight']   ?? '900';
$subtitle       = $attributes['subtitle']       ?? '';
$subtitle_color = $attributes['subtitleColor']  ?? 'rgba(255,255,255,0.85)';
$subtitle_size  = $attributes['subtitleSize']   ?? 'clamp(1rem,2vw,1.375rem)';
$eyebrow        = $attributes['eyebrow']        ?? '';
$eyebrow_color  = $attributes['eyebrowColor']   ?? '';
$cta_label      = $attributes['ctaLabel']       ?? '';
$cta_url        = $attributes['ctaUrl']         ?? '#';
$cta_label2     = $attributes['ctaLabel2']      ?? '';
$cta_url2       = $attributes['ctaUrl2']        ?? '';
$cta_bg         = $attributes['ctaBgColor']     ?? '';
$cta_text       = $attributes['ctaTextColor']   ?? '#ffffff';
$media_url      = $attributes['mediaUrl']       ?? '';
$media_alt      = $attributes['mediaAlt']       ?? '';
$overlay        = $attributes['overlayColor']   ?? 'rgba(0,0,0,0.45)';
$text_align     = $attributes['textAlign']      ?? 'left';
$min_height     = $attributes['minHeight']      ?? '100vh';
$bg_type        = $attributes['bgType']         ?? 'image';
$bg_color       = $attributes['bgColor']        ?? '#0a0a0a';
$grad_type      = $attributes['gradientType']   ?? 'linear';
$grad_angle     = $attributes['gradientAngle']  ?? 135;
$grad_color1    = $attributes['gradientColor1'] ?? '#1a1a2e';
$grad_color2    = $attributes['gradientColor2'] ?? '#e94560';
$bg_attachment  = $attributes['bgAttachment']   ?? 'scroll';
$bg_position    = $attributes['bgPosition']     ?? 'center center';
$bg_size        = $attributes['bgSize']         ?? 'cover';
$content_pos    = $attributes['contentPosition'] ?? 'bottom-left';
$pt             = $attributes['paddingTop']     ?? 0;
$pb             = $attributes['paddingBottom']  ?? 80;
$pl             = $attributes['paddingLeft']    ?? 0;
$pr             = $attributes['paddingRight']   ?? 0;

// Posizione contenuto
$pos_map = [
    'bottom-left'   => [ 'align-items' => 'flex-end',   'text-align' => 'left' ],
    'bottom-center' => [ 'align-items' => 'flex-end',   'text-align' => 'center' ],
    'bottom-right'  => [ 'align-items' => 'flex-end',   'text-align' => 'right' ],
    'center-left'   => [ 'align-items' => 'center',     'text-align' => 'left' ],
    'center-center' => [ 'align-items' => 'center',     'text-align' => 'center' ],
    'center-right'  => [ 'align-items' => 'center',     'text-align' => 'right' ],
    'top-left'      => [ 'align-items' => 'flex-start', 'text-align' => 'left' ],
    'top-center'    => [ 'align-items' => 'flex-start', 'text-align' => 'center' ],
    'top-right'     => [ 'align-items' => 'flex-start', 'text-align' => 'right' ],
];
$pos = $pos_map[ $content_pos ] ?? $pos_map['bottom-left'];

// Sfondo
$bg_style = '';
switch ( $bg_type ) {
    case 'color':
        $bg_style = "background:{$bg_color};";
        break;
    case 'gradient':
        $grad = $grad_type === 'linear'
            ? "linear-gradient({$grad_angle}deg,{$grad_color1},{$grad_color2})"
            : "radial-gradient(circle,{$grad_color1},{$grad_color2})";
        $bg_style = "background:{$grad};";
        break;
    case 'image':
    default:
        if ( $media_url ) {
            $bg_style = "background-image:url(" . esc_url( $media_url ) . ");background-size:{$bg_size};background-position:{$bg_position};background-attachment:{$bg_attachment};background-repeat:no-repeat;";
        } else {
            $bg_style = "background:{$bg_color};";
        }
        break;
}

$wrapper_style = "min-height:{$min_height};display:flex;align-items:{$pos['align-items']};width:100vw;max-width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);position:relative;overflow:hidden;{$bg_style}";

$wrapper_attrs = get_block_wrapper_attributes([
    'class' => 'ark-hero ark-hero--align-' . esc_attr( $text_align ),
    'style' => $wrapper_style,
]);
?>

<section <?php echo $wrapper_attrs; ?>>

    <!-- Overlay -->
    <?php if ( $overlay ) : ?>
        <div class="ark-hero__overlay" style="position:absolute;inset:0;background:<?php echo esc_attr( $overlay ); ?>;z-index:1;pointer-events:none;"></div>
    <?php endif; ?>

    <!-- Contenuto -->
    <div class="ark-hero__content" style="position:relative;z-index:2;width:100%;max-width:var(--container-width,1200px);margin:0 auto;padding:<?php echo absint($pt); ?>px <?php echo absint($pr); ?>px <?php echo absint($pb); ?>px <?php echo absint($pl); ?>px;text-align:<?php echo esc_attr( $pos['text-align'] ); ?>;">

        <?php if ( $eyebrow ) : ?>
            <p class="ark-hero__eyebrow" style="<?php echo $eyebrow_color ? "color:{$eyebrow_color};" : ''; ?>">
                <?php echo esc_html( $eyebrow ); ?>
            </p>
        <?php endif; ?>

        <?php if ( $title ) : ?>
            <h1 class="ark-hero__title ark-hero__title--1"
                style="font-size:<?php echo esc_attr( $title1_size ); ?> !important;font-weight:<?php echo esc_attr( $title1_weight ); ?> !important;color:<?php echo esc_attr( $title1_color ); ?> !important;line-height:1 !important;letter-spacing:-0.02em !important;margin:0 !important;">
                <?php echo wp_kses_post( $title ); ?>
            </h1>
        <?php endif; ?>

        <?php if ( $title2 ) : ?>
            <p class="ark-hero__title ark-hero__title--2"
               style="font-size:<?php echo esc_attr( $title2_size ); ?> !important;font-weight:<?php echo esc_attr( $title2_weight ); ?> !important;color:<?php echo esc_attr( $title2_color ); ?> !important;line-height:1 !important;letter-spacing:-0.02em !important;margin:0 !important;">
                <?php echo wp_kses_post( $title2 ); ?>
            </p>
        <?php endif; ?>

        <?php if ( $subtitle ) : ?>
            <p class="ark-hero__subtitle"
               style="font-size:<?php echo esc_attr( $subtitle_size ); ?>;color:<?php echo esc_attr( $subtitle_color ); ?>;">
                <?php echo wp_kses_post( $subtitle ); ?>
            </p>
        <?php endif; ?>

        <?php if ( $cta_label || $cta_label2 ) : ?>
            <div class="ark-hero__ctas">
                <?php if ( $cta_label ) : ?>
                    <a class="ark-hero__cta btn"
                       href="<?php echo esc_url( $cta_url ); ?>"
                       style="<?php echo $cta_bg ? "background:{$cta_bg};" : ''; ?>color:<?php echo esc_attr( $cta_text ); ?>;">
                        <?php echo esc_html( $cta_label ); ?>
                    </a>
                <?php endif; ?>
                <?php if ( $cta_label2 && $cta_url2 ) : ?>
                    <a class="ark-hero__cta ark-hero__cta--secondary btn"
                       href="<?php echo esc_url( $cta_url2 ); ?>">
                        <?php echo esc_html( $cta_label2 ); ?>
                    </a>
                <?php endif; ?>
            </div>
        <?php endif; ?>

    </div>

</section>
