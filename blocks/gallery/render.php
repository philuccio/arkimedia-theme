<?php
/**
 * Render blocco Gallery Servizio.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$use_folder   = $attributes['useFolder']    ?? false;
$folder_id    = $attributes['folderId']     ?? 0;
$images       = $attributes['images']       ?? [];
$layout       = $attributes['layout']       ?? 'grid';
$columns      = $attributes['columns']      ?? 3;
$gap          = $attributes['gap']          ?? 8;
$aspect_ratio = $attributes['aspectRatio']  ?? '4/3';
$lightbox     = $attributes['lightbox']     ?? true;
$bg_color     = $attributes['bgColor']      ?? '';
$pt           = $attributes['paddingTop']   ?? 0;
$pb           = $attributes['paddingBottom'] ?? 0;

// ── Recupera immagini ──────────────────────────────────────
$gallery_images = [];

if ( $use_folder && $folder_id && taxonomy_exists( 'vmfo_folder' ) ) {
    // Modalità cartella — Virtual Media Folders
    $query = new WP_Query([
        'post_type'      => 'attachment',
        'post_status'    => 'inherit',
        'posts_per_page' => -1,
        'orderby'        => 'menu_order',
        'order'          => 'ASC',
        'tax_query'      => [[
            'taxonomy' => 'vmfo_folder',
            'field'    => 'term_id',
            'terms'    => absint( $folder_id ),
        ]],
    ]);

    foreach ( $query->posts as $attachment ) {
        $src     = wp_get_attachment_image_url( $attachment->ID, 'full' );
        $thumb   = wp_get_attachment_image_url( $attachment->ID, 'large' );
        $alt     = get_post_meta( $attachment->ID, '_wp_attachment_image_alt', true );
        $caption = wp_get_attachment_caption( $attachment->ID );
        $gallery_images[] = [
            'src'     => $src,
            'thumb'   => $thumb ?: $src,
            'alt'     => $alt ?: '',
            'caption' => $caption ?: '',
            'link'    => '',
        ];
    }
} else {
    // Modalità manuale
    foreach ( $images as $img ) {
        $gallery_images[] = [
            'src'     => $img['src']     ?? '',
            'thumb'   => $img['thumb']   ?? $img['src'] ?? '',
            'alt'     => $img['alt']     ?? '',
            'caption' => $img['caption'] ?? '',
            'link'    => $img['link']    ?? '',
        ];
    }
}

if ( empty( $gallery_images ) ) return '';

// ── CSS classi layout ──────────────────────────────────────
$layout_class = 'ark-gallery--' . esc_attr( $layout );

$section_style = '';
if ( $bg_color )  $section_style .= "background:{$bg_color};";
if ( $pt )        $section_style .= "padding-top:{$pt}px;";
if ( $pb )        $section_style .= "padding-bottom:{$pb}px;";

$grid_style = "gap:{$gap}px;";
if ( $layout === 'grid' || $layout === 'masonry' ) {
    $grid_style .= "grid-template-columns:repeat({$columns},1fr);";
}

$wrapper_attrs = get_block_wrapper_attributes([
    'class' => 'ark-gallery alignfull ' . $layout_class,
    'style' => "width:100vw;max-width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);{$section_style}",
]);

$gallery_id = 'ark-gallery-' . substr( md5( serialize( $attributes ) ), 0, 6 );
?>

<div <?php echo $wrapper_attrs; ?>>
    <div class="ark-gallery__grid <?php echo esc_attr( $layout_class ); ?>__grid"
         style="<?php echo esc_attr( $grid_style ); ?>"
         id="<?php echo esc_attr( $gallery_id ); ?>">

        <?php foreach ( $gallery_images as $img ) :
            if ( ! $img['src'] ) continue;

            $item_class = 'ark-gallery__item';
            $img_style  = $aspect_ratio !== 'free' ? "aspect-ratio:{$aspect_ratio};" : '';
        ?>
            <div class="<?php echo esc_attr( $item_class ); ?>">
                <?php if ( $lightbox ) : ?>
                    <a href="<?php echo esc_url( $img['src'] ); ?>"
                       data-fancybox="<?php echo esc_attr( $gallery_id ); ?>"
                       <?php if ( $img['caption'] ) : ?>
                           data-caption="<?php echo esc_attr( $img['caption'] ); ?>"
                       <?php endif; ?>
                       <?php if ( $img['link'] ) : ?>
                           data-case-study="<?php echo esc_url( $img['link'] ); ?>"
                       <?php endif; ?>>
                        <img src="<?php echo esc_url( $img['thumb'] ?: $img['src'] ); ?>"
                             alt="<?php echo esc_attr( $img['alt'] ); ?>"
                             loading="lazy"
                             style="<?php echo esc_attr( $img_style ); ?>">
                    </a>
                <?php else : ?>
                    <?php if ( $img['link'] ) : ?>
                        <a href="<?php echo esc_url( $img['link'] ); ?>">
                    <?php endif; ?>
                    <img src="<?php echo esc_url( $img['thumb'] ?: $img['src'] ); ?>"
                         alt="<?php echo esc_attr( $img['alt'] ); ?>"
                         loading="lazy"
                         style="<?php echo esc_attr( $img_style ); ?>">
                    <?php if ( $img['link'] ) : ?>
                        </a>
                    <?php endif; ?>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>

    </div>
</div>
