<?php
/**
 * Render blocco Clienti.
 *
 * @package Arkimedia
 */

$eyebrow      = $attributes['eyebrow']     ?? 'TRUSTED BY';
$bg_color     = $attributes['bgColor']     ?? '#1a1a2e';
$logo_color   = $attributes['logoColor']   ?? '#ffffff';
$logo_size    = $attributes['logoSize']    ?? 160;
$auto_scroll  = $attributes['autoScroll']  ?? false;
$invert_logos = $attributes['invertLogos'] ?? false;
$logo_bg      = $attributes['logoBg']      ?? 'rgba(255,255,255,0.06)';
$clients      = $attributes['clients']     ?? [];

$clients = array_filter( $clients, fn( $c ) => ! empty( $c['mediaUrl'] ) );

$img_filter = $invert_logos ? 'filter:brightness(0) invert(1);' : '';

$wrapper_attrs = get_block_wrapper_attributes([
    'class' => 'ark-clients alignfull',
    'style' => "background:{$bg_color};width:100vw;max-width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);",
]);
?>

<section <?php echo $wrapper_attrs; ?>>

    <?php if ( $eyebrow ) : ?>
        <p class="ark-clients__eyebrow" style="color:<?php echo esc_attr( $logo_color ); ?>">
            <?php echo esc_html( $eyebrow ); ?>
        </p>
    <?php endif; ?>

    <div class="ark-clients__track <?php echo $auto_scroll ? 'ark-clients__track--scroll' : ''; ?>">
        <div class="ark-clients__list">
            <?php foreach ( $clients as $client ) :
                $url = $client['mediaUrl'] ?? '';
                $alt = $client['mediaAlt'] ?? ( $client['name'] ?? '' );
                if ( ! $url ) continue;
            ?>
                <div class="ark-clients__item"
                     style="width:<?php echo absint( $logo_size ); ?>px;height:<?php echo absint( $logo_size ); ?>px;background:<?php echo esc_attr( $logo_bg ); ?>;">
                    <img src="<?php echo esc_url( $url ); ?>"
                         alt="<?php echo esc_attr( $alt ); ?>"
                         loading="lazy"
                         style="<?php echo $img_filter; ?>">
                </div>
            <?php endforeach; ?>
        </div>

        <?php if ( $auto_scroll ) : ?>
        <div class="ark-clients__list" aria-hidden="true">
            <?php foreach ( $clients as $client ) :
                $url = $client['mediaUrl'] ?? '';
                $alt = $client['mediaAlt'] ?? ( $client['name'] ?? '' );
                if ( ! $url ) continue;
            ?>
                <div class="ark-clients__item"
                     style="width:<?php echo absint( $logo_size ); ?>px;height:<?php echo absint( $logo_size ); ?>px;background:<?php echo esc_attr( $logo_bg ); ?>;">
                    <img src="<?php echo esc_url( $url ); ?>"
                         alt="<?php echo esc_attr( $alt ); ?>"
                         loading="lazy"
                         style="<?php echo $img_filter; ?>">
                </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
    </div>

</section>
