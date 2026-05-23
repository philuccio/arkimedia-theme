<?php
/**
 * Render blocco Mappa.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$lat          = $attributes['lat']         ?? 41.9028;
$lng          = $attributes['lng']         ?? 12.4964;
$zoom         = $attributes['zoom']        ?? 14;
$map_type     = $attributes['mapType']     ?? 'roadmap';
$height       = $attributes['height']      ?? '500px';
$layout       = $attributes['layout']      ?? 'full';
$show_marker  = $attributes['showMarker']  ?? true;
$marker_title = $attributes['markerTitle'] ?? '';
$marker_text  = $attributes['markerText']  ?? '';
$bg_color     = $attributes['bgColor']     ?? '#0a0a0a';
$text_color   = $attributes['textColor']   ?? '#ffffff';
$accent       = $attributes['accentColor'] ?? '#e94560';
$panel_title  = $attributes['panelTitle']  ?? 'Dove siamo';
$panel_text   = $attributes['panelText']   ?? '';
$address      = $attributes['address']     ?? '';

// URL embed Google Maps — senza API key
$embed_url = sprintf(
    'https://maps.google.com/maps?q=%s,%s&z=%s&output=embed&t=%s',
    esc_attr( $lat ),
    esc_attr( $lng ),
    absint( $zoom ),
    ( $map_type === 'satellite' || $map_type === 'hybrid' ) ? 'k' : 'm'
);

$wrapper_attrs = get_block_wrapper_attributes([
    'class' => 'ark-map alignfull ark-map--layout-' . esc_attr( $layout ),
    'style' => "width:100vw;max-width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);",
]);
?>

<div <?php echo $wrapper_attrs; ?>>

    <?php if ( $layout === 'split' ) : ?>
    <div class="ark-map__split">

        <!-- Pannello info -->
        <div class="ark-map__panel" style="background:<?php echo esc_attr( $bg_color ); ?>;color:<?php echo esc_attr( $text_color ); ?>;">
            <?php if ( $panel_title ) : ?>
                <h3 class="ark-map__panel-title" style="color:<?php echo esc_attr( $text_color ); ?>">
                    <?php echo esc_html( $panel_title ); ?>
                </h3>
            <?php endif; ?>
            <?php if ( $panel_text ) : ?>
                <p class="ark-map__panel-text"><?php echo esc_html( $panel_text ); ?></p>
            <?php endif; ?>
            <?php if ( $address ) : ?>
                <a class="ark-map__panel-address"
                   href="https://www.google.com/maps/search/<?php echo urlencode( $address ); ?>"
                   target="_blank" rel="noopener noreferrer"
                   style="color:<?php echo esc_attr( $accent ); ?>">
                    <span aria-hidden="true">📍</span>
                    <?php echo esc_html( $address ); ?>
                </a>
            <?php endif; ?>
            <a class="ark-map__directions"
               href="https://www.google.com/maps/dir/?api=1&destination=<?php echo esc_attr( $lat ); ?>,<?php echo esc_attr( $lng ); ?>"
               target="_blank" rel="noopener noreferrer"
               style="background:<?php echo esc_attr( $accent ); ?>;">
                <?php esc_html_e( 'Indicazioni stradali', 'arkimedia' ); ?>
            </a>
        </div>

        <!-- Mappa -->
        <div class="ark-map__embed-wrap" style="height:<?php echo esc_attr( $height ); ?>;">
            <iframe
                class="ark-map__iframe"
                src="<?php echo esc_url( $embed_url ); ?>"
                width="100%"
                height="100%"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="<?php echo esc_attr( $panel_title ?: 'Mappa' ); ?>">
            </iframe>
        </div>

    </div>

    <?php else : ?>

        <!-- Solo mappa fullwidth -->
        <div class="ark-map__embed-wrap" style="height:<?php echo esc_attr( $height ); ?>;">
            <iframe
                class="ark-map__iframe"
                src="<?php echo esc_url( $embed_url ); ?>"
                width="100%"
                height="100%"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="<?php echo esc_attr( $panel_title ?: 'Mappa' ); ?>">
            </iframe>
        </div>

    <?php endif; ?>

</div>
