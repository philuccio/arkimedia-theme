<?php
/**
 * Render blocco Case History.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$images       = $attributes['images']        ?? [];
$side         = ( $attributes['imagesSide'] ?? 'right' ) === 'left' ? 'left' : 'right';
$images_width = min( 60, max( 10, absint( $attributes['imagesWidth'] ?? 30 ) ) );
$columns_gap  = absint( $attributes['columnsGap']   ?? 40 );
$images_gap   = absint( $attributes['imagesGap']    ?? 0 );
$images_bg    = sanitize_text_field( $attributes['imagesBgColor'] ?? '' );
$images_pad   = absint( $attributes['imagesPadding'] ?? 0 );
$radius       = absint( $attributes['imagesRadius'] ?? 0 );
$lightbox     = $attributes['lightbox']      ?? true;
$bg_color     = $attributes['bgColor']       ?? '';
$text_color   = $attributes['textColor']     ?? '';
$pt           = absint( $attributes['paddingTop']    ?? 60 );
$pb           = absint( $attributes['paddingBottom'] ?? 60 );
$pair_ratio   = in_array( $attributes['mobilePairRatio'] ?? '4/3', [ '1/1', '4/3', '3/4', '16/9' ], true ) ? $attributes['mobilePairRatio'] : '4/3';
$pair_gap     = absint( $attributes['mobilePairGap'] ?? 12 );

// ── Immagini della colonna (URL aggiornati dall'ID) ────────
$side_images = [];
foreach ( $images as $img ) {
    $id  = absint( $img['id'] ?? 0 );
    $src = $id ? wp_get_attachment_image_url( $id, 'full' ) : ( $img['src'] ?? '' );
    if ( ! $src ) continue;

    $thumb = $id ? wp_get_attachment_image_url( $id, 'large' ) : '';
    $alt   = $id ? get_post_meta( $id, '_wp_attachment_image_alt', true ) : '';

    $side_images[] = [
        'id'    => $id,
        'src'   => $src,
        'thumb' => $thumb ?: $src,
        'alt'   => $alt ?: ( $img['alt'] ?? '' ),
    ];
}

$has_images = ! empty( $side_images );

// ── Contenuto: ordine e coppie per mobile (≤768px) ─────────
// Su mobile il contenuto comincia sempre con un testo: i blocchi che
// precedono il primo testo vanno subito dopo di esso. Le immagini
// consecutive (nell'ordine mobile) vengono affiancate a coppie.
// Ordine e coppie sono solo CSS: il markup resta nell'ordine dell'editor.
$image_blocks = [ 'core/image', 'arkimedia/image' ];
$text_blocks  = [ 'core/paragraph', 'core/heading', 'core/list', 'arkimedia/text' ];

$children = [];
foreach ( $block->inner_blocks as $inner ) {
    $html = $inner->render();
    if ( trim( $html ) === '' ) continue;
    $children[] = [ 'name' => $inner->name, 'html' => $html ];
}

$sequence = array_keys( $children );
foreach ( $children as $i => $child ) {
    if ( in_array( $child['name'], $text_blocks, true ) ) {
        if ( $i > 0 ) {
            $sequence = array_merge( [ $i ], range( 0, $i - 1 ), array_slice( $sequence, $i + 1 ) );
        }
        break;
    }
}

$paired = [];
$run    = [];
foreach ( array_merge( $sequence, [ null ] ) as $idx ) {
    if ( $idx !== null && in_array( $children[ $idx ]['name'], $image_blocks, true ) ) {
        $run[] = $idx;
        continue;
    }
    for ( $p = 0; $p + 1 < count( $run ); $p += 2 ) {
        $paired[ $run[ $p ] ]     = true;
        $paired[ $run[ $p + 1 ] ] = true;
    }
    $run = [];
}

$content_html = '';
foreach ( $sequence as $position => $idx ) {
    $tags = new WP_HTML_Tag_Processor( $children[ $idx ]['html'] );
    if ( $tags->next_tag() ) {
        $style = (string) $tags->get_attribute( 'style' );
        $tags->set_attribute( 'style', rtrim( $style, '; ' ) . ( $style !== '' ? ';' : '' ) . "--ark-ch-order:{$position};" );
        if ( isset( $paired[ $idx ] ) ) $tags->add_class( 'ark-ch-pair' );
    }
    $children[ $idx ]['out'] = $tags->get_updated_html();
}
foreach ( $children as $child ) {
    $content_html .= $child['out'];
}

// ── Stili ──────────────────────────────────────────────────
$section_style = "width:100vw;max-width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);padding-top:{$pt}px;padding-bottom:{$pb}px;";
if ( $bg_color )   $section_style .= "background:{$bg_color};";
if ( $text_color ) $section_style .= "color:{$text_color};";

$inner_style = "--ark-ch-images-w:{$images_width}%;--ark-ch-gap:{$columns_gap}px;--ark-ch-images-gap:{$images_gap}px;--ark-ch-radius:{$radius}px;--ark-ch-pair-ratio:{$pair_ratio};--ark-ch-pair-gap:{$pair_gap}px;--ark-ch-images-pad:{$images_pad}px;";
if ( $images_bg ) $inner_style .= "--ark-ch-images-bg:{$images_bg};";

$classes = 'ark-case-history alignfull ark-case-history--images-' . $side;
if ( ! $has_images ) $classes .= ' ark-case-history--no-images';

$wrapper_attrs = get_block_wrapper_attributes([
    'class' => $classes,
    'style' => $section_style,
]);

$gallery_id = wp_unique_id( 'ark-case-history-' );
?>

<section <?php echo $wrapper_attrs; ?>>
    <div class="container ark-case-history__inner" style="<?php echo esc_attr( $inner_style ); ?>">

        <div class="ark-case-history__content">
            <?php echo $content_html; ?>
        </div>

        <?php if ( $has_images ) : ?>
            <aside class="ark-case-history__images" aria-label="<?php esc_attr_e( 'Immagini', 'arkimedia' ); ?>">
                <?php foreach ( $side_images as $img ) : ?>
                    <figure class="ark-case-history__image">
                        <?php if ( $lightbox ) : ?>
                            <a href="<?php echo esc_url( $img['src'] ); ?>" data-fancybox="<?php echo esc_attr( $gallery_id ); ?>">
                        <?php endif; ?>
                        <img src="<?php echo esc_url( $img['thumb'] ); ?>"
                             alt="<?php echo esc_attr( $img['alt'] ); ?>"
                             loading="lazy">
                        <?php if ( $lightbox ) : ?>
                            </a>
                        <?php endif; ?>
                    </figure>
                <?php endforeach; ?>
            </aside>
        <?php endif; ?>

    </div>
</section>
