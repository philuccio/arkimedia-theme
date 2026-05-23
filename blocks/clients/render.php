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
$img_filter  = $invert_logos ? 'filter:brightness(0) invert(1);' : '';
$item_size   = 'width:' . absint( $logo_size ) . 'px;height:' . absint( $logo_size ) . 'px;background:' . esc_attr( $logo_bg ) . ';';

$wrapper_attrs = get_block_wrapper_attributes([
    'class' => 'ark-clients alignfull',
    'style' => "background:{$bg_color};width:100vw;max-width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);",
]);

// Render singola slide logo
$ark_client_item = function( array $client, string $item_size, string $img_filter ): string {
    $url        = $client['mediaUrl']  ?? '';
    $alt        = $client['mediaAlt'] ?? ( $client['name'] ?? '' );
    $client_url = $client['clientUrl'] ?? '';

    if ( ! $url ) return '';

    $img = '<img src="' . esc_url( $url ) . '" alt="' . esc_attr( $alt ) . '" loading="lazy" style="' . $img_filter . '">';

    $inner = $client_url
        ? '<a href="' . esc_url( $client_url ) . '" target="_blank" rel="noopener noreferrer" class="ark-clients__link">' . $img . '</a>'
        : $img;

    return '<div class="ark-clients__item" style="' . $item_size . '">' . $inner . '</div>';
};
?>

<section <?php echo $wrapper_attrs; ?>>

    <?php if ( $eyebrow ) : ?>
        <p class="ark-clients__eyebrow" style="color:<?php echo esc_attr( $logo_color ); ?>">
            <?php echo esc_html( $eyebrow ); ?>
        </p>
    <?php endif; ?>

    <div class="ark-clients__track <?php echo $auto_scroll ? 'ark-clients__track--scroll' : ''; ?>">
        <div class="ark-clients__list">
            <?php foreach ( $clients as $client ) : ?>
                <?php echo $ark_client_item( $client, $item_size, $img_filter ); ?>
            <?php endforeach; ?>
        </div>

        <?php if ( $auto_scroll ) : ?>
        <div class="ark-clients__list" aria-hidden="true">
            <?php foreach ( $clients as $client ) : ?>
                <?php echo $ark_client_item( $client, $item_size, $img_filter ); ?>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
    </div>

</section>
