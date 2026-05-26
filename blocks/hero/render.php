<?php
/**
 * Render blocco Hero.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$title           = $attributes['title']           ?? '';
$title2          = $attributes['title2']          ?? '';
$title1_color    = $attributes['title1Color']     ?? '#ffffff';
$title1_size     = $attributes['title1Size']      ?? 'clamp(3rem,9vw,8rem)';
$title1_weight   = $attributes['title1Weight']    ?? '900';
$title1_pt       = $attributes['title1PaddingTop']    ?? 0;
$title1_pb       = $attributes['title1PaddingBottom'] ?? 0;
$title1_pl       = $attributes['title1PaddingLeft']   ?? 0;
$title1_pr       = $attributes['title1PaddingRight']  ?? 0;
$title1_mt       = $attributes['title1MarginTop']     ?? 0;
$title1_mb       = $attributes['title1MarginBottom']  ?? 0;
$title1_ml       = $attributes['title1MarginLeft']    ?? 0;
$title1_mr       = $attributes['title1MarginRight']   ?? 0;
$title2_color    = $attributes['title2Color']     ?? '#ffffff';
$title2_size     = $attributes['title2Size']      ?? 'clamp(3rem,9vw,8rem)';
$title2_weight   = $attributes['title2Weight']    ?? '900';
$title2_pt       = $attributes['title2PaddingTop']    ?? 0;
$title2_pb       = $attributes['title2PaddingBottom'] ?? 0;
$title2_pl       = $attributes['title2PaddingLeft']   ?? 0;
$title2_pr       = $attributes['title2PaddingRight']  ?? 0;
$title2_mt       = $attributes['title2MarginTop']     ?? 0;
$title2_mb       = $attributes['title2MarginBottom']  ?? 0;
$title2_ml       = $attributes['title2MarginLeft']    ?? 0;
$title2_mr       = $attributes['title2MarginRight']   ?? 0;
$subtitle        = $attributes['subtitle']        ?? '';
$subtitle_color  = $attributes['subtitleColor']   ?? 'rgba(255,255,255,0.85)';
$subtitle_size   = $attributes['subtitleSize']    ?? 'clamp(1rem,2vw,1.375rem)';
$eyebrow         = $attributes['eyebrow']         ?? '';
$eyebrow_color   = $attributes['eyebrowColor']    ?? '';
$cta_label       = $attributes['ctaLabel']        ?? '';
$cta_url         = $attributes['ctaUrl']          ?? '#';
$cta_label2      = $attributes['ctaLabel2']       ?? '';
$cta_url2        = $attributes['ctaUrl2']         ?? '';
$cta_bg          = $attributes['ctaBgColor']      ?? '';
$cta_text        = $attributes['ctaTextColor']    ?? '#ffffff';
$media_url       = $attributes['mediaUrl']        ?? '';
$media_alt       = $attributes['mediaAlt']        ?? '';
$overlay         = $attributes['overlayColor']    ?? 'rgba(0,0,0,0.45)';
$text_align      = $attributes['textAlign']       ?? 'left';
$min_height      = $attributes['minHeight']       ?? '100vh';
$bg_type         = $attributes['bgType']          ?? 'image';
$bg_color        = $attributes['bgColor']         ?? '#0a0a0a';
$grad_type       = $attributes['gradientType']    ?? 'linear';
$grad_angle      = $attributes['gradientAngle']   ?? 135;
$grad_color1     = $attributes['gradientColor1']  ?? '#1a1a2e';
$grad_color2     = $attributes['gradientColor2']  ?? '#e94560';
$bg_attachment   = $attributes['bgAttachment']    ?? 'scroll';
$bg_position     = $attributes['bgPosition']      ?? 'center center';
$bg_size         = $attributes['bgSize']          ?? 'cover';
$content_pos     = $attributes['contentPosition'] ?? 'bottom-left';
$pt              = $attributes['paddingTop']       ?? 0;
$pb              = $attributes['paddingBottom']    ?? 80;
$pl              = $attributes['paddingLeft']      ?? 0;
$pr              = $attributes['paddingRight']     ?? 0;

// Posizione contenuto
$v_map = [
    'bottom' => 'bottom',
    'center' => 'center',
    'top'    => 'top',
];
$h_map = [
    'left'   => 'left',
    'center' => 'center',
    'right'  => 'right',
];

$parts   = explode( '-', $content_pos );
$v_pos   = $parts[0] ?? 'bottom';
$h_pos   = $parts[1] ?? 'left';

$text_align_val = $h_pos === 'center' ? 'center' : ( $h_pos === 'right' ? 'right' : 'left' );

// Stile posizione assoluta
$content_style = 'position:absolute;left:0;right:0;width:100%;max-width:var(--container-width,1200px);margin:0 auto;';
$content_style .= "padding:{$pt}px {$pr}px {$pb}px {$pl}px;";
$content_style .= "text-align:{$text_align_val};";

if ( $v_pos === 'bottom' ) {
    $content_style .= 'bottom:0;';
} elseif ( $v_pos === 'top' ) {
    $content_style .= 'top:0;';
} else {
    $content_style .= 'top:50%;transform:translateY(-50%);';
}

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
    default:
        if ( $media_url ) {
            $bg_style = "background-image:url(" . esc_url( $media_url ) . ");background-size:{$bg_size};background-position:{$bg_position};background-attachment:{$bg_attachment};background-repeat:no-repeat;";
        } else {
            $bg_style = "background:{$bg_color};";
        }
        break;
}

$wrapper_style = "min-height:{$min_height};position:relative;overflow:hidden;width:100vw;max-width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);{$bg_style}";

$wrapper_attrs = get_block_wrapper_attributes([
    'class' => 'ark-hero',
    'style' => $wrapper_style,
]);

// Stili titoli
$t1_style = "font-size:{$title1_size};font-weight:{$title1_weight};color:{$title1_color};line-height:1;letter-spacing:-0.02em;display:block;padding:{$title1_pt}px {$title1_pr}px {$title1_pb}px {$title1_pl}px;margin:{$title1_mt}px {$title1_mr}px {$title1_mb}px {$title1_ml}px;";
$t2_style = "font-size:{$title2_size};font-weight:{$title2_weight};color:{$title2_color};line-height:1;letter-spacing:-0.02em;display:block;padding:{$title2_pt}px {$title2_pr}px {$title2_pb}px {$title2_pl}px;margin:{$title2_mt}px {$title2_mr}px {$title2_mb}px {$title2_ml}px;";
?>

<section <?php echo $wrapper_attrs; ?>>

    <?php if ( $overlay ) : ?>
        <div style="position:absolute;inset:0;background:<?php echo esc_attr( $overlay ); ?>;z-index:1;pointer-events:none;"></div>
    <?php endif; ?>

    <div class="ark-hero__content" style="<?php echo esc_attr( $content_style ); ?>z-index:2;">

        <?php if ( $eyebrow ) : ?>
            <p class="ark-hero__eyebrow" style="<?php echo $eyebrow_color ? "color:{$eyebrow_color};" : ''; ?>">
                <?php echo esc_html( $eyebrow ); ?>
            </p>
        <?php endif; ?>

        <?php if ( $title ) : ?>
            <span class="ark-hero__title ark-hero__title--1" style="<?php echo esc_attr( $t1_style ); ?>">
                <?php echo wp_kses_post( $title ); ?>
            </span>
        <?php endif; ?>

        <?php if ( $title2 ) : ?>
            <span class="ark-hero__title ark-hero__title--2" style="<?php echo esc_attr( $t2_style ); ?>">
                <?php echo wp_kses_post( $title2 ); ?>
            </span>
        <?php endif; ?>

        <?php if ( $subtitle ) : ?>
            <p class="ark-hero__subtitle" style="font-size:<?php echo esc_attr( $subtitle_size ); ?>;color:<?php echo esc_attr( $subtitle_color ); ?>;">
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
