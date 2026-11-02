<?php
/**
 * Render blocco Clienti.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$eyebrow      = $attributes['eyebrow']     ?? 'TRUSTED BY';
$bg_color     = $attributes['bgColor']     ?? '#1a1a2e';
$logo_color   = $attributes['logoColor']   ?? '#ffffff';
$logo_size    = $attributes['logoSize']    ?? 160;
$auto_scroll  = $attributes['autoScroll']  ?? false;
$invert_logos = $attributes['invertLogos'] ?? false;
$logo_bg      = $attributes['logoBg']      ?? '#ffffff';
$clients      = $attributes['clients']     ?? [];

$clients     = array_filter( $clients, fn( $c ) => ! empty( $c['mediaUrl'] ) );
if ( ! $clients ) return;

$img_filter  = $invert_logos ? 'filter:brightness(0) invert(1);' : '';
$item_size   = 'width:' . absint( $logo_size ) . 'px;height:' . absint( $logo_size ) . 'px;';
$inner_bg    = 'background:' . esc_attr( $logo_bg ) . ';';

// Metà nastro = spostamento dell'animazione: deve coprire anche schermi larghi
$set_width   = count( $clients ) * ( absint( $logo_size ) + 24 );
$set_repeat  = $auto_scroll ? (int) ceil( 2560 / $set_width ) : 1;
$list_count  = $auto_scroll ? $set_repeat * 2 : 1;
$track_style = $auto_scroll ? 'animation-duration:' . round( $set_width * $set_repeat / 40 ) . 's;' : '';

$wrapper_attrs = get_block_wrapper_attributes([
    'class' => 'ark-clients alignfull',
    'style' => "background:{$bg_color};width:100vw;max-width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);",
]);

// Render singola slide logo
$ark_client_item = function( array $client, string $item_size, string $inner_bg, string $img_filter, bool $hidden ): string {
    $media_id   = (int) ( $client['mediaId'] ?? 0 );
    $url        = ( $media_id ? wp_get_attachment_image_url( $media_id, 'full' ) : '' ) ?: ( $client['mediaUrl'] ?? '' );
    $alt        = ( $client['mediaAlt'] ?? '' ) ?: ( $client['name'] ?? '' );
    $client_url = $client['clientUrl'] ?? '';

    if ( ! $url ) return '';

    $img = '<img src="' . esc_url( $url ) . '" alt="' . esc_attr( $hidden ? '' : $alt ) . '" loading="lazy" style="' . $img_filter . '">';

    $inner = $client_url
        ? '<a href="' . esc_url( $client_url ) . '" target="_blank" rel="noopener noreferrer" class="ark-clients__link"' . ( $hidden ? ' tabindex="-1"' : '' ) . '>' . $img . '</a>'
        : $img;

    return '<div class="ark-clients__item" style="' . $item_size . '"><div class="ark-clients__item-inner" style="' . $inner_bg . '">' . $inner . '</div></div>';
};
?>

<section <?php echo $wrapper_attrs; ?>>

    <?php if ( $eyebrow ) : ?>
        <p class="ark-clients__eyebrow" style="color:<?php echo esc_attr( $logo_color ); ?>">
            <?php echo esc_html( $eyebrow ); ?>
        </p>
    <?php endif; ?>

    <div class="ark-clients__track <?php echo $auto_scroll ? 'ark-clients__track--scroll' : ''; ?>" style="<?php echo esc_attr( $track_style ); ?>">
        <?php for ( $list = 0; $list < $list_count; $list++ ) : ?>
        <div class="ark-clients__list"<?php echo $list ? ' aria-hidden="true"' : ''; ?>>
            <?php foreach ( $clients as $client ) : ?>
                <?php echo $ark_client_item( $client, $item_size, $inner_bg, $img_filter, $list > 0 ); ?>
            <?php endforeach; ?>
        </div>
        <?php endfor; ?>
    </div>

</section>
