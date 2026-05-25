<?php
/**
 * Render blocco Immagine.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$media_url    = $attributes['mediaUrl']      ?? '';
$media_alt    = $attributes['mediaAlt']      ?? '';
$caption      = $attributes['caption']       ?? '';
$link_url     = $attributes['linkUrl']       ?? '';
$link_target  = $attributes['linkTarget']    ?? '_self';
$lightbox     = $attributes['lightbox']      ?? false;
$width        = $attributes['width']         ?? '100%';
$height       = $attributes['height']        ?? 'auto';
$object_fit   = $attributes['objectFit']     ?? 'cover';
$object_pos   = $attributes['objectPosition'] ?? 'center center';
$radius       = $attributes['borderRadius']  ?? 0;
$align        = $attributes['align']         ?? 'none';
$hover        = $attributes['hoverEffect']   ?? 'none';
$opacity      = $attributes['opacity']       ?? 1;
$pt           = $attributes['paddingTop']    ?? 0;
$pb           = $attributes['paddingBottom'] ?? 0;
$mt           = $attributes['marginTop']     ?? 0;
$mb           = $attributes['marginBottom']  ?? 0;
$max_width    = $attributes['maxWidth']      ?? '';
$aspect_ratio = $attributes['aspectRatio']   ?? '';
$filter       = $attributes['filter']        ?? 'none';

if ( ! $media_url ) return '';

// Allineamento wrapper
$align_style = match( $align ) {
    'left'   => 'margin-right:auto;',
    'center' => 'margin-left:auto;margin-right:auto;',
    'right'  => 'margin-left:auto;',
    default  => '',
};

$wrapper_style = "padding-top:{$pt}px;padding-bottom:{$pb}px;margin-top:{$mt}px;margin-bottom:{$mb}px;{$align_style}";
if ( $max_width ) $wrapper_style .= "max-width:{$max_width};";
if ( $max_width || $align !== 'none' ) $wrapper_style .= "display:block;";

$img_style = "width:{$width};height:{$height};object-fit:{$object_fit};object-position:{$object_pos};border-radius:{$radius}px;opacity:{$opacity};display:block;";
if ( $aspect_ratio ) $img_style .= "aspect-ratio:{$aspect_ratio};";
if ( $filter !== 'none' ) $img_style .= "filter:{$filter};";

$hover_class = $hover !== 'none' ? ' ark-image--hover-' . esc_attr( $hover ) : '';

$wrapper_attrs = get_block_wrapper_attributes([
    'class' => 'ark-image' . $hover_class,
    'style' => $wrapper_style,
]);
?>

<figure <?php echo $wrapper_attrs; ?>>
    <?php if ( $lightbox ) : ?>
        <a href="<?php echo esc_url( $media_url ); ?>"
           data-fancybox="image-<?php echo get_the_ID(); ?>"
           <?php if ( $caption ) : ?>data-caption="<?php echo esc_attr( $caption ); ?>"<?php endif; ?>>
            <img src="<?php echo esc_url( $media_url ); ?>"
                 alt="<?php echo esc_attr( $media_alt ); ?>"
                 loading="lazy"
                 style="<?php echo esc_attr( $img_style ); ?>">
        </a>
    <?php elseif ( $link_url ) : ?>
        <a href="<?php echo esc_url( $link_url ); ?>"
           target="<?php echo esc_attr( $link_target ); ?>"
           <?php if ( $link_target === '_blank' ) : ?>rel="noopener noreferrer"<?php endif; ?>>
            <img src="<?php echo esc_url( $media_url ); ?>"
                 alt="<?php echo esc_attr( $media_alt ); ?>"
                 loading="lazy"
                 style="<?php echo esc_attr( $img_style ); ?>">
        </a>
    <?php else : ?>
        <img src="<?php echo esc_url( $media_url ); ?>"
             alt="<?php echo esc_attr( $media_alt ); ?>"
             loading="lazy"
             style="<?php echo esc_attr( $img_style ); ?>">
    <?php endif; ?>

    <?php if ( $caption ) : ?>
        <figcaption class="ark-image__caption">
            <?php echo esc_html( $caption ); ?>
        </figcaption>
    <?php endif; ?>
</figure>
