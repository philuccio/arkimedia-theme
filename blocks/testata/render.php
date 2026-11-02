<?php
/**
 * Render blocco Testata.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$use_page_title  = $attributes['usePageTitle']   ?? true;
$custom_title    = $attributes['customTitle']    ?? '';
$show_title      = $attributes['showTitle']      ?? true;
$eyebrow         = $attributes['eyebrow']        ?? '';
$height          = $attributes['height']         ?? '70vh';
$bg_type         = $attributes['bgType']         ?? 'image';
$media_id        = $attributes['mediaId']        ?? 0;
$media_url       = $attributes['mediaUrl']       ?? '';
$media_alt       = $attributes['mediaAlt']       ?? '';
$bg_color        = $attributes['bgColor']        ?? '#1a1a2e';
$grad_type       = $attributes['gradientType']   ?? 'linear';
$grad_angle      = $attributes['gradientAngle']  ?? 135;
$grad_color1     = $attributes['gradientColor1'] ?? '#1a1a2e';
$grad_color2     = $attributes['gradientColor2'] ?? '#e94560';
$overlay         = $attributes['overlayColor']   ?? 'rgba(0,0,0,0.45)';
$bg_size         = $attributes['bgSize']         ?? 'cover';
$bg_position     = $attributes['bgPosition']     ?? 'center center';
$bg_attachment   = $attributes['bgAttachment']   ?? 'scroll';
$text_color      = $attributes['textColor']      ?? '#ffffff';
$pt              = $attributes['paddingTop']     ?? 0;
$pb              = $attributes['paddingBottom']  ?? 64;
$pl              = $attributes['paddingLeft']    ?? 0;
$pr              = $attributes['paddingRight']   ?? 0;
$title_size      = $attributes['titleSize']      ?? 'clamp(2.5rem,5vw,5rem)';
$content_pos     = $attributes['contentPosition'] ?? 'bottom';

// Con l'ID l'immagine segue il dominio del sito; l'URL resta per i blocchi già salvati
if ( $media_id ) {
    $media_url = wp_get_attachment_image_url( $media_id, 'full' ) ?: $media_url;
}

// Titolo — automatico o custom
$title = '';
if ( $show_title ) {
    if ( $use_page_title ) {
        $title = get_the_title();
    } elseif ( $custom_title ) {
        $title = $custom_title;
    }
}

// Sfondo
$bg_styles = [];
switch ( $bg_type ) {
    case 'color':
        $bg_styles[] = "background:{$bg_color}";
        break;
    case 'gradient':
        $grad = $grad_type === 'linear'
            ? "linear-gradient({$grad_angle}deg,{$grad_color1},{$grad_color2})"
            : "radial-gradient(circle,{$grad_color1},{$grad_color2})";
        $bg_styles[] = "background:{$grad}";
        break;
    case 'image':
        if ( $media_url ) {
            $bg_styles[] = "background-image:url(" . esc_url( $media_url ) . ")";
            $bg_styles[] = "background-size:{$bg_size}";
            $bg_styles[] = "background-position:{$bg_position}";
            $bg_styles[] = "background-repeat:no-repeat";
        } else {
            $bg_styles[] = "background:{$bg_color}";
        }
        break;
}

// Allineamento contenuto
$align_map = [
    'top'    => 'flex-start',
    'center' => 'center',
    'bottom' => 'flex-end',
];
$align_items = $align_map[ $content_pos ] ?? 'flex-end';

$has_image = $bg_type === 'image' && $media_url;

$testata_class = 'ark-testata alignfull';
if ( $has_image && $bg_attachment === 'fixed' ) $testata_class .= ' ark-testata--parallax';

// Il padding del pannello si somma allo spazio per l'header fisso e al margine del container
$content_style  = 'padding-top:calc(var(--header-height,80px) + 2rem + ' . absint( $pt ) . 'px);';
$content_style .= 'padding-right:calc(var(--container-pad,1.5rem) + ' . absint( $pr ) . 'px);';
$content_style .= 'padding-bottom:' . absint( $pb ) . 'px;';
$content_style .= 'padding-left:calc(var(--container-pad,1.5rem) + ' . absint( $pl ) . 'px);';

$wrapper_attrs = get_block_wrapper_attributes([
    'class' => $testata_class,
    'style' => implode(';', $bg_styles) . ";min-height:{$height};color:{$text_color};width:100vw;max-width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);display:flex;align-items:{$align_items};position:relative;overflow:hidden;",
]);
?>

<div <?php echo $wrapper_attrs; ?>>

    <?php if ( $has_image && $media_alt ) : ?>
        <span class="screen-reader-text" role="img" aria-label="<?php echo esc_attr( $media_alt ); ?>"></span>
    <?php endif; ?>

    <?php if ( $overlay && ( $bg_type !== 'image' || $media_url ) ) : ?>
        <div class="ark-testata__overlay"
             style="position:absolute;inset:0;background:<?php echo esc_attr( $overlay ); ?>;z-index:1;pointer-events:none;"></div>
    <?php endif; ?>

    <div class="ark-testata__content container" style="<?php echo esc_attr( $content_style ); ?>">
        <?php if ( $eyebrow && $show_title ) : ?>
            <p class="ark-testata__eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
        <?php endif; ?>

        <?php if ( $title ) : ?>
            <h1 class="ark-testata__title"
                style="font-size:<?php echo esc_attr( $title_size ); ?>;">
                <?php echo esc_html( $title ); ?>
            </h1>
        <?php endif; ?>
    </div>

</div>
