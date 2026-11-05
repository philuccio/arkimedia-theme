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

$other_key      = 'altre-citta';
$is_folder_mode = false;
$cities         = [];
$has_other      = false;

// ── Recupera immagini ──────────────────────────────────────
$gallery_images = [];

if ( $use_folder && $folder_id && taxonomy_exists( 'vmfo_folder' ) ) {
    // Modalità cartella — Virtual Media Folders
    $is_folder_mode = true;

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
        if ( ! $src ) continue;

        $thumb   = wp_get_attachment_image_url( $attachment->ID, 'large' );
        $alt     = get_post_meta( $attachment->ID, '_wp_attachment_image_alt', true );
        $caption = wp_get_attachment_caption( $attachment->ID );

        $location = ark_get_attachment_location( $attachment->ID );
        $city_key = sanitize_title( $location['city'] ) ?: $other_key;

        if ( $city_key === $other_key ) {
            $has_other = true;
        } elseif ( ! isset( $cities[ $city_key ] ) ) {
            $cities[ $city_key ] = $location['city'];
        }

        $gallery_images[] = [
            'src'     => $src,
            'thumb'   => $thumb ?: $src,
            'alt'     => $alt ?: '',
            'caption' => $caption ?: '',
            'link'    => '',
            'location' => implode( ' — ', array_filter( $location ) ),
            'city_key' => $city_key,
        ];
    }
} else {
    // Modalità manuale — città e indirizzo letti dall'ID dell'immagine
    foreach ( $images as $img ) {
        $att_id   = absint( $img['id'] ?? 0 );
        $location = $att_id ? ark_get_attachment_location( $att_id ) : [ 'city' => '', 'address' => '' ];
        $city_key = sanitize_title( $location['city'] ) ?: $other_key;

        if ( $city_key === $other_key ) {
            $has_other = true;
        } elseif ( ! isset( $cities[ $city_key ] ) ) {
            $cities[ $city_key ] = $location['city'];
        }

        $gallery_images[] = [
            'src'     => $img['src']     ?? '',
            'thumb'   => $img['thumb']   ?? $img['src'] ?? '',
            'alt'     => $img['alt']     ?? '',
            'caption' => $img['caption'] ?? '',
            'link'    => $img['link']    ?? '',
            'location' => implode( ' — ', array_filter( $location ) ),
            'city_key' => $city_key,
        ];
    }
}

if ( empty( $gallery_images ) ) return '';

// ── Didascalie e filtro città ──────────────────────────────
// Cartella: accesi di default. Manuale: spenti di default.
$show_caption = $is_folder_mode
    ? ( $attributes['showCaption'] ?? true )
    : ( $attributes['manualShowCaption'] ?? false );
$show_filter  = ( $is_folder_mode
        ? ( $attributes['showCityFilter'] ?? true )
        : ( $attributes['manualShowCityFilter'] ?? false ) )
    && count( $cities ) + (int) $has_other > 1;

// ── Titolo e linee ─────────────────────────────────────────
$title       = $is_folder_mode ? '' : trim( (string) ( $attributes['title'] ?? '' ) );
$title_style = 'font-size:' . absint( $attributes['titleSize'] ?? 48 ) . 'px;';
if ( ! empty( $attributes['titleColor'] ) ) $title_style .= 'color:' . $attributes['titleColor'] . ';';

$line_style = function ( $width, $color ) {
    $style = 'border-top-width:' . max( 1, absint( $width ) ) . 'px;';
    if ( $color ) $style .= 'border-top-color:' . $color . ';';
    return $style;
};
$line_top_style    = $line_style( $attributes['lineTopWidth'] ?? 1, $attributes['lineTopColor'] ?? '' );
$show_line_bottom  = ! empty( $attributes['lineBottom'] );
$line_bottom_style = $line_style( $attributes['lineBottomWidth'] ?? 1, $attributes['lineBottomColor'] ?? '' );

uasort( $cities, fn( $a, $b ) => strcasecmp( remove_accents( $a ), remove_accents( $b ) ) );

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

$wrapper_class = 'ark-gallery alignfull ' . $layout_class;
if ( $show_caption ) $wrapper_class .= ' ark-gallery--captions';

$wrapper_attrs = get_block_wrapper_attributes([
    'class' => $wrapper_class,
    'style' => "width:100vw;max-width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);{$section_style}",
]);

$gallery_id = 'ark-gallery-' . substr( md5( serialize( $attributes ) ), 0, 6 );
?>

<div <?php echo $wrapper_attrs; ?>>
    <?php if ( $title !== '' ) : ?>
        <div class="ark-gallery__header">
            <h2 class="ark-gallery__title" style="<?php echo esc_attr( $title_style ); ?>"><?php echo esc_html( $title ); ?></h2>
            <hr class="ark-gallery__line ark-gallery__line--top" style="<?php echo esc_attr( $line_top_style ); ?>">
        </div>
    <?php endif; ?>

    <?php if ( $show_filter ) : ?>
        <div class="ark-gallery__filter" role="group" aria-label="<?php esc_attr_e( 'Filtra per città', 'arkimedia' ); ?>">
            <button type="button" class="ark-gallery__filter-btn is-active" data-city="all" aria-pressed="true">
                <?php esc_html_e( 'Tutte', 'arkimedia' ); ?>
            </button>
            <?php foreach ( $cities as $city_key => $city_label ) : ?>
                <button type="button" class="ark-gallery__filter-btn" data-city="<?php echo esc_attr( $city_key ); ?>" aria-pressed="false">
                    <?php echo esc_html( $city_label ); ?>
                </button>
            <?php endforeach; ?>
            <?php if ( $has_other ) : ?>
                <button type="button" class="ark-gallery__filter-btn" data-city="<?php echo esc_attr( $other_key ); ?>" aria-pressed="false">
                    <?php esc_html_e( "ALTRE CITTÀ", 'arkimedia' ); ?>
                </button>
            <?php endif; ?>
        </div>
    <?php endif; ?>

    <div class="ark-gallery__grid <?php echo esc_attr( $layout_class ); ?>__grid"
         style="<?php echo esc_attr( $grid_style ); ?>"
         id="<?php echo esc_attr( $gallery_id ); ?>">

        <?php foreach ( $gallery_images as $img ) :
            if ( ! $img['src'] ) continue;

            $item_class = 'ark-gallery__item';
            $img_style  = $aspect_ratio !== 'free' ? "aspect-ratio:{$aspect_ratio};" : '';
            $location_text = $show_caption ? $img['location'] : '';
            $lightbox_text = $location_text ?: $img['caption'];
        ?>
            <div class="<?php echo esc_attr( $item_class ); ?>"<?php if ( $show_filter ) : ?> data-city="<?php echo esc_attr( $img['city_key'] ); ?>"<?php endif; ?>>
                <?php if ( $lightbox ) : ?>
                    <a href="<?php echo esc_url( $img['src'] ); ?>"
                       data-fancybox="<?php echo esc_attr( $gallery_id ); ?>"
                       <?php if ( $lightbox_text ) : ?>
                           data-caption="<?php echo esc_attr( $lightbox_text ); ?>"
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
                <?php if ( $location_text ) : ?>
                    <p class="ark-gallery__caption"><?php echo esc_html( $location_text ); ?></p>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>

    </div>

    <?php if ( $show_line_bottom ) : ?>
        <div class="ark-gallery__footer">
            <hr class="ark-gallery__line ark-gallery__line--bottom" style="<?php echo esc_attr( $line_bottom_style ); ?>">
        </div>
    <?php endif; ?>
</div>
